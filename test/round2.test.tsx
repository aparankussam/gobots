import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import Home from '@/app/page'
import CapabilitiesPage, { metadata as capMeta } from '@/app/capabilities/page'
import MortgagePage, { metadata as mortMeta } from '@/app/revxl/mortgage/page'
import NotFound from '@/app/not-found'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import HomeChecker from '@/components/home/HomeChecker'
import WalkthroughClient from '@/app/walkthrough/WalkthroughClient'
import VerifyClient from '@/app/verify/VerifyClient'
import { metadata as walkMeta } from '@/app/walkthrough/page'
import { GET as llms } from '@/app/llms.txt/route'
import { SITE_META } from '@/content/meta'
import { SAMPLE_RECEIPT, SAMPLE_META } from '@/content/sample-receipt'
import { WEEK_ONE, CALL_CAPTION } from '@/content/sprint'
import { allow, resetRateLimits, RATE_LIMIT, RATE_WINDOW_MS } from '@/lib/ratelimit'
import { runCheck, verifyReceipt } from '@/lib/check'
import { eventForHref } from '@/lib/track'
import { POST as evaluate } from '@/app/api/govtrace/evaluate/route'
import { findBanned, renderText } from './banned'

const root = path.resolve(__dirname, '..')
const read = (p: string) => readFileSync(path.join(root, p), 'utf8')

afterEach(() => {
  vi.unstubAllGlobals()
  resetRateLimits()
})

describe('one true week-1 sequence (A1)', () => {
  const surfaces = {
    home: renderText(<Home />),
    meta: JSON.stringify(SITE_META),
    walk: JSON.stringify(walkMeta),
  }

  it('states the same sentence everywhere it appears in full', () => {
    expect(WEEK_ONE).toBe('A working system on your workflow in week 1. Governed, integrated and receipted by week 4.')
    expect(surfaces.home).toContain(WEEK_ONE)
  })

  it.each(Object.entries(surfaces))('%s never claims governance from the first deploy or day one', (_, text) => {
    expect(text).not.toMatch(/first deploy|from day one|on day one|runs in production, governed|governed from/i)
  })

  it('llms.txt carries the same sentence and the new pages', async () => {
    const t = await llms().text()
    expect(t).toContain(WEEK_ONE)
    expect(t).toContain('https://gobotsai.com/capabilities')
    expect(t).toContain('https://gobotsai.com/revxl/mortgage')
    expect(t).not.toContain('www.gobotsai.com')
  })

  it('the link-preview image is a 1200x630 PNG that names the new headline', () => {
    const png = readFileSync(path.join(root, 'public/og-image.png'))
    expect(png.subarray(1, 4).toString()).toBe('PNG')
    expect(png.readUInt32BE(16)).toBe(1200)
    expect(png.readUInt32BE(20)).toBe(630)
    expect(read('public/og-image.svg')).toContain('A working AI system')
    expect(read('app/layout.tsx')).toContain('/og-image.png')
  })
})

describe('/walkthrough tells the truth (A2)', () => {
  const text = renderText(<WalkthroughClient />)
  const src = read('app/walkthrough/WalkthroughClient.tsx')

  it('never says a request was received or read, and promises no priority', () => {
    for (const s of ['Request received', 'RECEIVED', 'PRIORITY', 'Priority', 'prioritized', 'Read by the founder', 'Founder reads it', 'No SDR follow-up', 'goes only to the founder'])
      expect(text + src.replace(/priority/g, ''), s).not.toContain(s)
  })

  it('discloses that Calendly receives the details', () => {
    expect(text).toContain('They are passed to our scheduling provider, Calendly')
  })

  it('no longer hides the calendar provider consent banner', () => {
    expect(src).not.toContain('hide_gdpr_banner')
  })

  it('marks the form for the analytics form-start count', () => {
    expect(src).toContain('data-track-form')
  })

  it('the caption says what the call costs', () => {
    expect(text).toContain('No commitment, no discovery fee')
  })
})

