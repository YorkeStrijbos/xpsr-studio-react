/*
 * Rollen van het vizier per sectie op de homepage. Fracties van het scherm, of functies die meten.
 * Elke overgang scrubt tussen "top bottom" en "top top" van de volgende sectie,
 * dus metingen gaan uit van: sectie-top staat op de viewport-top.
 */

const H = () => window.innerHeight;
const q = (sel) => document.querySelector(sel);

// In de hero is het vizier onzichtbaar (de hero heeft een eigen zoeker); het wacht klein in het midden tot het probleem.
const HIDDEN = {
  dot: { x: 0.5, y: 0.5, scale: 0.2, opacity: 0 },
  ring: { x: 0.5, y: 0.5, scale: 0.4, rotate: -90, opacity: 0 },
  corners: { x: 0.5, y: 0.5, w: 0.3, h: 0.3, opacity: 0 },
  aperture: 0.2,
};

export function introStop() {
  return HIDDEN;
}

export function homeStops() {
  return [
    { trigger: '.s-hero', ...HIDDEN },
    {
      trigger: '.s-pain',
      // Punt blijft uit: het rode vlak komt nu zelf van onderen op (zie Pain.jsx).
      dot: { x: 0.5, y: 0.5, scale: 0.6, opacity: 0 },
      ring: { x: 0.5, y: 0.5, scale: 0.2, rotate: 180, opacity: 0 },
      corners: { x: 0.5, y: 0.5, w: 0.5, h: 0.5, opacity: 0 },
      aperture: 0.2,
      // De pin in Pain.jsx laat de kern groeien tot rood vlak en krimpen tot niets: daar begint de volgende overgang.
      exit: { core: 0 },
    },
    {
      // Diensten en cases: rustige secties zonder vizier; punt en ring uit beeld.
      trigger: '.s-services',
      dot: { x: 0.5, y: 0.5, scale: 0.3, opacity: 0 },
      ring: { x: 0.5, y: 0.5, scale: 0.3, rotate: 540, opacity: 0 },
      aperture: 0.9,
    },
    {
      trigger: '.s-cases',
      dot: { x: 0.5, y: 0.5, scale: 0.3, opacity: 0 },
      ring: { x: 0.5, y: 0.5, scale: 0.4, rotate: 720, opacity: 0 },
      aperture: 1,
    },
    {
      // Crème paneel: alleen het rode REC-punt rechtsboven, de lichte ring zou wegvallen.
      trigger: '.s-about',
      dot: { x: 0.94, y: 0.14, scale: 0.6 },
      ring: { x: 0.94, y: 0.14, scale: 0.42, rotate: 900, opacity: 0 },
      aperture: 0.3,
    },
    {
      // Het REC-punt eindigt als de grote REC-knop in de footer: het reist erheen en gaat erin op.
      trigger: '.fa__stage',
      end: 'bottom bottom',
      dot: {
        x: 0.5,
        y: () => {
          const s = q('.fa__stage').getBoundingClientRect();
          const b = q('.rec').getBoundingClientRect();
          return H() - (s.bottom - (b.top + b.height / 2));
        },
        scale: () => q('.rec').offsetWidth / 20,
        opacity: 0,
      },
      ring: { x: 0.5, y: 0.6, scale: 0.6, rotate: 1260, opacity: 0 },
      aperture: 0.6,
    },
  ];
}
