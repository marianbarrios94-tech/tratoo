import { updatePassword } from '../actions'

export default async function ActualizarContrasenaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold">Elegí una nueva contraseña</h1>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <form action={updatePassword} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Nueva contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Guardar contraseña
          </button>
        </form>
      </div>
    </div>
  )
}
