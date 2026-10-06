// Alle cases op één plek. Nieuwe case toevoegen = object toevoegen aan deze lijst.
// Media verwijzen naar namen uit src/assets/media (zie scripts/build-media.sh).
// Resultaten en context zijn bewust placeholders: niets verzinnen.
// TODO XPSR: per case klant, branche, deliverables, resultaat (cijfer) en eventuele klantquote aanleveren.

const P = '[PLACEHOLDER]';
const R = '[RESULTAAT]';

export const CASES = [
  {
    slug: 'boterlap',
    client: 'Boterlap',
    branch: 'Horeca en food',
    made: 'Foto en video',
    result: R,
    featured: true,
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
  {
    slug: 'reym',
    client: 'REYM',
    branch: 'Industrie en techniek',
    made: 'Video: een dag uit het leven van Juri',
    result: R,
    featured: true,
    cover: { name: 'reym-een-dag-uit-het-leven-van-juri', alt: 'Juri van REYM zet zijn helm en masker op' },
    heroMotion: 'loop-reym-juri',
    question: P,
    approach: P,
    outcome: P,
    gallery: [
      { name: 'reym-een-dag-uit-het-leven-van-juri', alt: 'Juri van REYM met helm en masker' },
      { name: 'reym-locatie', alt: 'Luchtfoto van een REYM-locatie' },
    ],
  },
  {
    slug: 'de-zwarte-boer',
    client: 'De Zwarte Boer',
    branch: 'Horeca en food',
    made: 'Foodstyling en fotografie',
    result: R,
    featured: true,
    cover: { name: 'zwarte-boer-foodstyling', alt: 'Gestyled gerecht van De Zwarte Boer' },
    question: P,
    approach: P,
    outcome: P,
    gallery: [],
  },
  {
    slug: 'rosel',
    client: 'Rosèl',
    branch: 'Horeca en food',
    made: 'De lekkerste broodjeszaak van Amsterdam',
    result: R,
    cover: { name: 'rosel-de-lekkerste-broodjeszaak-van-amsterdam', alt: 'Gast van Rosèl met een broodje' },
    question: P,
    approach: P,
    outcome: P,
    gallery: [{ name: 'rosel-bts', alt: 'Behind the scenes bij Rosèl' }],
  },
  {
    slug: 'stelz',
    client: 'Stëlz Hard Drinks',
    branch: 'Events',
    made: 'Lancering',
    result: R,
    cover: { name: 'stelz-hard-drinks-launch', alt: 'Koelkast met Stëlz Hard Drinks tijdens de lancering' },
    question: P,
    approach: P,
    outcome: P,
    gallery: [],
  },
  {
    slug: 'block',
    client: 'Block',
    branch: 'Zakelijk', // TODO XPSR: branche bevestigen.
    made: 'Corporate fotografie',
    result: R,
    cover: { name: 'block-corporate', alt: 'Drie mannen in een witte studio voor Block' },
    question: P,
    approach: P,
    outcome: P,
    gallery: [],
  },
];

export const FEATURED = CASES.filter((c) => c.featured);

export function getCase(slug) {
  return CASES.find((c) => c.slug === slug);
}

export function nextCase(slug) {
  const i = CASES.findIndex((c) => c.slug === slug);
  return CASES[(i + 1) % CASES.length];
}
