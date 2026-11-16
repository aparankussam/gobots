# Gobots site, round 2: the path to signing up

Date: 2026-11-12
Status: draft for founder approval. Nothing in this document is built yet.
Builds on: `2026-11-12-gobots-company-site-design.md` (round 1). Where the two disagree, this document wins once approved.

## 1. Why this round

Round 1 made the site look and read like a serious AI company. The founder's goal for round 2: the site should feel elite, and a customer should "just sign up".

Ten independent reviewers assessed that goal:
- three walked the site as buyers (sign-up path, clarity of the offer, trust and proof);
- four studied elite firms and benchmark sites: Palantir, Distyl, Ode, HatchWorks, RTS Labs, Sierra, McKinsey QuantumBlack, BCG X, Thoughtworks, Faculty, Linear, Stripe, Vercel, Ramp, Credo AI, Openlayer, Lakera, LeadPops and BankingBridge;
- one merged the findings into a ranked list;
- two skeptics stress-tested that list, one for honesty and feasibility and one for whether each change wins sign-ups.

The reviewers read the source code; the dev server did not answer their requests. The rendered site was checked by Claude in the browser throughout round 1.

## 2. The verdict

**Where Gobots is ahead.** None of the firms studied has a live engine check, a public receipt verifier, an open spec, or a source marker on every claim. The named, time-boxed offer and the free 90-second mortgage scan are also rare. Honest proof is the site's edge and should stay the centre of it.

**Where Gobots is behind.** The path to signing up:

1. The main button says "Start a Production Sprint" but books a 20-minute call. The label over-asks and the page under-explains.
2. The form on `/walkthrough` sends nothing to Gobots unless the visitor also finishes the calendar step, yet it shows a stamped "Request received".
3. No commercial shape anywhere: no fee model, no team, no definition of when "week 1" starts.
4. The two actions that need no call (the live check and the free mortgage scan) sit seven to nine sections down.
5. The homepage contradicts `/sprint`: it says "governed from the first deploy", while `/sprint` puts the governance controls in weeks 2–4. For a company selling auditor-grade claims, this is the most damaging finding.
6. No privacy policy, legal entity or security facts, although the form collects personal data.
7. Several claims a sceptical buyer will discount: "100 AI engineers" beside "3 clients", an invented "47-slide PowerPoint", and a simulated "signature valid" on the evidence page.

**The decision.** Add no new persuasion sections. Fix the truth and the path first, shorten the homepage, then publish the terms and the diligence layer as the founder supplies the facts.

**An honest limit.** No elite services firm has true self-serve sign-up; all of them end in a form or a call. For Gobots, "just sign up" means three things:
- the two no-call actions are the first thing a visitor can do;
- the call is small, clearly described and safe to book;
- the request is never lost.

## 3. Goals

1. A visitor can take a real action without a call within the first screen and a half.
2. Every statement about week 1 is the same on every page and in link previews.
3. The primary button says what it costs the visitor: a 20-minute call.
4. No request is lost between the form and the calendar. (Met only when B3 ships; Phase A stops the page claiming otherwise.)
5. The homepage drops from twelve sections to eight.
6. Nothing on the site is simulated, invented or unverifiable without saying so.

## 4. Non-goals

- Customer logo bars, analyst badges, testimonial walls or usage counters. Gobots does not have them, and inventing them breaks its own rules.
- Third-party statistics for urgency.
- A public claims register page and a "recently shipped" ledger. Deferred until the weakest claims have better evidence.
- A governance self-assessment quiz, a technology-radar publication, and industry depth pages other than mortgage.
- Email capture for unbuilt RevXL editions.

## 5. Phase A: build now, no new facts needed

These need only the founder's approval of this document, plus the decisions in section 7 where marked.

### A1. One true week-1 sequence (highest priority)

The conservative wording, which matches `content/sprint.ts`: **"A working system on your workflow in week 1. Governed, integrated and receipted by week 4."**

