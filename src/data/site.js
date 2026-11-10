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

// Beeldwolk: 3 dieptes, filterbaar per branche. Echte stills waar ze er zijn, placeholders voor industrie.
// TODO XPSR: 12 tot 14 stills aanleveren, vooral industrie (lassen, slijpen, machines, vakmensen, hallen).
export const CLOUD_BRANCHES = ['Industrie', 'Bouw', 'Horeca', 'Events'];

export const CLOUD = [
  { placeholder: 'Steigerbouw', branch: 'Bouw', depth: 1, x: 8, y: 12, w: 26 },
  { placeholder: 'Lassen', branch: 'Industrie', depth: 0.5, x: 40, y: 5, w: 16 },
  { placeholder: 'Montage op locatie', branch: 'Industrie', depth: 0.2, x: 64, y: 9, w: 11 },
  { placeholder: 'Machinebouw', branch: 'Industrie', depth: 1, x: 74, y: 20, w: 22 },
  { name: 'boterlap-gerechten', alt: 'Gerechten van Boterlap', branch: 'Horeca', depth: 0.2, x: 29, y: 31, w: 11 },
  { placeholder: 'Hal van boven', branch: 'Industrie', depth: 0.5, x: 50, y: 35, w: 17 },
  { name: 'stelz-hard-drinks-launch', alt: 'Lancering van Stëlz Hard Drinks', branch: 'Events', depth: 0.2, x: 3, y: 47, w: 12 },
  { placeholder: 'Vakman in PBM', branch: 'Industrie', depth: 1, x: 16, y: 58, w: 24 },
  { name: 'bij-rosa', alt: 'Publiek op een festival', branch: 'Events', depth: 0.5, x: 70, y: 54, w: 18 },
  { name: 'rosel-de-lekkerste-broodjeszaak-van-amsterdam', alt: 'Gast van Rosèl met een broodje', branch: 'Horeca', depth: 0.2, x: 88, y: 43, w: 10 },
  { name: 'boterlap', alt: 'Cocktail op een marmeren bar', branch: 'Horeca', depth: 0.5, x: 44, y: 70, w: 15 },
  { placeholder: 'Drone-overzicht', branch: 'Industrie', depth: 1, x: 62, y: 78, w: 21 },
  { name: 'rodeo-film-bandshoot', alt: 'Band in rood licht', branch: 'Events', depth: 0.2, x: 4, y: 84, w: 10 },
];


// Volgorde = volgorde op de homepage. Zie ook cases.js voor de detailpagina's.
// Diensten als accordion met beeldkaart. ar en cam zijn de camera-instellingen in het onderschrift van de kaart.
// media: still/loop uit src/assets/media, of leeg voor NO SIGNAL. Elk beeld maximaal één keer per pagina.
// TODO XPSR: per dienst een eigen loop aanleveren.
export const SERVICES = [
  { code: 'A-01', title: 'Bedrijfsfilm', label: 'Bedrijfsfilm', line: 'Wat jullie doen, in 90 seconden.', ar: 2.39, kind: 'scope', cam: ['ISO 400', 'F 2.8', '1/50', 'WB 5600K'] },
  { code: 'A-02', title: 'Recruitmentfilm', label: 'Recruitmentfilm', line: 'Vakmensen die solliciteren omdat ze de film zagen.', ar: 16 / 9, kind: 'focus', cam: ['ISO 400', 'F 2', '1/50', 'WB 4300K'] },
  { code: 'A-03', title: 'Explainer / productfilm', label: 'Productfilm', line: 'Complex gemaakt simpel.', ar: 16 / 9, kind: 'callout', cam: ['ISO 200', 'F 5.6', '1/50', 'WB 5600K'] },
  {
    code: 'A-04',
    title: 'Fotografie',
    label: 'Fotografie',
    line: 'Mensen, machines, projecten.',
    ar: 3 / 2,
    kind: 'photo',
    cam: ['ISO 200', 'F 4', '1/250', 'WB 5600K'],
    media: { type: 'still', name: 'block-corporate', alt: 'Teamfoto in een witte studio' },
  },
  { code: 'A-05', title: 'Drone', label: 'Drone', line: 'Overzicht van terrein, installatie of project.', ar: 16 / 9, kind: 'drone', cam: ['ISO 100', 'F 2.8', '1/50', 'ND 16'] },
  {
    code: 'A-06',
    title: 'Social content',
    label: 'Social',
    line: 'Elke maand zichtbaar, met groeigarantie.',
    ar: 9 / 16,
    kind: 'social',
    cam: ['ISO 800', 'F 1.8', '1/50', 'WB 5600K'],
    media: { type: 'still', name: 'social-content-behind-the-scenes', alt: 'Achter de schermen bij een social-shoot' },
  },
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
    body: 'Vijf stappen, één team. Geen tussenpersonen.',
    // TODO XPSR: copy check.
    steps: [
      { no: '01', title: 'Plan', line: 'Eén gesprek op de vloer. Daarna weten we wat de film moet doen.', monitor: 'plan' },
      { no: '02', title: 'Script', line: 'Elke zin staat vast voordat de camera aangaat.', monitor: 'script' },
      { no: '03', title: 'Storyboard', line: 'Elk shot getekend, elke seconde gepland.', monitor: 'storyboard' },
      { no: '04', title: 'Draaidag', line: 'Eén dag, VCA Vol, jullie werken gewoon door.', monitor: 'day' },
      { no: '05', title: 'Oplevering', line: 'Film, foto’s en reels binnen twee weken.', monitor: 'delivery' },
    ],
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
    portrait: null,
  },
];


