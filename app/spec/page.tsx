import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'GoVTrace Receipt Format v1 · Specification',
  description:
    'Open specification for GoVTrace Receipt v1. A portable, third-party-verifiable, Ed25519-signed attestation that an AI action was evaluated by a named policy and produced a named verdict at a named time.',
}

const SPEC_REPO_URL =
  'https://github.com/aparankussam/govtrace-ai/blob/main/spec/RECEIPT_FORMAT_v1.md'
const SCHEMA_URL = 'https://gobotsai.com/spec/receipt.schema.json'
const SCHEMA_REPO_URL =
  'https://github.com/aparankussam/govtrace-ai/blob/main/spec/receipt.schema.json'
const PUBKEY_URL =
  'https://govtrace-api.vercel.app/.well-known/govtrace-pubkey.json'
const NPM_URL = 'https://www.npmjs.com/package/@gobotsai/govtrace'
const REPO_URL = 'https://github.com/aparankussam/govtrace-ai'

export default function SpecPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.22em] font-semibold text-accent mb-3">
            OPEN SPECIFICATION
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4">
            GoVTrace Receipt Format <span className="text-accent">v1</span>.
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-6">
            A portable, third-party-verifiable artifact attesting that an AI
            action was evaluated by a named policy and produced a named
            verdict at a named time. Signed with Ed25519. Verifiable by anyone
            holding the public key, without ever contacting the issuing system.
          </p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <Badge tone="emerald">Status: Stable</Badge>
            <Badge>Version: 1.0.0</Badge>
            <Badge>License: CC BY 4.0</Badge>
            <Badge>Editor: GoVTraceAI / gobots</Badge>
          </div>
        </div>

        <Card>
          <p className="text-[11px] tracking-[0.22em] font-semibold text-white/50 mb-4">
            ON THIS PAGE
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-white/80">
            <li><a href="#goals" className="hover:text-accent">1. Design goals</a></li>
            <li><a href="#object" className="hover:text-accent">2. Receipt object</a></li>
            <li><a href="#canonical" className="hover:text-accent">3. Canonicalization</a></li>
            <li><a href="#signing" className="hover:text-accent">4. Signing</a></li>
            <li><a href="#publication" className="hover:text-accent">5. Public key publication</a></li>
            <li><a href="#verify" className="hover:text-accent">6. Verification procedure</a></li>
            <li><a href="#schema" className="hover:text-accent">7. JSON Schema</a></li>
            <li><a href="#impls" className="hover:text-accent">8. Reference implementations</a></li>
            <li><a href="#stability" className="hover:text-accent">9. Versioning</a></li>
            <li><a href="#security" className="hover:text-accent">10. Security</a></li>
          </ul>
        </Card>

        <Section id="goals" title="1. Design goals">
          <ol className="list-decimal list-outside ml-5 space-y-2 text-white/80">
            <li><strong className="text-white">Portable.</strong> A receipt can be detached from the issuing system and verified anywhere by anyone with the public key.</li>
            <li><strong className="text-white">Third-party verifiable.</strong> Verification does not require the issuer to be online, in business, or cooperative.</li>
            <li><strong className="text-white">Tamper-evident.</strong> Any modification to any signed field invalidates the signature.</li>
            <li><strong className="text-white">Compact.</strong> Receipts fit in a single JSON object suitable for embedding in logs, contracts, eDiscovery exports, and audit reports.</li>
            <li><strong className="text-white">Stable.</strong> v1 is frozen. Forward-compatible additions arrive as v1.x. Breaking changes arrive as v2.</li>
          </ol>
        </Section>

        <Section id="object" title="2. Receipt object">
          <p className="text-white/70 mb-4">
            A v1 receipt is a JSON object with the following top-level fields.
            Additional issuer-defined keys are allowed and MUST NOT be a
            reason to reject the receipt.
          </p>
          <FieldsTable
            rows={[
              ['receipt_id', 'string', 'yes', 'Unique identifier. Format is issuer-defined.'],
              ['signed_at', 'string (RFC 3339 UTC)', 'yes', 'Time the receipt was signed.'],
              ['signature_algo', 'string', 'yes', 'MUST be "Ed25519" in v1.'],
              ['signature', 'string (base64url)', 'yes', 'Unpadded base64url Ed25519 signature.'],
              ['public_key_id', 'string', 'yes', 'Stable identifier for the issuing public key.'],
              ['signed_fields', 'array of strings', 'yes', 'Ordered list of keys present in signed_fields_data.'],
              ['signed_fields_data', 'object', 'yes', 'The actual key/value mapping that was canonicalized and signed.'],
              ['canonical_digest', 'string (hex)', 'yes', 'Lowercase SHA-256 hex of the canonical bytes.'],
              ['pdf_url', 'string', 'no', 'Issuer-served URL to a human-readable PDF rendition.'],
              ['verify_url', 'string', 'no', 'Issuer-served URL to walk the chain (if any).'],
            ]}
          />
          <h3 className="text-white font-semibold text-base mt-8 mb-3">2.1 Required fields in signed_fields_data</h3>
          <p className="text-white/70 mb-4">
            A v1-compliant receipt MUST include at least these six keys.
            Issuer-defined keys MAY be added and are covered by the same
            signature.
          </p>
          <FieldsTable
            rows={[
              ['run_id', 'string', 'yes', 'Issuer-defined identifier for the AI action being attested.'],
              ['verdict', 'string', 'yes', 'The decision: STOP, NEEDS_REVIEW, SAFE, or issuer-defined.'],
              ['record_hash', 'string', 'yes', 'SHA-256 hex of the canonical record (DoCR) the verdict was made on.'],
              ['policy_digest', 'string', 'yes', 'SHA-256 hex of the policy bundle that produced the verdict.'],
              ['input_hash', 'string', 'yes', "SHA-256 hex of the AI action's input bytes."],
              ['timestamp', 'string', 'yes', 'RFC 3339 UTC timestamp of the verdict.'],
            ]}
          />
        </Section>

        <Section id="canonical" title="3. Canonicalization">
          <p className="text-white/70 mb-4">
            The canonical byte string of <Code>signed_fields_data</Code> is JSON
            with sorted keys at every level, compact separators
            (<Code>","</Code> and <Code>":"</Code>), no whitespace, UTF-8.
          </p>
          <Pre>{`# Python reference
import json
canonical = json.dumps(
    signed_fields_data,
    sort_keys=True,
    separators=(",", ":"),
).encode("utf-8")`}</Pre>
          <Pre>{`// Node.js reference (no deps)
function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return '[' + value.map(canonicalize).join(',') + ']'
  const keys = Object.keys(value).sort()
  return '{' + keys.map(k =>
    JSON.stringify(k) + ':' + canonicalize(value[k])
  ).join(',') + '}'
}`}</Pre>
          <p className="text-white/70 mt-4">
            The <Code>canonical_digest</Code> field MUST equal{' '}
            <Code>sha256(canonical_bytes)</Code> rendered as lowercase hex. A
            verifier MAY recompute it and reject the receipt on mismatch.
          </p>
        </Section>

        <Section id="signing" title="4. Signing">
          <p className="text-white/70 mb-4">
            The signature covers the <strong className="text-white">raw 32 bytes</strong> of the
            SHA-256 digest of the canonical bytes. Not the hex string of the
            digest. Not the canonical bytes themselves. This produces a
            fixed-length signing input independent of receipt size.
          </p>
          <Pre>{`digest_bytes = sha256(canonical_bytes)             # 32 bytes
signature    = ed25519.sign(private_key, digest_bytes)
signature_b64url = base64url_unpadded(signature)`}</Pre>
          <p className="text-white/70 mt-4">
            The signature is an Ed25519 signature as defined by RFC 8032.
          </p>
        </Section>

        <Section id="publication" title="5. Public key publication">
          <p className="text-white/70 mb-4">
            Issuers MUST publish their public key at a stable HTTPS URL. The
            recommended location is:
          </p>
          <Pre>{`https://<issuer-domain>/.well-known/govtrace-pubkey.json`}</Pre>
          <p className="text-white/70 mt-4 mb-4">
            The document MUST be a JSON object with this shape:
          </p>
          <Pre>{`{
  "key_id": "govtrace-signing-v1",
  "algorithm": "Ed25519",
  "public_key_b64url": "OwOdZ-d9QHwtuRCreEn6SIZ9iTuWxTpJPfeN5pGL-ns",
  "public_key_pem": "-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----\\n",
  "signs": "GoVTrace Receipt v1",
  "signature_encoding": "base64url (unpadded)"
}`}</Pre>
          <p className="text-white/70 mt-4">
            The <Code>key_id</Code> in the published document MUST equal the{' '}
            <Code>public_key_id</Code> field in any receipt the holder of the
            corresponding private key issues. The reference engine publishes
            its key at{' '}
            <Link
              href={PUBKEY_URL}
              className="text-accent underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {PUBKEY_URL}
            </Link>
            .
          </p>
        </Section>

        <Section id="verify" title="6. Verification procedure">
          <p className="text-white/70 mb-4">Given a receipt object R:</p>
          <ol className="list-decimal list-outside ml-5 space-y-2 text-white/80">
            <li>Validate <Code>R.signature_algo == "Ed25519"</Code>. Otherwise reject.</li>
            <li>Resolve the public key for <Code>R.public_key_id</Code>. Pin it, fetch from <Code>/.well-known/govtrace-pubkey.json</Code>, or accept it out of band.</li>
            <li>Recompute the canonical bytes of <Code>R.signed_fields_data</Code> per section 3.</li>
            <li>Compute <Code>digest_bytes = sha256(canonical_bytes)</Code>.</li>
            <li>(Recommended.) Verify <Code>R.canonical_digest == hex(digest_bytes)</Code>.</li>
            <li>Verify the Ed25519 signature against <Code>digest_bytes</Code> using the resolved key.</li>
          </ol>
          <p className="text-white/70 mt-4">
            If step 6 succeeds, the receipt is <strong className="text-emerald-300">VALID</strong>.
            The verifier SHOULD echo back <Code>signed_fields_data</Code> so
            the user sees exactly what was attested. If step 6 fails, the
            receipt is <strong className="text-red-300">INVALID</strong> and
            the verifier SHOULD NOT present <Code>signed_fields_data</Code> as
            trustworthy.
          </p>
        </Section>

        <Section id="schema" title="7. JSON Schema">
          <p className="text-white/70 mb-4">
            A machine-readable JSON Schema for the receipt object is published
            at:
          </p>
          <Pre>{SCHEMA_URL}</Pre>
          <p className="text-white/70 mt-4">
            The schema is normative for field names and types. This document
            is normative for canonicalization and signing.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ExternalButton href={SCHEMA_URL}>Open schema (JSON)</ExternalButton>
            <ExternalButton href={SCHEMA_REPO_URL}>View on GitHub</ExternalButton>
          </div>
        </Section>

        <Section id="impls" title="8. Reference implementations">
          <ul className="space-y-3 text-white/80">
            <li>
              <strong className="text-white">Issuer (Python):</strong>{' '}
              <Code>govtrace-api/signing.py</Code> in{' '}
              <Link
                href={REPO_URL}
                className="text-accent underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                aparankussam/govtrace-ai
              </Link>
              .
            </li>
            <li>
              <strong className="text-white">Verifier (Node CLI):</strong>{' '}
              <Link
                href={NPM_URL}
                className="text-accent underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                @gobotsai/govtrace
              </Link>{' '}
              on npm. <Code>npm i -g @gobotsai/govtrace</Code> then{' '}
              <Code>govtrace verify ./receipt.json</Code>.
            </li>
            <li>
              <strong className="text-white">Web verifier:</strong>{' '}
              <Link href="/verify" className="text-accent underline underline-offset-4">
                gobotsai.com/verify
              </Link>
              . Paste any receipt. Stateless.
            </li>
          </ul>
        </Section>

        <Section id="stability" title="9. Versioning and stability">
          <ul className="list-disc list-outside ml-5 space-y-2 text-white/80">
            <li>v1 is frozen as of the publication date of this document.</li>
            <li>Additive, backward-compatible changes to issuer-defined keys in <Code>signed_fields_data</Code> are allowed at any time.</li>
            <li>Changes that affect signing or canonicalization rules require a major version bump (v2). v1 verifiers SHOULD reject receipts carrying an unrecognized <Code>spec_version</Code>.</li>
          </ul>
        </Section>

        <Section id="security" title="10. Security considerations">
          <ul className="list-disc list-outside ml-5 space-y-2 text-white/80">
            <li>A verifier MUST resolve the public key from a source the verifier itself trusts. Never accept a public key embedded in the same receipt being verified.</li>
            <li>A receipt does not attest that the AI action signed actually occurred in the real world. It attests only that the issuer evaluated a given input under a given policy and reached the recorded verdict at the recorded time. Combine receipts with execution-time evidence to reconstruct what happened.</li>
            <li>Receipts are not anonymized. Avoid placing direct identifiers in <Code>signed_fields_data</Code>. Use hashes (<Code>record_hash</Code>, <Code>input_hash</Code>) instead.</li>
          </ul>
        </Section>

        <Card className="mt-12">
          <p className="text-[11px] tracking-[0.22em] font-semibold text-white/50 mb-3">
            FULL TEXT
          </p>
          <p className="text-white/70 text-sm mb-4">
            This page is a rendering of the canonical specification. The
            authoritative source is the Markdown file in the GoVTraceAI
            repository, published under CC BY 4.0.
          </p>
          <div className="flex flex-wrap gap-3">
            <ExternalButton href={SPEC_REPO_URL}>Read RECEIPT_FORMAT_v1.md</ExternalButton>
            <ExternalButton href={SCHEMA_URL}>receipt.schema.json</ExternalButton>
            <Link
              href="/verify"
              className="bg-accent text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Try the verifier
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 mt-12 first:mt-0">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-5">
        {title}
      </h2>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6 ${className}`}>
      {children}
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.85em] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white/90">
      {children}
    </code>
  )
}

function Pre({ children }: { children: string }) {
  return (
    <pre className="bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-xs text-white/85 overflow-x-auto leading-relaxed whitespace-pre">
{children}
    </pre>
  )
}

function FieldsTable({ rows }: { rows: Array<[string, string, string, string]> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-xs">
        <thead className="bg-white/[0.04] text-white/60 uppercase tracking-[0.14em] text-[10px]">
          <tr>
            <th className="text-left font-semibold px-3 py-2">Field</th>
            <th className="text-left font-semibold px-3 py-2">Type</th>
            <th className="text-left font-semibold px-3 py-2">Req</th>
            <th className="text-left font-semibold px-3 py-2">Description</th>
          </tr>
        </thead>
        <tbody className="text-white/80">
          {rows.map(([f, t, r, d]) => (
            <tr key={f} className="border-t border-white/5 align-top">
              <td className="px-3 py-2 font-mono text-white/95 whitespace-nowrap">{f}</td>
              <td className="px-3 py-2 font-mono text-white/70">{t}</td>
              <td className="px-3 py-2 text-white/60">{r}</td>
              <td className="px-3 py-2">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: 'emerald' }) {
  const cls =
    tone === 'emerald'
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      : 'bg-white/5 border-white/15 text-white/70'
  return (
    <span className={`px-2.5 py-1 rounded-md border tracking-[0.14em] uppercase font-semibold ${cls}`}>
      {children}
    </span>
  )
}

function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-white/15 hover:border-accent/60 hover:text-accent text-white/85 text-sm font-medium px-5 py-2 rounded-lg transition-colors"
    >
      {children}
    </Link>
  )
}
