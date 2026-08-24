import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tratoo — Encontrá al profesional que resuelve',
    short_name: 'Tratoo',
    description:
      'Tratoo conecta clientes con profesionales verificados de hogar, consultoría y salud.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#09090b',
    lang: 'es-AR',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
