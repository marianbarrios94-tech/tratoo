'use client'

import { useEffect } from 'react'

// Guardar el perfil redirige a la misma ruta con ?message=..., que Next.js
// trata como una actualización de la página actual y no resetea el scroll —
// si el botón de guardar está al final de un formulario largo, el aviso de
// "Perfil guardado" queda arriba, fuera de vista.
export function ScrollToTop({ when }: { when?: string }) {
  useEffect(() => {
    if (when) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [when])

  return null
}
