import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/govtrace/evaluate/route'
import { MAX_BODY_BYTES } from '@/lib/limits'

const req = (body: string) => new Request('http://localhost/api/govtrace/evaluate', { method: 'POST', body })

afterEach(() => vi.unstubAllGlobals())

describe('evaluate proxy', () => {
  it('caps the body at 8 KB', () => {
    expect(MAX_BODY_BYTES).toBe(8192)
  })

  it('rejects an oversized body with 413 without calling the engine', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const res = await POST(req('x'.repeat(MAX_BODY_BYTES + 1)))
    expect(res.status).toBe(413)
    expect((await res.json()).error).toBe('too_large')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('forwards a normal body to the engine once', async () => {
    const fetchSpy = vi.fn(async () => new Response('{"verdict_code":"SAFE"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await POST(req(JSON.stringify({ text: 'hello', profile: 'General' })))
    expect(res.status).toBe(200)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(String((fetchSpy.mock.calls[0] as unknown[])[0])).toMatch(/\/audit$/)
  })

  it('still rejects invalid JSON with 400', async () => {
    vi.stubGlobal('fetch', vi.fn())
    expect((await POST(req('{not json'))).status).toBe(400)
  })
})
