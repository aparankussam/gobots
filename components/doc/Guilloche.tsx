/**
 * Security-print guilloche band: interfering sine strands, drawn as authored SVG.
 * Deterministic, so server and client render the same paths.
 */
type Props = {
  width?: number
  height?: number
  strands?: number
  className?: string
  color?: string
  opacity?: number
}

function strand(w: number, h: number, k: number, n: number) {
  const mid = h / 2
  const amp = h * 0.42
  const phase = (k / n) * Math.PI * 2
  const pts: string[] = []
  for (let x = 0; x <= w; x += 3) {
    const t = x / w
    const y =
      mid +
      amp *
        Math.sin(t * Math.PI * 9 + phase) *
        (0.55 + 0.45 * Math.cos(t * Math.PI * 2 + phase / 2))
    pts.push(`${x === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(2)}`)
  }
  return pts.join('')
}

export default function Guilloche({
  width = 480,
  height = 44,
  strands = 14,
  className,
  color = 'currentColor',
  opacity = 1,
}: Props) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={color} strokeWidth={0.45} opacity={opacity}>
        {Array.from({ length: strands }, (_, k) => (
          <path key={k} d={strand(width, height, k, strands)} />
        ))}
      </g>
    </svg>
  )
}
