import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { findBanned, renderText } from './banned'
import { latestOnly } from '@/lib/check'
import { SITE_META } from '@/content/meta'
import WalkthroughClient from '@/app/walkthrough/WalkthroughClient'
import CompanyRecord from '@/components/home/CompanyRecord'
import WhoYouWorkWith from '@/components/home/WhoYouWorkWith'
import Engines from '@/components/home/Engines'
import Nav from '@/components/Nav'

const root = path.resolve(__dirname, '..')

describe('copy guard catches the phrasings the spec bans', () => {
  it('flags "customers"', () => {
    expect(findBanned('trusted by our customers')).toContain('customers')
  })

  it('flags certification claims but allows board-certified physicians', () => {
    expect(findBanned('SOC 2 certified')).toContain('certified')
    expect(findBanned('HIPAA-certified platform')).toContain('certified')
    expect(findBanned('Board-certified cardiologist')).toEqual([])
  })

  it('scans the walkthrough page and the site metadata', () => {
    expect(findBanned(renderText(<WalkthroughClient />))).toEqual([])
    expect(findBanned(JSON.stringify(SITE_META))).toEqual([])
  })
})

describe('homepage checker ignores stale results', () => {
  it('drops a slower earlier run once a newer one starts', async () => {
    const latest = latestOnly()
    let releaseFirst!: (v: string) => void
    const first = latest(new Promise<string>((r) => (releaseFirst = r)))
    const second = latest(Promise.resolve('second'))
    releaseFirst('first')
    expect(await second).toEqual({ fresh: true, value: 'second' })
    expect(await first).toEqual({ fresh: false })
  })
})

describe('link previews carry the company positioning', () => {
  it('titles the site as a full-stack AI company', () => {
    expect(SITE_META.title).toContain('Full-stack AI company')
    expect(SITE_META.ogAlt).not.toContain('actually get deployed')
  })

  it('OG image tagline is updated', () => {
    const svg = readFileSync(path.join(root, 'public/og-image.svg'), 'utf8')
    expect(svg).toContain('FULL-STACK AI COMPANY')
    expect(svg).not.toContain('AI EXECUTION COMPANY')
  })
})

describe('every claim on the homepage carries a source', () => {
  const markers = (html: string) => html.match(/aria-label="Source/g)?.length ?? 0

  it('company record marks its client and advisory rows', () => {
    expect(markers(renderToStaticMarkup(<CompanyRecord />))).toBe(2)
  })

  it('founder chain in who-you-work-with is marked', () => {
    expect(markers(renderToStaticMarkup(<WhoYouWorkWith />))).toBeGreaterThanOrEqual(1)
  })

  it('engines intro makes no unsourced claim about clients', () => {
    expect(renderText(<Engines />)).not.toContain('Most clients')
  })
})

describe('nav fits at tablet widths', () => {
  it('switches to the desktop nav at lg, not md', () => {
    const html = renderToStaticMarkup(<Nav />)
    expect(html).toMatch(/aria-label="Primary" class="[^"]*\blg:flex\b/)
    expect(html).not.toMatch(/aria-label="Primary" class="[^"]*\bmd:flex\b/)
  })
})
