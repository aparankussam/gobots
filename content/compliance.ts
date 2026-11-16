/**
 * How GoVTraceAI capabilities support framework themes (spec §7.1 item 13).
 * DRAFT for founder review. Not shown until LAUNCH.complianceMap is true.
 * Wording is "supports"; this is not a certification or legal advice.
 */

export type Framework = 'EU AI Act' | 'NIST AI RMF' | 'ISO/IEC 42001' | 'HIPAA' | 'SOC 2'
export type Theme = 'record-keeping' | 'transparency' | 'human oversight' | 'risk management' | 'data protection'

export const FRAMEWORKS: Framework[] = ['EU AI Act', 'NIST AI RMF', 'ISO/IEC 42001', 'HIPAA', 'SOC 2']

export const COMPLIANCE: { capability: string; supports: { framework: Framework; theme: Theme }[] }[] = [
  {
    capability: 'PII detection',
    supports: [
      { framework: 'EU AI Act', theme: 'data protection' },
      { framework: 'NIST AI RMF', theme: 'risk management' },
      { framework: 'ISO/IEC 42001', theme: 'risk management' },
      { framework: 'HIPAA', theme: 'data protection' },
      { framework: 'SOC 2', theme: 'data protection' },
    ],
  },
  {
    capability: 'Prompt-injection guard',
    supports: [
      { framework: 'EU AI Act', theme: 'risk management' },
      { framework: 'NIST AI RMF', theme: 'risk management' },
      { framework: 'ISO/IEC 42001', theme: 'risk management' },
      { framework: 'SOC 2', theme: 'risk management' },
    ],
  },
  {
    capability: 'Overclaim check',
    supports: [
      { framework: 'EU AI Act', theme: 'transparency' },
      { framework: 'NIST AI RMF', theme: 'transparency' },
      { framework: 'ISO/IEC 42001', theme: 'transparency' },
    ],
  },
  {
    capability: 'Signed receipts and audit trail',
    supports: [
      { framework: 'EU AI Act', theme: 'record-keeping' },
      { framework: 'NIST AI RMF', theme: 'transparency' },
      { framework: 'ISO/IEC 42001', theme: 'record-keeping' },
      { framework: 'HIPAA', theme: 'record-keeping' },
      { framework: 'SOC 2', theme: 'record-keeping' },
    ],
  },
  {
    capability: 'Named policy digest',
    supports: [
      { framework: 'EU AI Act', theme: 'human oversight' },
      { framework: 'NIST AI RMF', theme: 'risk management' },
      { framework: 'ISO/IEC 42001', theme: 'risk management' },
    ],
  },
  {
    capability: 'Third-party verification',
    supports: [
      { framework: 'EU AI Act', theme: 'record-keeping' },
      { framework: 'NIST AI RMF', theme: 'transparency' },
      { framework: 'ISO/IEC 42001', theme: 'transparency' },
      { framework: 'SOC 2', theme: 'record-keeping' },
    ],
  },
]
