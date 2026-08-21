import { ImageResponse } from 'next/og'

export const alt = 'Tratoo — Encontrá al profesional que resuelve'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#09090b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 36,
            background: '#18181b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="112" height="112" viewBox="0 0 100 100" fill="none">
            <path d="M6 20 H26" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
            <path d="M32 20 H52" stroke="#059669" strokeWidth="10" strokeLinecap="round" />
            <path d="M29 26 V78" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
            <circle cx="78" cy="30" r="13" fill="none" stroke="#059669" strokeWidth="9" />
            <circle cx="78" cy="70" r="13" fill="none" stroke="#ffffff" strokeWidth="9" />
          </svg>
        </div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: '#ffffff' }}>
          Tratoo
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#a1a1aa' }}>
          Encontrá al profesional que resuelve
        </div>
      </div>
    ),
    { ...size }
  )
}
