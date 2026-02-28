'use client'

interface Props {
  agreeableness: number   // 0-5
  extraversion: number    // 0-5
  conscientiousness: number // 0-5
  openness: number        // 0-5
  size?: number
}

const AXES = [
  { key: 'agreeableness', label: '温かみ', color: '#f59e0b' },
  { key: 'extraversion', label: '社交性', color: '#8b5cf6' },
  { key: 'conscientiousness', label: '丁寧さ', color: '#3b82f6' },
  { key: 'openness', label: '独自性', color: '#10b981' },
] as const

function polarToXY(angle: number, r: number, cx: number, cy: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

export default function PersonalityRadar({
  agreeableness,
  extraversion,
  conscientiousness,
  openness,
  size = 200,
}: Props) {
  const values = [agreeableness, extraversion, conscientiousness, openness]
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 28
  const n = 4

  function getPoints(vals: number[]) {
    return vals
      .map((v, i) => {
        const angle = (360 / n) * i
        const r = (v / 5) * maxR
        return polarToXY(angle, r, cx, cy)
      })
      .map((p) => `${p.x},${p.y}`)
      .join(' ')
  }

  const gridLevels = [1, 2, 3, 4, 5]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid */}
      {gridLevels.map((lvl) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const angle = (360 / n) * i
          const r = (lvl / 5) * maxR
          return polarToXY(angle, r, cx, cy)
        })
        return (
          <polygon
            key={lvl}
            points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        )
      })}

      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => {
        const angle = (360 / n) * i
        const p = polarToXY(angle, maxR, cx, cy)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth="1" />
      })}

      {/* Data polygon */}
      <polygon
        points={getPoints(values)}
        fill="#f59e0b"
        fillOpacity="0.2"
        stroke="#f59e0b"
        strokeWidth="2"
      />

      {/* Dots */}
      {values.map((v, i) => {
        const angle = (360 / n) * i
        const r = (v / 5) * maxR
        const p = polarToXY(angle, r, cx, cy)
        return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#f59e0b" />
      })}

      {/* Labels */}
      {AXES.map((ax, i) => {
        const angle = (360 / n) * i
        const p = polarToXY(angle, maxR + 16, cx, cy)
        return (
          <text
            key={ax.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#57534e"
            fontFamily="sans-serif"
          >
            {ax.label}
          </text>
        )
      })}
    </svg>
  )
}
