import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import WalkthroughClient from '@/app/walkthrough/WalkthroughClient'
import { metadata } from '@/app/walkthrough/page'
import { renderText } from './banned'

const root = path.resolve(__dirname, '..')
const read = (p: string) => readFileSync(path.join(root, p), 'utf8')

describe('walkthrough wording', () => {
  const text = renderText(<WalkthroughClient />)

  it('speaks to all three first steps', () => {
    expect(text).toContain('Bring the workflow you want running')
    expect(text).toContain('20 minutes with an architect, not a salesperson')
    expect(text).toContain('Sprint request')
  })

  it('uses a generic company placeholder', () => {
    const src = read('app/walkthrough/WalkthroughClient.tsx')
    expect(src).toContain('Acme Corp · Head of Operations')
    expect(src).not.toContain('Sharp HealthCare')
  })

  it('page metadata names the sprint', () => {
    expect(metadata.title).toBe('Start a Production Sprint · Gobots')
  })
})

describe('walkthrough form logic is untouched', () => {
  const src = read('app/walkthrough/WalkthroughClient.tsx')
  const snap: Record<string, string> = JSON.parse(read('test/fixtures/walkthrough-logic.json'))

  it.each(Object.keys(snap))('%s block is byte-for-byte unchanged', (key) => {
    expect(src).toContain(snap[key])
  })
})

describe('demo and evidence page buttons', () => {
  it('demo closing button books a GoVTraceAI briefing', () => {
    const src = read('app/demo/DemoClient.tsx')
    expect(src).toContain('Book a GoVTraceAI briefing')
    expect(src).not.toContain('Request a walkthrough')
  })

  it('evidence page no longer says Request a Walkthrough', () => {
    const html = read('public/evidence-gap.html')
    expect(html).not.toMatch(/Request a Walkthrough/i)
    expect(html).toContain('Book a GoVTraceAI briefing')
    expect(html).toContain('Start a sprint')
  })
})
