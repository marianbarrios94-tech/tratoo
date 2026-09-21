export const INSTAGRAM_URL = 'https://www.instagram.com/tratoo.ar/'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function InstagramLink({
  label,
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ? undefined : 'Tratoo en Instagram'}
      className={`items-center gap-2 hover:text-zinc-950 dark:hover:text-white ${className}`}
    >
      <InstagramIcon className="h-5 w-5 shrink-0" />
      {label}
    </a>
  )
}