Replace every stronger version:
- Hero subline ("governed from the first deploy").
- Closing section ("In week 1 it runs in production, governed, with a signed record of every decision").
- The Method quote "Both ship on day one" and the founder-record footnote "governance on from day one".
- `content/meta.ts` (title, descriptions) and `public/og-image.svg`, so link previews agree.
- `content/site.ts`: the AI governance capability line ("built in from the first deploy").
- `content/sprint.ts`: the `SPRINT_GET` line "Governance built in, not bolted on afterwards".
- `components/home/VendorComparison.tsx`: the heading "In production in week 1. Not month 6" becomes "Working in week 1. Not month 6", the week-1 bar's "Live in production" becomes "Live on your workflow", and the founder-record footnote loses "governance on from day one". Its test is updated.
- `app/walkthrough/page.tsx` metadata ("In week 1 it runs in production, governed").
- `/llms.txt` follows automatically from the content files.

If the founder confirms that specific controls are on by the end of week 1 (decision D2), the wording can be strengthened to name exactly those.

### A2. Make `/walkthrough` truthful

- The step-2 slip says "Details ready. Pick a time to send them." with a READY stamp, not "Request received".
- Remove the Priority lane's promise ("Same-week founder slots prioritized"). The code only changes a stamp; nothing is prioritised.
- The same unsupported "received" or "read" claim appears in five more strings in `WalkthroughClient.tsx`; reword each so it is true before B3: "your context is captured", "Founder will arrive briefed", "Read by the founder", "No SDR follow-up ... Founder reads it", and the step-2 heading.
- Reword "Your information goes only to the founder": the fields are passed to the scheduling provider. New line: "Your details are used only to prepare your call. They are passed to our scheduling provider, Calendly."
- Remove `hide_gdpr_banner` from the calendar URL. This changes one line of the form logic that round 1 froze; the test fixture is updated to match. Nothing else in the form logic changes.

### A3. An honest primary button

- Keep "Start a Production Sprint" as the one primary label.
- Under each instance (hero, closing section, `/sprint`, mobile bar where space allows) add: "20-minute call with an architect. No commitment, no discovery fee."
- The briefing actions become text links, so each screen has fewer competing buttons: "Book an architecture briefing" and "Book a product briefing" (`Engines.tsx`), "Book a RevXL briefing" (`EditionSwitcher.tsx`) and the Lumen record's "Book a product briefing" (`content/site.ts`). They are outlined today, not orange. The free-scan button stays orange. `test/brand.test.tsx` is updated.
- Confirm the Calendly event is 20 minutes before the caption ships; if it is not, the caption states the real length.
- `/walkthrough` may read a display-only `?for=` value to match its heading to the link clicked. No form logic changes.

### A4. Two no-call actions directly under the hero

Before the scan row ships, the builder walks the off-site scan flow on revxl.gobotsai.com once (what it asks, what the result offers next) and reports anything that would embarrass the top of the homepage. If it is not ready, the strip ships with the live check only.


- The hero's second button changes from "See our products" (a scroll) to **"Run a live check"**, which scrolls to the checker.
- A slim strip under the hero, titled "Start without a call", with two rows:
  - "Score your mortgage site free" → the RevXL scan. Says plainly that it opens RevXL, asks for site and email, and returns a score in about 90 seconds.
  - "Run a live AI governance check" → the homepage checker.
- The mobile sticky bar shows the scan action while the Mortgage record is on screen, and the sprint action elsewhere.

### A5. Close the proof loop

- After a homepage check, the result panel verifies that exact run in place and shows "Signature valid", using the existing `/api/govtrace/verify/[run_id]` proxy and the run id the checker already holds.
- The result link "See the full signed record" is replaced by "Try other scenarios" → `/demo`. Today it points to a page that does not show that record.
- Beside the checker: "A live call to the GoVTraceAI engine." Under the result: "Seen enough? Start a Production Sprint", with the A3 caption.
- **Engine-down state:** verification is done by the engine, so nothing can be verified live while it is down. Show a stored, real, engine-signed specimen labelled "Stored example, verified on <date>. The live engine is not answering right now." It makes no live claim.
- **Rate limit:** a best-effort in-memory limit in the evaluate and verify proxies (10 requests per IP per 10 minutes), accepted as weak on serverless. A Vercel Firewall rule with the same numbers is the real control; the founder switches it on if his plan includes it. No new paid service.
- `/verify`: "Load sample" currently loads a placeholder signature that fails verification. Ship one real engine-signed sample receipt so the first click succeeds.
- **Where the real receipts come from:** the builder captures them from a preset run against the live engine and stores the full receipt, so the sample verifies by signature (`verify-receipt`), not by run id. If the engine's signing key rotates, the stored samples must be recaptured; see D11.

