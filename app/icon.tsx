import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 7,
          background: '#09090b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <path d="M6 20 H26" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
          <path d="M32 20 H52" stroke="#059669" strokeWidth="10" strokeLinecap="round" />
          <path d="M29 26 V78" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
          <circle cx="78" cy="30" r="13" fill="none" stroke="#059669" strokeWidth="9" />
          <circle cx="78" cy="70" r="13" fill="none" stroke="#ffffff" strokeWidth="9" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
