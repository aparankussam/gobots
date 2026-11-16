/**
 * Claims register (spec §7.3). Every factual claim on the homepage and on
 * /guarantee is wrapped in <Claim id="..."> and must have an entry here.
 */

export type Evidence = 'verifiable' | 'documented' | 'reference' | 'statement'

export type ClaimEntry = { evidence: Evidence; source: string; href?: string }

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  verifiable: 'Verifiable',
  documented: 'On this site',
  reference: 'Reference on request',
  statement: 'Company statement',
}

export const CLAIMS = {
  'fig.week1': {
    evidence: 'reference',
    source: 'Delivery record across current implementation clients; references on request.',
  },
  'fig.products': { evidence: 'documented', source: 'One live (GoVTraceAI), one launching (RevXL), three built (CardioLumen, UroLumen, Prodrome). See the product records.', href: '/#products' },
  'fig.clients': {
    evidence: 'reference',
    source: 'Three enterprise implementation clients. Names withheld; references under NDA.',
  },
  'team.experience': {
    evidence: 'reference',
    source: 'Prior roles held by Gobots team members. These are not Gobots clients.',
  },
  'founder.bio': {
    evidence: 'reference',
    source: 'Founder’s career at IBM, UWM and Adient; details on request.',
  },
  'founder.record': {
    evidence: 'reference',
    source: 'Founder track record on prior enterprise programmes; details on request.',
  },
  'delivery.global': {
    evidence: 'statement',
    source: 'Architecture led from the US; delivery pods worldwide.',
  },
  'receipts.signed': {
    evidence: 'verifiable',
    source: 'Check any receipt’s Ed25519 signature yourself.',
    href: '/verify',
  },
  'product.govtrace': {
    evidence: 'verifiable',
    source: 'Public demo, verifier and open spec.',
    href: '/demo',
  },
  'product.revxl': { evidence: 'statement', source: 'Status as stated by Gobots.' },
  'revxl.validated': {
    evidence: 'reference',
    source: 'Mortgage edition validated with Pinnacle Ventures and Coast2Coast Mortgage; references on request.',
  },
  'sprint.plan': {
    evidence: 'statement',
    source: 'Delivery model as stated by Gobots: a working system in week 1, governed and integrated by week 4, then expanded across use cases.',
  },
  'revxl.scan': {
    evidence: 'statement',
    source: 'As stated on RevXL’s own free-scan page: your site and email, no credit card, about 90 seconds.',
    href: 'https://revxl.gobotsai.com/fundxl/audit',
  },
  'revxl.mortgage': {
    evidence: 'reference',
    source: 'RevXL mortgage audit: scoring model, sample report and method shown in a briefing.',
  },
  'product.health': { evidence: 'statement', source: 'Status as stated by Gobots.' },
  'advisory.physicians': { evidence: 'reference', source: 'Advisors’ names shared under NDA.' },
  'trust.data': {
    evidence: 'statement',
    source: 'Delivery model as stated by Gobots: a Production Sprint system is deployed in the client’s environment under the client’s access controls. Hosted products, such as the GoVTraceAI live demo, run on Gobots infrastructure.',
  },
  'guarantee.week1': { evidence: 'documented', source: 'Full terms.', href: '/guarantee' },
} satisfies Record<string, ClaimEntry>

export type ClaimId = keyof typeof CLAIMS

export function getClaim(id: string): ClaimEntry | undefined {
  return (CLAIMS as Record<string, ClaimEntry>)[id]
}
