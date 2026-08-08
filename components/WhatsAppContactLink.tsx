'use client'

import { logWhatsAppClick } from '@/app/cuenta/solicitudes/actions'

export function WhatsAppContactLink({
  professionalId,
  href,
}: {
  professionalId: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        logWhatsAppClick(professionalId)
      }}
      className="mt-4 inline-block rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
    >
      Contactar por WhatsApp
    </a>
  )
}
