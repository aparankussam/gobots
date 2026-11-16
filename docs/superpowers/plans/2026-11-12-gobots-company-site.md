# Gobots Company Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the GovTrace-led homepage into a company-first site for Gobots (strategy, forward-deployed pods, products), with sourced claims, a product register, `/guarantee` and `/llms.txt`, without breaking any existing route.

**Architecture:** All public copy that carries facts lives in two typed modules: `content/site.ts` (engines, capabilities, industries, products, figures, launch flags) and `content/claims.ts` (the claims register). Homepage sections are small server components under `components/home/`, each reading from those modules; a client `<Claim>` marker reveals a claim's source. Existing proof routes are untouched except for button labels; `/walkthrough` gets new wording only.

**Tech Stack:** Next.js 14.2.5 app router, React 18, Tailwind 3.4, TypeScript 5. New dev dependency: `vitest@2.1.9` only. Tests render components with `react-dom/server` `renderToStaticMarkup` in vitest's node environment.

**Spec:** `docs/superpowers/specs/2026-11-12-gobots-company-site-design.md`. Read it first; this plan does not repeat its reasoning.

## Global Constraints

- Work in this worktree on branch `claude/website-modern-ui-review-3a9e03`, on top of the uncommitted redesign. Never touch `main`.
- Commit steps run only once the founder has said commits are OK. If not, skip them and leave the work uncommitted. Never push.
- Design system is `DESIGN.md` ("Notarized record"): paper `#F2F2EE`, ink `#121212`, seal `#E0643A`, `seal-ink` `#B4431F` for orange text, 1px rules, 3px radius (`rounded-doc`), serif `.display`/`.heading`, `.label` never used as an eyebrow above a heading, mono only for data. No pills, glass, glows, gradient text.
- Copy rules (spec §4, §6):
  - No superlatives ("topmost", "leading", "best", "world-class").
  - No staffing or consulting vocabulary ("staffing", "staff augmentation", "consulting", "consultancy", "offshore"). The verb in "We don't consult." stays.
  - No investor information (equity, run-rate, ARR, budget, billing rates).
  - No client names anywhere (not PCP, Evolutia, CST, Caterlust). No doctors' names.
  - No claim of certification or compliance; use "supports" / "mapped to". "Board-certified" for advisors is allowed.
  - Product register never uses the word "customers".
- Product name is **GoVTraceAI**; the signed record is **GoVTrace Receipt**.
- Primary CTA label: **Start a Production Sprint**, linking to `/walkthrough`. On `/demo` and the evidence page: **Book a GoVTraceAI briefing**, linking to `/walkthrough`.
- `/walkthrough` field names, validation, `REGULATED_KEYWORDS`, priority routing, `CALENDLY_BASE` and Calendly params are byte-for-byte unchanged.
- Launch flags in `content/site.ts`: `LAUNCH = { guarantee: false, complianceMap: false }`. They stay `false` until the founder approves the guarantee terms and reviews the compliance map. Flag-off means the section renders nothing and `/guarantee` returns 404.
- No horizontal scroll at 375px on any route. `prefers-reduced-motion: reduce` disables all motion.
- Before the work is called done: `npx tsc --noEmit`, `npm test` and `npm run build` all pass.

## Review Focus

1. **A claim id missing from the register.** `<Claim>` must render nothing for that text (not the bare text), so an unsourced fact can't slip onto the page. Pinned in Task 2.
2. **Banned words creeping into copy** through a later edit, such as a client name, "staffing" or "customers". The whole rendered homepage is scanned. Pinned in Task 1 (the guard) and re-run in Task 16.
3. **The engine is down or slow when a visitor runs the homepage checker.** The checker shows a plain error line and the presets stay usable; it never hangs on "Checking". Pinned in Task 11.
4. **Oversized POST bodies to `/api/govtrace/evaluate`.** These are rejected with 413 before reaching the engine. Pinned in Task 11.
5. **Flags off.** With `LAUNCH.guarantee` false, no "guarantee" text or `/guarantee` link appears anywhere, so there are no dead links. Pinned in Task 12.

---

### Task 1: Test harness and copy guard

**Files:**
- Modify: `package.json` (add `"test": "vitest run"`, devDependency `vitest@2.1.9`)
- Create: `vitest.config.ts`
- Create: `test/setup.ts`
- Create: `test/banned.ts`
- Create: `test/home.guard.test.tsx`
- Modify: `.gitignore` (add `.superpowers/`)

