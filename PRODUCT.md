# Gobots: product context

## What it is
Gobots is a full-stack AI company, founder-led by Anand Parankussam (ex-IBM, UWM, Adient). It runs three engines, and a customer can start with any one:

1. **Strategy.** Senior AI architects decide what to build, and how to govern and secure it.
2. **Deploy and run.** Forward-deployed AI pods: US-led architecture with global delivery. A working system ships on the customer's workflow in week 1, and Gobots runs it in production.
3. **Products.** Gobots' own software, built on one shared agent and governance core:
   - **GoVTraceAI** (live). A gatekeeper that returns SAFE / WARNING / BLOCK on AI actions and issues Ed25519-signed, third-party-verifiable **GoVTrace Receipts**.
   - **RevXL** (launching). An AI revenue suite in industry editions.
   - **The Lumen health line** (built): CardioLumen, UroLumen and Prodrome, shaped by an anonymous medical advisory board.

The named offer is the **Production Sprint**: a working agent on the customer's own data in week 1.

## Who it is for
- Operations, technology and risk leaders who want AI in production rather than in a deck.
- Industries: mortgage, real estate, banking, finance, fintech, insurance, automotive, manufacturing, healthcare, medspa and small business.

## What the site must do
- Make one belief land: Gobots architects, ships and runs governed AI in production, and every decision leaves verifiable evidence.
- Primary action: **Start a Production Sprint** (`/walkthrough`, which feeds into Calendly).
- Secondary actions: try the live gatekeeper (`/demo`), verify a receipt (`/verify`), read the open spec (`/spec`), see the sprint week by week (`/sprint`), and score a mortgage site free on RevXL's own scan (`revxl.gobotsai.com/fundxl/audit`, linked from the Mortgage edition).

## Proof that is real
- **Live implementation clients.** Three are in production. They are never named on the site.
- **RevXL mortgage validation.** The mortgage edition is validated with Pinnacle Ventures and Coast2Coast Mortgage. The founder asked for these two to be named; they are the only firms named on the site.
- **Team experience.** The founder's career and the team's prior roles (Apple, IBM, UBS, BCBS, Nationwide, Qantas, UWM, Adient), labelled as prior roles, not clients.
- **The working proof routes.** `/demo` (engine proxy), `/verify`, and the public receipt spec and JSON schema.
- **The SDK.** The npm package `@gobotsai/govtrace`.
- **Sourced claims.** Every factual claim on the homepage is in `content/claims.ts` and shows its source.

## Tone
- Direct and contrarian, with no hype: "We don't consult. We build. We deploy. We govern."
- Claims must be defensible in front of an auditor.
- No superlatives, no staffing or consulting vocabulary, no investor numbers, no client names, no invented statistics. The copy guard (`test/banned.ts`) scans the rendered homepage, `/walkthrough`, `/llms.txt`, the site metadata and the content modules for these words; other routes and new facts still need a human read.

## Constraints
- Next.js 14 app router, Tailwind 3, deployed on Vercel. Tests run with vitest (`npm test`).
- Keep all routes, API proxies, form logic and the Calendly hand-off intact.
- Two launch flags live in `content/site.ts`. Both stay off until the founder approves them:
  - `LAUNCH.guarantee`, for the week-1 guarantee terms;
  - `LAUNCH.complianceMap`, for the framework mapping.
