import { describe, expect, it } from 'vitest'
import Home from '@/app/page'
import { findBanned, renderText } from './banned'

describe('copy guard', () => {
  it('flags banned words', () => {
    expect(findBanned('we offer staffing to PCP')).toEqual(['staffing', 'PCP'])
  })

  it('homepage copy has no banned words', () => {
    expect(findBanned(renderText(<Home />))).toEqual([])
  })
})
