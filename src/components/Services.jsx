import { tiltMove, tiltLeave } from '../utils/interactions.js';
import imgCorporate from '../assets/images/proj-block-corporate.jpg';
import imgSocial from '../assets/images/proj-social-content-behind-the-scenes.jpg';
import imgAnimatie from '../assets/images/proj-showreel-2026.jpg';
import imgStrategie from '../assets/images/proj-studio-portret.jpg';

const SERVICES = [
  {
    n: '01',
    title: "CORPORATE & BRANDING VIDEO'S",
    desc: 'Van bedrijfsfilm tot recruitment — beeld dat laat zien wie je écht bent.',
    img: imgCorporate,
    delay: '0s',
  },
  {
    n: '02',
    title: 'SOCIAL MEDIA & UGC CONTENT',
    desc: 'Kort, raak en gemaakt voor de scroll. Content die stopt met scrollen.',
    img: imgSocial,
    delay: '.08s',
  },
  {
    n: '03',
    title: 'EXPLAINERS & ANIMATIE',
    desc: 'Complexe verhalen simpel gemaakt, in beweging.',
    img: imgAnimatie,
    delay: '.16s',
  },
  {
    n: '04',
    title: 'STRATEGIE & POSITIONERING',
    desc: 'Voordat we filmen, denken we na over wat je écht wil zeggen.',
    img: imgStrategie,
    delay: '.24s',
  },
];

export default function Services() {
  return (
    <div id="projecten" style={{ padding: '140px 48px 100px', background: '#0b0908' }}>
      <div style={{ animation: 'revealUp 0.9s cubic-bezier(.16,1,.3,1) both', marginBottom: 64 }}>
        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E31E24', marginBottom: 14 }}>Wat we doen</div>
        <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(32px,4.2vw,58px)', color: '#F5F3F1', margin: 0, maxWidth: 900 }}>VIER MANIEREN OM OP TE VALLEN</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, background: 'rgba(255,255,255,0.08)' }}>
        {SERVICES.map((s) => (
          <div
            key={s.n}
            style={{ animation: `revealUp 0.9s cubic-bezier(.16,1,.3,1) ${s.delay} both`, background: '#0b0908', padding: 48, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 8, right: 24, fontFamily: "'Anton',sans-serif", fontSize: 140, color: 'rgba(255,255,255,0.04)', lineHeight: 1, zIndex: 0, userSelect: 'none' }}>{s.n}</div>
            <div style={{ position: 'relative', fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#8a8280', marginBottom: 24 }}>{s.n}</div>
            <h3 style={{ fontFamily: "'Anton',sans-serif", fontSize: 32, color: '#F5F3F1', margin: '0 0 14px' }}>{s.title}</h3>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15, color: '#a8a19d', maxWidth: 400, margin: '0 0 32px' }}>{s.desc}</p>
            <div
              onMouseMove={tiltMove}
              onMouseLeave={tiltLeave}
              style={{
                aspectRatio: '16/9', borderRadius: 4, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform .15s ease-out', willChange: 'transform',
              }}
            >
              <img
                src={s.img}
                alt={s.title}
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
