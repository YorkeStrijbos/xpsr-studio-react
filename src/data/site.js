// Centrale content voor XPSR Studio. Copy-regels: geen em dashes, geen verzonnen cijfers of quotes.

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

export const TAGLINE = 'Productiestudio voor foto, video en social uit Harderwijk.';

export const HERO = {
  // TODO XPSR: definitieve hero-claim bevestigen.
  claim: 'Content die gezien wordt.',
  sub: 'Foto, video en social uit Harderwijk. Meer weergaven, of de volgende maand is gratis.',
};

export const GUARANTEE = {
  // TODO XPSR: garantievoorwaarden laten checken voordat dit live gaat.
  title: 'Meer gezien. Of de volgende maand gratis.',
  body: 'Wij zorgen dat je meer gezien wordt. Stijgen je weergaven niet ten opzichte van de drie maanden ervoor, dan is de volgende maand gratis.',
  how: 'We meten in je eigen statistieken van Instagram en Facebook. Jij ziet dezelfde cijfers als wij.',
};

// TODO XPSR: logo's als SVG aanleveren, met toestemming per klant. Tot die tijd tonen we de naam als woordmerk.
export const CLIENTS = [
  'Bij RoSa',
  'Verlan',
  'Boterlap',
  'De Zwarte Boer',
  'Liemes',
  'Buitenplaats Het Loo',
  'REYM',
  'YOUNG Group',
];

export const SERVICES = [
  {
    id: 'foto',
    title: 'Foto',
    line: 'Beeld dat je gerecht, product of team in één oogopslag verkoopt.',
    deliverables: ['Food- en productfotografie', 'Portret- en teamfoto’s', 'Locatie- en sfeerbeelden', 'Eventfotografie'],
    // TODO XPSR: korte video-loop van fotowerk (bijv. BTS van een foodshoot) aanleveren.
    media: { type: 'still', name: 'boterlap-gerechten', alt: 'Gerechten van Boterlap, gefotografeerd van bovenaf' },
  },
  {
    id: 'video',
    title: 'Video',
    line: 'Van bedrijfsfilm tot korte reel. Gemaakt om bekeken te worden, niet om te vullen.',
    deliverables: ['Bedrijfs- en recruitmentfilms', 'Korte video’s voor social', 'Aftermovies van events', 'Behind the scenes'],
    media: { type: 'motion', name: 'loop-reym-juri', alt: 'Fragment uit de REYM-film over Juri' },
  },
  {
    id: 'social',
    title: 'Social',
    line: 'Elke maand nieuwe content, met de strategie erachter. Zo kun je groei ook echt zien.',
    deliverables: ['Maandelijkse contentpakketten', 'Planning en strategie', 'Reels, TikToks en stories', 'Maandelijks inzicht in je weergaven'],
    // TODO XPSR: verticale social-loop aanleveren.
    media: { type: 'still', name: 'rosel-bts', alt: 'Behind the scenes bij een social shoot voor Rosèl' },
  },
];

export const BRANCHES = [
  {
    id: 'horeca',
    name: 'Horeca en food',
    line: 'Restaurants, chef-concepten en foodevents. Beeld waar je trek van krijgt.',
    client: 'Rosèl',
    media: { name: 'rosel-de-lekkerste-broodjeszaak-van-amsterdam', alt: 'Gast van Rosèl met een broodje' },
  },
  {
    id: 'industrie',
    name: 'Industrie en techniek',
    line: 'Laten zien wat er achter het hek gebeurt. Voor klanten én voor nieuwe collega’s.',
    client: 'REYM',
    media: { name: 'reym-locatie', alt: 'Luchtfoto van een REYM-locatie' },
  },
  {
    id: 'events',
    name: 'Events',
    line: 'Het moment zelf, en de content die het event daarna nog weken laat leven.',
    client: 'Stëlz Hard Drinks',
    media: { name: 'stelz-hard-drinks-launch', alt: 'Koelkast met Stëlz Hard Drinks tijdens de lancering' },
  },
];

export const ALSO_ACTIVE = 'Ook actief in vastgoed, bouw, sport en wellness.';

export const TEAM = [
  {
    name: 'Yorke Strijbos',
    role: 'Sales, klantrelaties en fotografie',
    line: 'Jouw eerste aanspreekpunt, en achter de camera als het om foto gaat.',
    // TODO XPSR: portret aanleveren.
    portrait: null,
  },
  {
    name: 'Liam van Bart',
    role: 'Video, productie en techniek',
    line: 'Regisseert de draaidag en zorgt dat elk shot technisch klopt.',
    // TODO XPSR: portret aanleveren.
    portrait: null,
  },
];
