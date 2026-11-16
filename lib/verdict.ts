export type Verdict = 'SAFE' | 'WARNING' | 'BLOCK' | 'UNKNOWN'

/** Map the engine's verdict_code onto the site's three verdicts. */
export function toVerdict(code: string | undefined): Verdict {
  switch (code) {
    case 'SAFE':
      return 'SAFE'
    case 'NEEDS_REVIEW':
      return 'WARNING'
    case 'STOP':
      return 'BLOCK'
    default:
      return 'UNKNOWN'
  }
}
