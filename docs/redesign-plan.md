# XPSR Studio: redesign-plan (Awwwards-ronde)

Status: **concept, wacht op akkoord.** Er wordt geen fase gestart voordat de beslispunten hieronder zijn beantwoord.

Leidende principes: beheersing boven effect, één idee per scherm, productiewaarde is de boodschap, één accentkleur, één typografisch systeem. Twijfel: weglaten.

Werkwijze per fase: bouwen, `node scripts/screenshots.mjs` draaien en de eigen screenshots kritisch beoordelen tegen de acceptatiecriteria, fixen, geen console errors of warnings, fase afvinken in dit document, git commit, korte samenvatting.

---

## Beslispunten (eerst beantwoorden)

Deze brief draait een paar recente, expliciete keuzes terug. Standaard volgt het plan de brief; per punt kies jij.

| # | Brief | Huidige stand (eerder door jou gevraagd) | Standaard in dit plan |
|---|---|---|---|
| B1 | Neutraal diep zwart, geen rode of bordeaux tint, geen rode gradients als achtergrond | Warm zwart met rode ondertoon, rood-zwart vlak in de statements, rode footer (ember) | Brief: neutraal zwart, rood alleen functioneel |
| B2 | Secundaire knop: outline in dezelfde off-white als de navtekst | Limoen-crème accent uit het kleurvoorbeeld | Brief: off-white |
| B3 | Camera-overlay in hero en statements, subtiel | Overlay uit de hero gehaald, versimpeld in de statements | Brief: subtiel terug in de hero |
| B4 | Statements als donkere video-scène die bij statement 4 opengaat | Rood-zwart gradientvlak | Brief: video-scène (met foto-fallback) |
| B5 | Huidig uncommitted werk (hero, kleuren, overgangen) | Nog niet gecommit | Eerst een checkpoint-commit vóór fase 1 |

Daarnaast vraagt de brief binnen de fases om keuzes van jou: de bodyfont (fase 1, drie opties), de kop van uitgelicht werk (fase 2, drie opties) en de hero-variant (fase 3, feature flag).

---

## Uitgangspositie (audit, 13 november)

