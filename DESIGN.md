# Gobots design system: "Notarized record"

The site reads like an audit artifact that has been issued, ruled and sealed. It is not a dark-mode AI landing page. The product attests AI decisions with signed receipts, so the interface borrows from the world of receipts, notary seals, security print and standards documents.

## Ground and ink
| Token | Value | Use |
|---|---|---|
| `paper` | #F2F2EE | Page ground |
| `paper-2` | #E9E9E3 | Code blocks, quiet fills |
| `paper-3` | #FBFBF8 | Slips, receipts, form fields |
| `ink` | #121212 | Text, primary buttons, the inverted CTA and footer |
| `ink-2` | #4F4F49 | Secondary text (≈6.6:1 on paper) |
| `ink-3` | #6A6A63 | Tertiary text and labels (≈4.7:1) |
| `rule` | ink at 14% | Hairline structure |
| `ink/80` | | Strong rules that open sections and tables |
| `seal` | #E0643A | The logo orange. Seal, stamps, guilloche, the full stop in the wordmark. Never body text. |
| `seal-ink` | #B4431F | Orange text on paper (≥4.5:1) |
| `verdict.safe / warn / block` | #1F6B45 / #9A6200 / #B4231F | SAFE / WARNING / BLOCK, only for verdicts |

## Type
- **Source Serif 4** (`.display`, `.heading`): weight 500 and tight tracking, for headlines and quotes. Use a high optical size for display.
- **Archivo** (`font-sans`): UI and body text. `.label` uses the 87.5% width, uppercase, for field labels and table column heads. It is **never** an eyebrow above a heading.
- **IBM Plex Mono**: only for data, meaning hashes, IDs, JSON, code and field names.

## Structure
- 1px hairline rules carry the structure, not cards. Sections open with an `ink/80` rule and use a 12-column grid: the serif heading sits in columns 1–6 and the body in columns 8–12.
- Radius is 3px (`rounded-doc`). There are no pills, no glass, no glows and no gradient text.
- Buttons: `.btn-ink` (primary), `.btn-rule` (secondary), and `.btn-paper` / `.btn-rule-inv` on ink.

## Document components (`components/doc`)
- `Receipt`: the hero specimen slip, with perforated edges, guilloche band, ruled fields and mono hashes.
- `Seal`: circular notary seal in `seal`, with the full Gobots logo (`public/gobots-logo-seal.png`, one stamp colour) at its centre. The ink-roughness filter needs a unique `id`.
- `Stamp`: rectangular rubber-stamp impression for verdicts and VOID-style marks.
- `Guilloche`: security-print linework band, generated deterministically.
- `icons`: Check, Arrow, ArrowUpRight, Cross. Use these instead of unicode glyphs.
- "One core" diagram: the product records sit on a solid ink `Gobots Core` foundation (agents · governance · signed receipts · integrations), each pinned to it by a thin rule and a seal-orange node on large screens.
- Product records (`components/home/Products.tsx`): each product family is a sealed slip with real fields (For, You get, Next step), a status stamp and a seal. The earlier redaction bars were removed because visitors read them as broken or as hiding something.
- `.btn-seal` (orange, ink text) is the conversion action: every "Start a Production Sprint", and the Mortgage edition's free scan. Keep to one or two per screen so orange stays rare.
- `/sprint` (`app/sprint/page.tsx`, content in `content/sprint.ts`): the sprint week by week. It publishes only what Gobots has stated (week 1, week 4, then expand): no day-level schedule, price or pod size until supplied.
- `EditionSwitcher` (`components/home/EditionSwitcher.tsx`): tabs for the RevXL editions. Dashed tabs are editions in development. An edition shows outcomes only when `content/site.ts` holds real ones for it.

## Site components
- `Claim` (`components/Claim.tsx`): wraps a factual claim and adds a small ring marker that opens its source from `content/claims.ts`. An id missing from the register renders nothing. Use `tone="ink"` on dark sections. The popover clamps itself inside the viewport.
  - Rule: mark a claim at least once per section in which it appears. Within a section, a repeat of an already-marked claim (for example "week 1" in an engine description after the figures band) may stay unmarked.
- `InView` (`components/home/InView.tsx`): adds `is-inview` once 25% of its content is visible. It holds the receipt's motion until then.
- Capability bento: hairline cells built with `gap-px` on a `bg-rule` grid, not cards with shadows. The cell count is chosen so the grid closes with no gaps.
- SVGs are block-level under Tailwind's preflight. Add `inline-block` when an SVG (a Stamp, for example) must sit inline with a `Claim` marker.

## Motion
There is one authored moment: the agent run trace (the receipt in the Proof section). Its checks ink in one after another, then the seal stamps down. It plays once, when the trace scrolls into view.

- Without JavaScript the slip is fully visible.
- After hydration, `.js-inview:not(.is-inview)` holds it until it is in view.
- Under `prefers-reduced-motion: reduce` it doesn't animate.

The comparison graphic is the second: when it scrolls into view the Gobots week-1 bar fills, a LIVE stamp lands above it, and the other segments fade in (`cmp-*` classes, same `InView` gate and reduced-motion rule). The third is the "one core" plug-in: each product's pin draws down to the core, its orange node lands, then that record's Gobots seal presses (`core-*` classes, same gate). Nothing else animates on entry.

## Browser surfaces
- Text selection uses the seal background.
- The focus ring is 2px `seal-ink`.
- The caret uses the seal colour.
- The scrollbar is paper with a grey thumb.
- `tnum` sets tabular numerals for data.
