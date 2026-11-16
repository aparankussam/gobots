import type { ClaimId } from './claims'

/**
 * Public company content (spec §6, §7.1). Facts here are rendered through
 * <Claim>; lists of capabilities and industries are offers, not claims.
 */

/** Off until the founder approves the guarantee terms / reviews the map. */
export const LAUNCH = { guarantee: false, complianceMap: false }

export type EngineKey = 'strategy' | 'deploy' | 'products'

export const ENGINES: {
  n: '01' | '02' | '03'
  key: EngineKey
  name: string
  title: string
  body: string
  covers: string[]
  firstStep: string
}[] = [
  {
    n: '01',
    key: 'strategy',
    name: 'Strategy',
    title: 'Architects, not slideware',
    body: 'Senior AI architects decide what to build, and how to govern and secure it.',
    covers: ['AI strategy', 'AI governance', 'AI security', 'Cybersecurity'],
    firstStep: 'Book an architecture briefing',
  },
  {
    n: '02',
    key: 'deploy',
    name: 'Deploy and run',
    title: 'Forward-deployed pods',
    body: 'A working system on your workflow in week 1. Then we run it in production.',
    covers: ['Agentic systems', 'GenAI apps', 'Intelligent automation', 'QA and release', 'AgentOps'],
    firstStep: 'Start a Production Sprint',
  },
  {
    n: '03',
    key: 'products',
    name: 'Products',
    title: 'Our own software',
    body: 'Products built on one shared agent and governance core, so each starts from the same layers.',
    covers: ['RevXL', 'GoVTraceAI', 'Lumen health line'],
    firstStep: 'Book a product briefing',
  },
]

export const CAPABILITIES: { name: string; line: string; engine: 'strategy' | 'deploy' }[] = [
  { name: 'Agentic and multi-agent systems', line: 'Agents that execute real work across your tools, with humans in the loop where it counts.', engine: 'deploy' },
  { name: 'AI governance', line: 'Guardrails, policy and signed evidence, switched on by week 4 of a sprint.', engine: 'strategy' },
  { name: 'AI strategy', line: 'Which workflows to automate first, and what week 1 ships.', engine: 'strategy' },
  { name: 'AI security', line: 'Prompt-injection defence, data-leak controls and model risk review.', engine: 'strategy' },
  { name: 'Cybersecurity', line: 'Security architecture for the systems AI touches.', engine: 'strategy' },
  { name: 'GenAI applications', line: 'Copilots and assistants wired to your data and permissions.', engine: 'deploy' },
  { name: 'RAG and enterprise knowledge', line: 'Answers grounded in your documents, with sources.', engine: 'deploy' },
  { name: 'RPA and intelligent automation', line: 'Rule-based bots upgraded with judgement where rules run out.', engine: 'deploy' },
  { name: 'Document intelligence', line: 'Extraction and review for invoices, loans, claims and records.', engine: 'deploy' },
  { name: 'Voice agents', line: 'Phone and voice workflows that hand off cleanly to people.', engine: 'deploy' },
  { name: 'QA automation', line: 'AI-assisted test generation and regression suites.', engine: 'deploy' },
  { name: 'Release engineering', line: 'Pipelines that ship AI changes safely and often.', engine: 'deploy' },
  { name: 'MLOps and LLMOps', line: 'Monitoring, versioning and cost control for models in production.', engine: 'deploy' },
  { name: 'AI red-teaming and evals', line: 'Adversarial tests and evaluation suites before and after launch.', engine: 'deploy' },
  { name: 'Data engineering', line: 'The pipelines and context your agents depend on.', engine: 'deploy' },
]

export const INDUSTRIES: { name: string; servedBy: string[] }[] = [
  { name: 'Mortgage', servedBy: ['RevXL · Mortgage', 'Deploy and run'] },
  { name: 'Real estate', servedBy: ['RevXL · Real estate'] },
  { name: 'Banking', servedBy: ['RevXL · Banking (in development)', 'GoVTraceAI'] },
  { name: 'Finance', servedBy: ['RevXL · Finance (in development)', 'Deploy and run'] },
  { name: 'Fintech', servedBy: ['RevXL · Fintech (in development)', 'GoVTraceAI'] },
  { name: 'Insurance', servedBy: ['Deploy and run', 'GoVTraceAI'] },
  { name: 'Automotive', servedBy: ['RevXL · Automotive (in development)', 'Deploy and run'] },
  { name: 'Manufacturing', servedBy: ['Deploy and run'] },
  { name: 'Healthcare', servedBy: ['Lumen', 'GoVTraceAI'] },
  { name: 'Medspa', servedBy: ['RevXL · Medspa'] },
  { name: 'Small business', servedBy: ['RevXL · Small business'] },
]

/** Sectors with a live or built product behind them (not only a service line, not only in development). */
export const INDUSTRIES_WITH_PRODUCT = INDUSTRIES.filter((i) =>
  i.servedBy.some((s) => s !== 'Deploy and run' && !s.includes('in development')),
)

export type Status = 'live' | 'launching' | 'built' | 'in-development'

export const STATUS_LABEL: Record<Status, string> = {
  live: 'Live',
  launching: 'Launching',
  built: 'Built',
  'in-development': 'In development',
}

export const STATUS_LEGEND: Record<Status, string> = {
  live: 'Anyone can use it today.',
  launching: 'Built, and now going to market.',
  built: 'Complete, not yet released.',
  'in-development': 'Being built.',
}

export type Product = {
  name: string
  line: string
  status: Status
  claim: ClaimId
  family: 'core' | 'revxl' | 'health'
  editions?: { names: string[]; status: Status }[]
}