**Interfaces:**
- Produces:
  - `BANNED: { label: string; pattern: RegExp }[]` and `findBanned(text: string): string[]` (returns the labels that matched) in `test/banned.ts`.
  - `renderText(el: React.ReactElement): string`, which renders to static markup and returns visible text with tags stripped.
  - Global mocks for `next/navigation` (`usePathname` returns `'/'`).

- [ ] **Step 1:** `npm i -D vitest@2.1.9`. Write `vitest.config.ts`:
  - environment `node`;
  - `esbuild: { jsx: 'automatic' }`;
  - `resolve.alias` `{ '@': <repo root> }`;
  - `setupFiles: ['test/setup.ts']`.

  `test/setup.ts` sets up two mocks:
  - `vi.mock('next/navigation', () => ({ usePathname: () => '/' }))`;
  - `vi.mock('next/image', ...)`, rendering a plain `<img>` from `src` and `alt`.
- [ ] **Step 2:** Write `test/banned.ts`. Use these patterns, case-insensitive with word boundaries:
  - `topmost`, `world-class`, `\bleading\b`, `\bbest\b`;
  - `staffing`, `staff augmentation`, `consulting`, `consultancy`, `offshore`;
  - `equity`, `run-rate`, `\bARR\b`;
  - `\bPCP\b`, `Evolutia`, `\bCST\b`, `Caterlust`;
  - `\bcompliant\b`, `certified (by|for|under|to)`.
- [ ] **Step 3: Write the failing guard test** `test/home.guard.test.tsx`:
  ```tsx
  it('homepage copy has no banned words', () => {
    expect(findBanned(renderText(<Home />))).toEqual([])
  })
  ```
- [ ] **Step 4:** Add a second test, `findBanned('we offer staffing to PCP')` equals `['staffing', 'PCP']`. This proves the guard bites even if today's copy is clean.
- [ ] **Step 5:** Run `npm test`. Expected: the second test passes. The homepage test passes too if today's copy is clean. If it fails, the output names the banned words; leave it failing, because Tasks 4–14 replace that copy and Task 16 requires it green.
- [ ] **Step 6: Commit** `chore: add vitest and homepage copy guard`.

### Task 2: Claims register and `<Claim>` marker

**Files:**
- Create: `content/claims.ts`
- Create: `components/Claim.tsx` (client)
- Test: `test/claims.test.tsx`

**Interfaces:**
- Produces:
  - `type Evidence = 'verifiable' | 'documented' | 'reference' | 'statement'`.
  - `type ClaimEntry = { evidence: Evidence; source: string; href?: string }`.
  - `CLAIMS` (object, `satisfies Record<string, ClaimEntry>`) and `type ClaimId = keyof typeof CLAIMS`.
  - `<Claim id: ClaimId; children: ReactNode; tone?: 'paper' | 'ink' />`.
  - `EVIDENCE_LABEL: Record<Evidence, string>`: `Verifiable`, `On this site`, `Reference on request`, `Company statement`.

Initial entries. Ids are fixed; the source wording may be polished.

| id | evidence | source / href |
|---|---|---|
| `fig.week1` | reference | "Delivery record across current implementation clients; references on request." |
| `fig.products` | documented | "See the product register." `#products` |
| `fig.clients` | reference | "Three enterprise implementation clients. Names withheld; references under NDA." |
| `fig.bench` | statement | "Bench capacity, as stated by Gobots." |
| `team.experience` | reference | "Prior roles held by Gobots team members. These are not Gobots clients." |
| `founder.bio` | reference | "Founder's career at IBM, UWM and Adient; details on request." |
| `founder.record` | reference | "Founder track record on prior enterprise programmes; details on request." |
| `delivery.global` | statement | "Architecture led from the US; delivery pods worldwide." |
| `receipts.signed` | verifiable | "Check any receipt's Ed25519 signature yourself." `/verify` |
| `product.govtrace` | verifiable | "Public demo, verifier and open spec." `/demo` |
| `product.revxl` | statement | "Status as stated by Gobots." |
| `product.health` | statement | "Status as stated by Gobots." |
| `advisory.physicians` | reference | "Advisors' names shared under NDA." |
| `trust.data` | statement | "Systems are deployed in the client's environment." |
| `guarantee.week1` | documented | "Full terms." `/guarantee` |

