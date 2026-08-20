export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <span
      className={`${className} inline-flex shrink-0 items-center justify-center rounded-lg bg-zinc-950 dark:bg-white`}
    >
      <svg viewBox="0 0 100 100" fill="none" className="h-2/3 w-2/3">
        <path
          d="M6 20 H26"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="text-white dark:text-zinc-950"
        />
        <path d="M32 20 H52" stroke="#059669" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M29 26 V78"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="text-white dark:text-zinc-950"
        />
        <circle cx="78" cy="30" r="13" fill="none" stroke="#059669" strokeWidth="9" />
        <circle
          cx="78"
          cy="70"
          r="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          className="text-white dark:text-zinc-950"
        />
      </svg>
    </span>
  )
}