export const PRODUCTS: Product[] = [
  {
    name: 'GoVTraceAI',
    line: 'Checks AI output for PII, prompt injection and overclaims, and issues a verifiable receipt for every run.',
    status: 'live',
    claim: 'product.govtrace',
    family: 'core',
  },
  {
    name: 'RevXL',
    line: 'AI revenue suite for growth-focused businesses, in industry editions.',
    status: 'launching',
    claim: 'product.revxl',
    family: 'revxl',
    editions: [
      { names: ['Mortgage', 'Real estate', 'Medspa', 'Small business'], status: 'built' },
      { names: ['Finance', 'Banking', 'Fintech', 'Automotive'], status: 'in-development' },
    ],
  },
  { name: 'CardioLumen', line: 'AI product for cardiology practices.', status: 'built', claim: 'product.health', family: 'health' },
  { name: 'UroLumen', line: 'AI product for urology practices.', status: 'built', claim: 'product.health', family: 'health' },
  { name: 'Prodrome', line: 'Healthcare AI product for specialty care.', status: 'built', claim: 'product.health', family: 'health' },
]

/** Three figures. "1 live · 1 launching · 3 built" matches PRODUCTS. */
export const FIGURES: { value: string; label: string; claim: ClaimId }[] = [
  { value: 'Week 1', label: 'First working system', claim: 'fig.week1' },
  { value: '1 live · 1 launching · 3 built', label: 'AI products', claim: 'fig.products' },
  { value: '3', label: 'Implementation clients in production', claim: 'fig.clients' },
]

export const ADVISORY = ['Board-certified cardiologist', 'Board-certified urologist']

export const TEAM_EXPERIENCE = ['Apple', 'IBM', 'UBS', 'BCBS', 'Nationwide', 'Qantas', 'UWM', 'Adient']

/** One sealed "product record" per product family (homepage product section). */
export type ProductRecord = {
  key: 'govtrace' | 'revxl' | 'health'
  name: string
  promise: string
  status: Status
  claim: ClaimId
  fields: { label: string; value: string; claim?: ClaimId }[]
  next: { label: string; href: string }
}

export const PRODUCT_RECORDS: ProductRecord[] = [
  {
    key: 'govtrace',
    name: 'GoVTraceAI',
    promise: 'Proof for every AI decision.',
    status: 'live',
    claim: 'product.govtrace',
    fields: [
      { label: 'For', value: 'Teams that must defend AI decisions to an auditor' },
      { label: 'You get', value: 'PII and prompt-injection checks, overclaim flags, and a signed receipt for every run' },
      { label: 'Proof', value: 'Public demo · verifier · open spec' },
    ],
    next: { label: 'See it run', href: '/demo' },
  },
  {
    key: 'revxl',
    name: 'RevXL',
    promise: 'AI revenue suite, in industry editions.',
    status: 'launching',
    claim: 'product.revxl',
    fields: [
      { label: 'For', value: 'Mortgage brokers first, then growth-focused businesses in other industries' },
      { label: 'You get', value: 'Scores a mortgage site for borrower conversion, 0 to 100, with a prioritized fix plan', claim: 'revxl.mortgage' },
      { label: 'Editions', value: 'Also built: Real estate · Medspa · Small business. In development: Finance · Banking · Fintech · Automotive' },
    ],
    next: { label: 'Score your mortgage site free', href: 'https://revxl.gobotsai.com/fundxl/audit' },
  },
  {
    key: 'health',
    name: 'Lumen health line',
    promise: 'AI for specialty care practices.',
    status: 'built',
    claim: 'product.health',
    fields: [
      { label: 'For', value: 'Cardiology, urology and specialty practices' },
      { label: 'Products', value: 'CardioLumen · UroLumen · Prodrome' },
      { label: 'Built with', value: 'Board-certified cardiologist and urologist', claim: 'advisory.physicians' },
    ],
    next: { label: 'Book a product briefing', href: '/walkthrough' },
  },
]

/** RevXL editions for the homepage switcher. Order matches PRODUCTS' RevXL editions. */
export type RevxlEdition = {
  name: string
  /** Completes "RevXL for …". */
  audience: string
  status: Status
  /** Shown as "You get". Only filled where Gobots has supplied real outcomes. */
  outcomes?: string[]
  loanTypes?: string
  /** Live free scan for this edition, if one exists. */
  freeScan?: { label: string; note: string; href: string }
  validatedWith?: string[]
}

export const REVXL_EDITIONS: RevxlEdition[] = [
  {
    name: 'Mortgage',
    audience: 'mortgage brokers',
    status: 'built',
    outcomes: [
      'A 0–100 borrower-conversion score for your site, across eight weighted areas from speed to lead to compliance flags',
      'Your own pages marked up as evidence: forms, calls to action, trust signals and compliance-sensitive wording',
      'A prioritized fix plan. Do it yourself, or RevXL can fix it for you',
    ],
    loanTypes: 'DSCR · Conventional · and other loan programs',
    freeScan: {
      label: 'Score your mortgage site free',
      note: 'About 90 seconds. Just your site and email, no credit card.',
      href: 'https://revxl.gobotsai.com/fundxl/audit',
    },
    validatedWith: ['Pinnacle Ventures', 'Coast2Coast Mortgage'],
  },
  { name: 'Real estate', audience: 'real estate teams', status: 'built' },
  { name: 'Medspa', audience: 'medspas', status: 'built' },
  { name: 'Small business', audience: 'small businesses', status: 'built' },
  { name: 'Finance', audience: 'finance teams', status: 'in-development' },
  { name: 'Banking', audience: 'banks', status: 'in-development' },
  { name: 'Fintech', audience: 'fintechs', status: 'in-development' },
  { name: 'Automotive', audience: 'automotive teams', status: 'in-development' },
]
