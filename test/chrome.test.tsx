import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import { renderText } from './banned'

describe('site chrome', () => {
  it.each([
    ['Nav', <Nav key="n" />],
    ['CTA', <CTA key="c" />],
    ['StickyMobileCTA', <StickyMobileCTA key="s" />],
  ])('%s uses the Production Sprint call to action', (_, el) => {
    const text = renderText(el)
    expect(text).toContain('Start a Production Sprint')
    expect(text).not.toContain('Request a walkthrough')
  })

  it('Footer links to the sprint and not the old walkthrough label', () => {
    const text = renderText(<Footer />)
    expect(text).toContain('Start a sprint')
    expect(text).not.toMatch(/Walkthrough/)
  })

  it('Nav links to the homepage sections', () => {
    const html = renderToStaticMarkup(<Nav />)
    for (const a of ['/#products', '/sprint', '/capabilities']) expect(html).toContain(`href="${a}"`)
  })

  it('Footer has no guarantee link while the flag is off', () => {
    expect(renderToStaticMarkup(<Footer />)).not.toContain('/guarantee')
  })

  it('Nav no longer offers Industries', () => {
    expect(renderText(<Nav />)).not.toContain('Industries')
  })

  it('every sprint button says what the call costs', () => {
    expect(renderText(<CTA />)).toContain('20-minute call with an architect. No commitment, no discovery fee.')
    expect(renderText(<StickyMobileCTA />)).toContain('No commitment, no discovery fee')
  })

  it('CTA offers the architect line', () => {
    expect(renderText(<CTA />)).toContain('With your architect, not a salesperson')
  })
})
