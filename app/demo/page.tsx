import type { Metadata } from 'next'
import DemoClient from './DemoClient'

export const metadata: Metadata = {
  title: 'Live Gatekeeper Demo · GoVTraceAI',
  description:
    'Watch an AI agent try to send a risky action. Watch GoVTraceAI catch it. Inspect the signed Duty-of-Care Record in your browser.',
}

export default function DemoPage() {
  return <DemoClient />
}
