type P = { className?: string; size?: number }

export function Check({ className = '', size = 12 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path d="M2 6.4l2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  )
}

export function Arrow({ className = '', size = 14 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-hidden="true">
      <path d="M2 7h9.5M7.5 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export function ArrowUpRight({ className = '', size = 14 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-hidden="true">
      <path d="M4 10L10 4M5 4h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export function Cross({ className = '', size = 12 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path d="M3 3l6 6M9 3l-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  )
}
