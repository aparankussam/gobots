import { describe, expect, it } from 'vitest'
import { GET } from '@/app/llms.txt/route'
import { findBanned } from './banned'

describe('/llms.txt', () => {
  it('serves plain text describing the company', async () => {
    const res = GET()
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/plain')
    const text = await res.text()
    expect(text.startsWith('# Gobots')).toBe(true)
    for (const s of ['GoVTraceAI', 'RevXL', 'Production Sprint', 'https://gobotsai.com/demo', '## Engines', '## Products', '## Industries', '## Proof']) {
      expect(text).toContain(s)
    }
  })

  it('contains no banned copy and no customer claims', async () => {
    const text = await GET().text()
    expect(findBanned(text)).toEqual([])
    expect(text).not.toMatch(/customers/i)
  })
})
