/*
 * Rollen van het vizier per sectie op de homepage. Fracties van het scherm, of functies die meten.
 * Elke overgang scrubt tussen "top bottom" en "top top" van de volgende sectie,
 * dus metingen gaan uit van: sectie-top staat op de viewport-top.
 */

const H = () => window.innerHeight;
const q = (sel) => document.querySelector(sel);

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

export function homeStops() {
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
      // Diensten: de camera-tekening en de zoeker zijn het vizier; punt en ring uit beeld.
      trigger: '.s-services',
      dot: { x: 0.5, y: 0.5, scale: 0.3, opacity: 0 },
      ring: { x: 0.5, y: 0.5, scale: 0.3, rotate: 540, opacity: 0 },
      aperture: 0.9,
    },
    {
      // Tijdlijn: de afspeelkop is het vizier; punt en ring uit beeld.
      trigger: '.s-dayline',
      dot: { x: 0.5, y: 0.5, scale: 0.3, opacity: 0 },
      ring: { x: 0.5, y: 0.5, scale: 0.3, rotate: 360, opacity: 0 },
      aperture: 0.5,
    },
    {
      // Exposure: het beeld zelf is de belichtingsmeter; vizier uit beeld.
      trigger: '.s-exposure',
      dot: { x: 0.5, y: 0.5, scale: 0.3, opacity: 0 },
      ring: { x: 0.5, y: 0.5, scale: 0.4, rotate: 1080, opacity: 0 },
      aperture: 1,
    },
    {
      trigger: '.s-about',
      dot: { x: 0.94, y: 0.14, scale: 0.6 },
      ring: { x: 0.94, y: 0.14, scale: 0.42, rotate: 900, opacity: 0.8 },
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
