const QUOTES = [
  {
    initial: 'Y',
    quote: '"Een goed verhaal is een gevoel — geen format."',
    body: 'Beeld, geluid, ritme — het moet landen. Wij maken geen content om ruimte te vullen, maar om te raken.',
    name: 'Yorke Strijbos — Founder',
    delay: '0s',
  },
  {
    initial: 'L',
    quote: '"Creativiteit is geen keuze, het is een drijfveer."',
    body: 'We zoeken altijd nieuwe hoeken en frisse vormen. Alleen door grenzen te verleggen maak je écht impact.',
    name: 'Liam van Bart — Founder',
    delay: '.08s',
  },
];

export default function Philosophy() {
  return (
    <div id="over-ons" style={{ padding: '120px 48px', background: 'linear-gradient(180deg, #0b0908 0%, #1c0808 100%)' }}>
      <div style={{ animation: 'revealUp 0.9s cubic-bezier(.16,1,.3,1) both', marginBottom: 64 }}>
        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E31E24', marginBottom: 14 }}>Waar we in geloven</div>
        <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(32px,4.2vw,58px)', color: '#F5F3F1', margin: 0 }}>GEVOEL BOVEN FORMAT</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 56 }}>
        {QUOTES.map((q) => (
          <div key={q.name} style={{ animation: `revealUp 0.9s cubic-bezier(.16,1,.3,1) ${q.delay} both`, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
            <div style={{ width: 120, height: 150, borderRadius: 4, background: 'linear-gradient(160deg, #241a1a 0%, #1a1414 100%)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 48, color: '#E31E24' }}>{q.initial}</span>
            </div>
            <div>
              <p style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, lineHeight: 1.3, color: '#F5F3F1', margin: '0 0 16px' }}>{q.quote}</p>
              <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: '#a8a19d', lineHeight: 1.6, margin: '0 0 16px' }}>{q.body}</p>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#8a8280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{q.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
