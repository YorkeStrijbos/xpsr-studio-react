// Centrale content voor XPSR Studio (V2: industrie eerst).
// Copy-regels: geen em dashes, geen verzonnen cijfers of quotes.
// TODO XPSR: copy check. Alle teksten hieronder zijn een voorstel uit de V2-brief.

export const CONTACT = {
  email: 'yorke@xpsr-studio.com',
  phone: '+31 6 551 880 54',
  phoneHref: 'tel:+31655188054',
  street: 'Pijlkruidmeen 35',
  city: '3844 PM Harderwijk',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/xpsr_studio/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/105960480/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@xpsr_studio' },
  ],
};

export const TAGLINE = 'Film, foto en social voor de industrie. Productiehuis uit Harderwijk.';

export const HERO = {
  label: 'Industrie / Techniek / Film & foto',
  // TODO XPSR: definitieve claim bevestigen.
  claim: ['Jullie bouwen het.', 'Wij laten het zien.'],
  // TODO XPSR: bevestigen dat "VCA Vol-gecertificeerd" zo genoemd mag worden.
  sub: 'Film, foto en social voor de industrie. VCA Vol-gecertificeerd, dus we draaien waar anderen niet mogen komen.',
};

export const STATEMENT = {
  rows: [
    ['Geen', { struck: 'bedrijfsfilmpje.' }],
    ['Een reden', 'om bij jullie'],
    ['te werken.'],
  ],
  // TODO XPSR: keuze tussen "Just staal. Just verhaal." en "Geen stock. Geen saai. Gewoon staal."
  punch: 'Geen stock. Geen saai. Gewoon staal.',
  body: 'Technische bedrijven maken de mooiste dingen van Nederland en laten de saaiste filmpjes zien. Wij draaien dat om. Met film die werft, uitlegt en verkoopt.',
};

export const PAIN = {
  lines: [
    'Je zoekt monteurs. Zij zoeken een werkgever die er gaaf uitziet.',
    'Je product is complex. Je klant heeft 8 seconden.',
    'Je hal is spectaculair. Niemand weet het.',
  ],
  turn: 'Tijd om de lichten aan te zetten.',
};

// Beeldwolk: 3 dieptes. Echte stills waar ze er zijn, placeholders voor industrie.
// TODO XPSR: 12 tot 14 stills aanleveren, vooral industrie (lassen, slijpen, machines, vakmensen, hallen).
export const CLOUD = [
  { name: 'one-love-cruise', alt: 'Steigerbouwers aan het werk op een gevel', depth: 1, x: 8, y: 14, w: 26 },
  { placeholder: 'Lassen', depth: 0.5, x: 40, y: 6, w: 16 },
  { name: 'block-corporate', alt: 'Team van Block in een witte studio', depth: 0.2, x: 64, y: 10, w: 11 },
  { placeholder: 'Machinebouw', depth: 1, x: 74, y: 22, w: 22 },
  { name: 'rodeo-film-bandshoot', alt: 'Band in rood licht', depth: 0.2, x: 30, y: 34, w: 10 },
  { placeholder: 'Hal van boven', depth: 0.5, x: 50, y: 38, w: 17 },
  { name: 'social-content-behind-the-scenes', alt: 'Telefoon in de hand tijdens een shoot', depth: 0.2, x: 3, y: 50, w: 12 },
  { placeholder: 'Vakman in PBM', depth: 1, x: 16, y: 62, w: 24 },
  { name: 'bij-rosa', alt: 'Publiek op een festival', depth: 0.5, x: 70, y: 58, w: 18 },
  { placeholder: 'Slijpvonken', depth: 0.2, x: 88, y: 46, w: 10 },
  { name: 'studio-portret', alt: 'Fles wijn tegen een bakstenen muur', depth: 0.5, x: 44, y: 74, w: 15 },
  { placeholder: 'Drone-overzicht', depth: 1, x: 62, y: 82, w: 21 },
];

// Volgorde = volgorde op de homepage. Zie ook cases.js voor de detailpagina's.
export const SERVICES = [
  { code: 'A-01', title: 'Recruitmentfilm', line: 'Monteurs die solliciteren omdat ze de film zagen.' },
  { code: 'A-02', title: 'Bedrijfsfilm', line: 'Wat je doet, in 90 seconden.' },
  { code: 'A-03', title: 'Explainer / productfilm', line: 'Complex gemaakt simpel.' },
  { code: 'A-04', title: 'Fotografie', line: 'Mensen, machines, projecten.' },
  { code: 'A-05', title: 'Drone', line: 'Overzicht van terrein, installatie of project.' },
  { code: 'A-06', title: 'Social content', line: 'Elke maand zichtbaar, met groeigarantie.' },
];

export const CONVEYOR = [
  { label: 'Horeca' },
  { media: 'boterlap-gerechten', alt: 'Gerechten van Boterlap' },
  { label: 'Events' },
  { media: 'stelz-hard-drinks-launch', alt: 'Lancering van Stëlz Hard Drinks' },
  { label: 'Vastgoed' },
  { media: 'rosel-de-lekkerste-broodjeszaak-van-amsterdam', alt: 'Gast van Rosèl met een broodje' },
  { label: 'Sport & wellness' },
  { media: 'boterlap', alt: 'Cocktail op een marmeren bar' },
  { label: 'Bouw' },
  { media: 'rosel-bts', alt: 'Behind the scenes bij Rosèl' },
];

