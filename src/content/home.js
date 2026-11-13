/*
 * Alle copy van de homepage op één plek. Teksten uit de redesign-brief (13 november), tenzij gemarkeerd.
 * Regels: geen em dashes, geen verzonnen claims, cijfers of quotes. De homepage is breed (alle sectoren);
 * branche-specifieke taal hoort op /branche/:slug (src/content/branches.js).
 */

export const META = {
  title: 'XPSR Studio | Film, foto en social content',
  description: 'Film, foto en social content. Productiehuis uit Harderwijk.',
};

export const HERO = {
  claim: ['Jullie maken het.', 'Wij laten het zien.'],
  sub: 'Film, foto en social content voor bedrijven die beter zijn dan hun beeld nu laat zien. Eén team, van idee tot laatste formaat.',
  primary: 'Bekijk de reel',
  secondary: 'Plan een draaidag',
};

export const MANIFEST = {
  // De doorstreping op "bedrijfsfilmpje." blijft.
  rows: [['Geen', { struck: 'bedrijfsfilmpje.' }], ['Een reden', 'om voor jullie'], ['te kiezen.']],
  accent: 'Geen stock. Geen saai. Gewoon echt.',
  body: 'De meeste bedrijven doen mooier werk dan hun content laat zien. Wij draaien dat om, met film en foto die werven, uitleggen en verkopen.',
};

export const STATEMENTS = {
  lines: [
    'Je zoekt mensen. Zij zoeken een plek die goed voelt.',
    'Je product is goed. Alleen snapt niemand het in één keer.',
    'Wat jullie doen is indrukwekkend. Alleen weet niemand het.',
  ],
  turn: 'Tijd om de lichten aan te zetten.',
};

export const WORK = {
  // TODO XPSR: kop kiezen uit de drie voorstellen; nu staat voorstel A.
  headingOptions: ['Dit lieten we zien.', 'Zo zag het eruit.', 'Recent in beeld.'],
  heading: 'Dit lieten we zien.',
  all: 'Al het werk',
};

// Diensten: copy uit de brief; ar en cam zijn de formaten en camera-instellingen in het onderschrift van de kaart.
// media: still of loop uit src/assets/media, of leeg. TODO XPSR: per dienst een eigen loop aanleveren.
export const SERVICES_HEADING = ['Eén draaidag.', 'Zes opbrengsten.'];
export const SERVICES = [
  { code: 'A-01', title: 'Bedrijfsfilm', label: 'Bedrijfsfilm', line: 'Wie jullie zijn, in 90 seconden.', ar: 2.39, kind: 'scope', cam: ['ISO 400', 'F 2.8', '1/50', 'WB 5600K'] },
  { code: 'A-02', title: 'Recruitmentfilm', label: 'Recruitmentfilm', line: 'Mensen die solliciteren omdat ze de film zagen.', ar: 16 / 9, kind: 'focus', cam: ['ISO 400', 'F 2', '1/50', 'WB 4300K'] },
  { code: 'A-03', title: 'Explainer / productfilm', label: 'Productfilm', line: 'Ingewikkeld wordt in één keer duidelijk.', ar: 16 / 9, kind: 'callout', cam: ['ISO 200', 'F 5.6', '1/50', 'WB 5600K'] },
  {
    code: 'A-04',
    title: 'Fotografie',
    label: 'Fotografie',
    line: 'Mensen, producten, locaties.',
    ar: 3 / 2,
    kind: 'photo',
    cam: ['ISO 200', 'F 4', '1/250', 'WB 5600K'],
    media: { type: 'still', name: 'block-corporate', alt: 'Teamfoto in een witte studio' },
  },
  { code: 'A-05', title: 'Drone', label: 'Drone', line: 'Het overzicht dat je vanaf de grond niet ziet.', ar: 16 / 9, kind: 'drone', cam: ['ISO 100', 'F 2.8', '1/50', 'ND 16'] },
  {
    code: 'A-06',
    title: 'Social content',
    label: 'Social',
    line: 'Een maand aan content uit één dag.',
    ar: 9 / 16,
    kind: 'social',
    cam: ['ISO 800', 'F 1.8', '1/50', 'WB 5600K'],
    media: { type: 'still', name: 'social-content-behind-the-scenes', alt: 'Achter de schermen bij een social-shoot' },
  },
];

export const BRANCHES_SECTION = {
  label: 'Branches',
  // TODO XPSR: copy check op kop en kaartzinnen; dit is een voorstel, inhoud per branche volgt.
  heading: ['Elke sector', 'een eigen verhaal.'],
};

export const WERKWIJZE = {
  label: 'Werkwijze',
  heading: 'Vijf stappen, één team.',
  steps: [
    { no: '01', title: 'Plan', line: 'Eén gesprek op de vloer. Daarna weten we wat de film moet doen.' },
    { no: '02', title: 'Script', line: 'Elke zin staat vast voordat de camera aangaat.' },
    { no: '03', title: 'Storyboard', line: 'Elk shot getekend, elke seconde gepland.' },
    { no: '04', title: 'Draaidag', line: 'Eén dag, VCA Vol, jullie werken gewoon door.' },
    { no: '05', title: 'Oplevering', line: 'Film, foto’s en reels binnen twee weken.' },
  ],
  // TODO XPSR: bevestigen dat het certificaat zo genoemd mag worden.
  vca: 'VCA-gecertificeerd. Welkom op locaties waar anderen niet binnenkomen.',
};

export const ABOUT = {
  label: 'Over XPSR',
  heading: { before: 'Samen één productiehuis uit', accent: 'Harderwijk.' },
  lead: 'Yorke en Liam. Fotograaf en filmmaker.',
  link: 'Over ons en onze werkwijze',
  // Feiten uit de bestaande copy, geen verzonnen cijfers. TODO XPSR: VCA Vol en de dronecertificaten bevestigen.
  facts: [
    { big: 'VCA', small: 'Vol‑gecertificeerd' },
    { big: 'C2', small: 'Drone, A1 / A2 / A3' },
    { big: '2', small: 'Makers: fotograaf en filmmaker' },
    { big: '5', small: 'Stappen, één team' },
  ],
};

// TODO XPSR: toestemming per klant checken; monochrome SVG-logo's aanleveren (fase 5).
export const CLIENTS = {
  heading: 'Ze gingen je voor.',
  names: ['REYM', 'WIKO', 'E-tronic', 'HBM Machines', 'Lichtbedrijf', 'Bij RoSa', 'Verlan', 'De Zwarte Boer', 'Buitenplaats Het Loo', 'YOUNG Group'],
};

export const CTA = {
  ask: 'Zin in een draaidag?',
  button: 'Plan een draaidag',
};

export const TAGLINE = 'Film, foto en social content. Productiehuis uit Harderwijk.';
