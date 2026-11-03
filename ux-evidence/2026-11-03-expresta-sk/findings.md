# Expresta.sk – purchase-journey usability study (2026-11-03)

Expert-simulated walkthroughs by the `user-research-specialist` agent (headless Chromium, emulated viewports 1440 / 390 / 320 px). **Not research with human participants.** No order, account, form submission or payment was made.

- FigJam section: https://www.figma.com/board/CHAO3eXnEtLIs189ok50KE/?node-id=1111-320
- Evidence screenshots: [`evidence/`](evidence/) (canonical, named by finding ID). `screenshots/` holds raw captures whose prefixes do **not** match the final IDs.
- Step log: `notes_log.jsonl` · Scripts: `scripts/` (run `j1d_to_step2.js` first to recreate session state) · Test files: `testfiles/`

## Executive summary

The happy path works on desktop and mobile (configure → upload → cart edits → shipping; no horizontal scroll at 390/320 px; cart remove/duplicate/qty-0 confirmations behave well). The serious problems are state and error handling where the customer cannot see something went wrong:

1. Configuration is partly lost on Back (UX-001); editing a cart item can silently drop the artwork file while the cart shows a stock photo (UX-002).
2. Upload errors are dead ends (UX-003); low-res / wrong-size files are accepted silently (UX-004).
3. Brochure calculator rules are invisible (UX-006, UX-007, UX-008).
4. Checkout loses shipping/payment state on Back/reload (UX-009); no concrete delivery date or total at the shipping step (UX-014).
5. Mobile: newsletter popup blocks a modal CTA at 320 px (UX-005); cart ± buttons 18×22 px (UX-011). Search "vizitka" + Enter lands on accessories (UX-010).

## Finding cards

| ID | Title | Type | Prio | Device | Location | Evidence |
|---|---|---|---|---|---|---|
| UX-002 | Editing cart item → switching to two-sided drops uploaded file; save succeeds without artwork; cart shows stock photo | Verified issue | P1 | Desktop 1440 | /order/shopping-cart → Upraviť → /order/product/vizitky-variation/upload?…&ba=edit | `UX-002_sk_1440_edit-sides-file-dropped.png`, `UX-002_sk_1440_cart-stock-thumbnail-no-file.png` |
| UX-001 | Browser Back from step 2 resets quantity (500 → 250, 42,42 € → 33,41 €), keeps other params (2/2 runs) | Verified issue | P1 | Desktop 1440 | https://www.expresta.sk/vizitky | `UX-001_sk_1440_back-from-step2-qty-reset.png` |
| UX-003 | Corrupt PDF → English modal "Upload failure reason unknown" + toast pointing to non-existent "DÁTA DODÁM NESKÔR" option | Verified issue | P1 | Desktop 1440 | /order/product/vizitky-variation/upload | `UX-003_sk_1440_upload-corrupt-pdf-en-modal.png`, `UX-003_sk_1440_upload-corrupt-pdf-toast.png`, `UX-003_sk_1440_step2-no-data-later-option.png` |
| UX-005 | Newsletter popup (~8 s) covers "Pokračovať bez povrchovej úpravy" modal CTA at 320 px (extends F2) | Verified issue | P2 | Mobile 320 / 390 | /vizitky | `UX-005_sk_320_newsletter-blocks-modal-cta.png`, `UX-005_sk_390_newsletter-over-modal.png` |
| UX-004 | 60×33 px PNG and A4 PDF accepted for 90×50 card without warning (page states 1122×650 px @300 DPI) | Verified issue | P2 | Desktop 1440 | upload step | `UX-004_sk_1440_upload-lowres-accepted.png`, `UX-004_sk_1440_upload-a4-on-card-accepted.png` |
| UX-009 | Back from Údaje: Kuriér ticked, 0 payment options, POKRAČOVAŤ disabled; reload/re-entry clears both (3/3) | Verified issue | P2 | Desktop 1440 | https://www.expresta.sk/order/delivery-payment | `UX-009_sk_1440_back-delivery-selected-payment-missing.png`, `UX-009_sk_1440_reenter-delivery-cleared.png` |
| UX-006 | Brochure odd page count (37/39): no price, toast visible ~3 s, no field error state, loop on "Stlačte VYPOČÍTAŤ" | Verified issue | P2 | Desktop 1440 | https://www.expresta.sk/tlac-brozur | `UX-006_sk_1440_odd-pages-toast.png`, `UX-006_sk_1440_odd-pages-navrh-blocked.png` |
| UX-007 | Too few pages opens "manual price" contact modal without naming the page-count limit | Verified issue | P2 | Desktop 1440 | /tlac-brozur | `UX-007_sk_1440_manual-price-modal-2pages.png`, `UX-007_sk_1440_manual-price-modal-v2-8pages.png` |
| UX-010 | Search "vizitka" + Enter → /category/doplnky; suggestions 3× "vizitkár" + duplicate "Vizitky" (confirms W10-1) | Verified issue | P2 | Desktop 1440 | homepage search | `UX-010_sk_1440_search-vizitka-suggestions.png` |
| UX-011 | Cart −/+ buttons 18×22 px (< WCAG 2.2 2.5.8 24×24) | Verified issue | P2 | Mobile 390 / 320 | /order/shopping-cart | `UX-011_sk_390_cart-qty-buttons-18x22.png` |
| UX-008 | Binding V1→V2 keeps "38" but field meaning changes (incl. cover → inside pages); price 374,06 → 513,29 € without notice | Usability concern | P2 | Desktop 1440 | /tlac-brozur | `UX-008_*` |
| UX-014 | Only relative delivery times ("výroba 3+ dní", "doručenie 1 deň"); no subtotal/total on shipping step | Usability concern | P2 | Desktop 1440 | /order/delivery-payment | `UX-014_*` |
| UX-012 | Tooltip max 1 000 000, but up to 9 999 999 accepted; 8th digit silently rewrites value (100000000 → 10); Enter doesn't recalc | Verified issue | P3 | Desktop 1440 | /vizitky | `UX-012_*` |
| UX-013 | Invalid e-mail on Údaje only turns heading red; field `type="text"` (no e-mail keyboard) | Usability concern | P3 | Desktop 1440 | Údaje step | `UX-013_*` |
| UX-015 | "Secret discount" modal for 1–10 pcs: text says 5 €, image alt says 7 €; 1/2/3 pcs same price 19,17 € | Usability concern | P3 | Desktop 1440 | /vizitky | `UX-015_*` |

