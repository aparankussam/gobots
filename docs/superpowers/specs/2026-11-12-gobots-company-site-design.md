# Gobots company site: design

Date: 2026-11-12
Status: draft for founder approval. Nothing in this document is built yet.

## 1. Intent

The current redesign (uncommitted, in this worktree) presents Gobots mainly through one product, GoVTraceAI. Gobots is now a broader AI company. The site must present it as one company that does four things: sets AI strategy, implements and runs AI systems, supplies AI engineers, and builds its own products that customers use.

It must not read as a staffing agency or a consultancy. It should feel like a current Bay Area AI company: restrained, confident, specific, with proof behind every claim. The founder's reference points are Apple and Tesla for polish, and Palantir, Sierra, Harvey, Abridge, Linear and Anthropic for how leading AI companies present themselves.

Why now: a partnership raise is under way, three clients are live, and five products are built. The site is the first thing a customer, partner or investor checks.

## 2. Goals

1. A first-time visitor understands within one screen that Gobots is a full-stack AI company: strategy, build and run, products.
2. Staffing and managed services appear as "forward-deployed AI pods", never in staffing or consulting language.
3. The product range is visible and impressive, while product internals stay private.
4. Every claim on the site is backed by evidence the visitor can open.
5. Nothing valuable from the current redesign or the production site is lost (see section 9).
6. The primary action is unchanged in mechanics: the `/walkthrough` form, then Calendly.

## 3. Non-goals (this release)

These are agreed ideas that are deliberately left for later. The build should not block them.

- "Ask Gobots" site agent, the workflow scoper, and the live trust ledger.
- Per-industry pages and comparison pages (vs. Big-4, vs. staffing agency, vs. in-house).
- Deployment logs, public shipping log, careers page, early-access lists.
- Monthly live deploy sessions, hero film, role switch (CIO / COO / practice owner).
- An MCP endpoint for buyers' AI assistants.
- Published Sprint pricing.

## 4. Anti-goals

The release fails, even if it works technically, if any of these appear:

- Superlatives such as "topmost", "leading", "best" or "world-class". Standing comes from specifics.
- Staffing or consulting vocabulary: "staffing", "staff augmentation", "consulting", "resources", "offshore", rates.
- Investor information: equity, revenue targets, budget, billing rates, funnel assumptions.
- Product internals: architecture, prompts, feature lists beyond a one-line outcome.
- Invented statistics, invented clients, client logos (names in text only), or doctors' names.
- Any claim of certification or compliance. The wording is "supports" or "mapped to".
- A generic dark AI-template look, gradient text, glass, glows, pills.
- A product described as serving customers when it is not yet.

## 5. Decisions made by the founder

- Reposition as described in section 1.
- **Exception (added 2026-11-12):** the RevXL mortgage edition names two firms that validated it, Pinnacle Ventures and Coast2Coast Mortgage, at the founder's request. The product section uses sealed product records and a RevXL edition switcher in place of the redaction bars.
- **No client is named on the site.** The three live clients are all implementation (pod) clients; none is a product customer. They appear only as a count. (Supersedes the earlier OK to name PCP, Evolutia and CST.)
- Medical advisory board members stay anonymous for now and appear by specialty only.
- Finance, banking, fintech and automotive offerings all sit inside **RevXL** as editions.
- "Planning is not progress" is replaced. Gobots comes first, and the comparison row is labelled as the visitor's current vendor rather than "Typical AI programme".
- No superlatives without proof.
- Gobots will publicly stand behind a **week-1 guarantee**.
- Product status labels must be honest.
- All ideas in sections 6 to 8 were agreed in principle. The split between this release and later was proposed by Claude and not objected to.

Assumed, not yet confirmed by the founder:

- E-commerce work and the client Caterlust stay off the site.

## 6. Positioning and language

**Company line:** Gobots is a full-stack AI company. It architects, ships and runs AI in production, and builds its own products on the same core.

**Three engines.** A customer can start with any one.

