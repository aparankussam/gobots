import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactElement } from 'react'
import Home from '@/app/page'
import DemoClient from '@/app/demo/DemoClient'
import VerifyClient from '@/app/verify/VerifyClient'
import WalkthroughClient from '@/app/walkthrough/WalkthroughClient'
import SpecPage from '@/app/spec/page'
import Engines from '@/components/home/Engines'
import Footer from '@/components/Footer'
import Seal from '@/components/doc/Seal'

/** Headings (h1/h2) whose visible text ends in a full stop, and whether that stop is orange. */
function headingStops(el: ReactElement) {
  const html = renderToStaticMarkup(el)
  return Array.from(html.matchAll(/<(h[12])\b[^>]*>([\s\S]*?)<\/\1>/g))
    .map((m) => ({ inner: m[2], text: m[2].replace(/<[^>]+>/g, '').trim() }))
    .filter((h) => h.text.endsWith('.'))
    .map((h) => ({ text: h.text, orange: /<span class="text-seal">\.<\/span>\s*$/.test(h.inner.trim()) }))
}

describe('orange full stop on every section heading', () => {
  it.each([
    ['home', <Home key="h" />],
    ['demo', <DemoClient key="d" />],
    ['verify', <VerifyClient key="v" />],
    ['walkthrough', <WalkthroughClient key="w" />],
    ['spec', <SpecPage key="s" />],
  ])('%s headings end in an orange stop', (_, el) => {
    const plain = headingStops(el).filter((h) => !h.orange).map((h) => h.text)
    expect(plain).toEqual([])
  })
})

describe('orange sprint button', () => {
  const sprintLinks = (html: string) =>
    Array.from(html.matchAll(/<a\b[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)).filter((m) =>
      m[2].replace(/<[^>]+>/g, '').includes('Start a Production Sprint'),
    )

  it('every Start a Production Sprint link on the homepage is orange', () => {
    const links = sprintLinks(renderToStaticMarkup(<Home />))
    expect(links.length).toBeGreaterThanOrEqual(4)
    for (const m of links) expect(m[1]).toMatch(/\bbtn-seal\b/)
  })

  it('Three engines keeps only the sprint as a button; briefings are text links', () => {
    const html = renderToStaticMarkup(<Engines />)
    expect(html.match(/\bbtn-seal\b/g)?.length).toBe(1)
    expect(html.match(/\bbtn-rule\b/g)?.length ?? 0).toBe(0)
  })
})

describe('logo and mark', () => {
  it('footer shows the real logo, not a typed wordmark', () => {
    const html = renderToStaticMarkup(<Footer />)
    expect(html).toContain('src="/gobots-logo-paper.png"')
    expect(html).toContain('alt="Gobots"')
  })

  it('seals carry the full Gobots logo, not a tick or just the robot', () => {
    const html = renderToStaticMarkup(<Seal id="t" />)
    expect(html).toContain('data-mark="logo"')
    expect(html).toContain('href="/gobots-logo-seal.png"')
    expect(html).not.toContain('data-mark="robot"')
    expect(html).not.toContain('M45 58l10 10 20-22')
  })
})