describe('homepage has eight sections (A8)', () => {
  const html = renderToStaticMarkup(<Home />)
  const order = ['how-it-works', 'live-proof', 'id="products"', 'id="engines"', 'id="who"', 'id="questions"']

  it('runs hero, how it works, proof, products, engines, who you work with, questions, call', () => {
    const idx = order.map((k) => html.indexOf(k.startsWith('id=') ? k : `id="${k}"`))
    for (const i of idx) expect(i).toBeGreaterThan(-1)
    expect([...idx].sort((a, b) => a - b)).toEqual(idx)
  })

  it('moved capabilities and industries off the homepage', () => {
    expect(html).not.toContain('id="capabilities"')
    expect(html).not.toContain('id="industries"')
    expect(html).not.toContain('Agentic and multi-agent systems')
    expect(html).not.toContain('Method')
  })

  it('answers four questions from facts it already states', () => {
    const text = renderText(<Home />)
    for (const q of ['What is a Production Sprint?', 'What do we need to provide?', 'Where does our data go?', 'What happens after week 4?']) expect(text).toContain(q)
  })

  it('keeps the homepage inside the copy rules', () => {
    expect(findBanned(renderText(<Home />))).toEqual([])
  })

  it('shows every primary sprint caption it should', () => {
    expect(renderText(<Home />).split(CALL_CAPTION).length - 1).toBeGreaterThanOrEqual(3)
  })
})

describe('new pages (A8, A9, A10)', () => {
  it('/capabilities keeps the grid and the industries', () => {
    const text = renderText(<CapabilitiesPage />)
    expect(text).toContain('Agentic and multi-agent systems')
    expect(text).toContain('Where we work')
    expect(capMeta.title).toBe('Capabilities · Gobots')
  })

  it('/revxl/mortgage has one action at the top and the three outcomes', () => {
    const full = renderToStaticMarkup(<MortgagePage />)
    const html = full.slice(full.indexOf('<main'), full.indexOf('</main>'))
    const text = renderText(<MortgagePage />)
    expect(html.match(/\bbtn-seal\b/g)?.length).toBe(1)
    expect(text).toContain('Score your mortgage site free')
    for (const s of ['DSCR', 'Pinnacle Ventures', 'Coast2Coast Mortgage', '0–100']) expect(text).toContain(s)
    expect(text).not.toMatch(/48 hours/)
    expect(findBanned(text)).toEqual([])
    expect(mortMeta.title).toContain('RevXL')
  })

  it('404 is in the document style and links onward', () => {
    const text = renderText(<NotFound />)
    expect(text).toContain('No record found')
    expect(renderToStaticMarkup(<NotFound />)).toContain('href="/walkthrough"')
  })

  it('robots and sitemap point at the canonical domain', () => {
    expect(robots().sitemap).toBe('https://gobotsai.com/sitemap.xml')
    const urls = sitemap().map((s) => s.url)
    expect(urls).toEqual(expect.arrayContaining(['https://gobotsai.com', 'https://gobotsai.com/sprint', 'https://gobotsai.com/revxl/mortgage']))
  })
})

describe('proof loop (A5)', () => {
  it('the checker names the live call and sits at the #live-check anchor', () => {
    const html = renderToStaticMarkup(<HomeChecker />)
    expect(html).toContain('id="live-check"')
    expect(renderText(<HomeChecker />)).toContain('A live call to the GoVTraceAI engine')
  })

  it('"Load sample" is a real engine-signed receipt, not a placeholder', () => {
    const src = read('app/verify/VerifyClient.tsx')
    expect(src).not.toContain('PASTE-A-REAL-RECEIPT')
    expect(src).not.toContain('GT-SAMPLE')
    expect(SAMPLE_RECEIPT.signature.length).toBeGreaterThan(60)
    expect(SAMPLE_RECEIPT.signed_fields_data.record_hash).toMatch(/^[0-9a-f]{64}$/)
    expect(renderText(<VerifyClient />)).toContain(`signed by the live engine on ${SAMPLE_META.capturedOn}`)
  })

  it('verifies by signature through the proxy, wrapping the receipt', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ valid: true, public_key_id: 'k', signature_algo: 'Ed25519' })))
    const r = await verifyReceipt({ a: 1 }, { fetchImpl: f as unknown as typeof fetch })
    expect(r).toEqual({ kind: 'valid', keyId: 'k', algo: 'Ed25519' })
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('/api/govtrace/verify-receipt')
    expect(JSON.parse(String(init.body))).toEqual({ receipt: { a: 1 } })
  })

  it('reports an invalid signature and never guesses "valid" when the engine is down', async () => {
    const bad = vi.fn(async () => new Response(JSON.stringify({ valid: false })))
    expect(await verifyReceipt({}, { fetchImpl: bad as unknown as typeof fetch })).toEqual({ kind: 'invalid' })
    const down = vi.fn(async () => {
      throw new Error('offline')
    })
    expect(await verifyReceipt({}, { fetchImpl: down as unknown as typeof fetch })).toEqual({ kind: 'error' })
    const five = vi.fn(async () => new Response('x', { status: 502 }))
    expect(await verifyReceipt({}, { fetchImpl: five as unknown as typeof fetch })).toEqual({ kind: 'error' })
  })

  it('carries the signed receipt out of a check and flags a rate-limited one', async () => {
    const ok = vi.fn(async () => new Response(JSON.stringify({ verdict_code: 'SAFE', reason_line: 'r', run_id: 'x', receipt: { s: 1 } })))
    const done = await runCheck('t', 'General', { fetchImpl: ok as unknown as typeof fetch })
    expect(done).toMatchObject({ kind: 'done', verdict: 'SAFE', receipt: { s: 1 } })
    const limited = vi.fn(async () => new Response('{}', { status: 429 }))
    expect(await runCheck('t', 'General', { fetchImpl: limited as unknown as typeof fetch })).toEqual({ kind: 'error', limited: true })
  })
})

