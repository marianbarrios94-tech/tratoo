import { LogoMark } from './Logo'

// El elemento vive siempre en el HTML — nunca lo agrega ni lo saca React, así
// que no hay riesgo de choque con la hidratación. Quién lo muestra y lo
// desvanece es puro CSS (ver globals.css), activado por una clase que un
// script bloqueante en <head> (app/layout.tsx) agrega a <html> antes de
// pintar, si detecta que la app corre instalada.
export function SplashScreen() {
  return (
    <div id="tratoo-splash" className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
      <LogoMark className="h-24 w-24" />
    </div>
  )
}