export const FOOTER = {
  ask: 'Zin in een draaidag?',
  button: 'Plan een draaidag', // label onder het REC-punt
};

// Storyboard: zo plannen we de shots voordat de camera aangaat. Generiek voorbeeld van een recruitmentfilm.
// TODO XPSR: copy check.
export const STORYBOARD = [
  { sketch: 'wide', type: 'Wide', move: 'Langzaam naar binnen', dur: '4s', note: 'De hal in het ochtendlicht. Eerste indruk: hier wordt gebouwd.' },
  { sketch: 'medium', type: 'Medium', move: 'Statisch', dur: '3s', note: 'Vakman aan de machine. Gezicht en werk in één beeld.' },
  { sketch: 'close', type: 'Close-up', move: 'Slow motion', dur: '2s', note: 'Handen, vonken, precisie. Het detail dat blijft hangen.' },
  { sketch: 'interview', type: 'Interview', move: 'Derdenregel', dur: '12s', note: 'Waarom ik hier werk. In eigen woorden, niet voorgelezen.' },
  { sketch: 'drone', type: 'Drone', move: 'Omhoog en terug', dur: '5s', note: 'Het hele terrein. Laat zien hoe groot het is.' },
  { sketch: 'end', type: 'Eindkaart', move: 'Fade', dur: '3s', note: 'Logo en vacature. Eén actie: solliciteer.' },
];

// Script naast het storyboard: scène i hoort bij paneel i. Placeholder-script. TODO XPSR: copy check.
export const SCRIPT = [
  { head: '1. EXT. INDUSTRIETERREIN - OCHTEND', body: 'De zon komt op boven de hal.', note: 'langer aanhouden' },
  { head: '2. INT. HAL - DOORLOPEND', body: 'JAN (23), lasser, zet zijn helm op.' },
  { head: '3. INT. HAL - CLOSE-UP', body: 'Vonken. Handen. Precisie.', note: 'slow-mo!' },
  { head: '4. INT. KANTINE - INTERVIEW', speaker: 'JAN', body: 'Hier maken we dingen die twintig jaar meegaan.', circle: 'twintig' },
  { head: '5. EXT. TERREIN - DRONE', body: 'Omhoog en terug. Het hele terrein in beeld.' },
  { head: '6. EINDKAART', body: 'Logo. Kom werken bij [KLANT].' },
];

// Eén draaidag als montage-tijdlijn. Tijden in uren (12.5 = 12:30). Track: V1 beeld, V2 drone.
// Media optioneel (still of loop uit src/assets/media), anders NO SIGNAL.
// TODO XPSR: copy check, tijden en instellingen naar jullie echte werkwijze; per fase een loop aanleveren.
export const SHOOT_DAY = {
  start: 7,
  end: 17.5,
  shots: [
    {
      track: 'V1',
      from: 7,
      to: 8,
      title: 'Aankomst en VCA-check',
      line: 'Melden bij de poort, PBM aan, werkvergunning rond. Jullie werken gewoon door.',
      settings: ['PBM: helm, bril, S3', 'Werkvergunning'],
    },
    {
      track: 'V1',
      from: 8,
      to: 9,
      title: 'Briefing op de vloer',
      line: 'Korte ronde met de ploegleider: wat draait er, waar mag de camera, wie wil in beeld.',
      settings: ['Shotlist', 'Veiligheidszones'],
    },
    {
      track: 'V1',
      from: 9,
      to: 12.5,
      title: 'Draaien in de hal',
      line: 'Handen, machines, vonken, precisie. Het beeld dat laat zien hoe gaaf het werk is.',
      settings: ['50P slow motion', 'f/2', '1/100', 'ISO 800'],
    },
    {
      track: 'V1',
      from: 12.5,
      to: 14,
      title: 'Interviews met vakmensen',
      line: 'Vakmensen die vertellen waarom ze hier werken. Het hart van de recruitmentfilm.',
      settings: ['f/2.8', '1/50', 'ISO 400', 'Audio −12 dB'],
      media: { type: 'motion', name: 'loop-reym-juri', alt: 'Fragment uit de REYM-film over Juri' },
      audio: true,
    },
    {
      track: 'V2',
      from: 14,
      to: 15.5,
      title: 'Drone over het terrein',
      line: 'Overzicht van terrein, installatie en project, van bovenaf.',
      settings: ['4K / 25P', 'f/4', '1/50', 'ND 0.9'],
    },
    {
      track: 'V1',
      from: 15.5,
      to: 17,
      title: 'Fotografie',
      line: 'Mensen, machines en projecten. Voor website, offertes en vacatures.',
      settings: ['f/4', '1/250', 'ISO 200', 'Flitser'],
    },
    {
      track: 'V1',
      from: 17,
      to: 17.5,
      title: 'Wrap',
      line: 'Spullen op, vloer schoon achtergelaten, data dubbel geback-upt.',
      settings: ['Back-up 2x', 'Opgeruimd'],
    },
  ],
  // TODO XPSR: doorlooptijd bevestigen.
  after: 'Twee weken later: film, foto’s en social content.',
};

// Wat er op de monitor staat tijdens het draaien.
export const CAMERA_HUD = {
  tl: ['REC 00:00:12:18', '4K / 25P / LOG'],
  tr: ['ISO 400', 'f/2.8', '1/50', '5600K'],
  bl: ['Zebra 95%', 'ND 0.6'],
  br: ['Audio −12 dB', 'Accu 74%'],
};
