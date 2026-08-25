'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'tratoo-install-dismissed'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true
    const alreadyDismissed = localStorage.getItem(DISMISSED_KEY) === '1'
    /* eslint-disable react-hooks/set-state-in-effect --
       one-time client-only feature detection (window/localStorage aren't
       available during SSR), not a sync loop */
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
    setVisible(!standalone && !alreadyDismissed)
    /* eslint-enable react-hooks/set-state-in-effect */

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setVisible(false)
  }

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    dismiss()
  }

  if (!visible) return null
  if (!deferredPrompt && !isIOS) return null

  return (
    <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-emerald-600"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
      <div className="flex-1">
        {deferredPrompt ? (
          <span>Instalá Tratoo en tu celular para acceder más rápido, como una app.</span>
        ) : (
          <span>
            Instalá Tratoo en tu iPhone: tocá <strong>compartir</strong> (⎋) y después{' '}
            <strong>&quot;Agregar a pantalla de inicio&quot;</strong>.
          </span>
        )}
      </div>
      {deferredPrompt && (
        <button
          type="button"
          onClick={install}
          className="shrink-0 rounded-full bg-zinc-950 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Instalar
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar"
        className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
