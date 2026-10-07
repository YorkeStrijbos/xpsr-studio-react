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
export const CLOUD_BRANCHES = ['Industrie', 'Bouw', 'Horeca', 'Events', 'Zakelijk'];

export const CLOUD = [
  { name: 'one-love-cruise', alt: 'Steigerbouwers aan het werk op een gevel', branch: 'Bouw', depth: 1, x: 8, y: 12, w: 26 },
  { placeholder: 'Lassen', branch: 'Industrie', depth: 0.5, x: 40, y: 5, w: 16 },
  { name: 'block-corporate', alt: 'Team van Block in een witte studio', branch: 'Zakelijk', depth: 0.2, x: 64, y: 9, w: 11 },
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


// Prikbord rond de blauwdruk (Fase 01). Per dienst 2 of 3 items, plus losse items op de muur.
// x/y = linkerbovenhoek in % van het scherm (desktop), rot = scheefstand, fix = punaise of tape.
// Placeholders tot er echte foto's zijn. TODO XPSR: copy check, echte polaroids aanleveren.
export const PIN_ITEMS = [
  { s: 0, kind: 'polaroid', caption: 'Jan, 23 jaar, lasser', x: 3, y: 31, rot: -5, fix: 'pin' },
  { s: 0, kind: 'script', head: 'INT. HAL - OCHTEND', body: 'JAN zet zijn helm op en loopt de hal in.', x: 9, y: 44, rot: 3, fix: 'tape' },
  { s: 0, kind: 'postit', text: 'Waarom werk jij hier?', x: 22, y: 51, rot: 6, fix: 'pin' },
  { s: 1, kind: 'strip', x: 37, y: 7, rot: -2, fix: 'tape' },
  { s: 1, kind: 'polaroid', caption: 'De hal', x: 57, y: 4, rot: 4, fix: 'pin' },
  { s: 1, kind: 'note', text: '90 sec', x: 52, y: 19, rot: -6, fix: 'pin' },
  { s: 2, kind: 'sketch', x: 76, y: 12, rot: 2, fix: 'tape' },
  { s: 2, kind: 'postit', text: 'Simpeler!', x: 90, y: 10, rot: -4, fix: 'pin' },
  { s: 2, kind: 'script', head: 'VOICE-OVER', body: 'Eén onderdeel, drie stappen.', x: 86, y: 28, rot: 5, fix: 'pin' },
  { s: 3, kind: 'contact', x: 75, y: 49, rot: -3, fix: 'tape' },
  { s: 3, kind: 'polaroid', caption: 'Portret', x: 89, y: 57, rot: 5, fix: 'pin' },
  { s: 4, kind: 'map', x: 56, y: 83, rot: 2, fix: 'tape' },
  { s: 4, kind: 'polaroid', caption: 'Van bovenaf', x: 41, y: 85, rot: -4, fix: 'pin' },
  { s: 5, kind: 'reels', x: 3, y: 63, rot: -2, fix: 'tape' },
  { s: 5, kind: 'postit', text: 'Hook in 1 sec', x: 18, y: 84, rot: 4, fix: 'pin' },
  { s: 5, kind: 'note', text: '[RESULTAAT]', x: 21, y: 66, rot: -5, fix: 'pin' },
  { s: null, kind: 'callsheet', x: 63, y: 26, rot: 3, fix: 'tape' },
  { s: null, kind: 'slate', caption: 'Klap!', x: 66, y: 86, rot: 6, fix: 'pin' },
  { s: null, kind: 'gaffer', x: 0, y: 90, rot: -12 },
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
    portrait: null,
  },
];


export const FOOTER = {
  ask: 'Zin in een draaidag?',
  button: 'Plan een draaidag',
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
// Media optioneel (still of loop uit src/assets/media), anders een gestencilde placeholder.
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
      media: { type: 'still', name: 'one-love-cruise', alt: 'Steigerbouwers aan het werk op een gevel' },
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
      media: { type: 'still', name: 'reym-locatie', alt: 'Luchtfoto van een REYM-locatie' },
    },
    {
      track: 'V1',
      from: 15.5,
      to: 17,
      title: 'Fotografie',
      line: 'Mensen, machines en projecten. Voor website, offertes en vacatures.',
      settings: ['f/4', '1/250', 'ISO 200', 'Flitser'],
      media: { type: 'still', name: 'block-corporate', alt: 'Teamfoto in een witte studio' },
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
