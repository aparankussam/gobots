import { InkFilter } from './Seal'

type Tone = 'seal' | 'safe' | 'warn' | 'block' | 'ink'

const TONE: Record<Tone, string> = {
  seal: 'text-seal',
  safe: 'text-verdict-safe',
  warn: 'text-verdict-warn',
  block: 'text-verdict-block',
  ink: 'text-ink',
}

/**
 * Rectangular rubber stamp impression. Width follows the text.
 */
export default function Stamp({
  id,
  children,
  tone = 'seal',
  size = 'md',
  className = '',
}: {
  id: string
  children: string
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const fs = size === 'lg' ? 30 : size === 'sm' ? 13 : 19
  const padX = fs * 0.7
  const padY = fs * 0.5
  const w = Math.round(children.length * fs * 0.66 + padX * 2)
  const h = Math.round(fs + padY * 2)
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={`${TONE[tone]} ${className}`}
      style={{ mixBlendMode: 'multiply', overflow: 'hidden', contain: 'paint' }}
      role="img"
      aria-label={children}
    >
      <defs>
        <InkFilter id={`${id}-ink`} />
      </defs>
      <g filter={`url(#${id}-ink)`}>
        <rect x="1.5" y="1.5" width={w - 3} height={h - 3} fill="none" stroke="currentColor" strokeWidth="2.6" rx="2" />
        <rect x="5" y="5" width={w - 10} height={h - 10} fill="none" stroke="currentColor" strokeWidth="0.9" rx="1" />
        <text
          x={w / 2}
          y={h / 2 + fs * 0.36}
          textAnchor="middle"
          fill="currentColor"
          fontSize={fs}
          fontWeight="800"
          letterSpacing={fs * 0.08}
          style={{ fontFamily: 'var(--font-sans)', fontStretch: '75%' }}
        >
          {children}
        </text>
      </g>
    </svg>
  )
}