Confidence: High for verified issues (reproduced with recorded steps); Medium for usability concerns (impact needs user testing / Clarity data).

## Hypotheses (untested)

- **HYP-A** – Discount code, Kontrola, addresses and business VAT sit behind the e-mail gate; untested without an account.
- **HYP-B** – Quantity keydown filter likely blocks Ctrl/Cmd+V, Ctrl+A, Home/End (Enter blocking confirmed).
- **HYP-C** – Step-2 templates for 90×55 / 85×55 / two-sided offered for a 90×50 one-sided config may silently change configuration or price.
- **HYP-D** – /vizitky → /vizitky-variation redirect may be an A/B test (relates to W4a).

## Recommended solutions

- **Configuration state:** persist the full config against `c=` id and restore on Back/re-entry; when switching to two-sided keep the front file and ask only for the back; block saving without artwork or warn, and show a "Grafika chýba" placeholder in the cart.
- **Upload:** localize uploader error codes; make the toast product-specific; add automatic DPI / size / bleed check with a soft warning and template link.
- **Calculator:** persistent inline errors with auto-fix (round to even pages); show page limits per binding; warn when field meaning changes; one quantity limit everywhere, never rewrite silently; Enter triggers VYPOČÍTAŤ.
- **Checkout:** save shipping/payment on click and re-render correctly from bfcache; show estimated delivery date and order summary on every step; specific inline e-mail error and `type="email"` (ties to F3).
- **Mobile / search:** suppress newsletter popup over system modals and on calculator pages (F2); ± buttons ≥ 44×44 px; rank suggestions by popularity, handle singular/plural, de-duplicate.
- **Validate next:** Clarity on /order/delivery-payment exits and Back-navigation sessions; 5–8 participant task tests on brochure binding/page count and on a deadline-driven delivery question.

## Coverage matrix

| Workflow | SK 1440 | SK 390 | SK 320 | EU/CZ/DE/AT/HU |
|---|---|---|---|---|
| Home + navigation | Tested | Tested (menu not opened) | Tested (menu not opened) | Not tested |
| Search / autocomplete | Tested (5 queries) | Not tested | Not tested | Not tested |
| Business-card calculator + edge cases | Tested | Tested | Partial | Not tested |
| Brochure calculator | Tested | Not tested | Not tested | Not tested |
| Step 2 design | Tested | Tested | Blocked (UX-005) | Not tested |
| Upload (5 test files, replace) | Tested | Not tested | Not tested | Not tested |
| Online editor | Not tested (covered by W5/W9/W11) | Not tested | Not tested | Not tested |
| Cart | Tested | Layout + tap targets | Layout + tap targets | Not tested |
| Doprava a platba | Tested | Layout | Layout | Not tested |
| Údaje e-mail validation | Tested (invalid only) | Not tested | Not tested | Not tested |
| Kontrola / discount / address / VAT / payment | Blocked (e-mail gate) | Blocked | Blocked | Not tested |
| Reload / Back / re-entry | Tested | Not tested | Not tested | Not tested |

## Edge-case checklist

- **Passed:** .txt upload → clear SK message; file replace; cart qty 0 → "Nie" restores; duplicate item; remove + empty cart; price-tier recalculation; checkout URL with empty cart → cart; continue without shipping disabled with tooltip; no horizontal scroll at 320 px; search without diacritics.
- **Passed with caveats:** qty 0/empty silently → 1; 1–3 pcs trigger discount modal.
- **Failed:** qty ≥ 10M; qty 1M–9.99M vs tooltip; Enter in qty; odd pages; too few pages; Back from step 2; corrupt PDF; low-res / wrong size; edit item + change param; Back/reload/re-entry at checkout; 320 px modal overlap; cart tap targets; search "vizitka"; binding switch (UX-008); invalid e-mail (UX-013).
- **Not tested:** paste into qty; interrupted upload; invalid discount code; invalid / missing address fields.

## Blocked

- Údaje → Kontrola → payment requires a real e-mail (login/registration) – not done by design.
- Online editor skipped (already covered on board).
- Other domains out of scope for this run.
- Environment: headless Chromium with emulation, not real devices; a 403 from a third-party tag host is not a site defect.