- [ ] **Step 1: Write the failing tests:**
  - every entry has a non-empty `source`;
  - every `verifiable` and `documented` entry has an `href`;
  - `renderToStaticMarkup(<Claim id="fig.products">5</Claim>)` contains `5` and a `button` with `aria-label` starting `Source:`;
  - casting an unknown id (`'nope' as ClaimId`) renders `''`.
- [ ] **Step 2:** Run `npm test -- claims`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement.**
  - `<Claim>` renders `children` followed by a small superscript ring marker (`seal-ink` on paper, `paper/70` on ink, at least a 24px hit area).
  - Clicking toggles a popover: evidence label, source sentence, and a link when `href` is set. Escape and outside-click close it.
  - Unknown id: return `null`, and `console.error` in development.
- [ ] **Step 4:** Run `npm test -- claims`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: claims register and source marker`.

### Task 3: Site content module

**Files:**
- Create: `content/site.ts`
- Test: `test/site.test.ts`

**Interfaces:**
- Produces:
  - `LAUNCH: { guarantee: boolean; complianceMap: boolean }`, both `false`.
  - `ENGINES: { n: '01'|'02'|'03'; key: 'strategy'|'deploy'|'products'; name: string; title: string; body: string; covers: string[]; firstStep: string }[]`.
  - `CAPABILITIES: { name: string; line: string; engine: 'strategy'|'deploy' }[]`.
  - `INDUSTRIES: { name: string; servedBy: string[] }[]`.
  - `type Status = 'live'|'launching'|'built'|'in-development'`.
  - `STATUS_LABEL: Record<Status,string>` and `STATUS_LEGEND: Record<Status,string>`.
  - `PRODUCTS: { name: string; line: string; status: Status; claim: ClaimId; family: 'core'|'revxl'|'health'; editions?: { names: string[]; status: Status }[] }[]`.
  - `FIGURES: { value: string; label: string; claim: ClaimId }[]`.
  - `ADVISORY: string[]`.
  - `TEAM_EXPERIENCE: string[]`.

Values come from spec §6 and §7.1:

- **`ENGINES`**: names Strategy, Deploy and run, Products. First steps: "Book an architecture briefing", "Start a Production Sprint", "Book a product briefing".
- **`CAPABILITIES`**: the 15 areas in spec §6. Strategy covers AI strategy, AI governance, AI security, cybersecurity; the rest are deploy.
- **`INDUSTRIES`**: the 11 in spec §7.1 item 10.
- **`PRODUCTS`**:
  - GoVTraceAI `live`.
  - RevXL `launching`, with editions:
    - `['Mortgage','Real estate','Medspa','Small business']` `built`;
    - `['Finance','Banking','Fintech','Automotive']` `in-development`.
  - CardioLumen, UroLumen and Prodrome `built`.
- **`STATUS_LEGEND`**: exactly the four definitions in spec §7.1 item 8.
- **`FIGURES`**: `Week 1` / "First working system"; `5` / "AI products built"; `3` / "Implementation clients in production"; `100` / "AI engineers our bench scales to".
- **`ADVISORY`**: `['Board-certified cardiologist','Board-certified urologist']`.
- **`TEAM_EXPERIENCE`**: the 8 names now in `components/TrustBar.tsx`.

- [ ] **Step 1: Write the failing tests:**
  - every `PRODUCTS[].claim` and `FIGURES[].claim` is a key of `CLAIMS`;
  - `findBanned` of `JSON.stringify` of every export is `[]`;
  - no product string matches `/customers/i`;
  - `CAPABILITIES.length === 15`;
  - `INDUSTRIES.length === 11`;
  - `LAUNCH` deep-equals `{ guarantee: false, complianceMap: false }`.
- [ ] **Step 2:** Run. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** `content/site.ts` as plain typed constants.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5: Commit** `feat: site content module`.

### Task 4: Nav, footer, sticky bar, closing CTA

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/StickyMobileCTA.tsx`
- Modify: `components/CTA.tsx`
- Test: `test/chrome.test.tsx`

**Interfaces:**
- Produces: homepage anchors the nav links to: `#products`, `#capabilities`, `#industries`. Later tasks must set these ids.

**Nav**
- Links: Products `/#products`, Capabilities `/#capabilities`, Industries `/#industries`, then a "Proof" disclosure button. Its menu holds Live demo `/demo`, Verify `/verify`, Spec `/spec` and Evidence `/evidence-gap`; it closes on Escape and outside click.
- The mobile menu lists all seven links flat.
- Button: "Start a Production Sprint". It stays hidden on `/walkthrough`.
- The side label changes from "AI execution co." to "Full-stack AI company".

