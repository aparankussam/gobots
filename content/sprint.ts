/**
 * The Production Sprint, week by week. Source: Gobots' delivery model
 * (a working system in week 1, governed and integrated by week 4, then
 * expanded). No day-level schedule, price or pod size is published until
 * the founder supplies them.
 */

/** The one week-1 statement. Every page, preview and llms.txt uses these. */
export const WEEK_ONE = 'A working system on your workflow in week 1. Governed, integrated and receipted by week 4.'

/** Said under every primary Production Sprint button. */
export const CALL_CAPTION = '20-minute call with an architect. No commitment, no discovery fee.'

export const SPRINT_PHASES: { when: string; title: string; points: string[] }[] = [
  {
    when: 'Week 1',
    title: 'A working system on your own data',
    points: [
      'A real agent running on your own workflow and data',
      'Deployed in your environment, under your access controls',
      'Led by your architect, who is in the room from the first call',
    ],
  },
  {
    when: 'Weeks 2–4',
    title: 'Governed and integrated',
    points: [
      'PII detection, a prompt-injection guard and audit trails switched on',
      'Connected to the systems and tools it acts on',
      'A signed receipt for every AI decision',
    ],
  },
  {
    when: 'Week 5 onward',
    title: 'Expanded across use cases',
    points: [
      'The same governed core, applied to your next workflows',
      'No rebuild between use cases',
      'A clear view of what to expand next',
    ],
  },
]

export const SPRINT_BRING = [
  'One workflow worth automating',
  'Access to the data and tools it needs',
  'A named owner on your side',
  'A short written brief, agreed by both sides, that says what “working” means',
]

export const SPRINT_GET = [
  'A working system on your workflow in week 1',
  'Governance and signed receipts on that same system by week 4',
  'A signed record of every AI decision that your auditors can verify',
  'A plan for what to expand next',
]

export const SPRINT_NEXT: { name: string; line: string }[] = [
  { name: 'Pod', line: 'Forward-deployed engineers stay and expand the system across your workflows.' },
  { name: 'Run', line: 'We operate, monitor and govern it in production for you.' },
  { name: 'Product', line: 'Adopt one of our own products, such as RevXL or GoVTraceAI, on the same core.' },
]

/** Illustrative week-1 systems (shown labelled as examples, not client work). */
export const WEEK_ONE_SYSTEMS: { name: string; type: string; steps: string[] }[] = [
  { name: 'Invoice Processing', type: 'Document agent', steps: ['Extract invoice fields', 'Match to purchase order', 'Post to SAP ERP', 'Notify approver'] },
  { name: 'Risk Guard', type: 'Governance agent', steps: ['Scan for PII', 'Check prompt injection', 'Evaluate hallucination', 'Return verdict'] },
  { name: 'Approval Workflow', type: 'Orchestration agent', steps: ['Route to approver', 'Check SLA threshold', 'Escalate via Slack', 'Update CRM record'] },
]