describe('rate limit (A5)', () => {
  it('allows ten per ip per ten minutes, then refuses, then recovers', () => {
    expect(RATE_LIMIT).toBe(10)
    expect(RATE_WINDOW_MS).toBe(600_000)
    for (let i = 0; i < 10; i++) expect(allow('ip:a', 1_000 + i)).toBe(true)
    expect(allow('ip:a', 2_000)).toBe(false)
    expect(allow('ip:b', 2_000)).toBe(true)
    expect(allow('ip:a', 1_000 + RATE_WINDOW_MS + 11)).toBe(true)
  })

  it('the evaluate proxy answers 429 without calling the engine once the limit is hit', async () => {
    const fetchSpy = vi.fn(async () => new Response('{"verdict_code":"SAFE"}'))
    vi.stubGlobal('fetch', fetchSpy)
    const mk = () => new Request('http://localhost/api/govtrace/evaluate', { method: 'POST', body: '{"text":"x"}', headers: { 'x-forwarded-for': '9.9.9.9' } })
    for (let i = 0; i < RATE_LIMIT; i++) expect((await evaluate(mk())).status).toBe(200)
    const res = await evaluate(mk())
    expect(res.status).toBe(429)
    expect((await res.json()).error).toBe('rate_limited')
    expect(fetchSpy).toHaveBeenCalledTimes(RATE_LIMIT)
  })
})

describe('the evidence page does not simulate proof (A7)', () => {
  const html = read('public/evidence-gap.html')

  it('says up front that it is an illustration and points to the real verifier', () => {
    expect(html).toContain('This page is an illustration.')
    expect(html).toContain('href="/verify"')
  })

  it('no longer prints a verification result the page did not produce', () => {
    for (const s of ['SIGNATURE VALID', 'NOT TAMPERED', 'RECEIPT NOT FOUND', 'Get cryptographic verification', 'Verify it yourself'])
      expect(html, s).not.toContain(s)
    expect(html).toContain('SIMULATED RESULT')
  })

  it('states the allegation as an allegation and names both names for the record', () => {
    expect(html).toContain('Class actions allege')
    expect(html).not.toMatch(/Thousands of patients recorded without consent\./)
    expect(html).toContain('The Duty-of-Care Record is signed as a GoVTrace Receipt')
  })
})

describe('analytics (A11)', () => {
  it('counts sprint and scan clicks and nothing else', () => {
    expect(eventForHref('/walkthrough')).toBe('sprint_click')
    expect(eventForHref('https://revxl.gobotsai.com/fundxl/audit')).toBe('scan_click')
    expect(eventForHref('/sprint')).toBeNull()
    expect(eventForHref(null)).toBeNull()
  })
})

describe('one name for the signed record (A7b)', () => {
  it('each page that uses one name states its relationship to the other', () => {
    expect(read('app/demo/DemoClient.tsx')).toContain('signed as a GoVTrace Receipt')
    expect(read('app/verify/VerifyClient.tsx')).toContain('the signed form of a Duty-of-Care Record')
    expect(read('app/spec/page.tsx')).toContain('Duty-of-Care Record is signed as a GoVTrace Receipt')
  })
})