**Footer**
- Tagline "Full-stack AI company".
- Links: Products, Capabilities, Industries, Live demo, Verify, Spec, Evidence, and "Start a sprint" (`/walkthrough`). Add Guarantee only when `LAUNCH.guarantee` is true.

**StickyMobileCTA:** label "Start a Production Sprint".

**CTA**
- Heading "Start with one workflow."
- Body: "Bring the workflow. In week 1 it runs in production, governed, with a signed record of every decision."
- Button: "Start a Production Sprint".
- The `dl` gains the row `First call / With your architect, not a salesperson`.

- [ ] **Step 1: Write the failing tests:**
  - `<Nav />`, `<Footer />` and `<CTA />` each contain "Start a Production Sprint" or "Start a sprint";
  - none contains "Request a walkthrough";
  - Footer has no `/guarantee` href while the flag is off.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement** the four edits.
- [ ] **Step 4:** Run `npm test -- chrome`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: nav, footer and CTAs for company site`.

### Task 5: Hero, figures band, team strip

**Files:**
- Modify: `components/Hero.tsx`
- Create: `components/home/Figures.tsx`
- Modify: `components/TrustBar.tsx` (becomes the team strip)
- Modify: `app/page.tsx`
- Test: `test/hero.test.tsx`

**Interfaces:**
- Consumes: `ENGINES`, `FIGURES`, `TEAM_EXPERIENCE` (Task 3); `<Claim>` (Task 2).

**Hero (layout A)**
- h1: "We architect, ship and run AI in production", with an orange full stop.
- Subline: "AI strategy, forward-deployed engineering pods and our own products. One company, governed from the first deploy."
- Buttons: btn-ink "Start a Production Sprint" to `/walkthrough`; btn-rule "See our products" to `#products`.
- Then an `ink/80` rule and the three engines (`label` number and name, serif title, one line). Each engine links to `#engines`.
- The Receipt is removed from the hero.
- The founder line stays, with ex-IBM, UWM and Adient wrapped in `<Claim id="founder.bio">`.

**Figures**
- `bg-ink text-paper` band with four figures (serif, about 56px desktop and 40px mobile) separated by `rule-inv`. Each value is wrapped in `<Claim tone="ink">`.
- Under them: "Implementation pods in production with three enterprise clients", ending in `<Claim id="fig.clients" tone="ink">`.
- "Architecture led from the US, delivered by pods worldwide." ends in `<Claim id="delivery.global">`.
- Grid: 2 columns at 375px, 4 at `lg`.

**TrustBar**
- Label "Where our team has delivered", with the list wrapped in `<Claim id="team.experience">`.
- A small `text-ink-3` note: "Prior roles of team members. Not Gobots clients."

**page.tsx order so far:** Hero, Figures, TrustBar.

- [ ] **Step 1: Write the failing tests:**
  - Hero text contains the h1 and "Start a Production Sprint";
  - Hero has no `Attestation of AI action` (Receipt gone);
  - Figures contains "Week 1", "5", "3" and "100", and four `Source:` buttons;
  - TrustBar contains "Not Gobots clients".
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** Run `npm test -- hero`. Expected: PASS.
- [ ] **Step 5:** `npm run dev` (or the existing `web` preview on port 3123). Check at 375px and 1280px:
  - `document.documentElement.scrollWidth === innerWidth`;
  - figures readable;
  - nav anchors present.
- [ ] **Step 6: Commit** `feat: company-first hero, figures band, team strip`.

### Task 6: Gobots vs. your current vendor

**Files:**
- Create: `components/home/VendorComparison.tsx`, built from `components/Problem.tsx`, which is then deleted
- Modify: `app/page.tsx` (after TrustBar)
- Test: `test/comparison.test.tsx`

**Content**
- Heading: "In production in week 1. Not month 6."
- Body: one or two sentences in the voice of the current Problem copy.
- Desktop: one week axis, with the **Gobots row on top**:
  - "Working system in production" (seal fill, week 1);
  - "Governed and integrated" (ink, weeks 2–4);
  - "Expanded across use cases" (outlined, 5+).
- Second row, labelled **"Your current vendor"**: Kickoff, Discovery, Requirements deck, Proposal review, then "Still planning" with the existing `Stamp id="void" tone="block" size="sm"` "NO SYSTEM".
- A thin vertical seal line at end of week 1 spans both rows, captioned "Gobots is live". This is the gap the visual points at.
- Under the vendor row: "Illustrative. Based on typical enterprise programmes."
- Mobile: two stacked lists, Gobots first.
- The footnote stays, wrapped in `<Claim id="founder.record">`.

