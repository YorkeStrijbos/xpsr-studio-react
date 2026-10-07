// Alle cases op één plek. Nieuwe case = object toevoegen. Volgorde = volgorde op de site.
// Media verwijzen naar namen uit src/assets/media (zie scripts/build-media.sh).
// Niets verzinnen: resultaat en context blijven placeholders tot XPSR ze aanlevert.
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

// Op de homepage: alle industriecases plus één afsluiter "Ook buiten de hal".
export const HOME_CASES = [...CASES.filter((c) => c.industry), CASES.find((c) => c.slug === 'de-zwarte-boer')];

export function getCase(slug) {
  return CASES.find((c) => c.slug === slug);
}

export function nextCase(slug) {
  const i = CASES.findIndex((c) => c.slug === slug);
  return CASES[(i + 1) % CASES.length];
}
