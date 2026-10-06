# XPSR Studio website

Productiestudio voor foto, video en social uit Harderwijk. Concept: **Belichting**. De site is een donkere studio, en wat de bezoeker belicht, wordt zichtbaar.

## Draaien

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # productie-build in dist/
```

Routing gebeurt client-side (React Router). De host moet onbekende paden dus naar `index.html` sturen (SPA-fallback).

## Structuur

- `src/data/site.js`: alle copy, contactgegevens, klanten, diensten, branches en team.
- `src/data/cases.js`: alle cases. Nieuwe case = nieuw object in de lijst.
- `src/styles/tokens.css`: kleur, typografie, ruimte en motion-tokens. `src/lib/motion.js` spiegelt de easing en duren voor GSAP.
- `src/components/Aperture.jsx`: preloader en paginatransitie (diafragma). Gebruik `ApertureLink` voor interne links.
- `src/components/Hero.jsx`: spotlight-hero.
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
