import { BackButton } from '@/components/BackButton'

export const metadata = {
  title: 'Política de reembolsos y cancelación — Tratoo',
}

export default function ReembolsosPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <BackButton fallbackHref="/" />
      <h1 className="mt-4 text-2xl font-semibold">Política de reembolsos y cancelación</h1>
      <p className="mt-1 text-sm text-zinc-500">Última actualización: agosto de 2026.</p>

      <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
        Este documento es un borrador base y debe ser revisado por un profesional legal antes de
        su publicación definitiva.
      </p>

      <div className="mt-8 flex flex-col gap-6 text-sm text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            1. Derecho de arrepentimiento (primeros 10 días)
          </h2>
          <p className="mt-2">
            De acuerdo con el artículo 34 de la Ley de Defensa del Consumidor (Ley 24.240), si
            contrataste tu suscripción a través de internet tenés derecho a revocar la compra
            dentro de los 10 días corridos desde la contratación, sin necesidad de justificar el
            motivo y sin cargo alguno. Para ejercer este derecho, escribinos a{' '}
            <a href="mailto:hola@tratoo.com" className="underline">
              hola@tratoo.com
            </a>{' '}
            dentro de ese plazo y te reembolsamos el monto pagado en su totalidad.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            2. Cancelación después de los 10 días
          </h2>
          <p className="mt-2">
            Pasado el plazo de arrepentimiento, podés cancelar tu suscripción en cualquier momento
            desde &quot;Cancelar suscripción&quot; en tu panel. La cancelación no es inmediata: tu
            plan sigue activo (con acceso al directorio y a nuevas solicitudes) hasta el final del
            período ya pagado, y no se te cobra el siguiente ciclo. No se realizan reembolsos
            parciales por el tiempo restante de un período ya iniciado.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            3. Pagos fallidos
          </h2>
          <p className="mt-2">
            Si un pago de renovación falla, tu suscripción queda en estado &quot;con pago
            pendiente&quot; y perdés temporalmente la visibilidad en el directorio hasta que se
            regularice el pago o se cancele la suscripción.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            4. Servicios entre cliente y profesional
          </h2>
          <p className="mt-2">
            Esta política cubre únicamente los pagos de suscripción realizados a Tratoo. Tratoo no
            procesa ni interviene en los pagos por los servicios acordados directamente entre un
            cliente y un profesional; cualquier reembolso relacionado con esos servicios debe
            acordarse entre las partes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">5. Contacto</h2>
          <p className="mt-2">
            Para solicitar un reembolso o resolver cualquier duda sobre tu suscripción, escribinos
            a{' '}
            <a href="mailto:hola@tratoo.com" className="underline">
              hola@tratoo.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
