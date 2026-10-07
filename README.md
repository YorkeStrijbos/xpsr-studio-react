# XPSR Studio website

Film, foto en social voor de industrie, uit Harderwijk. Concept (V2): **Industrie in het juiste licht**. Een camera die een donkere fabriekshal binnenloopt; het vizier (REC-punt, diafragmaring, zoekerhoeken) reist door de hele pagina.

## Draaien

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # productie-build in dist/
```

Routing gebeurt client-side (React Router). De host moet onbekende paden dus naar `index.html` sturen (SPA-fallback).

## Structuur

- `src/data/site.js`: alle copy (hero, statement, probleem, beeldwolk, diensten, band, over, garantie, footer), contact en klanten.
- `src/data/cases.js`: alle cases. Nieuwe case = nieuw object in de lijst.
- `src/styles/tokens.css`: kleur, typografie, ruimte en motion-tokens. `src/lib/motion.js` spiegelt de easing en duren voor GSAP.
- `src/components/Aperture.jsx`: preloader en paginatransitie (diafragma). Gebruik `ApertureLink` voor interne links.
- `src/components/home/`: de homepage-secties (hero met vonken, statement met diafragma, probleem met beeldwolk, cases met laserscan, technische tekening, lopende band, stapelkoppen, garantiemeter).
- `src/motion/`: vizier (`viewfinder.js`, rollen per sectie in `stops.js`), diafragma-geometrie (`iris.js`), vonken (`sparks.js`), scramble.
- `src/components/Footer.jsx`: diafragmaboog met REC-knop, op elke pagina.
- `src/components/Media.jsx`: `Picture` (AVIF/WebP met srcset) en `LoopVideo` (lazy, met pauzeknop).

## Media

Bronbestanden staan in `src/assets/images`. `scripts/build-media.sh` zet ze om naar `src/assets/media`:
stills naar AVIF en WebP (640 px en volle breedte) plus JPG, en bewegend beeld naar H.264 mp4, VP9 webm en een poster.
Daarna verwijs je in de data-bestanden naar de naam (zonder breedte of extensie).

```bash
FFMPEG=/pad/naar/ffmpeg ./scripts/build-media.sh   # vereist ImageMagick en een ffmpeg met libx264 en libvpx
```

## Nog aan te leveren

Alles wat nog ontbreekt, staat in de code als `TODO XPSR:`, `[PLACEHOLDER]` of `[RESULTAAT]`:

```bash
grep -rn "TODO XPSR\|\[PLACEHOLDER\]\|\[RESULTAAT\]" src index.html
```

## Copyregels

Geen em dashes. Geen verzonnen cijfers, resultaten of quotes. Websites en AI horen bij hovr.it, niet op deze site.