// TODO XPSR: toestemming per klant checken voordat namen of logo's live gaan.
export const CLIENTS_INDUSTRY = ['REYM', 'WIKO', 'E-tronic', 'HBM Machines', 'Lichtbedrijf'];
export const CLIENTS_OTHER = ['Bij RoSa', 'Verlan', 'De Zwarte Boer', 'Buitenplaats Het Loo', 'YOUNG Group'];

export const ABOUT = [
  {
    head: 'Wie',
    body: 'Yorke en Liam. Fotograaf en filmmaker. Samen één productiehuis uit Harderwijk.',
    kind: 'team',
  },
  {
    head: 'Werkwijze',
    body: 'Briefing, script, één draaidag, montage, uitrol. Geen tussenpersonen.',
    steps: ['Briefing', 'Script', 'Draaidag', 'Montage', 'Uitrol'],
  },
  {
    head: 'Certificaten',
    // TODO XPSR: bevestigen dat VCA Vol en de dronecertificaten zo genoemd mogen worden.
    body: 'VCA Vol. Drone C2, A1/A2/A3. Veiligheidsschoenen in de auto.',
    badges: ['VCA Vol', 'Drone C2', 'A1 / A2 / A3'],
  },
  {
    head: 'Klanten',
    body: 'Industrie eerst. Daarna de rest.',
    kind: 'clients',
  },
];

export const TEAM = [
  {
    name: 'Yorke Strijbos',
    role: 'Fotografie, sales en klantrelaties',
    // TODO XPSR: portret aanleveren, bij voorkeur in de hal met PBM.
    portrait: null,
  },
  {
    name: 'Liam van Bart',
    role: 'Film, productie en techniek',
    // TODO XPSR: portret aanleveren, bij voorkeur in de hal met PBM.
    portrait: null,
  },
];

export const FOOTER = {
  ask: 'Zin in een draaidag?',
  button: 'Plan een draaidag',
};

// Eén draaidag als montage-tijdlijn. Tijden in uren (7.5 = 07:30). Track = spoor op de tijdlijn.
// Media optioneel: still of loop uit src/assets/media, anders een placeholder.
// TODO XPSR: copy check, tijden en instellingen naar jullie echte werkwijze; per shot een still of loop aanleveren.
export const SHOOT_DAY = {
  start: 7,
  end: 17,
  shots: [
    {
      track: 'V1',
      from: 7.25,
      to: 8.25,
      title: 'Aankomst en VCA-check',
      line: 'Melden bij de poort, PBM aan, werkvergunning rond. Jullie werken gewoon door.',
      settings: ['PBM: helm, bril, S3', 'Werkvergunning', 'Toolbox'],
    },
    {
      track: 'V2',
      from: 8.5,
      to: 9.75,
      title: 'Drone over het terrein',
      line: 'Overzicht van terrein, installatie en project, voordat de hal vol staat.',
      settings: ['4K / 25P', 'f/4', '1/50', 'ND 0.9'],
      media: { type: 'still', name: 'reym-locatie', alt: 'Luchtfoto van een REYM-locatie' },
    },
    {
      track: 'V1',
      from: 10,
      to: 12,
      title: 'Interviews in de hal',
      line: 'Vakmensen die vertellen waarom ze hier werken. Het hart van de recruitmentfilm.',
      settings: ['f/2.8', '1/50', 'ISO 400', 'Audio −12 dB'],
      media: { type: 'motion', name: 'loop-reym-juri', alt: 'Fragment uit de REYM-film over Juri' },
    },
    {
      track: 'V1',
      from: 12.75,
      to: 14.25,
      title: 'Werkvloer en details',
      line: 'Handen, machines, vonken, precisie. Het beeld dat laat zien hoe gaaf het werk is.',
      settings: ['50P slow motion', 'f/2', '1/100', 'ISO 800'],
      media: { type: 'still', name: 'one-love-cruise', alt: 'Steigerbouwers aan het werk op een gevel' },
    },
    {
      track: 'F',
      from: 14.5,
      to: 15.75,
      title: 'Fotografie',
      line: 'Mensen, machines en projecten. Voor website, offertes en vacatures.',
      settings: ['f/4', '1/250', 'ISO 200', 'Flitser'],
    },
    {
      track: 'V2',
      from: 16,
      to: 16.85,
      title: 'Social content',
      line: 'Verticale clips en stories, gelijk mee in dezelfde draaidag.',
      settings: ['9:16', '4K / 25P', 'f/2.8', '1/50'],
    },
  ],
  after: 'Daarna: montage, één feedbackronde, uitrol op alle kanalen.',
};

// Wat er op de monitor staat tijdens het draaien.
export const CAMERA_HUD = {
  tl: ['REC 00:00:12:18', '4K / 25P / LOG'],
  tr: ['ISO 400', 'f/2.8', '1/50', '5600K'],
  bl: ['Zebra 95%', 'ND 0.6'],
  br: ['Audio −12 dB', 'Accu 74%'],
};
