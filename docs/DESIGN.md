# XPSR Studio: design system

Bron van waarheid voor kleur, typografie, ruimte, knoppen, nav en motion. De implementatie staat in
`src/styles/tokens.css` (CSS) en `src/lib/motion.js` (GSAP). Componenten gebruiken alleen deze tokens:
geen losse kleuren, lettergroottes of afstanden.

Principes: beheersing boven effect, één idee per scherm, één accentkleur, één typografisch systeem.

## Kleur

| Token | Waarde | Gebruik |
|---|---|---|
| `--black` | #0A0A0A | achtergrond van alle donkere secties |
| `--surface` | #141414 | kaarten en vlakken op zwart |
| `--surface-2` | #1E1E1E | verhoogd vlak, hover |
| `--white` | #F2EDE4 | off-white: tekst op zwart, navtekst, secundaire knop |
| `--grey` | #A39E96 | secundaire tekst op zwart (7,4:1) |
| `--grey-2` | #C9C4BB | tertiaire koppen en labels op zwart |
| `--line` | off-white 14% | lijnen op zwart |
| `--cream` | #ECE5D8 | lichte secties |
| `--cream-ink` | #1A1816 | tekst op crème |
| `--cream-muted` | #5F5A53 | secundaire tekst op crème (5,4:1) |
| `--cream-line` | ink 14% | lijnen op crème |
| `--red` | #C8261C | het enige accent |

**Rood** alleen voor: REC- en live-indicatoren, de primaire CTA, actieve states, en hooguit één accentwoord per kop.
Rood als tekst alleen op grote koppen (24 px en groter): rood op zwart is 3,5:1, genoeg voor grote tekst, niet voor kleine.
Geen rode of bordeaux tinten in achtergronden, geen rode gradients.

Gemeten contrast: off-white op zwart 17:1, off-white op rood 4,8:1, cream-ink op crème 15:1.

Uitzondering: `#000` en `#fff` in masks (SVG-mask, CSS mask-image) zijn alfakanalen, geen kleuren.

## Typografie

- **Display**: Anton, altijd hoofdletters, tracking `--tracking-display` (0,012em) zodat letters elkaar nergens raken, regelhoogte 0,92.
- **Body**: Geist (Vercel, SIL OFL 1.1), zelf gehost als één variabel bestand (`public/fonts/Geist-Variable.woff2`), preload en `font-display: swap`. Gewichten: 400 lopende tekst, 500 lead, 700 knoppen en labels.
- **Mono**: JetBrains Mono, alleen voor camera-UI, labels en specs. Nooit kleiner dan 12 px.

Schaal (vloeiend, `clamp()`):

| Token | Bereik | Gebruik |
|---|---|---|
| `--fs-label` | 12 px | mono-labels, specs |
| `--fs-small` | 15 px | knoppen, nav, meta |
| `--fs-body` | 17 tot 19 px | lopende tekst |
| `--fs-lead` | 19 tot 24 px | intro's, subkoppen |
| `--fs-h4` | 24 tot 36 px | titels van items |
| `--fs-h3` | 32 tot 56 px | kleine koppen |
| `--fs-h2` | 44 tot 108 px | sectiekoppen |
| `--fs-h1` | 56 tot 176 px | paginakoppen |
| `--fs-mega` | 96 tot 480 px | footer-wordmark |

Regels: body regelhoogte 1,5; maximaal 65 tekens per regel (`--measure`); `hyphens: manual`, geen
afbreekstreepjes midden in samengestelde woorden (non-breaking hyphen waar een koppelteken moet blijven staan).

## Ruimte en grid

- Eén schaal: `--space-0` (4) `-1` (8) `-1h` (12) `-2` (16) `-3` (24) `-3h` (32) `-4` (40) `-5` (64) `-6` (80 tot 160) `-7` (120 tot 220).
- Drie sectiehoogtes: `--section-s` (64 tot 112), `--section-m` (96 tot 176), `--section-l` (128 tot 240). Elke sectie kiest er één (`.section--s/m/l`).
- Grid: 12 kolommen (`.grid`), kolomafstand `--col-gap`, marges `--gutter`, maximale breedte `--max` (1600 px).
- Radius: `--radius` voor beeld en kaarten, `--radius-pill` voor knoppen en chips.
- Touch: alles wat je aanraakt is minimaal `--touch` (44 px).

## Knoppen

Twee stijlen, verder identiek: hoogte `--btn-h` (48 px), padding 0 24 px, pill-radius, 15 px hoofdletters, gewicht 700.

- **Primair**: rood gevuld, off-white tekst. Eén per scherm.
- **Secundair**: outline in `--white`, exact het off-white van de navtekst.
- Hover: beide vullen zich met off-white, tekst wordt zwart. Focus: 2 px off-white outline met 3 px afstand.

## Nav

Logo groot en leesbaar (XPSR in display, STUDIO in 12 px). Items: Werk, Diensten, Branches, Over ons, Contact.
Rechts "Reel" (secundair) en "Plan een draaidag" (primair). Bovenaan transparant over de hero; vanaf de eerste
scroll volledig dekkend zwart, zodat er niets zichtbaar onder doorschuift. Verbergt bij omlaag scrollen, komt
terug bij omhoog of bij toetsenbordfocus.

## Motion

Twee easings en drie duraties, in CSS en GSAP gelijk:

| Token | Waarde | Gebruik |
|---|---|---|
| `EASE.reveal` / `--ease-reveal` | expo.out | binnenkomen: tekst, blokken, beeld |
| `EASE.move` / `--ease-move` | power3.inOut | van A naar B: transities, zoom, verdwijnen |
| `DUR.fast` / `--dur-fast` | 0,35 s | hover, kleine reacties |
| `DUR.base` / `--dur-base` | 0,7 s | transities |
| `DUR.slow` / `--dur-slow` | 1,1 s | reveals |

`EASE.linear` is geen easing maar de stand voor gescrubde tijdlijnen (gekoppeld aan scroll). In gescrubde
tijdlijnen zijn duraties verhoudingen, geen seconden. De preloader is een vaste sequentie van maximaal 1,5 s.

Reduced motion: geen pinning en geen scrub, alleen eenvoudige fades. Mobiel (< 768 px): gepinde secties hebben een
niet-gepinde variant.
