import Link from 'next/link'
import { signup } from '../actions'
import { BackButton } from '@/components/BackButton'
import { PasswordInput } from '@/components/PasswordInput'

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; role?: string; promo?: string }>
}) {
  const { error, role, promo } = await searchParams
  const defaultRole = role === 'professional' ? 'professional' : 'client'

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <BackButton />
        <h1 className="mt-4 text-2xl font-semibold">Creá tu cuenta en Tratoo</h1>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <form action={signup} className="mt-6 flex flex-col gap-4">
          {promo && <input type="hidden" name="promo" value={promo} />}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">Quiero...</legend>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm has-[:checked]:border-zinc-950 has-[:checked]:bg-zinc-50 dark:border-zinc-700 dark:has-[:checked]:border-white dark:has-[:checked]:bg-zinc-900">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  defaultChecked={defaultRole === 'client'}
                  className="sr-only"
                />
                Buscar un profesional
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm has-[:checked]:border-zinc-950 has-[:checked]:bg-zinc-50 dark:border-zinc-700 dark:has-[:checked]:border-white dark:has-[:checked]:bg-zinc-900">
                <input
                  type="radio"
                  name="role"
                  value="professional"
                  defaultChecked={defaultRole === 'professional'}
                  className="sr-only"
                />
                Ofrecer mis servicios
              </label>
            </div>
          </fieldset>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium">
              Nombre completo
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
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
            <PasswordInput
              id="password"
              name="password"
              required
              minLength={8}
              pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
              title="Al menos 8 caracteres, con una letra y un número"
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Mínimo 8 caracteres, con al menos una letra y un número.
            </p>
          </div>
          <button
            type="submit"
            className="mt-2 rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-500">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-medium text-zinc-950 underline dark:text-zinc-50">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
