export default function TopBar() {
  return (
    <div
      className="desktop-only"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 48px',
        background: '#0b0908',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontFamily: "'Manrope',sans-serif",
        fontSize: 13,
        color: '#8a8280',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <a href="tel:+31655188054" style={{ color: '#8a8280', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#E31E24' }}>☎</span> +31 6 551 880 54
        </a>
        <a href="mailto:yorke@xpsr-studio.com" style={{ color: '#8a8280', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#E31E24' }}>✉</span> yorke@xpsr-studio.com
        </a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <a href="https://www.instagram.com/xpsr_studio/" target="_blank" rel="noreferrer" style={{ color: '#8a8280', fontSize: 15 }}>Instagram</a>
        <a href="https://www.linkedin.com/company/105960480/" target="_blank" rel="noreferrer" style={{ color: '#8a8280', fontSize: 15 }}>LinkedIn</a>
        <a href="https://www.tiktok.com/@xpsr_studio" target="_blank" rel="noreferrer" style={{ color: '#8a8280', fontSize: 15 }}>TikTok</a>
      </div>
    </div>
  );
}
