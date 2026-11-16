import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/** Copy that must never appear on the public site (spec §4). */
export const BANNED: { label: string; pattern: RegExp }[] = [
  { label: 'topmost', pattern: /\btopmost\b/i },
  { label: 'world-class', pattern: /world-class/i },
  { label: 'leading', pattern: /\bleading\b/i },
  { label: 'best', pattern: /\bbest\b/i },
  { label: 'staffing', pattern: /\bstaffing\b/i },
  { label: 'staff augmentation', pattern: /staff augmentation/i },
  { label: 'consulting', pattern: /\bconsulting\b/i },
  { label: 'consultancy', pattern: /\bconsultancy\b/i },
  { label: 'offshore', pattern: /\boffshore\b/i },
  { label: 'equity', pattern: /\bequity\b/i },
  { label: 'run-rate', pattern: /run-rate/i },
  { label: 'ARR', pattern: /\bARR\b/ },
  { label: 'PCP', pattern: /\bPCP\b/ },
  { label: 'Evolutia', pattern: /evolutia/i },
  { label: 'CST', pattern: /\bCST\b/ },
  { label: 'Caterlust', pattern: /caterlust/i },
  { label: 'compliant', pattern: /\bcompliant\b/i },
  { label: 'certified', pattern: /(?<!board-)\bcertified\b/i },
  { label: 'customers', pattern: /\bcustomers?\b/i },
]

export function findBanned(text: string): string[] {
  return BANNED.filter((b) => b.pattern.test(text)).map((b) => b.label)
}

/** Static render, tags stripped, entities decoded enough for copy checks. */
export function renderText(el: ReactElement): string {
  return renderToStaticMarkup(el)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}
