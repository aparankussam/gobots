import { describe, expect, it } from 'vitest'
import Trust, { ComplianceMap } from '@/components/home/Trust'
import { COMPLIANCE } from '@/content/compliance'
import { renderText } from './banned'

describe('trust section', () => {
  const text = renderText(<Trust />)

  it('always states where data lives', () => {
    expect(text).toContain('Your data stays in your environment')
  })

  it('hides the compliance map while the flag is off', () => {
    expect(text).not.toContain('EU AI Act')
  })
})

describe('compliance map', () => {
  const text = renderText(<ComplianceMap />)

  it('says it is not a certification', () => {
    expect(text).toContain('Not a certification or legal advice')
  })

  it('uses "supports", never "compliant"', () => {
    expect(text).toContain('supports')
    expect(text).not.toMatch(/\bcompliant\b/i)
  })

  it('covers the five frameworks', () => {
    for (const f of ['EU AI Act', 'NIST AI RMF', 'ISO/IEC 42001', 'HIPAA', 'SOC 2']) expect(text).toContain(f)
    expect(COMPLIANCE.length).toBeGreaterThan(0)
  })
})
