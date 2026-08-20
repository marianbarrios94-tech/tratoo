import { BackButton } from '@/components/BackButton'

export const metadata = {
  title: 'Términos y condiciones — Tratoo',
}

export default function TerminosPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <BackButton fallbackHref="/" />
      <h1 className="mt-4 text-2xl font-semibold">Términos y condiciones</h1>
      <p className="mt-1 text-sm text-zinc-500">Última actualización: agosto de 2026.</p>

      <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
        Este documento es un borrador base y debe ser revisado por un profesional legal antes de
        su publicación definitiva.
      </p>

      <div className="mt-8 flex flex-col gap-6 text-sm text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">1. Qué es Tratoo</h2>
          <p className="mt-2">
            Tratoo es una plataforma que conecta a personas que buscan un servicio (&quot;clientes&quot;)
            con personas que lo ofrecen (&quot;profesionales&quot;) en las áreas de hogar, consultoría y
            salud. Tratoo actúa únicamente como intermediario tecnológico: no presta los servicios
            solicitados, no emplea a los profesionales listados en el directorio, y no participa en
            la ejecución del trabajo acordado entre cliente y profesional.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">2. Cuentas</h2>
          <p className="mt-2">
            Para usar Tratoo hace falta crear una cuenta con un email válido. Sos responsable de
            mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu
            cuenta. Una misma cuenta puede actuar como cliente y como profesional a la vez.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            3. Responsabilidad entre cliente y profesional
          </h2>
          <p className="mt-2">
            El contrato de prestación de servicios se celebra directamente entre el cliente y el
            profesional. Tratoo no garantiza la calidad, idoneidad, legalidad ni el resultado del
            servicio prestado, y no es parte de ese acuerdo. Cualquier reclamo sobre el servicio en
            sí debe resolverse entre las partes involucradas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            4. Suscripciones de profesionales
          </h2>
          <p className="mt-2">
            Los profesionales pueden suscribirse a un plan pago para aparecer en el directorio
            público y recibir solicitudes de clientes. Los pagos se procesan a través de Mercado
            Pago.
            Ver la{' '}
            <a href="/reembolsos" className="underline">
              política de reembolsos y cancelación
            </a>{' '}
            para los detalles de facturación.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            5. Conducta prohibida
          </h2>
          <p className="mt-2">
            No está permitido usar Tratoo para publicar información falsa, suplantar identidad,
            evadir el pago de una suscripción activa, ni usar la plataforma con fines distintos a
            conectar clientes y profesionales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            6. Limitación de responsabilidad
          </h2>
          <p className="mt-2">
            En la medida permitida por la ley aplicable, Tratoo no es responsable por daños
            indirectos, pérdida de ganancias, ni por perjuicios derivados de los servicios
            contratados entre clientes y profesionales a través de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            7. Ley aplicable
          </h2>
          <p className="mt-2">
            Estos términos se rigen por las leyes de la República Argentina, incluyendo la Ley de
            Defensa del Consumidor (Ley 24.240) para las relaciones con usuarios consumidores.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">8. Contacto</h2>
          <p className="mt-2">
            Ante cualquier consulta sobre estos términos, escribinos a{' '}
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
