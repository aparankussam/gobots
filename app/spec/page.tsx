import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Stamp from '@/components/doc/Stamp'
import { Arrow, ArrowUpRight } from '@/components/doc/icons'

export const metadata: Metadata = {
  title: 'GoVTrace Receipt Format v1 · Specification',
  alternates: { canonical: '/spec' },
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

const TOC: Array<[string, string, string]> = [
  ['goals', '1', 'Design goals'],
  ['object', '2', 'Receipt object'],
  ['canonical', '3', 'Canonicalization'],
  ['signing', '4', 'Signing'],
  ['publication', '5', 'Public key publication'],
  ['verify', '6', 'Verification procedure'],
  ['schema', '7', 'JSON Schema'],
  ['impls', '8', 'Reference implementations'],
  ['stability', '9', 'Versioning'],
  ['security', '10', 'Security'],
]

const META: Array<[string, React.ReactNode]> = [
  [
    'Status',
    <Stamp key="status" id="spec-status" tone="safe" size="sm" className="-my-1 -rotate-2">
      STABLE
    </Stamp>,
  ],
  ['Version', <span key="version" className="tnum">1.0.0</span>],
  ['License', 'CC BY 4.0'],
  ['Published', <span key="pub" className="tnum">2026-04-25</span>],
  ['Editor', 'Anand Parankussam, GoVTraceAI / gobots'],
]

const EXT_LINK =
  'link-ink text-ink [overflow-wrap:anywhere]'

export default function SpecPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="pt-16">
        {/* Document header */}
        <header className="wrap pb-14 pt-10 md:pb-20 md:pt-16">
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="display text-[clamp(2.6rem,6.4vw,4.75rem)]">
                GoVTrace Receipt Format v1<span className="text-seal">.</span>
              </h1>
              <p className="mt-7 max-w-[65ch] text-[18px] leading-[1.6] text-ink-2 md:text-[19px]">
                A portable, third-party-verifiable artifact attesting that an AI
                action was evaluated by a named policy and produced a named
                verdict at a named time. Signed with Ed25519. Verifiable by anyone
                holding the public key, without ever contacting the issuing system. A
                Duty-of-Care Record is signed as a GoVTrace Receipt.
              </p>
            </div>
            <dl className="self-end border-t border-ink/80 lg:col-span-4">
              {META.map(([k, v]) => (
                <div
                  key={k}
                  className="grid min-h-[3rem] grid-cols-[6.5rem_1fr] items-center gap-4 border-b border-rule py-2.5 text-[15px]"
                >
                  <dt className="label text-[10.5px] text-ink-3">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="wrap grid gap-x-12 gap-y-12 pb-24 lg:grid-cols-12 md:pb-32">
          {/* Table of contents */}
          <nav aria-labelledby="toc-heading" className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
            <h2 id="toc-heading" className="heading text-[19px]">On this page</h2>
            <ol className="mt-4 grid border-t border-ink/80 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
              {TOC.map(([id, n, title]) => (
                <li key={id} className="border-b border-rule">
                  <a
                    href={`#${id}`}
                    className="grid grid-cols-[2rem_1fr] items-baseline py-2.5 text-[14.5px] text-ink-2 transition-colors hover:text-seal-ink"
                  >
                    <span className="tnum text-ink-3">{n}.</span>
                    <span>{title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Specification body */}
          <article className="min-w-0 lg:col-span-9">
            <Section id="goals" n="1" title="Design goals">
              <ol className="list-decimal space-y-3 pl-6 marker:text-ink-3">
                <li><strong className="font-semibold text-ink">Portable.</strong> A receipt can be detached from the issuing system and verified anywhere by anyone with the public key.</li>
                <li><strong className="font-semibold text-ink">Third-party verifiable.</strong> Verification does not require the issuer to be online, in business, or cooperative.</li>
                <li><strong className="font-semibold text-ink">Tamper-evident.</strong> Any modification to any signed field invalidates the signature.</li>
                <li><strong className="font-semibold text-ink">Compact.</strong> Receipts fit in a single JSON object suitable for embedding in logs, contracts, eDiscovery exports, and audit reports.</li>
                <li><strong className="font-semibold text-ink">Stable.</strong> v1 is frozen. Forward-compatible additions arrive as v1.x. Breaking changes arrive as v2.</li>
              </ol>
            </Section>

            <Section id="object" n="2" title="Receipt object">
              <P>
                A v1 receipt is a JSON object with the following top-level fields.
                Additional issuer-defined keys are allowed and <Kw>MUST NOT</Kw> be a
                reason to reject the receipt.
              </P>
              <FieldsTable
                caption="Top-level fields of a v1 receipt"
                rows={[
                  ['receipt_id', 'string', 'yes', 'Unique identifier. Format is issuer-defined.'],
                  ['signed_at', 'string (RFC 3339 UTC)', 'yes', 'Time the receipt was signed.'],
                  ['signature_algo', 'string', 'yes', <><Kw>MUST</Kw> be &quot;Ed25519&quot; in v1.</>],
                  ['signature', 'string (base64url)', 'yes', 'Unpadded base64url Ed25519 signature.'],
                  ['public_key_id', 'string', 'yes', 'Stable identifier for the issuing public key.'],
                  ['signed_fields', 'array of strings', 'yes', 'Ordered list of keys present in signed_fields_data.'],
                  ['signed_fields_data', 'object', 'yes', 'The actual key/value mapping that was canonicalized and signed.'],
                  ['canonical_digest', 'string (hex)', 'yes', 'Lowercase SHA-256 hex of the canonical bytes.'],
                  ['pdf_url', 'string', 'no', 'Issuer-served URL to a human-readable PDF rendition.'],
                  ['verify_url', 'string', 'no', 'Issuer-served URL to walk the chain (if any).'],
                ]}
              />
              <h3 className="heading mt-12 flex items-baseline gap-3 text-[22px] md:text-[24px]">
                <span className="tnum text-ink-3">2.1</span>
                <span>
                  Required fields in <span className="font-mono text-[0.78em] tracking-normal">signed_fields_data</span>
                </span>
              </h3>
              <P>
                A v1-compliant receipt <Kw>MUST</Kw> include at least these six keys.
                Issuer-defined keys <Kw>MAY</Kw> be added and are covered by the same
                signature.
              </P>
              <FieldsTable
                caption="Required keys in signed_fields_data"
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

            <Section id="canonical" n="3" title="Canonicalization">
              <P>
                The canonical byte string of <Code>signed_fields_data</Code> is JSON
                with sorted keys at every level, compact separators
                (<Code>&quot;,&quot;</Code> and <Code>&quot;:&quot;</Code>), no whitespace, UTF-8.
              </P>
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
              <P>
                The <Code>canonical_digest</Code> field <Kw>MUST</Kw> equal{' '}
                <Code>sha256(canonical_bytes)</Code> rendered as lowercase hex. A
                verifier <Kw>MAY</Kw> recompute it and reject the receipt on mismatch.
              </P>
            </Section>

            <Section id="signing" n="4" title="Signing">
              <P>
                The signature covers the <strong className="font-semibold text-ink">raw 32 bytes</strong> of the
                SHA-256 digest of the canonical bytes. Not the hex string of the
                digest. Not the canonical bytes themselves. This produces a
                fixed-length signing input independent of receipt size.
              </P>
              <Pre>{`digest_bytes = sha256(canonical_bytes)             # 32 bytes
signature    = ed25519.sign(private_key, digest_bytes)
signature_b64url = base64url_unpadded(signature)`}</Pre>
              <P>
                The signature is an Ed25519 signature as defined by RFC 8032.
              </P>
            </Section>

            <Section id="publication" n="5" title="Public key publication">
              <P>
                Issuers <Kw>MUST</Kw> publish their public key at a stable HTTPS URL. The
                recommended location is:
              </P>
              <Pre>{`https://<issuer-domain>/.well-known/govtrace-pubkey.json`}</Pre>
              <P>
                The document <Kw>MUST</Kw> be a JSON object with this shape:
              </P>
              <Pre>{`{
  "key_id": "govtrace-signing-v1",
  "algorithm": "Ed25519",
  "public_key_b64url": "OwOdZ-d9QHwtuRCreEn6SIZ9iTuWxTpJPfeN5pGL-ns",
  "public_key_pem": "-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----\\n",
  "signs": "GoVTrace Receipt v1",
  "signature_encoding": "base64url (unpadded)"
}`}</Pre>
              <P>
                The <Code>key_id</Code> in the published document <Kw>MUST</Kw> equal the{' '}
                <Code>public_key_id</Code> field in any receipt the holder of the
                corresponding private key issues. The reference engine publishes
                its key at{' '}
                <Link
                  href={PUBKEY_URL}
                  className={`${EXT_LINK} font-mono text-[0.86em]`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {PUBKEY_URL}
                </Link>
                .
              </P>
            </Section>

            <Section id="verify" n="6" title="Verification procedure">
              <P>Given a receipt object R:</P>
              <ol className="mt-4 list-decimal space-y-3 pl-6 marker:text-ink-3">
                <li>Validate <Code>R.signature_algo == &quot;Ed25519&quot;</Code>. Otherwise reject.</li>
                <li>Resolve the public key for <Code>R.public_key_id</Code>. Pin it, fetch from <Code>/.well-known/govtrace-pubkey.json</Code>, or accept it out of band.</li>
                <li>Recompute the canonical bytes of <Code>R.signed_fields_data</Code> per section 3.</li>
                <li>Compute <Code>digest_bytes = sha256(canonical_bytes)</Code>.</li>
                <li>(Recommended.) Verify <Code>R.canonical_digest == hex(digest_bytes)</Code>.</li>
                <li>Verify the Ed25519 signature against <Code>digest_bytes</Code> using the resolved key.</li>
              </ol>
              <P>
                If step 6 succeeds, the receipt is <strong className="font-semibold text-verdict-safe">VALID</strong>.
                The verifier <Kw>SHOULD</Kw> echo back <Code>signed_fields_data</Code> so
                the user sees exactly what was attested. If step 6 fails, the
                receipt is <strong className="font-semibold text-verdict-block">INVALID</strong> and
                the verifier <Kw>SHOULD NOT</Kw> present <Code>signed_fields_data</Code> as
                trustworthy.
              </P>
            </Section>

            <Section id="schema" n="7" title="JSON Schema">
              <P>
                A machine-readable JSON Schema for the receipt object is published
                at:
              </P>
              <Pre>{SCHEMA_URL}</Pre>
              <P>
                The schema is normative for field names and types. This document
                is normative for canonicalization and signing.
              </P>
              <div className="mt-6 flex flex-wrap gap-3">
                <ExternalButton href={SCHEMA_URL}>Open schema (JSON)</ExternalButton>
                <ExternalButton href={SCHEMA_REPO_URL}>View on GitHub</ExternalButton>
              </div>
            </Section>

            <Section id="impls" n="8" title="Reference implementations">
              <dl className="border-t border-rule">
                <ImplRow term="Issuer (Python):">
                  <Code>govtrace-api/signing.py</Code> in{' '}
                  <Link
                    href={REPO_URL}
                    className={EXT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aparankussam/govtrace-ai
                  </Link>
                  .
                </ImplRow>
                <ImplRow term="Verifier (Node CLI):">
                  <Link
                    href={NPM_URL}
                    className={EXT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @gobotsai/govtrace
                  </Link>{' '}
                  on npm. <Code>npm i -g @gobotsai/govtrace</Code> then{' '}
                  <Code>govtrace verify ./receipt.json</Code>.
                </ImplRow>
                <ImplRow term="Web verifier:">
                  <Link href="/verify" className={EXT_LINK}>
                    gobotsai.com/verify
                  </Link>
                  . Paste any receipt. Stateless.
                </ImplRow>
              </dl>
            </Section>

            <Section id="stability" n="9" title="Versioning and stability">
              <ul className="list-disc space-y-3 pl-6 marker:text-ink-3">
                <li>v1 is frozen as of the publication date of this document.</li>
                <li>Additive, backward-compatible changes to issuer-defined keys in <Code>signed_fields_data</Code> are allowed at any time.</li>
                <li>Changes that affect signing or canonicalization rules require a major version bump (v2). v1 verifiers <Kw>SHOULD</Kw> reject receipts carrying an unrecognized <Code>spec_version</Code>.</li>
              </ul>
            </Section>

            <Section id="security" n="10" title="Security considerations">
              <ul className="list-disc space-y-3 pl-6 marker:text-ink-3">
                <li>A verifier <Kw>MUST</Kw> resolve the public key from a source the verifier itself trusts. Never accept a public key embedded in the same receipt being verified.</li>
                <li>A receipt does not attest that the AI action signed actually occurred in the real world. It attests only that the issuer evaluated a given input under a given policy and reached the recorded verdict at the recorded time. Combine receipts with execution-time evidence to reconstruct what happened.</li>
                <li>Receipts are not anonymized. Avoid placing direct identifiers in <Code>signed_fields_data</Code>. Use hashes (<Code>record_hash</Code>, <Code>input_hash</Code>) instead.</li>
              </ul>
            </Section>

            {/* Colophon */}
            <section aria-labelledby="full-text" className="mt-20 border-t-[3px] border-double border-ink/80 pt-8">
              <h2 id="full-text" className="heading text-[26px] md:text-[30px]">Full text</h2>
              <p className="mt-4 max-w-[65ch] text-[16px] leading-[1.65] text-ink-2">
                This page is a rendering of the canonical specification. The
                authoritative source is the Markdown file in the GoVTraceAI
                repository, published under CC BY 4.0.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ExternalButton href={SPEC_REPO_URL}>Read RECEIPT_FORMAT_v1.md</ExternalButton>
                <ExternalButton href={SCHEMA_URL}>receipt.schema.json</ExternalButton>
                <Link href="/verify" className="btn-ink">
                  Try the verifier
                  <Arrow />
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Section({
  id,
  n,
  title,
  children,
}: {
  id: string
  n: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="mt-16 scroll-mt-24 border-t border-ink/80 pt-7 first:mt-0 md:mt-20"
    >
      <h2 id={`${id}-h`} className="heading flex items-baseline gap-4 text-[28px] md:text-[34px]">
        <span className="tnum min-w-[1.6ch] text-ink-3">{n}.</span>
        <span>{title}</span>
      </h2>
      <div className="mt-6 max-w-[70ch] text-[16.5px] leading-[1.7] text-ink-2">{children}</div>
    </section>
  )
}

function P({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-5 first:mt-0 ${className}`}>{children}</p>
}

/** RFC 2119 requirement keyword. */
function Kw({ children }: { children: React.ReactNode }) {
  return (
    <strong className="whitespace-nowrap text-[0.88em] font-semibold tracking-[0.06em] text-ink">
      {children}
    </strong>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[2px] bg-paper-2 px-[0.3em] py-px font-mono text-[0.84em] text-ink [overflow-wrap:anywhere]">
      {children}
    </code>
  )
}

function Pre({ children }: { children: string }) {
  return (
    <pre className="my-6 max-w-full overflow-x-auto whitespace-pre rounded-doc border border-rule bg-paper-2 px-4 py-4 font-mono text-[12.5px] leading-[1.65] text-ink md:px-5 md:text-[13px]">
{children}
    </pre>
  )
}

function FieldsTable({
  caption,
  rows,
}: {
  caption: string
  rows: Array<[string, string, string, React.ReactNode]>
}) {
  return (
    <div className="my-7 max-w-full overflow-x-auto border-y border-ink/80">
      <table className="w-full min-w-[38rem] border-collapse text-left text-[14.5px] leading-[1.5]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink/80">
            <th scope="col" className="label py-2.5 pr-4 text-[10.5px] text-ink-3">Field</th>
            <th scope="col" className="label py-2.5 pr-4 text-[10.5px] text-ink-3">Type</th>
            <th scope="col" className="label py-2.5 pr-4 text-[10.5px] text-ink-3">Req</th>
            <th scope="col" className="label py-2.5 text-[10.5px] text-ink-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([f, t, r, d]) => (
            <tr key={f} className="border-t border-rule align-top first:border-t-0">
              <th scope="row" className="whitespace-nowrap py-2.5 pr-4 font-mono text-[13px] font-medium text-ink">{f}</th>
              <td className="py-2.5 pr-4 font-mono text-[12.5px] text-ink-2">{t}</td>
              <td className={`py-2.5 pr-4 ${r === 'yes' ? 'text-ink' : 'text-ink-3'}`}>{r}</td>
              <td className="py-2.5 text-ink-2">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ImplRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-rule py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="font-semibold text-ink">{term}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="btn-rule">
      {children}
      <ArrowUpRight />
    </Link>
  )
}
