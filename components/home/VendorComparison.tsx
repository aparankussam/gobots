import Link from 'next/link'
import Claim from '@/components/Claim'
import SprintCaption from '@/components/SprintCaption'
import { Arrow } from '@/components/doc/icons'
import { SPRINT_BRING, SPRINT_GET, SPRINT_PHASES, WEEK_ONE_SYSTEMS } from '@/content/sprint'
import Stamp from '@/components/doc/Stamp'
import InView from './InView'

/**
 * Gobots first, then the visitor's current vendor, on one shared week axis.
 * The seal line at the end of week 1 is the point: Gobots is live, the
 * vendor is still in kickoff. On scroll (motion allowed) the week-1 bar
 * fills, a LIVE stamp lands, and the other segments fade in; see the
 * cmp-* classes in globals.css.
 */

/** Fade-in delay per segment, in ms, keyed by tone and position. */
function delayFor(tone: Tone, i: number) {
  if (tone === 'ink') return 1400
  if (tone === 'open') return 1700
  if (tone === 'void') return 1600
  return i * 300
}

type Tone = 'live' | 'ink' | 'open' | 'muted' | 'void'
type Seg = { from: number; to: number; title: string; sub: string; tone: Tone }

const WEEKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9+']
const TRACK = 'grid-cols-[repeat(8,minmax(0,1fr))_minmax(0,1.9fr)]'

const GOBOTS: Seg[] = [
  { from: 1, to: 1, title: 'Working system', sub: 'Live on your workflow', tone: 'live' },
  { from: 2, to: 4, title: 'Governed and integrated', sub: 'Guardrails, integrations, signed evidence', tone: 'ink' },
  { from: 5, to: 9, title: 'Expanded across use cases', sub: 'Same core. New workflows. No rebuild.', tone: 'open' },
]

const VENDOR: Seg[] = [
  { from: 1, to: 2, title: 'Kickoff', sub: 'Scope and stakeholders', tone: 'muted' },
  { from: 3, to: 4, title: 'Discovery', sub: 'Document current state', tone: 'muted' },
  { from: 5, to: 6, title: 'Requirements', sub: 'Written up for review', tone: 'muted' },
  { from: 7, to: 8, title: 'Proposal review', sub: 'Back to stakeholders', tone: 'muted' },
  { from: 9, to: 9, title: 'Still planning', sub: 'No system yet.', tone: 'void' },
]

const SEG_STYLE: Record<Tone, string> = {
  live: 'bg-seal text-ink',
  ink: 'bg-ink text-paper',
  open: 'border border-ink text-ink',
  muted: 'border border-dashed border-ink/30 text-ink-2',
  void: 'border border-dashed border-verdict-block/40 text-verdict-block',
}

const SUB_STYLE: Record<Tone, string> = {
  live: 'text-ink/80',
  ink: 'text-paper/75',
  open: 'text-ink-2',
  muted: 'opacity-80',
  void: 'opacity-80',
}