### A6. Remove overclaims and invented specifics

- Comparison: replace "47-slide PowerPoint" and "Align on vision" with neutral phase names. Keep the row label "Your current vendor", the "Illustrative" note and the NO SYSTEM stamp; the founder chose this framing, and it is labelled.
- Figures band: delete the duplicate three-clients sentence, or wrap it in its source marker.
- Figure "5 AI products built" becomes "1 live · 1 launching · 3 built", which matches `content/site.ts` and survives a click-through.
- Figure "100 AI engineers our bench scales to": see decision D3. "Bench" is staffing vocabulary, which round 1 banned.
- Industries: each RevXL edition tag that is still in development says so, wherever it appears.
- "RevXL closes it in 48 hours" gets a source marker, or is removed if the founder does not confirm it (D7).

### A7. The evidence page must not simulate proof

`public/evidence-gap.html` shows verification that did not happen: a Verify button prints "SIGNATURE VALID · NOT TAMPERED" from a timer against a hard-coded fixture, a static "valid" badge sits beside it, and two lines say the record was generated and signed by the engine. The only disclosure is a line of small print.

- Phase A fix: label the whole block as an illustration, prominently, by promoting the existing small-print disclosure to a visible heading-level note. Wiring it to the real verifier is a later option.
- The named case cards already say "alleges" and "reportedly". The allegation is stated as fact in the lead paragraph, the `og:description` and the stat tiles; reword those three as allegations. No new citations are invented: where the page already links a source it stays, and where it has none the builder flags it for the founder instead of adding one.
- The founder signs off the reworded text before it ships (D10).

### A7b. One name for the signed record (needs decision D10)

"Duty-of-Care Record" is used on the evidence page and on `/demo` (`app/demo/page.tsx`, `DemoClient.tsx`); "GoVTrace Receipt" on `/verify`, `/spec` and the footer. Either pick one, or state the relationship once on each page ("the Duty-of-Care Record is signed as a GoVTrace Receipt").

### A8. A shorter homepage (needs decision D1)

From twelve sections to eight:

1. **Hero**, with the caption and the "Start without a call" strip.
2. **How a Production Sprint works.** New. Built only from `content/sprint.ts`: the three phases, "You bring", "You get". It absorbs the vendor comparison as its timeline and the week-1 example systems, labelled illustrative. It replaces the four Method quotes.
3. **Proof.** Receipt, live check with in-place verify, evidence index, and "Your data stays in your environment" (the old Trust section folds in here).
4. **Products.** Mortgage-led (A9), on the one-core foundation.
5. **Three engines**, as one compact row with text links.
6. **Who you work with.** The founder note under a plain heading, the company record, three figures and the team-experience strip.
7. **Questions.** Four answers assembled from `content/sprint.ts` and the existing data claim: what a sprint is, what you provide, where your data goes, what happens after week 4. Two of them need one new sentence each, written from those facts.
8. **Closing call to action.**

What happens to each round-1 block:

| Round-1 block | Round 2 |
|---|---|
| Figures band | Kept inside section 6 as three figures: Week 1, "1 live · 1 launching · 3 built", and 3 implementation clients. The fourth depends on D3. |
| Team-experience strip | Kept inside section 6 |
| Vendor comparison (animated) | Kept inside section 2 as the timeline |
| Week-1 example systems | Kept inside section 2, labelled illustrative |
| Three engines | Kept as section 5, compact; removed from the hero |
| Capabilities grid | Moved to `/capabilities` |
| Product records, one-core foundation, plug-in animation | Kept in section 4 |
| Medical advisory board row | Kept on the Lumen record |
| RevXL edition switcher | Depends on D4 |
| Industries | One line in section 6 |
| Receipt run trace, live checker, three verdict specimens, evidence index | Kept in section 3 |
| Guarantee block (off) | Not a homepage section; becomes the caption line in B1 |
| Trust claim; compliance map (off) | Claim moves to section 3; the map moves to `/security` in B4 when approved |
| Method quotes | Removed |
| Founder note, company record | Kept in section 6 |

