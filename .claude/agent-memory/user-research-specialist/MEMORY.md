# user-research-specialist – project memory (durable knowledge only)

## FigJam board CHAO3eXnEtLIs189ok50KE
- Two pages = the two top-level research sections:
  - `0:1` "Hypotézy z Clarity" (Section 1: Clarity hypotheses H-001…H-010, funnel numbers, journey phases). Large: get_figjam output >77k chars -> grep the saved file.
  - `799:252` "Používateľské testovanie" (Section 2). Existing: `1029:316` overview (cards F1–F4, walkthrough logs 30.10–2.11, night testing W5–W11), loose draft nodes at x≈6192 (1070:3xx – leave alone).
  - Added 2026-11-03: section `1111:320` "Walkthrough 3.11. · expresta.sk (UX-001–UX-015)" at (0,7400), subsections A `1111:323`, B `1112:320`, C `1112:430`, D `1112:552`, E hypotheses `1113:320`, F coverage/checklist `1113:370`.
  - Added 2026-11-03 (run 2): section `1194:326` "Walkthrough 2 · 3.11. · editor, mobil, ďalšie produkty, 6 domén (UX-016–UX-026)" at (0,17633); subsections G editor `1194:329`, H konfigurátory `1194:331`, I cross-domain+lokalizácia `1194:333` (table `1201:326`), J hypotézy `1194:335` (HYP-A…H), K pokrytie `1194:337` (table `1208:375`).
  - Someone else added top-level `1117:443` "Section 1" (old F-cards + copies of UX-001/007/015, ids 1119:xxx) and a loose `1119:500` UX-006 copy – leave alone. UX-001 copy meta line `1119:454` kept in sync with original.
  - "Affected domains" lives in each card's meta line (3rd child TEXT, e.g. `1111:332`); old coverage matrix = `1113:372` (cells are frames 'bunka' with TEXT child).
- Highest finding ID used: UX-026 (hypotheses up to HYP-H; HYP-B→UX-023, HYP-C→UX-019 confirmed). Board language: Slovak.
- Card convention: white card, colored 4px stroke; badge pill Inter Bold 16; title Inter Semi Bold 30; body Inter Regular 18–20. Orange (0.92,0.46,0) = overený/potvrdený jav, blue (0.15,0.42,0.78) = usability concern (my addition), gray (0.56) = neoverená hypotéza. Images: rectangle placeholder + upload_assets with nodeIds, scaleMode FIT.

## expresta.sk site map / selectors (as of 2026-11-03)
- No cookie banner appeared in headless sessions. Newsletter weblayer `.weblayer--box-subscription-1` pops ~8 s after load, sits above Bootstrap modals.
- /vizitky sometimes redirects to /vizitky-variation (A/B?). Brochures: /tlac-brozur (/brozury = 404).
- PDP calculator: `#amount-value` (onkeydown digit filter, onblur <1 -> 1), `#sides-value` (bootstrap-select, click `[data-id=sides-value]`), `button.calculate_price` (VYPOČÍTAŤ, appears after any change), price `#prodPriceTotal` (hidden while stale), `#next-calculation` (NÁVRH A OBJEDNÁVKA), speeds `input[name=production_speed]`, brochure pages `#pages-value`, binding drawer `[data-bs-target="#binding-box"]`.
- Scratch modal CTA `#next-design-order-submit` ("Pokračovať bez povrchovej úpravy"). Error toasts are `.toast` (auto-hide ~3 s) — poll every 200 ms.
- Flow URLs: /order/product/<slug>/templates?c=<id> -> /upload?c= (file input `input[type=file][name=upload_file]`) -> /order/shopping-cart (`.item-quantity`, `a.edit_item|duplicate_item|remove_item`, `button.minus|plus`) -> /order/delivery-payment (`label[for=delivery-type-38326]` Kuriér, `payment-type-*`) -> /order/customer-data (email gate, stops anonymous testing).
- Delivery/payment selection is not persisted on reload/re-entry.

