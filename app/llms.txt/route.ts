import { ENGINES, INDUSTRIES, PRODUCTS, STATUS_LABEL } from '@/content/site'
import { WEEK_ONE } from '@/content/sprint'

const SITE = 'https://gobotsai.com'

export const dynamic = 'force-static'

/** Plain-text company summary for AI assistants (spec §7.2). */
export function GET() {
  const lines = [
    '# Gobots',
    '',
    '> Full-stack AI company. Gobots architects, ships and runs AI in production, and builds its own products on the same governed core.',
    '',
    `${WEEK_ONE}`,
    '',
    '## Engines',
    ...ENGINES.map((e) => `- ${e.name} (${e.title}): ${e.body} First step: ${e.firstStep}.`),
    '',
    '## Products',
    ...PRODUCTS.map((p) => {
      const editions = p.editions?.map((ed) => `${ed.names.join(', ')} (${STATUS_LABEL[ed.status]})`).join('; ')
      return `- ${p.name} (${STATUS_LABEL[p.status]}): ${p.line}${editions ? ` Editions: ${editions}.` : ''}`
    }),
    '',
    '## Industries',
    `- ${INDUSTRIES.map((i) => i.name).join(', ')}`,
    '',
    '## Proof',
    `- Live demo of GoVTraceAI: ${SITE}/demo`,
    `- Verify a signed receipt: ${SITE}/verify`,
    `- Open receipt specification: ${SITE}/spec`,
    `- Why logs are not evidence: ${SITE}/evidence-gap`,
    '- SDK: https://www.npmjs.com/package/@gobotsai/govtrace',
    '',
    '## Contact',
    `- The Production Sprint, week by week: ${SITE}/sprint`,
    `- Capabilities: ${SITE}/capabilities`,
    `- RevXL for mortgage brokers (free site score): ${SITE}/revxl/mortgage`,
    `- Start a Production Sprint: ${SITE}/walkthrough`,
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
