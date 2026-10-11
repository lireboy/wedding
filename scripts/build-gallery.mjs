import { spawn } from 'node:child_process'
import { mkdir, readdir, stat } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = join(projectRoot, 'src', 'assets', 'images')
const outputRoot = join(projectRoot, 'src', 'assets', 'gallery')
const imagePattern = /\.(jpe?g|png)$/i

const slugify = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const folders = (await readdir(sourceRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name, 'de'))

const tasks = []
for (const folder of folders) {
  const category = folder.name
  const categorySlug = slugify(category)
  const sourceDirectory = join(sourceRoot, category)
  const outputDirectory = join(outputRoot, categorySlug)
  await mkdir(outputDirectory, { recursive: true })

  const files = (await readdir(sourceDirectory))
    .filter((file) => imagePattern.test(file))
    .sort((a, b) => a.localeCompare(b, 'de', { numeric: true }))

  files.forEach((file) => {
    const source = join(sourceDirectory, file)
    const outputName = `${basename(file, extname(file))}.webp`
    tasks.push({
      source,
      output: join(outputDirectory, outputName),
    })
  })
}

let completed = 0
let cursor = 0

async function convert(task) {
  const [sourceInfo, outputInfo] = await Promise.all([
    stat(task.source),
    stat(task.output).catch(() => null),
  ])
  if (outputInfo && outputInfo.mtimeMs >= sourceInfo.mtimeMs) return

  await new Promise((resolveTask, rejectTask) => {
    const process = spawn(
      'ffmpeg',
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        '-i',
        task.source,
        '-vf',
        "scale='min(1440,iw)':-2",
        '-c:v',
        'libwebp',
        '-quality',
        '72',
        '-compression_level',
        '6',
        task.output,
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    )
    let error = ''
    process.stderr.on('data', (chunk) => {
      error += chunk.toString()
    })
    process.on('error', rejectTask)
    process.on('close', (code) => {
      if (code === 0) resolveTask()
      else rejectTask(new Error(error || `ffmpeg endete mit Code ${code}`))
    })
  })
}

async function worker() {
  while (cursor < tasks.length) {
    const task = tasks[cursor++]
    await convert(task)
    completed++
    if (completed % 50 === 0 || completed === tasks.length)
      console.log(`${completed}/${tasks.length} Bilder verarbeitet`)
  }
}

await mkdir(outputRoot, { recursive: true })
await Promise.all(Array.from({ length: Math.min(4, tasks.length) }, worker))
console.log(`${tasks.length} Galeriebilder sind bereit.`)
