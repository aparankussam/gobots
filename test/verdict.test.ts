import { describe, expect, it } from 'vitest'
import { toVerdict } from '@/lib/verdict'
import { runCheck } from '@/lib/check'

describe('toVerdict', () => {
  it.each([
    ['SAFE', 'SAFE'],
    ['NEEDS_REVIEW', 'WARNING'],
    ['STOP', 'BLOCK'],
    ['SOMETHING_ELSE', 'UNKNOWN'],
    [undefined, 'UNKNOWN'],
  ])('%s → %s', (code, expected) => {
    expect(toVerdict(code)).toBe(expected)
  })
})

const json = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }))

describe('runCheck', () => {
  it('returns an error when the network fails', async () => {
    const fetchImpl = () => Promise.reject(new Error('offline'))
    expect(await runCheck('x', 'General', { fetchImpl })).toEqual({ kind: 'error' })
  })

  it('returns an error when the engine never answers', async () => {
    const fetchImpl = (_: unknown, init?: RequestInit) =>
      new Promise<Response>((_, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('aborted'))))
    expect(await runCheck('x', 'General', { fetchImpl, timeoutMs: 50 })).toEqual({ kind: 'error' })
  })

  it('returns an error on a non-2xx response', async () => {
    const fetchImpl = () => json({ error: 'engine_unreachable' }, 502)
    expect(await runCheck('x', 'General', { fetchImpl })).toEqual({ kind: 'error' })
  })

  it('maps a verdict from the engine', async () => {
    const fetchImpl = () => json({ verdict_code: 'STOP', run_id: 'r1', reason_line: 'PII found' })
    expect(await runCheck('x', 'Finance', { fetchImpl })).toEqual({
      kind: 'done',
      verdict: 'BLOCK',
      runId: 'r1',
      reason: 'PII found',
    })
  })
})
