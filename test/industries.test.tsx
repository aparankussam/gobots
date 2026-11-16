import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Industries from '@/components/home/Industries'
import { INDUSTRIES } from '@/content/site'
import { renderText } from './banned'

describe('industries', () => {
  const text = renderText(<Industries />)

  it('anchors at #industries', () => {
    expect(renderToStaticMarkup(<Industries />)).toContain('id="industries"')
  })

  it('lists all eleven industries with what serves them', () => {
    for (const i of INDUSTRIES) {
      expect(text).toContain(i.name)
      for (const s of i.servedBy) expect(text).toContain(s)
    }
  })

  it('leaves e-commerce off', () => {
    expect(text).not.toMatch(/e-?commerce/i)
  })
})
