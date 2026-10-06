export default function Marquees() {
  return (
    <div style={{ background: '#E31E24', overflow: 'hidden', padding: '14px 0', whiteSpace: 'nowrap', borderTop: '1px solid rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'inline-block', fontFamily: "'Anton',sans-serif", fontSize: 26, color: '#0b0908', letterSpacing: '0.02em', animation: 'marquee 24s linear infinite' }}>
        <span>CORPORATE VIDEO&nbsp;&nbsp;—&nbsp;&nbsp;SOCIAL &amp; UGC&nbsp;&nbsp;—&nbsp;&nbsp;EXPLAINERS &amp; ANIMATIE&nbsp;&nbsp;—&nbsp;&nbsp;STRATEGIE &amp; POSITIONERING&nbsp;&nbsp;—&nbsp;&nbsp;</span>
        <span>CORPORATE VIDEO&nbsp;&nbsp;—&nbsp;&nbsp;SOCIAL &amp; UGC&nbsp;&nbsp;—&nbsp;&nbsp;EXPLAINERS &amp; ANIMATIE&nbsp;&nbsp;—&nbsp;&nbsp;STRATEGIE &amp; POSITIONERING&nbsp;&nbsp;—&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}
