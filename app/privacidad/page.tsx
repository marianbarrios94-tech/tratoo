import { BackButton } from '@/components/BackButton'

export const metadata = {
  title: 'Política de privacidad — Zolvi',
}

export default function PrivacidadPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <BackButton fallbackHref="/" />
      <h1 className="mt-4 text-2xl font-semibold">Política de privacidad</h1>
      <p className="mt-1 text-sm text-zinc-500">Última actualización: agosto de 2026.</p>

      <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
        Este documento es un borrador base y debe ser revisado por un profesional legal antes de
        su publicación definitiva.
      </p>

      <div className="mt-8 flex flex-col gap-6 text-sm text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            1. Qué datos recolectamos
          </h2>
          <ul className="mt-2 flex flex-col gap-1">
            <li>· Datos de cuenta: nombre completo, email y contraseña (encriptada).</li>
            <li>· Datos de perfil de cliente: teléfono y ciudad, si los completás.</li>
            <li>
              · Datos de perfil profesional: nombre o marca, categoría, ciudad, años de
              experiencia y descripción, si ofrecés servicios.
            </li>
            <li>
              · Datos de facturación: gestionados directamente por Mercado Pago. Zolvi nunca
              recibe ni almacena el número completo de tu tarjeta.
            </li>
            <li>
              · Contenido de solicitudes y reseñas que escribís dentro de la plataforma.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            2. Para qué usamos tus datos
          </h2>
          <p className="mt-2">
            Usamos tus datos para operar la plataforma: mostrar tu perfil en el directorio (si sos
            profesional con suscripción activa), conectar clientes con profesionales, procesar
            pagos de suscripciones, y enviarte notificaciones sobre el estado de tus solicitudes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            3. Con quién compartimos datos
          </h2>
          <p className="mt-2">
            Compartimos datos únicamente con los proveedores que necesitamos para funcionar:
            Supabase (base de datos y autenticación), Mercado Pago (pagos) y Resend (envío de
            emails).
            Ninguno de ellos puede usar tus datos para fines propios de marketing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            4. Tus derechos
          </h2>
          <p className="mt-2">
            De acuerdo con la Ley de Protección de Datos Personales (Ley 25.326), podés acceder,
            rectificar o solicitar la eliminación de tus datos personales en cualquier momento
            escribiendo a{' '}
            <a href="mailto:hola@zolvi.com" className="underline">
              hola@zolvi.com
            </a>
            . También podés editar tu nombre, teléfono y ciudad directamente desde tu cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">5. Cookies</h2>
          <p className="mt-2">
            Usamos únicamente cookies necesarias para mantener tu sesión iniciada. No usamos
            cookies de rastreo publicitario.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">6. Contacto</h2>
          <p className="mt-2">
            Ante cualquier consulta sobre privacidad, escribinos a{' '}
            <a href="mailto:hola@zolvi.com" className="underline">
              hola@zolvi.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
