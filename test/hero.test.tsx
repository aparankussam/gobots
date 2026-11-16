import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Hero from '@/components/Hero'
import Figures from '@/components/home/Figures'
import TrustBar from '@/components/TrustBar'
import { renderText } from './banned'

describe('hero', () => {
  const text = renderText(<Hero />)
  const html = renderToStaticMarkup(<Hero />)

  it('leads with the buyer outcome and keeps the company line', () => {
    expect(text).toContain('A working AI system on your workflow in week 1')
    expect(text).toContain('full-stack AI company')
    expect(text).toContain('forward-deployed engineering pods')
  })

  it('has one orange sprint button, with the call caption under it', () => {
    expect(html.match(/\bbtn-seal\b/g)?.length).toBe(1)
    expect(text).toContain('Start a Production Sprint')
    expect(text).toContain('20-minute call with an architect. No commitment, no discovery fee.')
  })

  it('offers two no-call actions right under the buttons', () => {
    expect(text).toContain('Start without a call')
    expect(text).toContain('Score your mortgage site free')
    expect(text).toContain('Run a live AI governance check')
    expect(text).toContain('Run a live check')
    expect(html).toContain('href="#live-check"')
    expect(html).toContain('href="https://revxl.gobotsai.com/fundxl/audit"')
  })

  it('tells the visitor the scan leaves the site', () => {
    expect(text).toContain('Opens RevXL')
  })

  it('no longer carries the receipt or the engine strip', () => {
    expect(text).not.toContain('Attestation of AI action')
    expect(text).not.toContain('Architects, not slideware')
  })
})

describe('figures', () => {
  it('shows the three facts, each with a source marker', () => {
    const html = renderToStaticMarkup(<Figures />)
    const text = renderText(<Figures />)
    for (const v of ['Week 1', '1 live · 1 launching · 3 built', '3']) expect(text).toContain(v)
    expect(text).not.toContain('100')
    expect(text).not.toContain('bench')
    expect(html.match(/aria-label="Source/g)?.length ?? 0).toBeGreaterThanOrEqual(4)
  })
})

describe('team strip', () => {
  it('says these are prior roles, not clients', () => {
    const text = renderText(<TrustBar />)
    expect(text).toContain('Where our team has delivered')
    expect(text).toContain('Not Gobots clients')
  })
})
