/*
 * Copy van /contact. TODO XPSR: copy check, vooral de stappen onder "Zo gaat het verder"
 * (voorstel op basis van de werkwijze; geen beloftes over reactietijd of prijzen tot XPSR die bevestigt).
 */
export const CONTACT_PAGE = {
  label: 'Contact',
  heading: 'Plan een draaidag',
  lead: 'Vertel wat jullie maken en wat het beeld moet doen. Wij denken mee over wat één draaidag kan opleveren.',
  form: {
    title: 'Aanvraag',
    what: 'Wat willen jullie maken?',
    branche: 'Branche',
    when: 'Wanneer?',
    whenOptions: ['Zo snel mogelijk', 'Binnen drie maanden', 'Later dit jaar', 'Weet ik nog niet'],
    message: 'Vertel kort wat jullie maken en wat het beeld moet doen',
    name: 'Naam',
    company: 'Bedrijf',
    email: 'E-mail',
    phone: 'Telefoon (optioneel)',
    submit: 'Verstuur aanvraag',
    note: 'Je mailprogramma opent met je aanvraag erin. Niets geopend? Mail ons direct.',
    sent: 'Je aanvraag staat klaar in je mailprogramma. Verstuur hem daar.',
    subject: 'Aanvraag draaidag',
  },
  steps: {
    title: 'Zo gaat het verder',
    items: [
      { no: '01', title: 'Kennismaking', line: 'We bellen of komen langs. Daarna weten we wat de film moet doen.' },
      { no: '02', title: 'Voorstel', line: 'Je krijgt een plan met wat we maken, wanneer en wat het kost.' },
      { no: '03', title: 'Draaidag', line: 'Eén dag draaien, daarna de film, foto’s en content.' },
    ],
  },
  direct: 'Liever direct contact?',
};