- [ ] **Step 1: Write the failing tests:**
  - the text index of "Gobots" row label is lower than that of "Your current vendor";
  - contains "Illustrative";
  - no "Typical AI programme".
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.** Delete `components/Problem.tsx`.
- [ ] **Step 4:** Run. Expected: PASS. Browser check at 375px and 1280px: the NO SYSTEM stamp does not overlap text, and there is no horizontal scroll.
- [ ] **Step 5: Commit** `feat: Gobots vs your current vendor comparison`.

### Task 7: Three engines, three ways to start

**Files:**
- Create: `components/home/Engines.tsx`, built from `components/WhatWeBuild.tsx`, which is then deleted
- Modify: `app/page.tsx`
- Test: `test/engines.test.tsx`

**Content**
- `<section id="engines">`, heading "Three engines. Start with any one."
- Three columns from `ENGINES`. Each has a title, body, `covers` as a short list, and its `firstStep` as a `btn-rule` to `/walkthrough`.
- Under engine 02, the condensed register "What a week-1 system looks like": the existing `SYSTEMS` (Invoice Processing, Risk Guard, Approval Workflow) with their four steps, in a tighter layout.
- The old PILLARS block is dropped; its ideas now live in the engines.

- [ ] **Step 1: Write the failing tests:**
  - three `href="/walkthrough"` links with the three `firstStep` labels;
  - contains "Invoice Processing".
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.** Delete `WhatWeBuild.tsx`.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5: Commit** `feat: three engines section`.

### Task 8: Capabilities bento

**Files:**
- Create: `components/home/Capabilities.tsx`
- Modify: `app/page.tsx`
- Test: `test/capabilities.test.tsx`

**Content**
- `<section id="capabilities">`, heading "What we build and run."
- A bento grid of `CAPABILITIES`, made of ruled cells, not cards with shadows.
- Two larger cells: "Agentic and multi-agent systems" and "AI governance". Their exact cell spans are the builder's call.
- Each cell: name, plus a mono engine tag (`strategy` or `deploy`) and its one line.
- At 375px it collapses to one column.
- No claim markers (spec §7.3).

- [ ] **Step 1: Write the failing test:** renders 15 cell names and no `Source:` buttons.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5: Commit** `feat: capabilities bento`.

### Task 9: Product register and medical advisory board

**Files:**
- Create: `components/home/Products.tsx`
- Create: `components/doc/Redaction.tsx`
- Modify: `app/page.tsx`
- Test: `test/products.test.tsx`

**Interfaces:**
- Produces: `<Redaction lines={number} />`, which draws ink bars of varied deterministic widths with `aria-hidden`, plus visible text "Briefing on request".

**Content**
- `<section id="products">`, heading "Products, built on one core."
- A "Gobots Core" base row: "Shared agent and governance stack. Every product starts mostly built."
- Product rows from `PRODUCTS`, grouped core / revxl / health. Each row shows name (serif), line, a status `Stamp` (tone `safe` for live, `seal` for launching, `ink` otherwise, size `sm`) wrapped in `<Claim id={p.claim}>`, and one `<Redaction lines={2} />`.
- RevXL lists its editions with the editions' status.
- GoVTraceAI links "See it run" to `/demo`.
- Status legend from `STATUS_LEGEND`, as a ruled `dl`.
- Health group footer, "Built with physicians": the `ADVISORY` entries, wrapped in `<Claim id="advisory.physicians">`.

- [ ] **Step 1: Write the failing tests:**
  - contains all five product names and the eight edition names;
  - four legend terms;
  - "Built with physicians" and "Board-certified cardiologist";
  - `/customers/i` absent;
  - "Briefing on request" appears once per product row.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** Run. Expected: PASS. Browser check that redaction bars don't overflow at 375px.
- [ ] **Step 5: Commit** `feat: product register and advisory board`.

### Task 10: Industries

**Files:**
- Create: `components/home/Industries.tsx`
- Modify: `app/page.tsx`
- Test: `test/industries.test.tsx`

**Content**
- `<section id="industries">`, heading "Where we work."
- A ruled list of the 11 `INDUSTRIES`, each with `servedBy` as quiet mono tags (for example `RevXL · Mortgage`, `Deploy and run`, `Lumen`).
- No e-commerce.

