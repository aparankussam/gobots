/**
 * Notary-style rubber seal in logo orange, with a light ink-roughness filter.
 */
type Props = {
  id: string
  size?: number
  ring?: string
  center?: string
  className?: string
  style?: React.CSSProperties
}

export function InkFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" result="d" />
      <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="1" seed="3" result="m" />
      <feColorMatrix
        in="m"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75"
        result="mask"
      />
      <feComposite in="d" in2="mask" operator="in" />
    </filter>
  )
}

export default function Seal({
  id,
  size = 132,
  ring = 'GoVTrace · Ed25519 signed · Third-party verifiable · ',
  center = 'SIGNED',
  className = '',
  style,
}: Props) {
  const fid = `${id}-ink`
  const pid = `${id}-path`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`text-seal ${className}`}
      style={{ mixBlendMode: 'multiply', overflow: 'hidden', contain: 'paint', ...style }}
      role="img"
      aria-label={`Seal: ${center}`}
    >
      <defs>
        <InkFilter id={fid} />
        <path id={pid} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <g filter={`url(#${fid})`} fill="none" stroke="currentColor">
        <circle cx="60" cy="60" r="57" strokeWidth="2.6" />
        <circle cx="60" cy="60" r="52.5" strokeWidth="0.9" />
        <circle cx="60" cy="60" r="35" strokeWidth="1.4" />
        <text
          fill="currentColor"
          stroke="none"
          fontSize="8.4"
          fontWeight="700"
          letterSpacing="1.6"
          style={{ fontFamily: 'var(--font-sans)', textTransform: 'uppercase', fontStretch: '87.5%' }}
        >
          <textPath href={`#${pid}`} startOffset="0">
            {ring.toUpperCase()}
          </textPath>
        </text>
        {/* The full Gobots logo, in one stamp colour, at the centre of the seal. */}
        <image data-mark="logo" href="/gobots-logo-seal.png" x="31" y="44.5" width="58" height="21.4" preserveAspectRatio="xMidYMid meet" />
        <text
          x="60"
          y="86"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="8"
          fontWeight="700"
          letterSpacing="1.4"
          style={{ fontFamily: 'var(--font-sans)', fontStretch: '87.5%' }}
        >
          {center}
        </text>
      </g>
    </svg>
  )
}
