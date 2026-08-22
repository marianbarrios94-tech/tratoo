import Link from 'next/link'
import { logout } from '@/app/(auth)/actions'
import { BackButton } from '@/components/BackButton'
import { LogoMark } from '@/components/Logo'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-y-2 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <LogoMark className="h-7 w-7" />
          Tratoo
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            Profesional
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            href="/panel"
            className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          >
            Panel
          </Link>
          <Link
            href="/cuenta"
            className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          >
            Cuenta de cliente
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              Cerrar sesión
            </button>
          </form>
        </nav>
      </header>
      <div className="mx-auto w-full max-w-4xl px-6 pt-4">
        <BackButton fallbackHref="/panel" />
      </div>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-10">{children}</main>
    </div>
  )
}
