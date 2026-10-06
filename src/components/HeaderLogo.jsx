export default function HeaderLogo({ logoRef }) {
  return (
    <div
      ref={logoRef}
      style={{
        position: 'fixed',
        left: 48,
        top: 18,
        zIndex: 110,
        transformOrigin: '0 0',
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 28, letterSpacing: '0.02em', color: '#F5F3F1', lineHeight: 1 }}>
        XPSR
        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 10, letterSpacing: '0.5em', color: '#8a8280', fontWeight: 600, marginTop: 2 }}>
          STUDIO
        </div>
      </div>
    </div>
  );
}
