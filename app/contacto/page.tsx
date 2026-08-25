import { BackButton } from '@/components/BackButton'
import { ScrollToTop } from '@/components/ScrollToTop'
import { sendContactMessage } from './actions'

export const metadata = {
  title: 'Contacto — Tratoo',
}

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <ScrollToTop when={message ?? error} />
      <BackButton fallbackHref="/" />
      <h1 className="mt-4 text-2xl font-semibold">Contacto</h1>
      <p className="mt-1 text-zinc-500">
        ¿Tenés una consulta o un problema con Tratoo? Escribinos y te respondemos por email.
      </p>

      {message && (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={sendContactMessage} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre (opcional)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Tu email
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
          <label htmlFor="message" className="block text-sm font-medium">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="mt-2 self-start rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  )
}
