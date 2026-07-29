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
        if (fallbackHref && window.history.length <= 1) {
          router.push(fallbackHref)
        } else {
          router.back()
        }
      }}
      className="text-sm text-zinc-500 hover:underline"
    >
      {label}
    </button>
  )
}
