import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Products from '@/components/home/Products'
import EditionSwitcher from '@/components/home/EditionSwitcher'
import { PRODUCTS, REVXL_EDITIONS, STATUS_LABEL } from '@/content/site'
import { findBanned, renderText } from './banned'

describe('product records', () => {
  const html = renderToStaticMarkup(<Products />)
  const text = renderText(<Products />)

  it('anchors at #products and names the shared core', () => {
    expect(html).toContain('id="products"')
    expect(text).toContain('Gobots Core')
  })

  it('shows three sealed product records', () => {
    expect(text.match(/Product record/g)?.length).toBe(3)
    for (const n of ['GoVTraceAI', 'RevXL', 'Lumen health line']) expect(text).toContain(n)
  })

  it('still names every product', () => {
    for (const p of PRODUCTS) expect(text).toContain(p.name)
  })

  it('replaces the black bars with real fields', () => {
    expect(text).not.toContain('Briefing on request')
    for (const f of ['For', 'You get', 'Next step']) expect(text).toContain(f)
  })

  it('explains every status in a legend', () => {
    for (const label of Object.values(STATUS_LABEL)) expect(text).toContain(label)
  })

  it('credits the physician advisors without names', () => {
    expect(text).toContain('Board-certified cardiologist')
  })

  it('never uses the word customers and stays inside the copy rules', () => {
    expect(findBanned(text)).toEqual([])
  })
})

describe('RevXL leads with the mortgage edition', () => {
  const html = renderToStaticMarkup(<EditionSwitcher />)
  const text = renderText(<EditionSwitcher />)
  const mortgage = REVXL_EDITIONS[0]

  it('has no tabs: only the edition with real outcomes gets a panel', () => {
    expect(html).not.toContain('role="tab"')
    expect(REVXL_EDITIONS).toHaveLength(8)
    expect(mortgage.name).toBe('Mortgage')
    expect(text).toContain('RevXL for mortgage brokers')
  })

  it('gives the mortgage edition three real outcomes', () => {
    expect(mortgage.outcomes).toHaveLength(3)
    for (const o of mortgage.outcomes ?? []) expect(text).toContain(o)
  })

  it('names the loan types and who validated it, with a source', () => {
    for (const s of ['DSCR', 'Conventional', 'Pinnacle Ventures', 'Coast2Coast Mortgage']) expect(text).toContain(s)
    expect(html).toContain('aria-label="Source for')
  })

  it('reduces the other editions to one status line, naming which are in development', () => {
    expect(text).toContain('Also built: Real estate, Medspa, Small business')
    expect(text).toContain('In development: Finance, Banking, Fintech, Automotive')
  })

  it('matches the editions listed in the product data', () => {
    const fromProducts = PRODUCTS.find((p) => p.name === 'RevXL')!.editions!.flatMap((e) => e.names)
    expect(REVXL_EDITIONS.map((e) => e.name)).toEqual(fromProducts)
  })

  it('does not promise a fix time', () => {
    expect(text).not.toMatch(/48 hours/)
  })

  it('is the target the mobile bar watches', () => {
    expect(html).toContain('data-revxl-record')
  })
})

describe('free RevXL score on the mortgage edition', () => {
  const html = renderToStaticMarkup(<EditionSwitcher />)
  const text = renderText(<EditionSwitcher />)

  it('offers the live scan with the real terms', () => {
    expect(text).toContain('Score your mortgage site free')
    expect(text).toContain('Just your site and email, no credit card')
    expect(html).toContain('href="https://revxl.gobotsai.com/fundxl/audit"')
  })

  it('opens the scan safely in a new tab and marks it as a company statement', () => {
    expect(html).toMatch(/<a[^>]*href="https:\/\/revxl\.gobotsai\.com\/fundxl\/audit"[^>]*rel="noopener noreferrer"/)
    expect(html).toMatch(/aria-label="Source for[^"]*scan[^"]*"/i)
  })
})

describe('one-core foundation', () => {
  const html = renderToStaticMarkup(<Products />)

  it('draws Gobots Core as the foundation under the product records', () => {
    expect(html).toContain('data-core="foundation"')
    expect(html.indexOf('data-core="foundation"')).toBeGreaterThan(html.indexOf('Product record'))
  })

  it('names the shared layers each product starts from', () => {
    const core = html.slice(html.indexOf('data-core="foundation"'))
    for (const l of ['agents', 'governance', 'signed receipts', 'integrations']) expect(core).toContain(l)
  })
})

describe('core plug-in animation', () => {
  const html = renderToStaticMarkup(<Products />)
  const count = (cls: string) => html.match(new RegExp(`\\b${cls}\\b`, 'g'))?.length ?? 0

  it('gives each product a pin, a node and a seal on the motion classes', () => {
    expect(count('core-pin')).toBe(3)
    expect(count('core-node')).toBe(3)
    expect(count('core-seal')).toBe(3)
  })

  it('staggers them left to right, each seal after its own pin lands', () => {
    const delays = Array.from(html.matchAll(/--d:(\d+)ms/g)).map((m) => Number(m[1]))
    expect(delays).toEqual(expect.arrayContaining([0, 900, 1800]))
  })
})
