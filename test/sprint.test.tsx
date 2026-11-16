import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import SprintPage, { metadata } from '@/app/sprint/page'
import HowItWorks from '@/components/home/VendorComparison'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import { GET as llms } from '@/app/llms.txt/route'
import { findBanned, renderText } from './banned'

describe('/sprint page', () => {
  const html = renderToStaticMarkup(<SprintPage />)
  const text = renderText(<SprintPage />)

  it('lays the sprint out week by week', () => {
    expect(text).toContain('A Production Sprint, week by week')
    for (const s of ['Week 1', 'Weeks 2–4', 'Week 5 onward']) expect(text).toContain(s)
    expect(text).toContain('A working system on your own data')
  })

  it('says what the client brings and gets, and how to continue after the sprint', () => {
    for (const s of ['What you bring', 'What you get', 'After the sprint']) expect(text).toContain(s)
    for (const s of ['Pod', 'Run', 'Product']) expect(text).toContain(s)
  })

  it('invents no price or pod size', () => {
    expect(text).not.toMatch(/\$\s?\d|per month|\/mo\b|engineers? on|team of \d/i)
  })

  it('has an orange sprint button to the booking form', () => {
    expect(html).toMatch(/<a[^>]*class="[^"]*btn-seal[^"]*"[^>]*href="\/walkthrough"|<a[^>]*href="\/walkthrough"[^>]*class="[^"]*btn-seal/)
    expect(text).toContain('Start a Production Sprint')
  })

  it('stays inside the copy rules and mentions no guarantee while that is off', () => {
    expect(findBanned(text)).toEqual([])
    expect(text).not.toMatch(/guarantee/i)
    expect(html).not.toContain('/guarantee')
  })

  it('says what the call costs under the button', () => {
    expect(text).toContain('20-minute call with an architect. No commitment, no discovery fee.')
  })

  it('states governance timing the same way as the homepage', () => {
    expect(text).toContain('Governance and signed receipts on that same system by week 4')
    expect(text).not.toMatch(/built in, not bolted/i)
  })

  it('sets page metadata', () => {
    expect(metadata.title).toBe('The Production Sprint · Gobots')
  })

  it('ends every heading that finishes in a full stop with an orange one', () => {
    const heads = Array.from(html.matchAll(/<(h[12])\b[^>]*>([\s\S]*?)<\/\1>/g)).filter((m) =>
      m[2].replace(/<[^>]+>/g, '').trim().endsWith('.'),
    )
    expect(heads.length).toBeGreaterThan(0)
    for (const m of heads) expect(m[2]).toMatch(/<span class="text-seal">\.<\/span>\s*$/)
  })
})

describe('the sprint is linked from where buyers look', () => {
  it('the how-it-works section on the homepage points to it', () => {
    expect(renderToStaticMarkup(<HowItWorks />)).toContain('href="/sprint"')
  })
  it('footer and closing section point to it', () => {
    expect(renderToStaticMarkup(<Footer />)).toContain('href="/sprint"')
    expect(renderToStaticMarkup(<CTA />)).toContain('href="/sprint"')
  })
  it('llms.txt lists it', async () => {
    expect(await llms().text()).toContain('/sprint')
  })
})
