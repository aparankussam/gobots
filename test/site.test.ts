import { describe, expect, it } from 'vitest'
import * as site from '@/content/site'
import { CLAIMS } from '@/content/claims'
import { findBanned } from './banned'

describe('site content', () => {
  it('every product and figure points at a registered claim', () => {
    for (const p of site.PRODUCTS) expect(Object.keys(CLAIMS), p.name).toContain(p.claim)
    for (const f of site.FIGURES) expect(Object.keys(CLAIMS), f.label).toContain(f.claim)
  })

  it('contains no banned copy', () => {
    expect(findBanned(JSON.stringify(site))).toEqual([])
  })

  it('never says a product has customers', () => {
    expect(JSON.stringify(site.PRODUCTS)).not.toMatch(/customers/i)
    expect(JSON.stringify(site.STATUS_LEGEND)).not.toMatch(/customers/i)
  })

  it('lists 15 capabilities and 11 industries', () => {
    expect(site.CAPABILITIES).toHaveLength(15)
    expect(site.INDUSTRIES).toHaveLength(11)
  })

  it('ships with both launch flags off', () => {
    expect(site.LAUNCH).toEqual({ guarantee: false, complianceMap: false })
  })

  it('figures are the three agreed facts', () => {
    expect(site.FIGURES.map((f) => f.value)).toEqual(['Week 1', '1 live · 1 launching · 3 built', '3'])
  })
})
