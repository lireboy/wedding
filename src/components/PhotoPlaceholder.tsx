type Props = { label: string; detail?: string; variant?: string }

export default function PhotoPlaceholder({
  label,
  detail,
  variant = 'sage',
}: Props) {
  return (
    <div
      className={`photo-placeholder photo-${variant} relative overflow-hidden flex flex-column align-items-center justify-content-center text-center p-4 h-full`}
    >
      <svg
        className="botanical absolute"
        viewBox="0 0 240 340"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M111 330C162 230 78 115 145 12M123 276C79 267 48 240 40 215C77 206 111 226 123 276ZM131 224C164 217 196 189 200 160C161 163 135 182 131 224ZM119 173C84 163 65 138 65 112C99 118 117 140 119 173ZM125 117C156 110 179 87 179 60C151 70 132 88 125 117ZM135 67C116 49 115 30 124 10C141 29 144 48 135 67Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
      <span className="photo-placeholder-label relative z-1 flex flex-column align-items-center gap-3">
        <i className="pi pi-camera text-2xl" aria-hidden="true" />
      </span>
    </div>
  )
}
