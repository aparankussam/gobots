import Claim from './Claim'
import { TEAM_EXPERIENCE } from '@/content/site'

export default function TrustBar() {
  return (
    <section aria-label="Team experience" className="border-b border-ink/80">
      <div className="wrap flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-10">
        <div className="shrink-0 md:w-48">
          <p className="label text-[10.5px] text-ink-3">
            Where our team has delivered
          </p>
          <p className="mt-1 text-[12.5px] text-ink-3">Prior roles of team members. Not Gobots clients.</p>
        </div>
        <ul className="grid grid-cols-2 gap-y-3 min-[420px]:grid-cols-4 md:flex-1 lg:grid-cols-8">
          {TEAM_EXPERIENCE.map((name, i) => (
            <li
              key={name}
              className="border-l border-rule pl-3 text-[15px] font-semibold tracking-[-0.01em] text-ink md:text-[17px]"
              style={{ fontStretch: '112.5%' }}
            >
              {i === TEAM_EXPERIENCE.length - 1 ? (
                <Claim id="team.experience" label="team experience list">
                  {name}
                </Claim>
              ) : (
                name
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
