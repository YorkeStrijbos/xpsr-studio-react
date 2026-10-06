import { magnetMove, magnetLeave } from '../utils/interactions.js';

export default function CTA() {
  return (
    <div id="contact" style={{ animation: 'revealUp 0.9s cubic-bezier(.16,1,.3,1) both', padding: '140px 48px', textAlign: 'center', background: 'radial-gradient(ellipse 70% 80% at 50% 100%, #7a0d10 0%, #2a0505 45%, #0b0908 80%)' }}>
      <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(36px,5.5vw,80px)', color: '#F5F3F1', margin: '0 0 36px', textWrap: 'pretty' }}>KLAAR VOOR DE JUISTE EXPOSURE?</h2>
      <a
        href="mailto:yorke@xpsr-studio.com"
        onMouseMove={magnetMove}
        onMouseLeave={magnetLeave}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, padding: '22px 44px', borderRadius: 999,
          background: '#E31E24', color: '#0b0908', fontFamily: "'Manrope',sans-serif", fontWeight: 800,
          fontSize: 16, letterSpacing: '0.03em', textTransform: 'uppercase', transition: 'transform .2s ease',
        }}
      >
        Plan een gesprek <span>→</span>
      </a>
    </div>
  );
}
