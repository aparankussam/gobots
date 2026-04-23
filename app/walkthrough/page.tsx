import type { Metadata } from 'next'
import WalkthroughClient from './WalkthroughClient'

export const metadata: Metadata = {
  title: 'Request a Scenario Walkthrough · Gobots',
  description:
    '20 minutes. Live. On your scenario. See the signed runtime evidence your compliance team should already have.',
}

export default function WalkthroughPage() {
  return <WalkthroughClient />
}