| Engine | What it is | Covers |
|---|---|---|
| 01 Strategy | Senior AI architects decide what to build and how to govern and secure it | AI strategy, AI governance, AI security, cybersecurity |
| 02 Deploy and run | Forward-deployed AI pods. US-led architecture, global delivery. A working system in week 1, then Gobots runs it in production | Agentic and multi-agent systems, GenAI apps, RAG and enterprise knowledge, RPA and intelligent automation, document intelligence, voice agents, QA automation, release engineering, MLOps and LLMOps, data engineering, AI red-teaming and evals |
| 03 Products | Gobots' own software, built on one shared agent and governance core ("Gobots Core") | RevXL, GoVTraceAI, the healthcare line |

**Named offer:** "Production Sprint": a working agent on the customer's own data in week 1. "Start a Production Sprint" replaces "Request a walkthrough" as the primary call to action in the nav, the homepage, the footer and the sticky mobile bar. The closing buttons on `/demo` and the evidence page become "Book a GoVTraceAI briefing", since those visitors came for the product. All of them link to `/walkthrough`. *(Claude's call.)*

**Product naming.** The site keeps its existing spelling: **GoVTraceAI** for the product and **GoVTrace Receipt** for the signed record. The partnership deck writes "GovTrace"; the site is not renamed in this release. *(Claude's call, so the proof routes stay untouched.)*

**Vocabulary.** Current terms are used in labels and capability names: agentic, forward-deployed engineers (FDE), evals, guardrails, AgentOps, MCP, context engineering, human-in-the-loop, model-agnostic. Headlines and body copy stay in plain English. One term per line at most.

**Copy rule.** New copy may be written for the new positioning. Existing claims may be trimmed and restructured. No new factual claim is added unless it is in section 8 or supplied by the founder.

## 7. The site in this release

### 7.1 Homepage, in order

Each section carries one idea. Section anchors are given where the nav needs them.

1. **Nav.** Products (`#products`), Capabilities (`#capabilities`), Industries (`#industries`), Proof (a small menu: Live demo `/demo`, Verify `/verify`, Spec `/spec`, Evidence `/evidence-gap`). Primary button: "Start a Production Sprint", linking to `/walkthrough`.
2. **Hero.** Company-first, layout A from the mockups: one large statement, a short subline, two buttons, then the three engines on a ruled row. Working headline: "We architect, ship and run AI in production." The receipt is no longer in the hero. *(Layout choice is Claude's call; the founder said the mockups look good but did not pick one.)*
3. **Figures band and client strip.** Four figures: Week 1 (first working system), 5 (AI products built), 3 (implementation clients in production), 100 (AI engineers the bench scales to). Then a line "Implementation pods in production with three enterprise clients", with no names. This band may be the one ink-black section near the top of the page.
4. **Team experience strip.** The existing list (Apple, IBM, UBS, BCBS, Nationwide, Qantas, UWM, Adient), relabelled "Where our team has delivered", with a small note that these are team members' prior experience and not Gobots clients.
5. **Gobots vs. your current vendor.** Replaces "Planning is not progress". One week axis, two rows, Gobots on top.
   - Gobots: week 1, working system in production; weeks 2 to 4, governed and integrated; week 5 onward, expanded across use cases.
   - "Your current vendor": kickoff, discovery, requirements deck, proposal review, still planning, with the existing "NO SYSTEM" stamp.
   - The gap between the rows is the visual point. The heading must state it plainly, for example "In production in week 1. Not month 6."
   - The vendor row is marked as illustrative. The founder track-record footnote stays.
6. **Three engines, three ways to start.** Replaces "Real systems, not prototypes". Each engine gets a short description and one first step: Strategy, an architecture briefing; Deploy and run, a Production Sprint; Products, a product briefing. All three lead to `/walkthrough`. The three example systems from the current section (Invoice Processing, Risk Guard, Approval Workflow) are kept, condensed, under engine 02 as "what a week-1 system looks like".
7. **Capabilities** (`#capabilities`). A bento grid of the practice areas listed in section 6. Names only, with one line each at most.
8. **Product register** (`#products`). "Gobots Core" shown as the shared base, then:

   | Product | Public line | Status |
   |---|---|---|
   | GoVTraceAI | Checks AI output for PII, prompt injection and overclaims, and issues a verifiable receipt for every run | Live |
   | RevXL | AI revenue suite for growth-focused businesses, in industry editions | Launching |
   | RevXL editions | Mortgage, real estate, medspa, small business | Built |
   | RevXL editions | Finance, banking, fintech, automotive | In development |
   | CardioLumen | AI product for cardiology practices | Built |
   | UroLumen | AI product for urology practices | Built |
   | Prodrome | Healthcare AI product for specialty care | Built |

   The register uses four statuses and shows a legend for them:
   - **Live**: anyone can use it today. For GoVTraceAI this means the public demo, verifier and open spec.
   - **Launching**: built, and now going to market.
   - **Built**: complete, not yet released.
   - **In development**: being built.

   No status says or implies that a product has customers. The three live clients are implementation clients, not product customers, and the register never uses the word "customers".

   Each entry shows name, public line and status. Further detail is drawn as redacted bars with "Briefing on request". The redaction is a motif, used once per product, not a gimmick repeated across the page. GoVTraceAI links to the proof routes. Statuses above are defaults taken from the partnership deck and must be confirmed (section 10).
9. **Medical advisory board.** Sits with the healthcare products. Anonymous entries by specialty, for example "Board-certified cardiologist". Framed as "built with physicians".
10. **Industries** (`#industries`). Mortgage, real estate, banking, finance, fintech, insurance, automotive, manufacturing, healthcare, medspa, small business. Each shows which engine or product serves it.
11. **Proof** (`#live-proof`). "Every decision leaves a receipt." Contains:
    - the existing receipt, now presented as an agent run trace: checks ink in one after another, then the seal stamps;
    - a native live checker on the homepage that calls the existing `/api/govtrace/evaluate` proxy and prints a stamped result (the production site has an inline checker; the redesign dropped it, and this restores it). It offers preset examples only, the same kind `/demo` already sends. Free-text input is added only if the founder confirms the engine does not store submitted text (section 10); in that case it carries a note not to paste real personal data, and a length cap of about 2,000 characters enforced in the page and in the proxy;
    - the three verdict specimens and the evidence index.
12. **Week-1 guarantee.** A short sealed certificate block linking to `/guarantee`.
13. **Trust.** Three parts: "Your data stays in your environment"; a compliance map; a model-agnostic stack strip.
    - Compliance map: real GoVTraceAI capabilities (PII detection, prompt-injection guard, overclaim check, signed receipts and audit trail, named policy digest, third-party verification) set against framework themes (record-keeping, transparency, human oversight, risk management, data protection) for the EU AI Act, NIST AI RMF, ISO/IEC 42001, HIPAA and SOC 2. Wording is "supports". It carries a line that it is not a certification or legal advice. The founder reviews this content before it is published.
    - Stack strip ships only when the founder supplies the list.
14. **The Gobots Method and founder note.** The existing contrarian quotes, retitled as the method. The founder note stays. A sealed "company record" slip (layout B from the mockups) sits here as the about block. Adds the line "Meet your architect, not a salesperson."
15. **Call to action.** "Start a Production Sprint", with the existing details list.
16. **Footer.** Existing footer, with links updated to match the nav.

### 7.2 New routes

- `/guarantee`: the week-1 guarantee as a sealed, signed-looking certificate with its full terms. Printable.
- `/llms.txt`: a plain-text description of the company, engines, products and proof links, for AI assistants.

### 7.3 Sourced claims

Every factual claim on the homepage and on `/guarantee` has an entry in one claims register in the codebase, and the page shows its source on click or tap. A claim without an entry is not rendered.

What counts as a claim: names, numbers, product statuses, credentials and promises. That includes "built with physicians", the advisory board specialties, "Your data stays in your environment" and "US-led architecture, global delivery". Capability and industry lists are offers, not claims, and carry no source marker. The comparison's vendor row is labelled illustrative instead. The other routes are not retrofitted in this release. *(Boundary is Claude's call. Expect roughly fifteen markers on the homepage, drawn quietly.)*

Each entry has an evidence type:

- **Verifiable**: links to something the visitor can check now (`/demo`, `/verify`, `/spec`, the npm package).
- **Documented**: links to a page on the site (`/guarantee`, the product register).
- **Reference**: available on request or under NDA (client references, founder track record).
- **Company statement**: Gobots' own statement, labelled as such (for example bench capacity).

Initial entries: the four figures, the three client names, the team experience list, the founder track record, the week-1 promise, signed receipts.

### 7.4 Unchanged

`/demo`, `/verify`, `/spec` and `/evidence-gap` keep their behaviour. They change only where the nav, button label or footer changes.

`/walkthrough` keeps its fields, validation, priority routing and Calendly hand-off exactly as they are. Its display copy is rewritten, because every primary button and all three engine first steps now land there and the page currently reads as a GoVTraceAI compliance pitch. The new copy serves all three first steps (architecture briefing, Production Sprint, product briefing), uses general rather than healthcare-only hints, and replaces the placeholder that names a real organisation with a generic one. The page title and the confirmation slip are reworded to match. *(Claude's call.)*

The evaluate proxy keeps its behaviour. A request-size cap may be added to it.

## 8. Facts the site may state

From the partnership deck and the founder:

- Founder: Anand Parankussam; enterprise AI and automation leader; ex-IBM, UWM, Adient.
- Team experience across Apple, IBM, UBS, BCBS, Nationwide, Qantas, UWM, Adient.
- Delivery model: working system in week 1, governed and integrated by week 4, then expanded.
- Five products built; three implementation clients live (unnamed); bench can scale to 100 AI engineers.
- Systems are deployed in the client's environment.
- Products share one agent and governance core.
- Existing site claims (founder track record, receipts, spec, npm package).

## 9. What is kept

- The "Notarized record" design system in `DESIGN.md`: paper, ink, hairline rules, seal orange, serif display, the document components.
- The signed receipt, seal and stamp components, and the one authored motion moment (it moves with the receipt to the Proof section and plays once when it enters view).
- `/demo`, `/verify`, `/spec`, `/evidence-gap`, `/walkthrough`.
- The week-1 promise, the founder note, the contrarian quotes, the evidence index.

## 10. Content needed from the founder

| Item | Used in | If not supplied |
|---|---|---|
| Guarantee terms (approval of the draft below) | `/guarantee`, section 12 | Guarantee block and route do not ship |
| One line on each client | Client strip, sourced claims | "AI implementation with a Gobots pod" |
| Status of each product and RevXL edition | Product register | Defaults in section 7.1 |
| Final list of RevXL editions | Product register, industries | Defaults in section 7.1 |
| Models and clouds Gobots builds on | Stack strip | Strip does not ship |
| Advisory board specialties | Advisory board | Cardiology and urology only |
| Founder portrait | Founder note | Text only |
| Review of the compliance map | Trust | Map does not ship |
| Confirmation that e-commerce and Caterlust stay off | Industries, clients | They stay off |
| Whether the GoVTraceAI engine stores text submitted to the checker (founder does not know) | Homepage live checker, privacy note | Presets only; no free-text input. Free text is out of this release until someone confirms |

**Draft guarantee terms, for approval:** "If a working system is not running on your workflow by the end of week 1 of a Production Sprint, the sprint is free." Conditions: the sprint brief, signed by both sides before kickoff, defines the workflow and what "working" means; the customer provides access to the needed data and tools and a named owner by day 1. This wording should have a legal read before it is published.

## 11. Constraints

- Next.js 14 app router, Tailwind 3, TypeScript, deployed on Vercel. No new framework.
- The current redesign is uncommitted in this worktree; this work builds on it.
- No horizontal scroll at 375px on any route. Reduced-motion preference is respected.
- Typecheck and the real production build pass before anything is pushed.
- `PRODUCT.md` and `DESIGN.md` are updated to match the new positioning and any new components.
- Commits and pushes happen only when the founder asks.

## 12. Left to the builder

- Exact layout, spacing and component breakdown of each new section, within `DESIGN.md`.
- The bento arrangement, the comparison visual's drawing, and how redaction is drawn.
- How a claim's source is revealed (popover, footnote or drawer) and the shape of the claims register.
- Whether `/walkthrough` links carry a preselected interest. Only if it needs no change to form logic.
- Final copy polish within the rules in sections 4 and 6.
- File organisation and which existing components are edited or replaced.

## 13. Done means

- Every section in 7.1 exists in the stated order, with the fallbacks in section 10 applied where content is missing.
- No anti-goal in section 4 appears anywhere on the site.
- Every claim, as defined in 7.3, opens a source.
- All existing routes and flows behave as before; `/walkthrough` differs only in its wording.
- Typecheck and production build pass; no horizontal scroll at 375px.