- [ ] **Step 1: Write the failing tests:**
  - 11 names;
  - no `/e-?commerce/i`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5: Commit** `feat: industries section`.

### Task 11: Proof — run trace in view, homepage checker, proxy cap

**Files:**
- Modify: `components/LiveProof.tsx`
- Modify: `components/doc/Receipt.tsx`
- Modify: `app/globals.css`
- Create: `components/home/InView.tsx` (client)
- Create: `components/home/HomeChecker.tsx` (client)
- Create: `lib/verdict.ts`
- Create: `lib/check.ts`
- Modify: `app/api/govtrace/evaluate/route.ts`
- Test: `test/verdict.test.ts`
- Test: `test/evaluate-route.test.ts`
- Test: `test/checker.test.tsx`

**Interfaces:**
- Produces:
  - `toVerdict(code: string | undefined): 'SAFE' | 'WARNING' | 'BLOCK' | 'UNKNOWN'`, mapping `SAFE`→SAFE, `NEEDS_REVIEW`→WARNING, `STOP`→BLOCK, anything else → UNKNOWN.
  - `MAX_BODY_BYTES = 8192`, exported from the route file.
  - `runCheck(text: string, profile: 'Finance'|'General', opts?: { fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<CheckResult>` in `lib/check.ts`, where:
    - `CheckResult = { kind: 'done'; verdict: ReturnType<typeof toVerdict>; reason?: string; runId?: string } | { kind: 'error' }`;
    - `timeoutMs` defaults to `10000`;
    - it never throws: a rejection, a timeout or a non-2xx response all return `{ kind: 'error' }`.
  - `<InView className?>`, which adds `is-inview` to its div once the element is 25% visible (IntersectionObserver, then disconnects).

**Receipt:** retitle the header "Agent run trace". Keep fields and seal.

**globals.css:** `.sig-step` and `.seal-stamp` animations apply only under `.is-inview` (inside the existing `prefers-reduced-motion: no-preference` block). Content stays visible without the class.

**LiveProof order**
1. Heading and body (existing), with "signs the result" wrapped in `<Claim id="receipts.signed">`.
2. Two columns: `<InView><Receipt /></InView>` and `<HomeChecker />`.
3. The existing three specimens.
4. The evidence index. Change the `/demo` note "Paste any prompt, get a verdict" to "Run a scenario, get a signed verdict".

**HomeChecker**
- Three preset buttons using the three `SPECIMENS` prompts, with profile `Finance`, `Finance` and `General`.
- "Run check" calls `runCheck`, which posts `{ text, profile }` to `/api/govtrace/evaluate` with an `AbortController` timeout.
- States:
  - idle;
  - checking ("Checking…");
  - done: `Stamp` from `toVerdict`, `reason_line`, `run_id` in mono, and "See the full signed record" to `/demo`;
  - error: "The engine didn't answer. Try again, or run it on the demo page." with a link to `/demo`.
- No free-text input.

**Route:** before forwarding, read `await req.text()`. If `Buffer.byteLength > MAX_BODY_BYTES`, return 413 `{ error: 'too_large', message: 'Request body is too large.' }`. Then `JSON.parse` with the existing 400 path. Forwarding is otherwise unchanged.

- [ ] **Step 1: Write the failing tests:**
  - `toVerdict` covers all four branches.
  - Route: `POST(new Request(url, { method: 'POST', body: 'x'.repeat(8193) }))` returns status 413, and `fetch` (stubbed with `vi.stubGlobal`) is not called.
  - Route: a valid 50-byte JSON body calls the stub once with `${ENGINE_URL}/audit`.
  - Route: invalid JSON returns 400.
  - `runCheck` with a `fetchImpl` that rejects returns `{ kind: 'error' }`.
  - `runCheck` with a `fetchImpl` that never resolves and `timeoutMs: 50` returns `{ kind: 'error' }`.
  - `runCheck` with a `fetchImpl` returning 502 returns `{ kind: 'error' }`.
  - `runCheck` with a `fetchImpl` returning `{ verdict_code: 'STOP', run_id: 'r1' }` returns `{ kind: 'done', verdict: 'BLOCK', runId: 'r1' }`.
  - Checker static render shows three preset buttons and no `textarea` or `input[type=text]`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement** all of the above.
