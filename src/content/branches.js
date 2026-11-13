/*
 * Branches: voedt de sectie Branches op de homepage en het template /branche/:slug.
 * Alleen structuur en voorbeeldvelden: de echte inhoud per branche volgt van XPSR.
 * TODO XPSR: alle teksten hieronder zijn voorstellen of placeholders; copy check per branche.
 *
 * Velden per branche:
 *   slug, name      url en naam
 *   card            één zin voor de kaart op de homepage
 *   image           still uit src/assets/media voor kaart en hero (null = typografische kaart, geen placeholderbeeld)
 *   heroSlot        media-slot voor de hero-video van de branchepagina (zie src/data/media.js)
 *   intro           korte intro bovenaan de branchepagina
 *   cases           functie die bepaalt welke cases bij deze branche horen (op data/cases.js)
 *   services        dienstcodes uit content/home.js die hier het meest gevraagd worden
 *   faq             vragen en antwoorden
 *   meta            title en description voor deze pagina
 */
const draft = (name) => `[Intro ${name} volgt]`;

export const BRANCHES = [
  {
    slug: 'industrie',
    name: 'Industrie',
    card: 'Vakmanschap, machines en processen, helder in beeld.',
    image: 'reym-locatie',
    heroSlot: 'branche-industrie',
    intro: draft('industrie'),
    cases: (c) => c.industry,
    services: ['A-02', 'A-01', 'A-03', 'A-05'],
    faq: [{ q: '[Vraag]', a: '[Antwoord]' }],
    meta: { title: 'Industrie', description: 'Film, foto en social content voor de industrie. Productiehuis uit Harderwijk.' },
  },
  {
    slug: 'bouw',
    name: 'Bouw',
    card: 'Van eerste paal tot oplevering, het hele project in beeld.',
    image: null,
    heroSlot: 'branche-bouw',
    intro: draft('bouw'),
    cases: (c) => c.branch === 'Bouw',
    services: ['A-05', 'A-01', 'A-04'],
    faq: [{ q: '[Vraag]', a: '[Antwoord]' }],
    meta: { title: 'Bouw', description: 'Film, foto en social content voor de bouw. Productiehuis uit Harderwijk.' },
  },
  {
    slug: 'horeca',
    name: 'Horeca',
    card: 'Gerechten, gasten en sfeer die je wilt proeven.',
    image: 'rosel-de-lekkerste-broodjeszaak-van-amsterdam',
    heroSlot: 'branche-horeca',
    intro: draft('horeca'),
    cases: (c) => c.branch === 'Horeca',
    services: ['A-04', 'A-06', 'A-01'],
    faq: [{ q: '[Vraag]', a: '[Antwoord]' }],
    meta: { title: 'Horeca', description: 'Film, foto en social content voor de horeca. Productiehuis uit Harderwijk.' },
  },
  {
    slug: 'events',
    name: 'Events',
    card: 'De energie van de dag, ook lang na afloop.',
    image: 'bij-rosa',
    heroSlot: 'branche-events',
    intro: draft('events'),
    cases: (c) => c.branch === 'Events',
    services: ['A-06', 'A-01', 'A-04'],
    faq: [{ q: '[Vraag]', a: '[Antwoord]' }],
    meta: { title: 'Events', description: 'Film, foto en social content voor events. Productiehuis uit Harderwijk.' },
  },
  {
    slug: 'zorg',
    name: 'Zorg',
    card: 'Mensen en zorg, eerlijk en met respect in beeld.',
    image: null,
    heroSlot: 'branche-zorg',
    intro: draft('zorg'),
    cases: (c) => c.branch === 'Zorg',
    services: ['A-02', 'A-01', 'A-04'],
    faq: [{ q: '[Vraag]', a: '[Antwoord]' }],
    meta: { title: 'Zorg', description: 'Film, foto en social content voor de zorg. Productiehuis uit Harderwijk.' },
  },
  {
    slug: 'retail',
    name: 'Retail',
    card: 'Producten en winkels waar je naartoe wilt.',
    image: null,
    heroSlot: 'branche-retail',
    intro: draft('retail'),
    cases: (c) => c.branch === 'Retail',
    services: ['A-04', 'A-06', 'A-03'],
    faq: [{ q: '[Vraag]', a: '[Antwoord]' }],
    meta: { title: 'Retail', description: 'Film, foto en social content voor retail. Productiehuis uit Harderwijk.' },
  },
];

export const getBranche = (slug) => BRANCHES.find((b) => b.slug === slug);
