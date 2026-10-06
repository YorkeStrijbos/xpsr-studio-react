import { useEffect, useRef } from 'react';
import heroBg from '../assets/images/hero-bg.webp';
import { prefersReducedMotion, rafThrottle } from '../utils/interactions.js';

export default function Hero({ logoRef, onOpenLightbox }) {
  const heroMosaicRef = useRef(null);
  const heroTileRef = useRef(null);
  const heroTaglineRef = useRef(null);
  const heroParaRef = useRef(null);
  const heroCtaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const mosaic = heroMosaicRef.current;
      if (!mosaic) return;
      const rect = mosaic.getBoundingClientRect();
      const scrollable = mosaic.offsetHeight - window.innerHeight;
      const progress = prefersReducedMotion()
        ? 1
        : (scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0);
      const tp = Math.min(1, progress / 0.5);
      const eased = 1 - Math.pow(1 - tp, 3);

      if (heroTileRef.current) {
        const scale = 1.45 - 0.45 * eased;
        heroTileRef.current.style.transform = `scale(${scale})`;
      }

      if (logoRef.current) {
        const navFontSize = 28;
        const heroFontSize = Math.min(190, Math.max(64, window.innerWidth * 0.11));
        const s0 = heroFontSize / navFontSize;
        const navLogoHeight = logoRef.current.offsetHeight;
        const desiredBigTopY = window.innerHeight - 48 - navLogoHeight * s0;
        const dy0 = desiredBigTopY - 18;
        const scaleNow = 1 + (s0 - 1) * (1 - eased);
        const dyNow = dy0 * (1 - eased);
        logoRef.current.style.transform = `translate(0px, ${dyNow}px) scale(${scaleNow})`;
      }

      if (heroTaglineRef.current) {
        heroTaglineRef.current.style.opacity = Math.max(0, 1 - progress / 0.25);
      }

      if (heroParaRef.current) {
        const containerOpacity = Math.min(1, Math.max(0, (progress - 0.3) / 0.1));
        heroParaRef.current.style.opacity = containerOpacity;
        heroParaRef.current.style.pointerEvents = containerOpacity > 0.5 ? 'auto' : 'none';

        const words = heroParaRef.current.querySelectorAll('.rw');
        const wordProgress = Math.min(1, Math.max(0, (progress - 0.35) / 0.5));
        const n = words.length;
        words.forEach((el, i) => {
          const per = Math.min(1, Math.max(0, wordProgress * n - i));
          el.style.opacity = 0.16 + 0.84 * per;
        });
      }

      if (heroCtaRef.current) {
        heroCtaRef.current.style.opacity = Math.min(1, Math.max(0, (progress - 0.75) / 0.15));
      }
    };

    const throttled = rafThrottle(handleScroll);
    window.addEventListener('scroll', throttled, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', throttled);
  }, [logoRef]);

  const words = "XPSR Studio is een videoproductiehuis uit Harderwijk. Wij vertellen verhalen die blijven hangen, van concept tot montage, voor merken die willen opvallen.".split(' ');

  return (
    <div ref={heroMosaicRef} style={{ position: 'relative', height: '320vh', background: '#0b0908' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', animation: 'revealUp 1s cubic-bezier(.16,1,.3,1) both' }}>

        <div ref={heroTileRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', transformOrigin: '50% 50%', willChange: 'transform', background: '#1a1414' }}>
          <img src={heroBg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,9,8,0.15) 0%, rgba(11,9,8,0.35) 45%, rgba(11,9,8,0.9) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 220px 40px rgba(0,0,0,0.6)', pointerEvents: 'none' }} />
        </div>

        <div
          onClick={onOpenLightbox}
          style={{
            position: 'absolute', top: 32, right: 48, zIndex: 30, display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(11,9,8,0.4)',
            backdropFilter: 'blur(4px)', cursor: 'pointer',
          }}
        >
          <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '9px solid #F5F3F1' }} />
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: '#F5F3F1', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Showreel</span>
        </div>

        <div ref={heroTaglineRef} style={{ position: 'absolute', right: 48, bottom: 56, zIndex: 20, maxWidth: 280, textAlign: 'right', pointerEvents: 'none' }}>
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15, lineHeight: 1.5, color: '#F5F3F1', margin: 0 }}>
            <span style={{ fontWeight: 800 }}>Verhalen</span> die niet alleen gezien worden, maar <span style={{ fontWeight: 800 }}>blijven hangen.</span>
          </p>
        </div>

        <div ref={heroParaRef} style={{ position: 'absolute', inset: 0, zIndex: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 48px', opacity: 0, pointerEvents: 'none' }}>
          <div style={{ maxWidth: 760, textAlign: 'center' }}>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(20px,2.8vw,34px)', lineHeight: 1.45, margin: '0 0 36px' }}>
              {words.map((w, i) => (
                <span key={i} className="rw">{w} </span>
              ))}
            </p>
            <a
              ref={heroCtaRef}
              href="#projecten"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 36px', borderRadius: 999,
                background: '#E31E24', color: '#0b0908', fontFamily: "'Manrope',sans-serif", fontWeight: 800,
                fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0,
              }}
            >
              Bekijk ons werk <span>→</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
