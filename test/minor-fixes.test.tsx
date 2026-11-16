import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import Claim from '@/components/Claim'
import Figures from '@/components/home/Figures'
import TrustBar from '@/components/TrustBar'
import { PRESETS } from '@/components/home/HomeChecker'
import { SPECIMENS } from '@/content/specimens'
import { GET as llms } from '@/app/llms.txt/route'
import { POST } from '@/app/api/govtrace/evaluate/route'
import { ENGINE_TIMEOUT_MS, MAX_BODY_BYTES } from '@/lib/limits'

const root = path.resolve(__dirname, '..')
const markers = (html: string) => html.match(/aria-label="Source/g)?.length ?? 0

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('claim marker names what it sources', () => {
  it('includes a short form of the claim in its label', () => {
    const html = renderToStaticMarkup(<Claim id="fig.products">5 products</Claim>)
    expect(html).toContain('aria-label="Source for 5 products: On this site"')
  })

  it('accepts an explicit label when the claim is not plain text', () => {
    const html = renderToStaticMarkup(
      <Claim id="fig.clients" label="three clients">
        <b>3</b>
      </Claim>,
    )
    expect(html).toContain('aria-label="Source for three clients: Reference on request"')
  })
})

describe('figures band marks each claim once', () => {
  it('has four markers: three figures and the delivery line', () => {
    expect(markers(renderToStaticMarkup(<Figures />))).toBe(4)
  })
})

describe('team strip marker sits on the list', () => {
  it('wraps the company list, not the label', () => {
    const html = renderToStaticMarkup(<TrustBar />)
    expect(html.indexOf('<ul')).toBeLessThan(html.indexOf('aria-label="Source'))
  })
})

describe('example prompts live in one place', () => {
  it('checker presets reuse the proof specimens', () => {
    expect(PRESETS.map((p) => p.text)).toEqual(SPECIMENS.map((s) => s.prompt))
  })
})

describe('llms.txt engine lines read cleanly', () => {
  it('does not repeat the engine name', async () => {
    expect(await llms().text()).not.toContain('Products: Products')
  })
})

describe('evaluate proxy hardening', () => {
  it('rejects a declared oversized body before reading it', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const req = new Request('http://localhost/api/govtrace/evaluate', {
      method: 'POST',
      body: '{}',
      headers: { 'content-length': String(MAX_BODY_BYTES + 1) },
    })
    const textSpy = vi.spyOn(req, 'text')
    const res = await POST(req)
    expect(res.status).toBe(413)
    expect(textSpy).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('gives up on a hung engine with 504', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_: unknown, init?: RequestInit) =>
          new Promise((_, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('aborted')))),
      ),
    )
    const pending = POST(new Request('http://localhost/api/govtrace/evaluate', { method: 'POST', body: '{"text":"x"}' }))
    await vi.advanceTimersByTimeAsync(ENGINE_TIMEOUT_MS + 1)
    const res = await pending
    expect(res.status).toBe(504)
  })
})

describe('walkthrough logic fixture pins routing inputs', () => {
  it('covers the free-email list and the initial form state', () => {
    const snap = JSON.parse(readFileSync(path.join(root, 'test/fixtures/walkthrough-logic.json'), 'utf8'))
    expect(Object.keys(snap)).toEqual(expect.arrayContaining(['free_email', 'initial']))
  })
})
