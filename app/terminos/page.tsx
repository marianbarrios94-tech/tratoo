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
            4. Verificación de profesionales
          </h2>
          <p className="mt-2">
            Algunos perfiles muestran una insignia de &quot;Verificado&quot;. Esa verificación confirma
            datos básicos del perfil, pero no es una garantía de idoneidad profesional, matrícula
            habilitante ni de la conducta del profesional durante la prestación del servicio. Usá tu
            criterio al contratar, más allá de la insignia.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            5. Contenido que publicás
          </h2>
          <p className="mt-2">
            Lo que publiques en Tratoo (perfil, descripción, fotos, reseñas) sigue siendo tuyo. Al
            publicarlo, le das a Tratoo una licencia no exclusiva para mostrarlo dentro de la
            plataforma con el fin de operar el directorio. Las reseñas deben reflejar experiencias
            reales; podemos ocultar o eliminar contenido falso, ofensivo o que incumpla estos
            términos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            6. Suscripciones de profesionales
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
            7. Conducta prohibida
          </h2>
          <p className="mt-2">
            No está permitido usar Tratoo para publicar información falsa, suplantar identidad,
            evadir el pago de una suscripción activa, ni usar la plataforma con fines distintos a
            conectar clientes y profesionales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            8. Cierre y suspensión de cuenta
          </h2>
          <p className="mt-2">
            Podés cerrar tu cuenta cuando quieras escribiéndonos a nuestro contacto. Tratoo puede
            suspender o dar de baja cuentas que incumplan estos términos, generen riesgo para otros
            usuarios o hagan un uso fraudulento de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            9. Limitación de responsabilidad
          </h2>
          <p className="mt-2">
            En la medida permitida por la ley aplicable, Tratoo no es responsable por daños
            indirectos, pérdida de ganancias, ni por perjuicios derivados de los servicios
            contratados entre clientes y profesionales a través de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            10. Ley aplicable y jurisdicción
          </h2>
          <p className="mt-2">
            Estos términos se rigen por las leyes de la República Argentina, incluyendo la Ley de
            Defensa del Consumidor (Ley 24.240) para las relaciones con usuarios consumidores. Como
            consumidor, ante cualquier controversia podés iniciar el reclamo ante los tribunales de
            tu propio domicilio, conforme al artículo 36 de la Ley 24.240 (que no permite pactar de
            antemano un tribunal distinto en tu perjuicio).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">11. Contacto</h2>
          <p className="mt-2">
            Ante cualquier consulta sobre estos términos, escribinos a{' '}
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
