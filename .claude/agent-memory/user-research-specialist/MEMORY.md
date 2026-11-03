# user-research-specialist – project memory (durable knowledge only)

## FigJam board CHAO3eXnEtLIs189ok50KE
- Two pages = the two top-level research sections:
  - `0:1` "Hypotézy z Clarity" (Section 1: Clarity hypotheses H-001…H-010, funnel numbers, journey phases). Large: get_figjam output >77k chars -> grep the saved file.
  - `799:252` "Používateľské testovanie" (Section 2). Existing: `1029:316` overview (cards F1–F4, walkthrough logs 30.10–2.11, night testing W5–W11), loose draft nodes at x≈6192 (1070:3xx – leave alone).
  - Added 2026-11-03: section `1111:320` "Walkthrough 3.11. · expresta.sk (UX-001–UX-015)" at (0,7400), subsections A `1111:323`, B `1112:320`, C `1112:430`, D `1112:552`, E hypotheses `1113:320`, F coverage/checklist `1113:370`.
- Highest finding ID used: UX-015 (hypotheses HYP-A…HYP-D). Board language: Slovak.
- Card convention: white card, colored 4px stroke; badge pill Inter Bold 16; title Inter Semi Bold 30; body Inter Regular 18–20. Orange (0.92,0.46,0) = overený/potvrdený jav, blue (0.15,0.42,0.78) = usability concern (my addition), gray (0.56) = neoverená hypotéza. Images: rectangle placeholder + upload_assets with nodeIds, scaleMode FIT.

## expresta.sk site map / selectors (as of 2026-11-03)
- No cookie banner appeared in headless sessions. Newsletter weblayer `.weblayer--box-subscription-1` pops ~8 s after load, sits above Bootstrap modals.
- /vizitky sometimes redirects to /vizitky-variation (A/B?). Brochures: /tlac-brozur (/brozury = 404).
- PDP calculator: `#amount-value` (onkeydown digit filter, onblur <1 -> 1), `#sides-value` (bootstrap-select, click `[data-id=sides-value]`), `button.calculate_price` (VYPOČÍTAŤ, appears after any change), price `#prodPriceTotal` (hidden while stale), `#next-calculation` (NÁVRH A OBJEDNÁVKA), speeds `input[name=production_speed]`, brochure pages `#pages-value`, binding drawer `[data-bs-target="#binding-box"]`.
- Scratch modal CTA `#next-design-order-submit` ("Pokračovať bez povrchovej úpravy"). Error toasts are `.toast` (auto-hide ~3 s) — poll every 200 ms.
- Flow URLs: /order/product/<slug>/templates?c=<id> -> /upload?c= (file input `input[type=file][name=upload_file]`) -> /order/shopping-cart (`.item-quantity`, `a.edit_item|duplicate_item|remove_item`, `button.minus|plus`) -> /order/delivery-payment (`label[for=delivery-type-38326]` Kuriér, `payment-type-*`) -> /order/customer-data (email gate, stops anonymous testing).
- Delivery/payment selection is not persisted on reload/re-entry.

## Coverage / blockers
- SK covered 2026-11-03: vizitky full path to email gate, brožúry calculator, upload edge cases, cart edits, mobile 390/320. Not covered: Kontrola, discount code, addresses (behind email gate; no account creation allowed), online editor (covered earlier W5/W9/W11), other domains.
- Harness blocks Write of report files (findings.md) for subagents; deliver findings in final message + FigJam.
- Evidence dir convention: /home/user/user-research/ux-evidence/<date>-expresta-<domain>/ with scripts/lib.js helper.
