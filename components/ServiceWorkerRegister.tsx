'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // best-effort: a failed registration shouldn't break the app,
        // it just means "Add to Home Screen" won't be a real install
      })
    }
  }, [])

  return null
}
