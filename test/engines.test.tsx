import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Engines from '@/components/home/Engines'
import { ENGINES } from '@/content/site'
import { renderText } from './banned'

describe('three engines', () => {
  const html = renderToStaticMarkup(<Engines />)
  const text = renderText(<Engines />)

  it('anchors at #engines', () => {
    expect(html).toContain('id="engines"')
  })

  it('gives each engine a first step; only the sprint is a button', () => {
    for (const e of ENGINES) expect(text).toContain(e.firstStep)
    expect(html.match(/href="\/walkthrough"/g)?.length).toBe(3)
    // Only the sprint engine keeps a button (orange, the one primary action); the rest are text links.
    expect(html.match(/\bbtn-seal\b/g)?.length).toBe(1)
    expect(html).not.toMatch(/\bbtn-(rule|ink)\b/)
  })
})