Nav after this round: Products · How it works (`/sprint`) · Capabilities (`/capabilities`) · Proof menu · the sprint button.

Moved off the homepage:
- The 15-tile capabilities grid moves to `/capabilities`; the nav link stays.
- Industries shrinks to one line inside section 6 ("Who it is for"), listing only sectors with a product or client behind them. The Industries nav item is removed.

The founder note's "We don't consult" becomes "We don't stop at advice", since engine 01 is Strategy.

### A9. Lead RevXL with what exists (needs decision D4)

- The RevXL record says what the product does today: "Scores a mortgage site for borrower conversion, 0 to 100, with a prioritised fix plan."
- "Score your mortgage site free" becomes the record's one button.
- A thin landing page, `/revxl/mortgage`, for brokers arriving from outreach: headline, the scan button, the three outcomes, loan types, and the two validating firms. One action at the top.

### A10. Polish that affects whether a link gets opened

- Export the link-preview image as a 1200×630 PNG; the current SVG does not render in LinkedIn, Slack or iMessage.
- A 404 page in the document style ("No record found"), with links to Products, Proof and the sprint.
- One canonical domain (D8), used in metadata, `/llms.txt` and the spec.
- Date, version and byline on the receipt spec.
- Background chores, not buyer-facing: robots, sitemap, structured data, favicon.ico.

### A11. Measurement (needs decision D6)

There is no analytics today, so nobody can tell which change worked. Add privacy-respecting event counts for: primary button clicks, form starts, scan clicks, live checks run, and calendar completions where Calendly's embed reports them. Custom events in Vercel Web Analytics need a paid plan; if the founder's plan lacks them, page views only, with event counts deferred.

## 6. Phase B: needs facts from the founder

Each ships as soon as its facts arrive. None blocks Phase A.

| # | Change | What it needs |
|---|---|---|
| B1 | **Switch on the week-1 guarantee.** State it once in the caption under the primary button and on `/sprint`, linking to `/guarantee`. Ship after A1 so its wording matches. | Legal read and sign-off of the drafted terms, or a narrower version such as "no invoice until the week-1 system is running" |
| B2 | **Sprint terms on `/sprint`**, as a sealed record: scope, length, team by role, commercials, ownership of code and data, client time per week, what happens after week 4. Plus a "from call to kickoff" strip and a sample sprint brief labelled illustrative. `/sprint` becomes the one page a champion forwards to a CFO, printable. | Fee model and any price or range (round 1 excluded pricing; see D5), pod by role, client hours, IP and exit terms, time from call to kickoff, the real day-level week-1 schedule |
| B3 | **Capture the request at step 1.** Send the form to Gobots through a server route, and tell the visitor: "No slot that suits? We have your request and will reply within one business day." | Where requests land (inbox or CRM) and a reply time he will keep |
| B4 | **Diligence layer.** `/privacy`, linked under the form button; a legal identity line in the footer; `/security` as plain rows including honest negatives (for example "No SOC 2 report yet"); `/terms` once the guarantee is live. | Legal entity, jurisdiction and address; reviewed privacy text; role mailboxes; hosting, retention and key-handling facts; model providers and sub-processors |
| B5 | **Show who the buyer works with.** Founder photo and profile link on the "You meet" card and the founder note. Move the prior-career figures out of the footnote into the founder note, labelled as results from prior employers' programmes. | Headshot, profile URL, who takes the first call, a source for the prior-career figures |
| B6 | **One anonymised sprint record**, placed inside "How a sprint works" as the worked example, and a reference offer beside the main button ("Speak to a current client before you sign"). | Written client consent and the real week-by-week facts for one engagement; whether reference calls can be offered |
| B7 | **Validator sentences** on the RevXL mortgage record and page: one approved sentence each from Pinnacle Ventures and Coast2Coast Mortgage, and what "validated with" concretely means. | The approved sentences |
| B8 | **A paid next step for brokers** after the free scan: the price of the 48-hour fix and of RevXL itself. | The prices, and a review of the off-site scan flow on revxl.gobotsai.com, which nobody has assessed |
| B9 | **`/govtraceai` overview page**, assembled only from what exists: product line, live check, verify, open spec, SDK install line. | Nothing new; lower priority than B1–B6 |