Volledige bevindingen en screenshots: `screenshots/audit/` (1440 en 390, per sectie en full-page, `/cases` en alle casepagina's, plus `audit.json`).

- Industrie-taal in hero, manifest, statements, beeldwolk, diensten, cases-kop, klanten-kop en meta (`src/data/site.js`, `index.html`, `CasesRail.jsx`, `AboutCream.jsx`).
- 11 keer NO SIGNAL op de homepage, 13 op de casepagina's; 6 van de 7 casepagina's tonen letterlijk "[PLACEHOLDER]" en "[RESULTAAT]".
- Contrast onder AA: muted op crème (4,1), tweede rij klanten (2,67), kleine rode labels op zwart (3,0), HUD-tekst op rood (±4,2).
- Bodyfont is systeem-Arial; geladen fonts: alleen Anton 400 en JetBrains Mono 400/500.
- Lege scroll: einde hero-pin, begin en tussenpozen van de statements-pin, beeldwolk.
- Cursor "bekijk" op de hele beeldwolk zonder klikbare tegels.
- Nav: bovenaan transparant, daarna 92% dekkend; de vizier-REC-stip zweeft los in het crème paneel.
- Knoppen: verschillende hoogtes (36, 40, 52 px) en kleuren; dubbele CTA's ("Plan een draaidag" 3×, reel 2×).
- 390 px: geen horizontale scroll, maar de hero-kop staat krap op elkaar en de statements tonen vaak een leeg rood vlak.

---

## Fase 1: Design system

**Taken**
- [ ] `docs/DESIGN.md` als bron van waarheid: kleur, typografie, spacing, grid, knoppen, nav, motion.
- [ ] Kleurtokens (`src/styles/tokens.css`): neutraal diep zwart, één warm off-white, één lichte crème, één accentrood. Alle andere kleuren en hardcoded hex/rgba uit componenten en CSS weg. Rood alleen voor REC/live, primaire CTA, actieve states en maximaal één accentwoord per kop.
- [ ] Rode achtergronden en gradients weg (statements, footer, diensten-gloed, hero-zweem), afhankelijk van B1.
- [ ] Display: Anton behouden, tracking zo dat letters elkaar nergens raken (controle in de kop van de hero en het manifest).
- [ ] Bodyfont: drie premium grotesk-opties met licentie-info en een screenshot van elk in de manifest-sectie; wachten op keuze; daarna laden (self-hosted, `font-display: swap`, preload).
- [ ] Mono alleen voor camera-UI, labels en specs.
- [ ] Vloeiende typeschaal met `clamp()`; body minimaal 17 px, regelhoogte 1,5, maximaal 65 tekens per regel; `hyphens: manual`, geen afbreekstreepjes midden in samengestelde woorden ("Vol-gecertificeerd" wordt niet meer afgebroken; non-breaking hyphen waar nodig).
- [ ] Spacing: drie sectiehoogtes (s, m, l) en een 12-koloms grid met vaste marges; alle secties erop.
- [ ] Knoppen: primair (rood, gevuld) en secundair (outline, zelfde off-white als navtekst); overal dezelfde hoogte (min. 48 px), padding, radius, hover en focus. Chips, accordion-knoppen en pauzeknop op minimaal 44 px.
- [ ] Nav: groter logo; items Werk, Diensten, Branches, Over ons, Contact; primaire CTA "Plan een draaidag"; "Reel" als secundaire knop. Achtergrond dekkend (of voldoende blur) vanaf de eerste scroll. Losse vizier-REC-stip buiten hero en statements weg.
- [ ] Motion tokens terugbrengen naar twee easings en drie duraties (`src/lib/motion.js` en `tokens.css`).

**Bestanden**: `docs/DESIGN.md`, `src/styles/tokens.css`, `src/styles/*.css`, `src/lib/motion.js`, `src/components/Nav.jsx`, `index.html` (font-preload), `public/fonts/`.

**Acceptatie**: geen hardcoded kleur, fontgrootte of spacing in componenten (grep op `#`, `rgb(`, `px` in component-CSS geeft alleen tokens); screenshots tonen één rustig, consistent systeem; alle tekst AA.

## Fase 2: Copy en structuur

**Taken**
- [ ] Alle copy in één content-bestand (`src/content/home.js`, later per pagina), met de teksten uit de brief: hero, manifest (doorstreping behouden), vier statements, zes diensten, klanten "Ze gingen je voor.", VCA-regel, CTA, footer en meta-description.
- [ ] Drie voorstellen voor de kop van uitgelicht werk; wachten op keuze.
- [ ] Volgorde homepage: hero, zoom naar reel, manifest, statements, uitgelicht werk, één draaidag zes opbrengsten, branches, werkwijze, over ons (met foto-strip), klanten, CTA, footer.
- [ ] Beeldwolk met filters weg van de homepage; wordt `/cases` met toggle Wall / Lijst (uitgewerkt in fase 5).
- [ ] Nieuwe sectie Branches: grote beeldkaarten (industrie, bouw, horeca, events, zorg, retail) met één zin en link naar `/branche/:slug`.
- [ ] Branche-template `/branche/:slug`, gevoed door `src/content/branches.js` (titel, intro, hero-media, relevante cases, diensten, FAQ, meta). Alleen structuur en voorbeeldvelden.
- [ ] Werkwijze-sectie op de homepage (kort; de uitgebreide draaidag-tijdlijn blijft op `/over-ons`).
- [ ] Industrie-taal van de homepage en uit de meta; die komt terug op `/branche/industrie`.

**Bestanden**: `src/content/*.js`, `src/data/site.js` (afbouwen), `src/pages/Home.jsx`, nieuw `src/pages/Branche.jsx`, `src/components/home/Branches.jsx`, `src/components/home/Werkwijze.jsx`, `src/App.jsx`, `index.html`.

**Acceptatie**: grep op industrie-termen in homepage-copy en meta geeft niets; elke sectie is in één zin samen te vatten; geen copy buiten de brief gewijzigd zonder voorleggen.

## Fase 3: Hero en reel

**Taken**
- [ ] Hero-montage: footage in en achter de kop wisselt tussen sectoren; slots `hero-01` t/m `hero-08` in `/public/media`, 1 tot 2 s per shot, harde cuts op ritme. Fallback per slot op bestaande assets; slots zonder bestand worden overgeslagen.
- [ ] Video-in-letters: hoge resolutie, kleurgecorrigeerd, contrast zodat elk woord leesbaar is (lichte rand of minimale helderheid in de letters).
- [ ] Variant met effen off-white kop en inline video-pil achter een feature flag (`?hero=pil` en een constante in de config).
- [ ] Zoom door de letters naar fullscreen behouden; rustige easing, geen schokken; eindigt op een fullscreen reel met geluidsknop (standaard muted) en "Bekijk de volledige reel".
- [ ] Volledige reel in een toegankelijke fullscreen player: Esc sluit, focus trap, focus terug naar de knop.
- [ ] Hero toont geen tweede set knoppen die gelijk is aan de nav.

**Bestanden**: `src/components/home/HeroZoom.jsx`, `src/components/Reel.jsx`, `src/data/media.js`, `src/styles/home.css`, `src/styles/reel.css`, `public/media/README.md`.

**Acceptatie**: binnen vijf seconden zichtbaar dat XPSR voor meerdere sectoren werkt; kop op elk moment leesbaar; player volledig met toetsenbord te bedienen.

## Fase 4: Statements als één scène

**Taken**
- [ ] Eén gepinde scène met de vier statements; geen rode achtergrond.
- [ ] Achtergrond: scrubbare video `statement-scene.mp4` (preload none, src laden als de sectie nadert, korte GOP), donker en onderbelicht tijdens statement 1 t/m 3, zichtbaar open naar vol licht bij statement 4.
- [ ] Zolang de video ontbreekt: donkere foto die bij statement 4 overgaat in een lichte foto. Nooit een lege gradient.
- [ ] Elk statement licht woord voor woord op terwijl je scrolt en is op zijn eindpunt volledig leesbaar; geen lege scroll tussen statements.
- [ ] Reduced motion: alleen de eindframe met alle statements leesbaar. Mobiel: geen scrub, crossfade begin- naar eindframe.
- [ ] Camera-overlay subtieler, alleen hier en in de hero.

**Bestanden**: `src/components/home/Pain.jsx` (wordt `Statements.jsx`), `src/components/home/CameraHud.jsx`, `src/styles/home.css`, `src/data/media.js`.

**Acceptatie**: "Tijd om de lichten aan te zetten" heeft een duidelijk visueel effect; op geen enkel scrollpunt een scherm zonder inhoud (gecontroleerd met screenshots op 0, 10, 20 … 100% van de pin).

## Fase 5: Werk

**Taken**
- [ ] Homepage: uitgelicht werk met 4 tot 6 cases, groot, hover speelt een korte muted loop, cursor "Bekijk". Cases zonder media worden niet getoond.
- [ ] `/cases`: wall met filters (Alle plus alleen branches die cases hebben) en een Lijst-weergave (casenaam, branche, type, jaar) met een video-preview die de cursor volgt; filterwissel met GSAP Flip.
- [ ] NO SIGNAL maximaal één keer op de hele site, als bewuste knipoog.
- [ ] Casepagina's: shared element transition vanaf de thumbnail, hero-video, korte intro, beeldreeks, credits, naadloze overgang naar de volgende case. Geen zichtbare "[PLACEHOLDER]" of "[RESULTAAT]": lege velden worden niet getoond.
- [ ] Klanten: alle namen gelijkwaardig (zelfde grootte en gewicht), klaar voor monochrome SVG-logo's; hover toont een still uit het project.

**Bestanden**: `src/components/home/CasesRail.jsx` (wordt `FeaturedWork.jsx`), `src/pages/Cases.jsx`, `src/pages/CaseDetail.jsx`, `src/data/cases.js`, `src/components/home/AboutCream.jsx` (klanten), `src/components/Aperture.jsx` (overgang).

**Acceptatie**: nul placeholders zichtbaar; NO SIGNAL hoogstens één keer; shared element transition zonder sprong.

## Fase 6: Eén draaidag, zes opbrengsten

**Taken**
- [ ] Desktop: gepinde scène waarin één ruwe clip zich op scroll opsplitst in zes formaten (16:9 bedrijfsfilm, 9:16 social, foto-contactsheet, drone, recruitmentfilm, explainer), elk met mono-label en specs.
- [ ] Mobiel: verbeterde accordion, inactieve items op voldoende contrast.
- [ ] Kop schuift nooit zichtbaar onder de nav door.

**Bestanden**: nieuw `src/components/home/ServicesSplit.jsx`, `src/components/home/ServicesList.jsx` (mobiel), `src/styles/home.css`.

**Acceptatie**: elk formaat herkenbaar en gelabeld; geen lege scroll; mobiel zonder pin.

## Fase 7: Usability en toegankelijkheid

**Taken**
- [ ] Cursor alleen bij pointer: fine; "Play" alleen boven afspeelbare media, "Bekijk" alleen boven klikbare cases met inhoud, "Sleep" alleen boven sleepbare elementen; elders de kleine stip; nooit over tekst of knoppen.
- [ ] Zichtbare focus states, skip-link, logische tab-volgorde, alt-teksten, aria-labels op icoonknoppen.
- [ ] Contrastrapport van alle tekst, ook op rood en op footage (gemeten per sectie met het script).
- [ ] Mobiel: fullscreen menu, touch-targets minimaal 44 px, geen horizontale scroll, gepinde secties met vereenvoudigde varianten.

**Bestanden**: `src/components/Cursor.jsx`, `src/components/Nav.jsx`, `scripts/screenshots.mjs` (contrastrapport uitbreiden), diverse componenten.

**Acceptatie**: alle tekst AA; volledige site met toetsenbord te bedienen; geen cursor-state zonder actie.

## Fase 8: Afwerking en performance

**Taken**
- [ ] Paginaovergangen tussen home, `/cases`, casepagina's en branchepagina's in dezelfde bewegingstaal.
- [ ] Preloader alleen bij eerste bezoek per sessie, maximaal 1,5 s (nu 1,3 s, controleren).
- [ ] Favicon, Open Graph-afbeelding en meta per pagina (ook per branche), 404 in huisstijl.
- [ ] Afbeeldingen AVIF/WebP met srcset, video's met posters en lazy loading, display-font preloaden, `font-display: swap`; de JS-bundel van meer dan 500 kB opsplitsen per route.
- [ ] Lighthouse (mobiel) op home, `/cases`, een casepagina en een branchepagina. Doel: performance 85+, accessibility 95+, best practices 95+, SEO 95+.
- [ ] Laatste screenshotronde op 1440, 1024 en 390 px, met en zonder reduced motion; kritische lijst van wat nog beter kan.

**Bestanden**: `src/components/Aperture.jsx`, `src/lib/usePageTitle.js` (wordt meta per pagina), `index.html`, `public/`, `vite.config.js`, `scripts/build-media.sh`.

**Acceptatie**: Lighthouse-doelen gehaald en gerapporteerd; geen console errors of warnings op alle pagina's.

---

## Opleveren (na fase 8)
- Lijst van alle media-slots: bestandsnaam, waar gebruikt, afmetingen, lengte, formaat en encode-instellingen (scrub-video's met korte GOP, bijvoorbeeld een keyframe per frame of per twee frames).
- Lijst van open punten en bewuste keuzes.
