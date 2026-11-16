import { toVerdict, type Verdict } from './verdict'

export type CheckResult =
  | { kind: 'done'; verdict: Verdict; reason?: string; runId?: string; receipt?: unknown }
  | { kind: 'error'; limited?: boolean }

export type VerifyOutcome =
  | { kind: 'valid'; keyId?: string; algo?: string }
  | { kind: 'invalid' }
  | { kind: 'error' }

/**
 * Run one GoVTraceAI check through the site's proxy. Never throws: a network
 * failure, a timeout or a non-2xx response all come back as { kind: 'error' }.
 */
export async function runCheck(
  text: string,
  profile: 'Finance' | 'General',
  opts: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<CheckResult> {
  const { fetchImpl = fetch, timeoutMs = 10_000 } = opts
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetchImpl('/api/govtrace/evaluate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, profile }),
      signal: ctrl.signal,
    })
    if (res.status === 429) return { kind: 'error', limited: true }
    if (!res.ok) return { kind: 'error' }
    const data = (await res.json()) as {
      verdict_code?: string
      reason_line?: string
      run_id?: string
      receipt?: unknown
    }
    return {
      kind: 'done',
      verdict: toVerdict(data.verdict_code),
      reason: data.reason_line,
      runId: data.run_id,
      receipt: data.receipt,
    }
  } catch {
    return { kind: 'error' }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Verify one signed receipt by its signature, through the site's verify proxy.
 * Never throws. Only the engine can answer "valid", so any failure to reach it
 * is { kind: 'error' }, never a guess.
 */
export async function verifyReceipt(
  receipt: unknown,
  opts: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<VerifyOutcome> {
  const { fetchImpl = fetch, timeoutMs = 10_000 } = opts
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetchImpl('/api/govtrace/verify-receipt', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ receipt }),
      signal: ctrl.signal,
    })
    if (!res.ok) return { kind: 'error' }
    const data = (await res.json()) as { valid?: boolean; public_key_id?: string; signature_algo?: string }
    if (data.valid === true) return { kind: 'valid', keyId: data.public_key_id, algo: data.signature_algo }
    if (data.valid === false) return { kind: 'invalid' }
    return { kind: 'error' }
  } catch {
    return { kind: 'error' }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Wraps promises so only the most recently started one counts as fresh.
 * Older ones resolve to { fresh: false } and their value is dropped, so a
 * slow earlier check can never overwrite a newer one.
 */
export function latestOnly() {
  let seq = 0
  return async <T,>(p: Promise<T>): Promise<{ fresh: true; value: T } | { fresh: false }> => {
    const id = ++seq
    const value = await p
    return id === seq ? { fresh: true, value } : { fresh: false }
  }
}
