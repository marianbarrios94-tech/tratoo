import { BackButton } from '@/components/BackButton'

export const metadata = {
  title: 'Política de privacidad — Tratoo',
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

      <p className="mt-6 text-sm text-zinc-700 dark:text-zinc-300">
        A los fines de la Ley 25.326 de Protección de Datos Personales, el responsable de la base
        de datos es{' '}
        <span className="rounded bg-amber-50 px-1 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
          [TU NOMBRE COMPLETO], con domicilio en [TU DOMICILIO]
        </span>
        . Cualquier consulta sobre tus datos podés dirigirla a{' '}
        <a href="mailto:tratoo.contacto@gmail.com" className="underline">
          tratoo.contacto@gmail.com
        </a>
        .
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
              · Datos de facturación: gestionados directamente por Mercado Pago. Tratoo nunca
              recibe ni almacena el número completo de tu tarjeta.
            </li>
            <li>
              · Contenido de solicitudes y reseñas que escribís dentro de la plataforma.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            2. Tu perfil es público
          </h2>
          <p className="mt-2">
            Si te registrás como profesional, tu perfil —nombre o marca, categoría, ciudad, foto,
            descripción, calificación y reseñas— es público: cualquier visitante puede verlo en el
            directorio, sin necesidad de tener cuenta. Tu número de teléfono se expone recién
            cuando aceptás una solicitud, a través del botón de contacto por WhatsApp, para que ese
            cliente puntual te escriba directamente. Si no querés que tu perfil sea visible, podés
            despublicarlo desde tu cuenta en cualquier momento.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            3. Para qué usamos tus datos
          </h2>
          <p className="mt-2">
            Usamos tus datos para operar la plataforma: mostrar tu perfil en el directorio (si sos
            profesional con suscripción activa), conectar clientes con profesionales, procesar
            pagos de suscripciones, y enviarte notificaciones sobre el estado de tus solicitudes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            4. Con quién compartimos datos
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
            5. Tus derechos
          </h2>
          <p className="mt-2">
            De acuerdo con la Ley de Protección de Datos Personales (Ley 25.326), podés acceder,
            rectificar o solicitar la eliminación de tus datos personales en cualquier momento
            escribiendo a{' '}
            <a href="mailto:tratoo.contacto@gmail.com" className="underline">
              tratoo.contacto@gmail.com
            </a>
            . También podés editar tu nombre, teléfono y ciudad directamente desde tu cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">6. Cookies</h2>
          <p className="mt-2">
            Usamos únicamente cookies necesarias para mantener tu sesión iniciada. No usamos
            cookies de rastreo publicitario.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">7. Contacto</h2>
          <p className="mt-2">
            Ante cualquier consulta sobre privacidad, escribinos a{' '}
            <a href="mailto:tratoo.contacto@gmail.com" className="underline">
              tratoo.contacto@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