- [ ] **Step 4:** Run `npm test`. Expected: these tests pass.
- [ ] **Step 5: Browser check on the dev server:**
  - run each preset and see a stamp;
  - stop the network (DevTools offline) and see the error line within 10s;
  - the receipt animates only when scrolled into view;
  - with reduced motion emulated, there is no animation.
- [ ] **Step 6: Commit** `feat: run trace, homepage checker, evaluate body cap`.

### Task 12: Week-1 guarantee (flagged off)

**Files:**
- Create: `content/guarantee.ts`
- Create: `components/home/Guarantee.tsx`
- Create: `app/guarantee/page.tsx`
- Modify: `app/page.tsx`
- Test: `test/guarantee.test.tsx`

**Interfaces:**
- Produces: `GUARANTEE: { promise: string; conditions: string[] }`, with the draft terms copied verbatim from spec §10.

**Homepage block:** a short sealed certificate: the promise, `<Claim id="guarantee.week1">`, and "Read the terms" to `/guarantee`. It returns `null` when `LAUNCH.guarantee` is false.

**`/guarantee` page**
- Calls `notFound()` when the flag is off.
- Otherwise renders a printable certificate: Guilloche band, Seal, promise, numbered conditions, and "Terms reviewed [date]" left as a visible TODO line for the founder.
- `metadata.title`: "Week-1 guarantee · Gobots".

- [ ] **Step 1: Write the failing tests:**
  - with the flag off, `<Guarantee />` renders `''`;
  - the certificate component (export `GuaranteeCertificate`) contains `GUARANTEE.promise`;
  - `renderText(<Home />)` has no `/guarantee/i` while the flag is off.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** Run. Expected: PASS. `curl -s -o /dev/null -w '%{http_code}' localhost:3123/guarantee` prints `404`.
- [ ] **Step 5: Commit** `feat: week-1 guarantee behind launch flag`.

### Task 13: Trust section

**Files:**
- Create: `components/home/Trust.tsx`
- Create: `content/compliance.ts`
- Modify: `app/page.tsx`
- Test: `test/trust.test.tsx`

**Interfaces:**
- Produces: `COMPLIANCE: { capability: string; supports: { framework: 'EU AI Act'|'NIST AI RMF'|'ISO/IEC 42001'|'HIPAA'|'SOC 2'; theme: string }[] }[]`, with capabilities and themes as listed in spec §7.1 item 13.

**Content**
- Heading "Built to be trusted."
- Part 1, always on: "Your data stays in your environment.", wrapped in `<Claim id="trust.data">`, plus one sentence.
- Part 2, the compliance map: renders only when `LAUNCH.complianceMap` is true. It is a ruled matrix with column heads for the frameworks, the word "supports" in cells, and the line "Not a certification or legal advice."
- Part 3, the stack strip: not built (spec §10: no list supplied).

- [ ] **Step 1: Write the failing tests:**
  - with the flag off, there is no "EU AI Act" text;
  - "Your data stays in your environment" is present;
  - a direct render of the exported `ComplianceMap` contains "Not a certification or legal advice" and no `/\bcompliant\b/i`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5: Commit** `feat: trust section with flagged compliance map`.

### Task 14: The Gobots Method, founder note, company record

**Files:**
- Modify: `components/POV.tsx` (rename to `components/home/Method.tsx`)
- Create: `components/home/CompanyRecord.tsx`
- Modify: `app/page.tsx`
- Test: `test/method.test.tsx`

**Content**
- Heading "The Gobots Method." The four statements stay.
- The founder note stays. Add "Meet your architect, not a salesperson." as its closing line.
- `CompanyRecord`: the slip from hero mockup B, with rows:
  - Practice: AI strategy · governance · security
  - Delivery: Forward-deployed AI pods · week-1 systems
  - Products: RevXL · GoVTraceAI · Lumen health line
  - In production: Three enterprise implementation clients
  - Advisory: Board-certified physicians

  It sits beside the founder note on `lg`, below it on mobile, and includes the Seal (unique id `record-seal`).

- [ ] **Step 1: Write the failing tests:**
  - contains "The Gobots Method", "Meet your architect, not a salesperson" and "Company record";
  - no client names (covered by `findBanned`).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.** Delete `POV.tsx` after moving it.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5: Commit** `feat: Gobots Method and company record`.

### Task 15: Walkthrough wording, demo and evidence-page buttons

**Files:**
- Modify: `app/walkthrough/WalkthroughClient.tsx` (display strings only)
- Modify: `app/walkthrough/page.tsx`
- Modify: `app/demo/DemoClient.tsx:345-353`
- Modify: `public/evidence-gap.html:312,664,689`
- Test: `test/walkthrough.test.tsx`

