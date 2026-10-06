import gifBoterlap from '../assets/images/statement-gif-boterlap-table.gif';
import gifReym from '../assets/images/statement-gif-reym-juri.gif';

export default function Lightbox({ open, onClose }) {
  if (!open) return null;

  const stopProp = (e) => e.stopPropagation();

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sfeerimpressie van ons werk"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6,4,4,0.92)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      }}
    >
      <div
        onClick={stopProp}
        style={{
          position: 'relative',
          width: 'min(1100px,90vw)',
          background: '#141010',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 4,
          overflow: 'hidden',
          padding: 40,
        }}
      >
        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E31E24', marginBottom: 8 }}>Sfeerimpressie</div>
        <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: '#a8a19d', maxWidth: 480, margin: '0 0 28px' }}>
          Onze volledige showreel wordt binnenkort toegevoegd. Alvast een glimp uit twee recente producties:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          <img src={gifBoterlap} alt="Sfeerbeeld uit de Boterlap-productie" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 4, display: 'block' }} />
          <img src={gifReym} alt="Sfeerbeeld uit de REYM-productie met Juri" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 4, display: 'block' }} />
        </div>
        <a
          href="#projecten"
          onClick={onClose}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 999,
            background: '#E31E24', color: '#0b0908', fontFamily: "'Manrope',sans-serif", fontWeight: 800,
            fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}
        >
          Bekijk al ons werk <span>→</span>
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Sluiten"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'transparent',
            color: '#F5F3F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
