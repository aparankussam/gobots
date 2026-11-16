import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Guarantee from '@/components/home/Guarantee'
import { GuaranteeCertificate } from '@/components/home/GuaranteeCertificate'
import { GUARANTEE } from '@/content/guarantee'
import Home from '@/app/page'
import { renderText } from './banned'

describe('week-1 guarantee', () => {
  it('renders nothing on the homepage while the flag is off', () => {
    expect(renderToStaticMarkup(<Guarantee />)).toBe('')
  })

  it('certificate carries the promise and every condition', () => {
    const text = renderText(<GuaranteeCertificate />)
    expect(text).toContain(GUARANTEE.promise)
    for (const c of GUARANTEE.conditions) expect(text).toContain(c)
  })

  it('the homepage never mentions or links to the guarantee while off', () => {
    expect(renderText(<Home />)).not.toMatch(/guarantee/i)
    expect(renderToStaticMarkup(<Home />)).not.toContain('/guarantee')
  })
})