**Exact wording**
- `metadata.title`: "Start a Production Sprint · Gobots".
- `metadata.description`: "Tell us the workflow. Talk to an architect. In week 1 it runs in production, governed."
- h1: "Bring the workflow you want running", with an orange full stop.
- Subline: "30 minutes with an architect, not a salesperson. Strategy, a Production Sprint or a product briefing, whichever fits."
- Slip title: "Sprint request". Confirmation slip label: "Sprint request".
- Company placeholder: "Acme Corp · Head of Operations".
- Scenario hint: "Invoice intake. Loan document review. Patient messaging. Release testing. The workflow that matters most."
- `AGENDA`:
  1. "Your workflow, in your words."
  2. "What week 1 would ship, and how it is governed."
  3. "A live GoVTraceAI check on an example from your domain."
  4. "Which engine fits: strategy, a sprint pod or a product."
- Demo closing heading: "Want this on your workflow?" Button: "Book a GoVTraceAI briefing".
- Evidence page: lines 312 and 664 read "Book a GoVTraceAI briefing". Line 689's footer link reads "Start a sprint".

- [ ] **Step 1: Write the failing tests:**
  - `WalkthroughClient` static render contains the new h1 and "Acme Corp", and no "Sharp HealthCare";
  - a source-text assertion: `readFileSync` of `WalkthroughClient.tsx` still contains the original `CALENDLY_BASE` line, the full `REGULATED_KEYWORDS` array text and `FIELD_ORDER`;
  - `public/evidence-gap.html` has no "Request a Walkthrough".
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement** the string edits only.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Browser: submit the form with a corporate email and the word "mortgage". The confirmation shows PRIORITY, and the Calendly URL contains `a1`, `a2` and `primary_color=e0643a`.
- [ ] **Step 6: Commit** `feat: sprint wording on walkthrough, demo and evidence page`.

### Task 16: llms.txt, page order, docs, final verification

**Files:**
- Create: `app/llms.txt/route.ts`
- Modify: `app/page.tsx`
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`
- Modify: `test/home.guard.test.tsx`
- Test: `test/llms.test.ts`

**Interfaces:**
- Produces: `GET(): Response` with `content-type: text/plain; charset=utf-8`, built from `content/site.ts`.

**llms.txt content**
- `# Gobots`
- A one-line company description.
- `## Engines`, `## Products` (with status labels) and `## Industries`.
- `## Proof`, with absolute URLs `https://www.gobotsai.com/demo`, `/verify`, `/spec`, `/evidence-gap` and the npm package.
- `## Contact`: `/walkthrough`.

**Final `app/page.tsx` order**
1. Nav
2. Hero
3. Figures
4. TrustBar
5. VendorComparison
6. Engines
7. Capabilities
8. Products
9. Industries
10. LiveProof
11. Guarantee
12. Trust
13. Method
14. CTA
15. Footer

Industries comes before Proof, as in spec §7.1.

**Docs**
- `PRODUCT.md`: rewrite "What it is", "Who it is for" and "Proof that is real" for the company positioning.
- `DESIGN.md`: add `Claim`, `Redaction`, `InView` and the bento rule to the components list. Motion now plays on entering view.

- [ ] **Step 1: Write the failing test:**
  - `GET()` returns status 200 with text containing "GoVTraceAI", "RevXL", "Production Sprint" and "https://www.gobotsai.com/demo";
  - `findBanned(text)` is `[]`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement** the route, the final page order and the docs. If Task 1 used `it.fails`, flip it back to `it`.
- [ ] **Step 4:** Run `npm test`. Expected: all PASS, including the homepage guard.
- [ ] **Step 5:** Run `npx tsc --noEmit`, then `npm run build`. Expected: both succeed, and the build lists `/guarantee` and `/llms.txt`. Afterwards delete `.next` and restart the dev server, because the build overwrites it.
- [ ] **Step 6: Browser pass on the dev server.** For `/`, `/demo`, `/verify`, `/spec`, `/evidence-gap` and `/walkthrough` at 375px and 1280px:
  - `scrollWidth === innerWidth`;
  - no console errors;
  - nav anchors scroll to their sections;
  - each claim marker opens and closes with the keyboard.
  - Take one desktop and one mobile screenshot of `/` for the founder.
- [ ] **Step 7: Commit** `feat: llms.txt, final homepage order, docs`.
