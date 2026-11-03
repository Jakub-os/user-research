# Expresta – usability study, run 2 (2026-11-03)

These are expert walkthroughs by the `user-research-specialist` agent in headless Chromium, at desktop 1440 px and mobile 390 px (iPhone 13 emulation). **They are not research with human participants.** No order, account, form submission or payment was made.

The run continued from run 1 (`../2026-11-03-expresta-sk/findings.md`, UX-001…UX-015). New findings are UX-016…UX-026.

- FigJam section: https://www.figma.com/board/CHAO3eXnEtLIs189ok50KE/?node-id=1194-326
  - G Online editor: [1194-329](https://www.figma.com/board/CHAO3eXnEtLIs189ok50KE/?node-id=1194-329)
  - H Configurators: [1194-331](https://www.figma.com/board/CHAO3eXnEtLIs189ok50KE/?node-id=1194-331)
  - I Cross-domain and localization: [1194-333](https://www.figma.com/board/CHAO3eXnEtLIs189ok50KE/?node-id=1194-333)
  - J Hypotheses: [1194-335](https://www.figma.com/board/CHAO3eXnEtLIs189ok50KE/?node-id=1194-335)
  - K Coverage: [1194-337](https://www.figma.com/board/CHAO3eXnEtLIs189ok50KE/?node-id=1194-337)
- Evidence: `evidence/` holds canonical screenshots named by finding ID. `screenshots/` holds raw captures. Scripts are in `scripts/`; logs are `*.log` and `notes_log.jsonl`.
- Cleanup caveat: one anonymous CZ test cart item could not be removed, because the browser session crashed. No personal data is attached to it.

## Summary

- **Online editor:**
  - On the `/vizitky-variation` A/B variant, the online-editor button leads to a 404 page (UX-016).
  - The mobile editor has no Text tool (UX-017).
  - Unsaved work is lost on reload, and saving requires a login (UX-018).
- **Configurators:**
  - Choosing a template in another size silently changes the product and the price (UX-019).
  - A 1-page PDF uploaded for a 40-page brochure is reported as "uploaded successfully" (UX-020).
  - Flyer production-speed prices go stale after a material change (UX-021).
  - The poster custom size switches the material and never switches it back (UX-022).
  - The quantity field blocks paste and keyboard shortcuts (UX-023).
- **Cross-domain:** UX-001, UX-002, UX-003 and UX-009 reproduce on **all 6 domains**.
  - CZ, DE, AT, HU and EU have an extra "special offer" step between cart and delivery that SK doesn't have (UX-026, a concern).
  - There are wording errors in HU and in the SK editor (UX-025).

## New findings

| ID | Title | Type | Prio | Domains | Device | Confidence |
|---|---|---|---|---|---|---|
| UX-016 | On the `/vizitky-variation` variant, "VYTVORIŤ A OBJEDNAŤ" leads to a 404 (empty template name in the URL `studio//90x50…`) | Verified issue | P1 | SK (variant only) | Desktop 1440 | High |
| UX-017 | Mobile editor at 390 px: a blank business card has no Text tool | Verified issue | P1 | SK | Mobile 390 | Medium |
| UX-018 | Editor: unsaved work is lost on reload; "Uložiť" requires login | Verified issue | P2 | SK | Desktop 1440 | High |
| UX-019 | A template in another size or with two sides silently changes the product and price (31,21 € → 37,40 €); the cart shows no parameters (HYP-C confirmed) | Verified issue | P2 | SK | Desktop 1440 | High |
| UX-020 | Brochure: a 1-page PDF for 40 pages is reported as "uploaded successfully", then the page count becomes 4 and a "manual price" popup appears | Verified issue | P2 | SK | Mobile 390 | High (1 run) |
| UX-021 | Flyers: after a material change, the production-speed list shows old prices (137,64 € vs a real 171,93 €) | Verified issue | P2 | SK | Desktop 1440 | High |
| UX-022 | Posters, custom size: the automatic material switch never reverts, isn't explained and no size limit is stated | Verified issue | P2 | SK | Desktop 1440 | High |
| UX-023 | The quantity field blocks Ctrl+V, Shift+Insert, Ctrl+A and Home (HYP-B confirmed) | Verified issue | P3 | SK | Desktop 1440 | High |
| UX-024 | The floating "?" (designer help) icon covers editor tools on desktop and a heading on mobile | Verified issue | P3 | SK | Desktop 1440 / Mobile 390 | High |
| UX-025 | Wording errors: HU "Hosszabik", "a ADATOKAT"; SK editor "Existuje 2 poznámok" | Verified issue | P3 | HU, SK | Desktop 1440 | High |
| UX-026 | Extra "special offer" step between cart and delivery on CZ/DE/AT/HU/EU, not on SK | Usability concern | P3 | CZ, DE, AT, HU, EU | Desktop 1440 | Medium |

### UX-016 – Online editor link leads to a 404 on the variant (P1)
- **Location:** expresta.sk/vizitky-variation → step 2 → `/order/product/vizitky-variation/studio//90x50/landscape/simplex/<c>`
- **Steps:** New session → /vizitky (redirected to /vizitky-variation) → NÁVRH A OBJEDNÁVKA → Pokračovať bez povrchovej úpravy → VYTVORIŤ A OBJEDNAŤ.
- **Observed:** "Chyba 404". The template name in the link is empty. On `/vizitky` the link is `…/studio/Blank/…` and returns 200. This happened in 3 of 3 variant sessions and 0 of 9 sessions on `/vizitky`.
- **Expected:** The blank editor opens on both versions of the page.
- **Impact:** Variant users have no "design it myself" path, and the A/B results are skewed.
- **Fix:** Add the "Blank" template to the link; monitor 404s on `/studio/`; check other products that have variants.
- **Evidence:** `evidence/UX-016_sk_1440_variation-create-404.png`, `evidence/UX-016_sk_1440_variation-step2-online-editor-cta.png`
- **Limitations:** The share of sessions that get the variant was not measured; other products and domains not checked.

### UX-017 – No Text tool in the mobile editor (P1)
- **Location:** `/order/product/vizitky/studio/Blank/90x50/landscape/simplex/<c>`, 390 px
- **Observed:**
  - The bottom bar has only Fotografie, Pozadia and Nálepky.
  - The ☰ menu has no text option.
  - The desktop editor has Text, Fotografia, Obdĺžnik and Elipsa.
- **Impact:** A business card is mostly text; a mobile customer may leave or order a card with no text.
- **Fix:** Add Text to the mobile bottom bar, or start blank products from a template that has text fields.
- **Evidence:** `evidence/UX-017_sk_390_editor-no-text-tool.png`, `evidence/UX-017_sk_1440_editor-desktop-text-tool-for-comparison.png`
- **Limitations:** Emulation only; editing text by tapping inside templates was not tested.

### UX-018 – Editor work lost on reload; saving needs login (P2)
- **Observed:**
  - Uložiť opens the login/registration dialog; there is no guest save.
  - Before reloading, only the browser's generic "leave page?" prompt appears.
  - After reloading there is a new projectId and an empty canvas.
  - Editing an editor item from the cart does reopen the saved project.
- **Fix:** Autosave tied to the configuration ID (`c=`); test demand for "save without an account" with a fake-door button.
- **Evidence:** `evidence/UX-018_sk_1440_editor-text-before-reload.png`, `…empty-after-reload.png`, `…save-requires-login.png`

### UX-019 – A template silently changes size, sides and price (P2)
- **Steps:** Default card (90×50, one-sided, 250 pcs, 31,21 €) → template "Blocks" (85×55, two-sided) → UPRAVIŤ → add to cart → acknowledge the warnings.
- **Observed:** The cart shows "Vizitky 250 ks 37,40 €" (+19.8 %) with no size or sides. The template card doesn't show its price or say that the configuration will change.
- **Fix:** Filter or group templates by size, show the price difference before opening, and show parameters in the cart row.
- **Evidence:** `evidence/UX-019_sk_1440_template-85x55-duplex-card.png`, `…editor-85x55-duplex.png`, `…cart-37-40-no-params.png`

### UX-020 – No page-count check on brochure upload (P2)
- **Steps:** 40 pages (383,92 €) → upload a 1-page A4 PDF → POKRAČOVAŤ.
- **Observed:**
  - The page says "Váš návrh sa úspešne nahral" with "0%" next to it.
  - The preview shows "Strana 1 / 4", followed by the "manual price" popup.
- **Fix:** Check the PDF page count after upload, show a specific message, and never change the configuration without consent.
- **Evidence:** `evidence/UX-020_sk_390_brochure-1page-pdf-success.png`, `…manual-price-after-upload.png`

### UX-021 – Stale production-speed prices on flyers (P2)
- **Steps:** /letaky default (A5, 150 g, 1000 pcs, 137,64 €) → material Matný 300 g → open RÝCHLOSŤ VÝROBY without clicking VYPOČÍTAŤ.
- **Observed:** RELAX 137,64 €, EXPRES 167,70 € and BLESKOVO 258,21 € are the old 150 g prices. The real price is 171,93 €, about 25 % higher.
- **Fix:** Recalculate automatically, or show "—" until recalculated.
- **Evidence:** `evidence/UX-021_sk_1440_flyer-stale-speed-prices.png`

### UX-022 – Poster custom size changes the material for good (P2)
- **Observed:**
  - At 5000×5000 the material switches to 130 g and a manual-price popup appears; no size limit is stated.
  - Back at 500×700 the material stays 130 g, priced 638,22 € instead of 678,04 €.
  - "-5" becomes "5", and the summary reads "x5 mm".
  - The 10×10 minimum-size error message works.
- **Fix:** Show min/max next to the fields, say which material changed to which, and offer an undo.
- **Evidence:** `evidence/UX-022_sk_1440_poster-500x700-150g-678.png`, `…5000-material-switched.png`, `…back-500x700-130g-638.png`

### UX-023 – Quantity field blocks paste and shortcuts (P3)
- **Observed:** Paste leaves the field empty; Ctrl+A + Backspace gives "25"; Home + "1" gives "2501". The field's `onkeydown` handler only allows digits, Backspace, Delete, arrows and Tab.
- **Impact:** Friction for business customers and keyboard users (WCAG 2.1.1).
- **Fix:** Clean the value on input instead of filtering keys, use `inputmode="numeric"`, and allow Ctrl/Cmd shortcuts.
- **Evidence:** `evidence/UX-023_sk_1440_qty-field-after-paste-tests.png`

### UX-024 – Help icon covers editor tools (P3)
- **Observed:** The 71×71 px `div.editor-icon-container` covers "Text" or "Fotografia" on desktop and the "Pridanie fotografií" heading at 390 px.
- **Fix:** Move it to the editor header or a corner; make it smaller on mobile.
- **Evidence:** `evidence/UX-024_sk_1440_help-bubble-over-text-tool.png`, `evidence/UX-024_sk_390_help-bubble-over-photo-panel.png`

### UX-025 – Wording errors (P3)
- **HU:**
  - "Hosszabik oldalon" should be "Hosszabbik".
  - "válassza a ADATOKAT…" should use the article "az".
- **SK editor:**
  - "Existuje 2 poznámok" should be "Existujú 2 poznámky".
  - "Ak ste si istý" is masculine-only.
- **Fix:** Native-speaker proofreading; handle plurals in the translation files.
- **Evidence:** `xd_stage*` logs, `screenshots/HYPC_sk_1440_remarks.png`

### UX-026 – Extra "special offer" step outside SK (concern, P3)
- **Observed:** `/order/special-offer` offers 4 card holders/stands, with two "continue without accessories" buttons. SK goes straight to delivery and shows accessories inside the cart instead. On HU, Back from delivery returns to this offer page.
- **How to validate:**
  - Analytics or Clarity funnel cart → special-offer → delivery, comparing CZ with SK.
  - A/B test of inline accessories against the separate step.
  - 8–10 participants with the task "order business cards by Friday".
- **Evidence:** `evidence/UX-026_cz_1440_special-offer-step.png`

## Cross-domain check of run-1 findings

| Finding | SK | CZ | DE | AT | HU | EU |
|---|---|---|---|---|---|---|
| UX-001 Back from step 2 resets quantity (500 → 250) | Yes | Yes | Yes | Yes | Yes | Yes |
| UX-002 Cart edit → two-sided drops the file; cart shows a stock image | Yes | Yes | Yes | Yes | Yes | Yes |
| UX-003 Corrupt PDF: English error + non-existent "data later" option | Yes | Yes | Yes | Yes | Yes | Yes |
| UX-009 Back from customer details: delivery looks selected, payment missing | Yes | Yes | Yes | Yes | Yes | Yes |

Each was checked once per domain at desktop 1440. Evidence: `evidence/UX-00{1,2,3,9}_{cz,de,at,hu,eu}_1440_*.png`. On the FigJam board, only the "Affected domains" field of these cards was changed.

**Legitimate regional differences (not defects):**
- **Currency formats:** "€" with decimal comma on SK/DE/AT; decimal point on EU; Kč on CZ; Ft on HU.
- **Delivery options:**
  - CZ: pickup point/box, courier, DHL, UPS, FedEx, Geis.
  - DE: DHL, DPD, pickup point.
  - AT: Expresta Kurier (Vienna), DPD.
  - HU: Futár, Magyar Posta.
- **Cash on delivery:** CZ and HU only.
- **.eu default country:** United States in testing, because it follows the test proxy's IP address. This is an environment artifact.

## Hypotheses

- **HYP-A:** still blocked; the e-mail step is confirmed on all 6 domains.
- **HYP-B:** confirmed, now UX-023.
- **HYP-C:** confirmed, now UX-019.
- **HYP-D:** partly confirmed. The variant is assigned at random; the product team should confirm whether it is a managed experiment.
- **HYP-E:** stale prices may also appear in the quantity price table and on other products.
- **HYP-F:** the UX-020 page-count override may also happen on desktop and other domains.
- **HYP-G:** English "Nothing selected" placeholders may appear in the flyer finishing dropdowns. They are in the page code but were not seen on screen.
- **HYP-H:** the UX-016 link defect may also affect other products or domains that have variants.

## Validation plans (not yet run with people)

- **UX-017:** 8–10 participants on their own phones, compare two prototypes (Text in the bottom bar vs a template with text fields). Observe rather than ask, with PM, design and engineering watching live.
- **UX-018:** fake-door "save without registering" button; Clarity data on reloads and exits from `/studio/`.
- **UX-019:** test 3 versions of the template card with 8–10 participants; measure how many notice the price change.
- **UX-021 / HYP-E:** Clarity share of sessions that open the speed list without recalculating.
- **UX-026:** funnel comparison plus an A/B test.

## Coverage (run 2)

| Workflow | SK 1440 | SK 390 | CZ/DE/AT/HU/EU 1440 |
|---|---|---|---|
| Homepage / navigation | Run 1 | Tested (menu, 3 levels) | Homepage check |
| Search + autocomplete | Run 1 | Tested | Not tested |
| Business cards: configure + Back | Run 1 | Run 1 | Tested |
| Step 2 templates / variant | Tested | Not tested | Tested (no templates) |
| Online editor | Tested | Tested (blank only) | Not tested |
| Upload: corrupt + valid PDF | Run 1 | Tested (brochure) | Tested |
| Cart edit → two-sided | Run 1 | Not tested | Tested |
| Delivery/payment Back and reload | Run 1 | Not tested | Tested |
| Brochures | Run 1 | Tested | Not tested |
| Flyers | Tested | Not tested | Not tested |
| Posters (custom size) | Tested | Not tested | Not tested |
| Quantity keyboard/paste | Tested | Not tested | Not tested |
| Customer details → review → payment | Blocked (e-mail step) | Blocked | Blocked |

**Not tested:** interrupted upload; invalid discount code; addresses and VAT; banners; 320 px in this run; real devices; Safari/Firefox.