function LiveLine() {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-1.5 right-0 grid gap-1.5 ${TRACK}`}>
      <div className="col-start-1 -mr-[3px] border-r-2 border-seal" />
    </div>
  )
}

function Row({ label, note, segs, lead }: { label: string; note?: string; segs: Seg[]; lead?: boolean }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] items-stretch border-b border-rule">
      <div className="flex flex-col justify-center border-r border-rule py-5 pr-4">
        <p className={`leading-tight ${lead ? 'heading text-[22px]' : 'text-[14px] font-semibold'}`}>{label}</p>
        {note && <p className="mt-1 text-[12px] leading-snug text-ink-3">{note}</p>}
      </div>
      <div className={`relative grid gap-1.5 pb-4 pl-1.5 ${lead ? 'pt-11' : 'pt-4'} ${TRACK}`}>
        <LiveLine />
        {segs.map((s, i) => (
          <div
            key={s.title}
            className={`relative flex min-h-[5.5rem] flex-col justify-between rounded-[2px] px-3 py-2.5 ${SEG_STYLE[s.tone]} ${
              s.tone === 'live' ? 'cmp-fill' : 'cmp-fade'
            }`}
            style={{ gridColumn: `${s.from} / ${s.to + 1}`, ['--d' as string]: `${delayFor(s.tone, i)}ms` }}
          >
            {s.tone === 'live' && (
              <Stamp id="live-stamp" tone="seal" size="sm" className="cmp-stamp absolute -top-[38px] left-1/2 -ml-[27px]">
                LIVE
              </Stamp>
            )}
            <p className="text-[13.5px] font-semibold leading-tight">{s.title}</p>
            {s.tone === 'void' && (
              <Stamp id="void" tone="block" size="sm" className="void-stamp my-1 self-center">
                NO SYSTEM
              </Stamp>
            )}
            <p className={`text-[12px] leading-snug ${SUB_STYLE[s.tone]}`}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const wk = (s: Seg) =>
  s.from === 9 ? 'Week 9+' : s.to === 9 ? `Week ${s.from}+` : s.from === s.to ? `Week ${s.from}` : `Weeks ${s.from}–${s.to}`

function MobileList({ label, note, segs }: { label: string; note?: string; segs: Seg[] }) {
  return (
    <div>
      <div className="border-b border-ink/80 pb-2">
        <p className="text-[16px] font-semibold">{label}</p>
        {note && <p className="text-[12.5px] text-ink-3">{note}</p>}
      </div>
      <ol>
        {segs.map((s) => (
          <li key={s.title} className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-rule py-3">
            <span className="font-mono text-[12px] text-ink-3 tnum">{s.tone === 'void' ? 'Week 9+' : wk(s)}</span>
            <span>
              <span
                className={`block text-[15px] font-semibold ${
                  s.tone === 'void' ? 'text-verdict-block' : s.tone === 'live' ? 'text-seal-ink' : ''
                }`}
              >
                {s.title}
              </span>
              <span className="text-[13.5px] text-ink-2">{s.sub}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

const VENDOR_NOTE = 'Illustrative. Based on typical enterprise programmes.'

export default function VendorComparison() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-24 md:py-32">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <h2 className="heading text-[clamp(2.5rem,5.4vw,4.25rem)] lg:col-span-6">
            Working in week 1. Not month 6<span className="text-seal">.</span>
          </h2>
          <div className="space-y-5 text-[18px] leading-[1.55] text-ink-2 lg:col-span-5 lg:col-start-8 lg:pt-3">
            <p>
              Gobots puts a working system on your real workflow in the first week, then governs,
              integrates and expands it.
            </p>
            <p className="text-ink">
              Compare that with a typical vendor timeline: kickoff, discovery and requirements before
              any production code.
            </p>
          </div>
        </div>

        {/* Desktop: shared week axis, Gobots on top */}
        <InView className="mt-16 hidden md:block">
          <div className="grid grid-cols-[10rem_1fr] border-b border-ink/80">
            <span className="label pb-2 text-[10.5px] text-ink-3">Week</span>
            <div className={`grid gap-1.5 pl-1.5 ${TRACK}`}>
              {WEEKS.map((w) => (
                <span key={w} className="relative pb-2 font-mono text-[12px] text-ink-3 tnum">
                  {w}
                  {w === '1' && (
                    <span className="label absolute -top-5 left-0 whitespace-nowrap text-[10.5px] text-seal-ink">
                      Live by end of week 1
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <Row label="Gobots" segs={GOBOTS} lead />
          <Row label="Your current vendor" note={VENDOR_NOTE} segs={VENDOR} />
        </InView>

        {/* Mobile: two ledgers, Gobots first */}
        <div className="mt-14 grid gap-10 md:hidden">
          <MobileList label="Gobots" segs={GOBOTS} />
          <MobileList label="Your current vendor" note={VENDOR_NOTE} segs={VENDOR} />
        </div>

        {/* The sprint itself: three phases, what you bring, what you get. All from content/sprint.ts. */}
        <ol className="mt-20 grid grid-cols-1 border-t border-ink/80 md:grid-cols-3">
          {SPRINT_PHASES.map((ph, i) => (
            <li
              key={ph.when}
              className={`border-b border-rule py-8 md:border-b-0 md:py-10 ${i > 0 ? 'md:border-l md:pl-8' : ''} ${i < 2 ? 'md:pr-8' : ''}`}
            >
              <p className="label text-[10.5px] text-seal-ink">{ph.when}</p>
              <h3 className="heading mt-3 text-[26px] leading-[1.1]">{ph.title}</h3>
              <ul className="mt-4 space-y-2">
                {ph.points.map((pt) => (
                  <li key={pt} className="text-[15px] leading-snug text-ink-2">
                    {pt}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-10 border-t border-ink/80 pt-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="heading text-[26px]">You bring<span className="text-seal">.</span></h3>
            <ul className="mt-4 border-t border-rule">
              {SPRINT_BRING.map((b) => (
                <li key={b} className="border-b border-rule py-3 text-[15.5px] leading-snug">
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="heading text-[26px]">You get<span className="text-seal">.</span></h3>
            <ul className="mt-4 border-t border-rule">
              {SPRINT_GET.map((g) => (
                <li key={g} className="border-b border-rule py-3 text-[15.5px] leading-snug">
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13.5px] text-ink-3">
              <Claim id="sprint.plan" label="sprint plan">Delivery model as stated by Gobots.</Claim>
            </p>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex flex-col gap-1 border-b border-ink/80 pb-3 md:flex-row md:items-baseline md:justify-between">
            <h3 className="text-[19px] font-semibold tracking-[-0.01em]">What a week-1 system can look like</h3>
            <p className="text-[13.5px] text-ink-3">Illustrative examples, not client work</p>
          </div>
          {WEEK_ONE_SYSTEMS.map((s) => (
            <div key={s.name} className="grid gap-3 border-b border-rule py-5 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-3">
                <p className="heading text-[22px]">{s.name}</p>
                <p className="text-[13px] text-ink-3">{s.type}</p>
              </div>
              <ol className="grid grid-cols-2 gap-x-4 gap-y-2 md:col-span-9 md:grid-cols-4 md:gap-0">
                {s.steps.map((step, i) => (
                  <li key={step} className="flex gap-2.5 md:pr-6">
                    <span className="font-mono text-[11.5px] leading-[1.6] text-seal-ink tnum">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[14.5px] leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div>
            <Link href="/walkthrough" className="btn-seal py-3.5">
              Start a Production Sprint
              <Arrow />
            </Link>
            <SprintCaption className="mt-2.5 max-w-[17rem] text-ink-3" />
          </div>
          <Link href="/sprint" className="link-ink inline-flex items-center gap-2 pt-3.5 text-[14.5px] font-medium">
            The sprint week by week
            <Arrow size={13} />
          </Link>
        </div>

        <p className="mt-12 max-w-3xl text-[14px] leading-relaxed text-ink-3">
          <Claim id="founder.record">
            Founder track record on prior enterprise programmes: $10M+ ROI delivered, 230+ plants
            deployed, three continents.
          </Claim>
        </p>
      </div>
    </section>
  )
}
