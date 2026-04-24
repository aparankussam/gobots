import type { Metadata } from 'next'
import VerifyClient from './VerifyClient'

export const metadata: Metadata = {
  title: 'Verify a Receipt · GoVTraceAI',
  description:
    'Paste a GoVTraceAI signed receipt and verify the Ed25519 signature against the published public key. Stateless, offline-capable.',
}

export default function VerifyPage() {
  return <VerifyClient />
}
