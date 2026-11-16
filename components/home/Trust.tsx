import Claim from '@/components/Claim'
import { LAUNCH } from '@/content/site'
import { COMPLIANCE, FRAMEWORKS } from '@/content/compliance'

/** Capability × framework matrix. Shown only when LAUNCH.complianceMap is on. */
export function ComplianceMap() {
  return (
    <div className="mt-14">
      <h3 className="text-[19px] font-semibold tracking-[-0.01em]">How GoVTraceAI supports common frameworks</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-ink/80">
              <th scope="col" className="label py-2 pr-4 text-[10.5px] font-semibold text-ink-3">
                Capability
              </th>
              {FRAMEWORKS.map((f) => (
                <th key={f} scope="col" className="label px-3 py-2 text-[10.5px] font-semibold text-ink-3">
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPLIANCE.map((row) => (
              <tr key={row.capability} className="border-b border-rule">
                <th scope="row" className="py-3 pr-4 font-medium">
                  {row.capability}
                </th>
                {FRAMEWORKS.map((f) => {
                  const hit = row.supports.find((s) => s.framework === f)
                  return (
                    <td key={f} className="px-3 py-3 align-top">
                      {hit ? (
                        <>
                          <span className="block text-ink">supports</span>
                          <span className="font-mono text-[11.5px] text-ink-3">{hit.theme}</span>
                        </>
                      ) : (
                        <span className="text-ink-4">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-ink-3">
        Not a certification or legal advice. GoVTraceAI produces evidence your own compliance work can
        use.
      </p>
    </div>
  )
}

export default function Trust() {
  return (
    <section aria-label="Trust" className="border-t border-ink/80 py-24 md:py-32">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <h2 className="heading text-[clamp(2.5rem,5.4vw,4.25rem)] lg:col-span-6">Built to be trusted<span className="text-seal">.</span></h2>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <p className="heading text-[clamp(1.5rem,2.6vw,2rem)] leading-snug">
              <Claim id="trust.data">Your data stays in your environment.</Claim>
            </p>
            <p className="mt-4 text-[17px] leading-[1.55] text-ink-2">
              We deploy into your cloud and your tools, under your access controls. Every AI decision
              leaves a signed record your auditors can check without asking us.
            </p>
          </div>
        </div>
        {LAUNCH.complianceMap && <ComplianceMap />}
      </div>
    </section>
  )
}
