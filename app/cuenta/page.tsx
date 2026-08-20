import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function CuentaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const profile = user
    ? (await supabase.from('profiles').select('full_name').eq('id', user.id).single()).data
    : null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Hola{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p className="mt-1 text-zinc-500">Este es tu espacio como cliente en Tratoo.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/cuenta/perfil"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Tu perfil</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Editá tu nombre, teléfono y ciudad.
          </p>
        </Link>
        <Link
          href="/profesionales"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Buscar profesionales</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Explorá el directorio por rubro, categoría y ciudad.
          </p>
        </Link>
        <Link
          href="/cuenta/solicitudes"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Tus solicitudes</h2>
          <p className="mt-1 text-sm text-zinc-500">Seguí el estado de tus pedidos de servicio.</p>
        </Link>
        <Link
          href="/panel"
          className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="font-medium">Ofrecer tus servicios</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Completá tu perfil profesional y elegí un plan.
          </p>
        </Link>
      </div>
    </div>
  )
}
