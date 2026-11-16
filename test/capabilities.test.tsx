import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Capabilities from '@/components/home/Capabilities'
import { CAPABILITIES } from '@/content/site'
import { renderText } from './banned'

describe('capabilities bento', () => {
  const html = renderToStaticMarkup(<Capabilities />)

  it('anchors at #capabilities', () => {
    expect(html).toContain('id="capabilities"')
  })

  it('lists every capability', () => {
    const text = renderText(<Capabilities />)
    for (const c of CAPABILITIES) expect(text).toContain(c.name)
  })

  it('carries no claim markers, since these are offers', () => {
    expect(html).not.toContain('aria-label="Source')
  })
})
