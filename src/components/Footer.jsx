export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <div style={{ padding: '64px 48px 40px', background: '#0b0908', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 26, color: '#F5F3F1' }}>
              XPSR<span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 10, letterSpacing: '0.4em', color: '#8a8280', marginLeft: 8 }}>STUDIO</span>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton',sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.3)' }}>8</div>
          </div>
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#7a736f', maxWidth: 280, marginTop: 16, lineHeight: 1.6 }}>
            Video productiestudio uit Harderwijk. Corporate, social en animatie die blijft hangen.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#8a8280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Adres</div>
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: '#c9c2be', lineHeight: 1.7, margin: 0 }}>
            Pijlkruidmeen 35<br />3844PM Harderwijk
          </p>
        </div>
        <div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#8a8280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Contact</div>
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            <a href="mailto:yorke@xpsr-studio.com" style={{ color: '#c9c2be' }}>yorke@xpsr-studio.com</a><br />
            <a href="tel:+31655188054" style={{ color: '#c9c2be' }}>+31 6 551 880 54</a>
          </p>
        </div>
        <div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#8a8280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Volg ons</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "'Manrope',sans-serif", fontSize: 14 }}>
            <a href="https://www.instagram.com/xpsr_studio/" target="_blank" rel="noreferrer" style={{ color: '#c9c2be' }}>Instagram</a>
            <a href="https://www.linkedin.com/company/105960480/" target="_blank" rel="noreferrer" style={{ color: '#c9c2be' }}>LinkedIn</a>
            <a href="https://www.tiktok.com/@xpsr_studio" target="_blank" rel="noreferrer" style={{ color: '#c9c2be' }}>TikTok</a>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 48px', background: '#0b0908', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: "'Manrope',sans-serif", fontSize: 12, color: '#5f5a57', textAlign: 'center' }}>
        © {year} XPSR Studio. Alle rechten voorbehouden.
      </div>
    </>
  );
}
