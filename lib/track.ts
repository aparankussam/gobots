/**
 * Privacy-respecting event counts through Vercel Web Analytics (no cookies).
 * Custom events need a paid Vercel plan; on other plans this is a harmless no-op
 * and only page views are counted. Never throws, never blocks.
 */
type Va = (cmd: 'event', payload: { name: string; data?: Record<string, string> }) => void

export function track(name: string, data?: Record<string, string>) {
  try {
    const va = (window as unknown as { va?: Va }).va
    if (typeof va === 'function') va('event', { name, data })
  } catch {
    /* analytics must never affect the page */
  }
}

/** Event name for a click on a link, or null if it is not one we count. */
export function eventForHref(href: string | null): string | null {
  if (!href) return null
  if (href === '/walkthrough') return 'sprint_click'
  if (href.startsWith('https://revxl.gobotsai.com/')) return 'scan_click'
  return null
}
