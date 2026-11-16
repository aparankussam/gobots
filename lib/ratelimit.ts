/**
 * Best-effort, in-memory rate limit for the API proxies. On serverless each
 * instance keeps its own counts, so this only slows casual abuse. A Vercel
 * Firewall rule with the same numbers is the real control.
 */
export const RATE_LIMIT = 10
export const RATE_WINDOW_MS = 10 * 60 * 1000

const hits = new Map<string, number[]>()

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/** True when this key may proceed; records the hit. */
export function allow(key: string, now: number = Date.now(), limit = RATE_LIMIT, windowMs = RATE_WINDOW_MS): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) {
    hits.forEach((v, k) => {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k)
    })
  }
  return true
}

export function resetRateLimits() {
  hits.clear()
}

export const tooMany = () =>
  new Response(JSON.stringify({ error: 'rate_limited', message: 'Too many requests. Try again in a few minutes.' }), {
    status: 429,
    headers: { 'content-type': 'application/json', 'retry-after': '600' },
  })