## Cross-domain platform (verified 2026-11-03)
- All 6 domains share the same platform & selectors (#amount-value, [data-id=sides-value] + `.dropdown-menu.show li`, button.calculate_price, #next-calculation, #next-design-order-submit, upload `input[type=file][name=upload_file]`, add `#next-calculation-step-1` (= save on edit), a.edit_item/remove_item, `.show-more-btn` expands params on upload/edit page).
- Business-card slugs: sk /vizitky, cz /vizitky, de+at /visitenkarten, hu /nevjegykartya, eu /business-cards. Flyers: sk /letaky, cz /letaky, de/at /flyer, hu /szorolap-nyomtatas, eu /flyer-printing.
- Checkout: CZ/DE/AT/HU/EU insert `/order/special-offer` between cart and delivery (continue: POKRAČOVAT BEZ DOPLŇKŮ / OHNE ZUBEHÖR FORTFAHREN / FOLYTATÁS KIEGÉSZÍTŐK NÉLKÜL / CONTINUE WITHOUT ACCESSORIES); SK goes cart → delivery. Direct GET /order/delivery-payment redirects to cart – click through. Cart continue: POKRAČOVAŤ K OBJEDNÁVKE / POKRAČOVAT K OBJEDNÁVCE / WEITER / PÉNZTÁR / CHECKOUT (avoid "ADD MORE PRODUCTS"/"TOVÁBBI TERMÉKEK"). Delivery continue: POKRAČOVAŤ/POKRAČOVAT/WEITER/FOLYTATÁS/CONTINUE.
- EU default delivery country follows geo-IP (proxy = United States) → only DHL/UPS/FedEx; environment artifact.
- UX-001/002/003/009 reproduce on all 6 domains.
- Cookie consent: Cookiebot, no blocking banner in headless; newsletter weblayer removable via `[class*=weblayer]`.

## Online editor (Printbox) on .sk
- Step 2 CTA "VYTVORIŤ A OBJEDNAŤ" → /order/product/<slug>/studio/Blank/90x50/landscape/simplex/<c>; editor UI is in iframe name `app_iframe` (same-origin). Help bubble `.editor-icon-container` is in main DOM. Save = login gate. Reload = new projectId (work lost). Add-to-cart runs a preflight "Upozornenia" panel for templates (checkbox "Som si istý…" enables "Pokračovať napriek tomu"); blank designs pass without warning.
- On /vizitky-variation the blank CTA href is `studio//90x50…` → 404 (UX-016). Variant assigned randomly (~1 in 8 new sessions).
- Mobile 390 editor: bottom bar Fotografie/Pozadia/Nálepky only, no Text (UX-017).
- Brochures skip templates: /order/product/tlac-brozur/content-upload → /content-preview (`#continue-order`).
- PDP drawers: `[data-bs-target="#paper-box"|#size-box|#additional-params-box|#amount-box|#production-speed-selection-box]`; material filter `button.papers-filter-tag`; custom size inputs `#os-width/#os-height` after "Iný" → "Iný rozmer alebo ohyb"; manual-price modal `#price-error-modal` (close via "ZMENIŤ PARAMETRE").

## Coverage / blockers
- SK covered 2026-11-03 run 1: vizitky full path to email gate, brožúry calculator, upload edge cases, cart edits, mobile 390/320.
- Run 2 (2026-11-03): online editor desktop+390, mobile menu/search 390, brochure 390 + upload, letáky material/finishing, plagáty custom size, HYP-B/C, cross-domain UX-001/002/003/009 on CZ/DE/AT/HU/EU.
- Still not covered: Kontrola, discount code, addresses (email gate on all 6), banners, 320 px in run 2, editor/upload on non-SK domains beyond the BC journey, real devices.
- Harness blocks Write of report files (findings.md) for subagents; deliver findings in final message + FigJam.
- Evidence dir convention: /home/user/user-research/ux-evidence/<date>-expresta-<domain>/ (run 2: 2026-11-03-run2/) with scripts/lib.js helper (run2 lib supports domain locale: launch(vp,storage,dom)). Delete storageState files at end.