## 7. Decisions for the founder

**Default rule:** each recommendation below is what gets built unless the founder says otherwise. Three are too large to default and must be answered before their work starts: D1, D4 and D9. Until then the hero receives only the A1 wording fix, the A3 caption and the A4 button.

| # | Decision | Recommendation |
|---|---|---|
| D1 | Shorten the homepage to eight sections (A8)? This reverses round 1, which put Capabilities and Industries on the homepage. | Yes. Fifteen capabilities and eleven industries beside three clients make a buyer discount both, and they push the proof down. |
| D2 | Which controls are on at the end of week 1, and does week 1 touch production data? | Ship the conservative wording now; strengthen only what he confirms. |
| D3 | Keep, reword or drop "100 AI engineers our bench scales to"? | Drop from the figures band. If capacity matters, state it as one sourced sentence in "Who you work with". |
| D4 | Collapse the RevXL edition switcher to the Mortgage panel plus one status line ("Also built: Real estate, Medspa, Small business. In development: Finance, Banking, Fintech, Automotive")? He approved the eight tabs in round 1, but seven of them say only "covered in a briefing". | Yes, until other editions have real outcomes. The tabs return edition by edition. |
| D5 | Publish a commercial shape for the sprint, even without a number? | Yes, at minimum "Fixed scope. Quoted in writing after the first call, before any work starts", if that is true. A "from" figure is what lets a buyer decide without a call. |
| D6 | Add privacy-respecting analytics? | Yes. Vercel Web Analytics needs no cookie banner. |
| D7 | Is "RevXL closes it in 48 hours" a promise he stands behind? | Confirm it, or reword to "RevXL can fix it for you". |
| D8 | Canonical domain: `www.gobotsai.com` or `gobotsai.com`? | Whichever production already redirects to. |
| D10 | One name for the signed record (A7b), and sign-off of the reworded evidence page (A7)? | Keep both names and state the relationship once per page. |
| D11 | Does the engine keep runs verifiable indefinitely, and does its signing key rotate? | Needed so stored sample receipts keep verifying. |
| D9 | New hero headline? Round 1 chose the company-first line "We architect, ship and run AI in production." Reviewers prefer the buyer's outcome: "A working AI system on your workflow in week 1." | Use the outcome line as the headline and keep "Full-stack AI company" in the nav tag and subline. Remove the engine strip from the hero, since section 5 repeats it. |

## 8. Constraints

- All round 1 rules stand: no invented facts, statistics, clients or quotes; no superlatives; no staffing or consulting vocabulary; no investor information; no client names beyond the two RevXL validators; every factual claim carries a source marker.
- The "Notarized record" design system in `DESIGN.md` stands. No new visual language.
- Round 1's tests pin several things this round changes (four figures, 15 capabilities and 11 industries on the homepage, the hero's engine strip, the form-logic fixture). Each such test is updated in the same change that alters the behaviour, never deleted to make a build pass.
- The three scroll animations stay. No new entry motion.
- Typecheck, the test suite and the production build pass before anything is pushed. Commits and pushes happen only when the founder asks.
- One rendered-browser pass at 375px and 1280px is part of done for every change.

## 9. Order of work

1. A1 and A2 (truth), then A6 and A7 (overclaims and simulated proof).
2. A3, A4, A5 (the path and the proof loop), with the engine-down state and rate limit before the checker moves up.
3. A8 and A9 (shorter homepage, Mortgage-led RevXL), once D1, D4 and D9 are answered.
4. A10 and A11.
5. Phase B items as facts arrive, starting with B1, B3 and B4.

## 10. Done means

- A first-time visitor can run a live check or start the mortgage scan without scrolling past the second section.
- A search of the site, link previews and `/llms.txt` finds one week-1 statement, not two.
- Submitting the form never shows "received" unless Gobots has actually received it.
- The homepage has eight sections.
- No page shows a verification result that did not come from the real verifier, unless it is labelled as an illustration.
- Tests, typecheck and the production build pass; no horizontal scroll at 375px.
