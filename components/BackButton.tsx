'use client'

import { useRouter } from 'next/navigation'

export function BackButton({
  label = '← Volver',
  fallbackHref,
}: {
  label?: string
  fallbackHref?: string
}) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        if (fallbackHref) {
          router.push(fallbackHref)
        } else {
          router.back()
        }
      }}
      className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
    >
      {label}
    </button>
  )
}
