import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import HomeChecker from '@/components/home/HomeChecker'
import LiveProof from '@/components/LiveProof'
import { renderText } from './banned'

describe('homepage checker', () => {
  const html = renderToStaticMarkup(<HomeChecker />)

  it('offers three preset examples', () => {
    expect(html.match(/aria-pressed=/g)?.length).toBe(3)
  })

  it('has no free-text input', () => {
    expect(html).not.toMatch(/<textarea|<input/)
  })
})

describe('proof section', () => {
  const text = renderText(<LiveProof />)

  it('presents the receipt as an agent run trace', () => {
    expect(text).toContain('Agent run trace')
  })

  it('no longer invites pasting any text', () => {
    expect(text).not.toContain('Paste any prompt')
  })
})