describe('review fixes', () => {
  const html = read('public/evidence-gap.html')

  it('/walkthrough no longer calls the evidence page live or verifiable', () => {
    const text = renderText(<WalkthroughClient />)
    expect(text).not.toMatch(/live evidence artifact|signed and verifiable/)
    expect(text).toContain('an illustrated evidence artifact')
    expect(text).not.toContain('route appropriately')
    expect(text).not.toContain('Sent when you pick a time')
    // step 2 only renders after submit, so check the source (JSX line breaks collapsed)
    expect(read('app/walkthrough/WalkthroughClient.tsx').replace(/\s+/g, ' ')).toContain('we receive them when you book a slot')
  })

  it('the three verdict specimens are labelled illustrative', () => {
    expect(renderText(<Home />)).toContain('Illustrative outcomes for three example inputs. Not engine output')
  })

  it('the evidence page invents no statistic, claims no live status and names no vendors as unable', () => {
    for (const s of ['reported to hold signed runtime receipts', 'can be compliant', 'Purview', 'Vanta', 'Credo', 'Not admissible', 'AI Execution Co.', 'gobots.ai', 'years later'])
      expect(html, s).not.toContain(s)
    expect(html).toContain('Florida F.S. §934.03')
  })

  it('the data claim is scoped to the sprint and says hosted products run on Gobots infrastructure', () => {
    const text = renderText(<Home />)
    expect(text).toContain('Our hosted products, such as the live demo, run on Gobots infrastructure')
    expect(text).not.toMatch(/years later/)
  })

  it('who-it-is-for lists only sectors with a live or built product', () => {
    const text = renderText(<Home />)
    const line = text.slice(text.indexOf('Who it is for'))
    for (const s of ['Mortgage', 'Healthcare', 'Insurance']) expect(line).toContain(s)
    for (const s of ['Automotive', 'Manufacturing']) expect(line.split('Questions')[0]).not.toContain(s)
  })

  it('the scan terms in the hero carry a source marker', () => {
    const hero = renderToStaticMarkup(<Home />)
    expect(hero).toMatch(/aria-label="Source for free scan terms/)
  })

  it('no unsourced "built by the same engineers" or "mostly built" claims remain', () => {
    const text = renderText(<Home />)
    expect(text).not.toMatch(/same engineers|mostly built/)
  })

  it('the figures say live, launching and built in words', () => {
    expect(renderText(<Home />)).toContain('1 live · 1 launching · 3 built')
  })

  it('each page carries its own canonical, and the root layout sets none', () => {
    expect(read('app/layout.tsx')).not.toContain('canonical')
    for (const [f, r] of [['app/page.tsx', '/'], ['app/sprint/page.tsx', '/sprint'], ['app/demo/page.tsx', '/demo'], ['app/verify/page.tsx', '/verify'], ['app/spec/page.tsx', '/spec'], ['app/walkthrough/page.tsx', '/walkthrough']])
      expect(read(f), f).toContain(`canonical: '${r}'`)
  })

  it('analytics tells a primary button from a briefing link', () => {
    expect(read('components/Analytics.tsx')).toContain("'button' : 'link'")
  })

  it('verify proxies cap the body and time out like evaluate', () => {
    const v = read('app/api/govtrace/verify-receipt/route.ts')
    expect(v).toContain('MAX_BODY_BYTES')
    expect(v).toContain('ENGINE_TIMEOUT_MS')
    expect(read('app/api/govtrace/verify/[run_id]/route.ts')).toContain('ENGINE_TIMEOUT_MS')
  })

  it('switching example drops an in-flight check', () => {
    expect(read('components/home/HomeChecker.tsx')).toContain('latest.current(Promise.resolve(0))')
  })

  it('who-you-work-with keeps the founder promise and company record the Method section carried', () => {
    const text = renderText(<Home />)
    expect(text).toContain('Your first call is with your architect, not a salesperson')
    expect(text).toContain('Company record')
    expect(text).toContain('We don’t stop at advice')
  })

  it('ships a favicon.ico', () => {
    const ico = readFileSync(path.join(root, 'app/favicon.ico'))
    expect(ico.readUInt16LE(2)).toBe(1)
  })

  it('package.json declares the test runner', () => {
    const pkg = JSON.parse(read('package.json'))
    expect(pkg.scripts.test).toBe('vitest run')
    expect(pkg.devDependencies.vitest).toBeTruthy()
  })
})
