import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '14px', height: '45px',  background: 'white', borderRadius: '7px' }} />
          <div style={{ width: '14px', height: '80px',  background: 'white', borderRadius: '7px' }} />
          <div style={{ width: '14px', height: '115px', background: 'white', borderRadius: '7px' }} />
          <div style={{ width: '14px', height: '80px',  background: 'white', borderRadius: '7px' }} />
          <div style={{ width: '14px', height: '45px',  background: 'white', borderRadius: '7px' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
