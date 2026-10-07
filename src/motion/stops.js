/*
 * Rollen van het vizier per sectie op de homepage. Fracties van het scherm, of functies die meten.
 * Elke overgang scrubt tussen "top bottom" en "top top" van de volgende sectie,
 * dus metingen gaan uit van: sectie-top staat op de viewport-top.
 */

const W = () => window.innerWidth;
const H = () => window.innerHeight;
const q = (sel) => document.querySelector(sel);

/** Positie van een punt in een element, ten opzichte van de top van zijn sectie. */
function within(sectionSel, el, fx, fy) {
  const s = q(sectionSel);
  const e = typeof el === 'string' ? q(el) : el;
  if (!s || !e) return { x: W() / 2, y: H() / 2, w: 0, h: 0 };
  const sr = s.getBoundingClientRect();
  const r = e.getBoundingClientRect();
  return { x: r.left + r.width * fx, y: r.top - sr.top + r.height * fy, w: r.width, h: r.height };
}

// In de hero is het vizier onzichtbaar; het wacht klein in het midden en opent pas bij het statement.
const HIDDEN = {
  dot: { x: 0.5, y: 0.5, scale: 0.2, opacity: 0 },
  ring: { x: 0.5, y: 0.5, scale: 0.4, rotate: -90, opacity: 0 },
  corners: { x: 0.5, y: 0.5, w: 0.3, h: 0.3, opacity: 0 },
  aperture: 0.2,
};

export function introStop() {
  return HIDDEN;
}

export function homeStops(wide) {
  return [
    { trigger: '.s-hero', ...HIDDEN },
    {
      trigger: '.s-statement',
      // Ring en punt blijven hier uit beeld: het statement heeft zijn eigen diafragma achter de kop.
      dot: { x: 0.5, y: 0.5, scale: 0.5, opacity: 0 },
      ring: { x: 0.5, y: 0.5, scale: 0.4, rotate: 90, opacity: 0 },
      corners: { x: 0.5, y: 0.5, w: 0.94, h: 0.86, opacity: 1 },
      aperture: 1,
    },
    {
      trigger: '.s-pain',
      dot: { x: 0.5, y: 0.5, scale: 0.6 },
      ring: { x: 0.5, y: 0.5, scale: 0.2, rotate: 180, opacity: 0 },
      corners: { x: 0.5, y: 0.5, w: 0.5, h: 0.5, opacity: 0 },
      aperture: 0.2,
      // De pin in Pain.jsx laat de kern groeien tot rood vlak en krimpen tot niets: daar begint de volgende overgang.
      exit: { core: 0 },
    },
    {
      trigger: '.s-cases',
      dot: wide ? { x: 0.05, y: 0.13, scale: 0.6 } : { x: 0.08, y: 0.1, scale: 0.5 },
      ring: wide ? { x: 0.95, y: 0.13, scale: 0.3, rotate: 270 } : { x: 0.92, y: 0.1, scale: 0.22, rotate: 270 },
      aperture: 0.4,
    },
    {
      trigger: '.s-blueprint',
      dot: { x: () => within('.s-blueprint', '.bp__svg', 0.5, 390 / 760).x, y: () => within('.s-blueprint', '.bp__svg', 0.5, 390 / 760).y, scale: 0.3, opacity: 0 },
      ring: {
        x: () => within('.s-blueprint', '.bp__svg', 0.5, 390 / 760).x,
        y: () => within('.s-blueprint', '.bp__svg', 0.5, 390 / 760).y,
        scale: () => (within('.s-blueprint', '.bp__svg', 0, 0).w * (256 / 1200)) / 140,
        rotate: 360,
      },
      aperture: 0.9,
    },
    {
      trigger: '.s-conveyor',
      dot: { x: 0.05, y: 0.12, scale: 0.6 },
      ring: { x: () => W() - Math.min(W() * 0.04, 64) - 40, y: () => within('.s-conveyor', '.belt__surface', 0, 0.5).y, scale: 0.4, rotate: 720 },
      aperture: 0.5,
    },
    {
      trigger: '.s-about',
      dot: wide ? { x: 0.94, y: 0.14, scale: 0.6 } : { x: 0.9, y: 0.1, scale: 0.5 },
      ring: wide ? { x: 0.94, y: 0.14, scale: 0.42, rotate: 900, opacity: 0.8 } : { x: 0.9, y: 0.1, scale: 0.3, rotate: 900, opacity: 0.8 },
      aperture: 0.3,
    },
    {
      // Draaidag: het REC-punt staat als opname-lampje naast de kop, de ring klein rechtsboven.
      trigger: '.s-dayline',
      dot: wide ? { x: 0.94, y: 0.14, scale: 0.6 } : { x: 0.9, y: 0.1, scale: 0.5 },
      ring: wide ? { x: 0.94, y: 0.14, scale: 0.42, rotate: 1080, opacity: 0.8 } : { x: 0.9, y: 0.1, scale: 0.3, rotate: 1080, opacity: 0.8 },
      aperture: 0.6,
    },
    {
      trigger: '.fa__stage',
      end: 'bottom bottom',
      // Bij "bottom bottom" staat de onderkant van de footer-stage op de onderkant van het scherm.
      dot: {
        x: 0.5,
        y: () => {
          const s = q('.fa__stage').getBoundingClientRect();
          const b = q('.fa__rec').getBoundingClientRect();
          return H() - (s.bottom - (b.top + b.height / 2));
        },
        scale: () => q('.fa__rec').offsetWidth / 20,
        opacity: 0,
      },
      ring: { x: 0.5, y: 1, scale: () => (Math.min(W() * 1.4, 1500) * 0.92) / 140, rotate: 1260, opacity: 0 },
      aperture: 0.6,
    },
  ];
}
