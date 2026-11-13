// Alle cases op één plek. Nieuwe case = object toevoegen. Volgorde = volgorde op de site.
// Media verwijzen naar namen uit src/assets/media (zie scripts/build-media.sh).
// Niets verzinnen: resultaat en context blijven placeholders tot XPSR ze aanlevert. Placeholders worden nooit getoond.
// Bewijs per case (alleen echt, door XPSR aangeleverd): result (één regel), quote { text, name, role }, year, credits [].
// TODO XPSR: per industriecase 1 loop van 4 tot 6 s, 6 tot 10 stills, resultaat en toestemming aanleveren.
// TODO XPSR: copy check op alle "made" en "line"-teksten.

const P = '[PLACEHOLDER]';
const R = '[RESULTAAT]';

export const CASES = [
  {
    slug: 'reym',
    client: 'REYM',
    branch: 'Industriële reiniging',
    made: 'Recruitmentfilm',
    line: 'Een dag uit het leven van Juri, van helm op tot klus geklaard.',
    result: R,
    industry: true,
    cover: { name: 'reym-een-dag-uit-het-leven-van-juri', alt: 'Juri van REYM zet zijn helm en masker op' },
    heroMotion: 'loop-reym-juri',
    question: P,
    approach: P,
    outcome: P,
    gallery: [{ name: 'reym-locatie', alt: 'Luchtfoto van een REYM-locatie' }],
  },
  {
    slug: 'wiko',
    client: 'WIKO',
    branch: 'Industrie',
    made: P,
    line: P,
    result: R,
    industry: true,
    cover: null,
    question: P,
    approach: P,
    outcome: P,
    gallery: [],
  },
  {
    slug: 'e-tronic',
    client: 'E-tronic',
    branch: 'Installatietechniek',
    made: 'Social content', // TODO XPSR: bevestigen.
    line: P,
    result: R,
    industry: true,
    cover: null,
    question: P,
    approach: P,
    outcome: P,
    gallery: [],
  },
  {
    slug: 'hbm-machines',
    client: 'HBM Machines',
    branch: 'Machinebouw',
    made: P,
    line: P,
    result: R,
    industry: true,
    cover: null,
    question: P,
    approach: P,
    outcome: P,
    gallery: [],
  },
  {
    slug: 'lichtbedrijf',
    client: 'Lichtbedrijf',
    branch: 'Techniek',
    made: P,
    line: P,
    result: R,
    industry: true,
    cover: null,
    question: P,
    approach: P,
    outcome: P,
    gallery: [],
  },
  {
    slug: 'de-zwarte-boer',
    client: 'De Zwarte Boer',
    branch: 'Horeca',
    made: 'Foodstyling en fotografie',
    line: 'Ook buiten de hal: gerechten die je wilt bestellen.',
    result: R,
    industry: false,
    cover: { name: 'zwarte-boer-foodstyling', alt: 'Gestyled gerecht van De Zwarte Boer' },
    question: P,
    approach: P,
    outcome: P,
    gallery: [],
  },
  {
    slug: 'boterlap',
    client: 'Boterlap',
    branch: 'Horeca',
    made: 'Foto en video',
    line: P,
    result: R,
    industry: false,
    cover: { name: 'boterlap-in-de-keuken', alt: 'Chef van Boterlap snijdt een gerecht aan' },
    heroMotion: 'reel-boterlap-tafel',
    question: P,
    approach: P,
    outcome: P,
    gallery: [
      { name: 'boterlap-gerechten', alt: 'Gerechten van Boterlap van bovenaf' },
      { name: 'boterlap', alt: 'Cocktail op een marmeren bar bij Boterlap' },
      { name: 'boterlap-in-de-keuken', alt: 'Chef van Boterlap aan het werk in de keuken' },
    ],
  },
];

/** Een tekstveld telt pas als het echt is ingevuld (geen "[PLACEHOLDER]" of "[RESULTAAT]"). */
export const filled = (t) => typeof t === 'string' && t.trim() !== '' && !t.trim().startsWith('[');

/** Gepubliceerd = er is beeld. Alleen deze cases worden getoond en gelinkt: een lege case is erger dan geen case. */
export const hasMedia = (c) => !!(c.cover || c.heroMotion);
export const PUBLISHED = CASES.filter(hasMedia);

export function getCase(slug) {
  return CASES.find((c) => c.slug === slug);
}

/** Volgende gepubliceerde case (rondgaand). */
export function nextCase(slug) {
  const i = PUBLISHED.findIndex((c) => c.slug === slug);
  return PUBLISHED[(i + 1) % PUBLISHED.length];
}
