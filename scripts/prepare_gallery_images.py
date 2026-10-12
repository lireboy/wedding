import re
import subprocess
import sys
from pathlib import Path
from uuid import uuid4


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
UUID_SUFFIX = re.compile(
    r"-[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


if len(sys.argv) != 2:
    raise SystemExit(
        "Aufruf: python scripts/prepare_gallery_images.py <ordner>"
    )

folder = Path(sys.argv[1]).expanduser().resolve()
if not folder.is_dir():
    raise SystemExit(f"Ordner nicht gefunden: {folder}")

processed = 0
for source in sorted(folder.iterdir()):
    if not source.is_file() or source.suffix.lower() not in SUPPORTED_EXTENSIONS:
        continue

    if source.suffix.lower() == ".webp" and UUID_SUFFIX.search(source.stem):
        continue

    target = source.with_name(f"{source.stem}-{uuid4()}.webp")

    if source.suffix.lower() == ".webp":
        source.rename(target)
    else:
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(source),
                "-vf",
                "scale='min(1440,iw)':'min(1440,ih)':force_original_aspect_ratio=decrease",
                "-frames:v",
                "1",
                "-c:v",
                "libwebp",
                "-quality",
                "75",
                "-compression_level",
                "6",
                str(target),
            ],
            check=True,
        )
        source.unlink()

    processed += 1

print(f"{processed} Bilder vorbereitet.")
