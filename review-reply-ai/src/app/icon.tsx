import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f59e0b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '7px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ width: '3px', height: '8px',  background: 'white', borderRadius: '2px' }} />
          <div style={{ width: '3px', height: '14px', background: 'white', borderRadius: '2px' }} />
          <div style={{ width: '3px', height: '20px', background: 'white', borderRadius: '2px' }} />
          <div style={{ width: '3px', height: '14px', background: 'white', borderRadius: '2px' }} />
          <div style={{ width: '3px', height: '8px',  background: 'white', borderRadius: '2px' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
