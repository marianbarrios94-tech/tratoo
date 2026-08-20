import Link from 'next/link'
import { login } from '../actions'
import { BackButton } from '@/components/BackButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <BackButton />
        <h1 className="mt-4 text-2xl font-semibold">Iniciá sesión en Tratoo</h1>
        <p className="mt-1 text-sm text-zinc-500">Encontrá al profesional que resuelve.</p>

        {message && (
          <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <form action={login} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-500">
          <Link href="/olvide-contrasena" className="font-medium text-zinc-950 underline dark:text-zinc-50">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="font-medium text-zinc-950 underline dark:text-zinc-50">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}
