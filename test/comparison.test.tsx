import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import VendorComparison from '@/components/home/VendorComparison'
import { renderText } from './banned'

describe('Gobots vs your current vendor', () => {
  const text = renderText(<VendorComparison />)

  it('puts Gobots before the current vendor', () => {
    const g = text.indexOf('Gobots')
    const v = text.indexOf('Your current vendor')
    expect(g).toBeGreaterThan(-1)
    expect(v).toBeGreaterThan(g)
  })

  it('states the point in the heading', () => {
    expect(text).toContain('Working in week 1. Not month 6')
  })

  it('marks the vendor row as illustrative', () => {
    expect(text).toContain('Illustrative')
  })

  it('drops the old framing', () => {
    expect(text).not.toContain('Typical AI programme')
    expect(text).not.toContain('Planning is not progress')
  })
})

describe('comparison graphic', () => {
  const html = renderToStaticMarkup(<VendorComparison />)
  const text = renderText(<VendorComparison />)

  it('labels the live point inside week 1, never as a week-2 boundary', () => {
    expect(text).toContain('Live by end of week 1')
    expect(text).not.toContain('Gobots is live')
  })

  it('stamps LIVE on the Gobots week-1 bar', () => {
    expect(html).toContain('aria-label="LIVE"')
  })

  it('animates only through the in-view motion classes', () => {
    expect(html).toContain('cmp-fill')
    expect(html).toContain('cmp-stamp')
    expect(html).toContain('cmp-fade')
  })
})
