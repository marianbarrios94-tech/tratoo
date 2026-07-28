import Link from 'next/link'
import { logout } from '@/app/(auth)/actions'

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <Link href="/" className="text-lg font-semibold">
          Zolvi
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/cuenta"
            className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          >
            Mi cuenta
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
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">{children}</main>
    </div>
  )
}
