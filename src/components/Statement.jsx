import { tiltMove, tiltLeave } from '../utils/interactions.js';
import gifBoterlap from '../assets/images/statement-gif-boterlap-table.gif';
import gifReym from '../assets/images/statement-gif-reym-juri.gif';

export default function Statement() {
  return (
    <div style={{ animation: 'revealUp 0.9s cubic-bezier(.16,1,.3,1) both', position: 'relative', background: 'linear-gradient(160deg, #1a0d0d 0%, #0b0908 75%)', padding: '140px 48px 120px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,30,36,0.55), transparent 70%)', filter: 'blur(70px)', top: -220, left: -120 }} />
      <div style={{ position: 'absolute', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,30,36,0.4), transparent 70%)', filter: 'blur(70px)', top: 60, right: -100 }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,13,16,0.6), transparent 70%)', filter: 'blur(70px)', bottom: -260, left: '35%' }} />
      <div style={{ position: 'relative', maxWidth: 1500, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(48px,7.5vw,132px)', lineHeight: 1, color: '#F5F3F1', margin: 0 }}>
          ECHTE BEELDEN
          <span
            onMouseMove={tiltMove}
            onMouseLeave={tiltLeave}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              verticalAlign: 'middle', width: '3.4em', height: '0.9em', margin: '0 0.12em', borderRadius: '0.08em',
              overflow: 'hidden', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
              transition: 'transform .15s ease-out', willChange: 'transform',
            }}
          >
            <img src={gifBoterlap} alt="" draggable="false" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
          </span>
          {' '}ECHTE VERHALEN<br />
          <span
            onMouseMove={tiltMove}
            onMouseLeave={tiltLeave}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              verticalAlign: 'middle', width: '3em', height: '0.9em', margin: '0 0.14em', borderRadius: '0.08em',
              overflow: 'hidden', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
              transition: 'transform .15s ease-out', willChange: 'transform',
            }}
          >
            <img src={gifReym} alt="" draggable="false" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
          </span>
          {' '}DIE BLIJVEN<br />
          HANGEN
        </h2>
        <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15, color: '#c9c2be', maxWidth: 360, margin: '32px 0 0' }}>
          Volledige videoproductiepartner — van concept en scenario tot draaidag en montage, voor merken die willen opvallen.
        </p>
      </div>
    </div>
  );
}
