import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { CLAIMS, type ClaimId } from '@/content/claims'
import Claim from '@/components/Claim'

describe('claims register', () => {
  it('every entry names a source', () => {
    for (const [id, c] of Object.entries(CLAIMS)) {
      expect(c.source.trim(), id).not.toBe('')
    }
  })

  it('verifiable and documented entries link to their evidence', () => {
    for (const [id, c] of Object.entries(CLAIMS)) {
      if (c.evidence === 'verifiable' || c.evidence === 'documented') {
        expect(c.href, id).toBeTruthy()
      }
    }
  })

  it('renders the claim text with a source marker', () => {
    const html = renderToStaticMarkup(<Claim id="fig.products">5</Claim>)
    expect(html).toContain('5')
    expect(html).toMatch(/<button[^>]*aria-label="Source/)
  })

  it('renders nothing for an unknown claim id', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(renderToStaticMarkup(<Claim id={'nope' as ClaimId}>unsourced</Claim>)).toBe('')
    err.mockRestore()
  })
})
