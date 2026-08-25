'use client'

import { useRouter, usePathname } from 'next/navigation'

export function BackButton({
  label = '← Volver',
  fallbackHref,
}: {
  label?: string
  fallbackHref?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <button
      type="button"
      onClick={() => {
        if (fallbackHref) {
          // Si el destino es la página en la que ya estás (ej: el layout de
          // /cuenta le pasa fallbackHref="/cuenta" incluso en /cuenta mismo),
          // ir ahí es un no-op — mandar a la principal en su lugar.
          const target = fallbackHref === pathname ? '/' : fallbackHref
          // replace, no push: evita apilar entradas duplicadas cuando se
          // entra y sale de varias páginas seguidas con este botón.
          router.replace(target)
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
