import { useEffect, useRef, useState } from 'react';
import { ApertureLink, useAperture } from './Aperture.jsx';
import { LoopVideo } from './Media.jsx';
import { useOpenReel } from './Reel.jsx';
import { HERO } from '../data/site.js';
import { DUR, EASE, gsap, useReducedMotion } from '../lib/motion.js';
import '../styles/hero.css';

const AUTO_LIGHT_MS = 3000;

/*
 * Spotlight-hero. De reel ligt onder een zwarte laag; een radiale mask volgt de cursor (met lerp).
 * Na ~3 s of bij de eerste scroll gaat het licht aan: de mask groeit tot vol beeld.
 * Touch: de spot beweegt zelf. Reduced motion: direct vol beeld, zonder spot.
 */
export default function Hero() {
  const { ready } = useAperture();
  const openReel = useOpenReel();
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const evRef = useRef(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduced) {
      root.dataset.lit = 'true';
      setLit(true);
      return;
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const rect = () => root.getBoundingClientRect();
    const pos = { x: rect().width * 0.62, y: rect().height * 0.42 };
    const target = { ...pos };
    const spot = { r: Math.max(180, Math.min(rect().width, rect().height) * 0.3) };
    const ev = { v: -3 };
    let litNow = false;
    let raf = 0;
    let t0 = performance.now();

    const render = (now) => {
      if (!finePointer && !litNow) {
        const t = (now - t0) / 1000;
        const r = rect();
        target.x = r.width * (0.5 + 0.3 * Math.sin(t * 0.7));
        target.y = r.height * (0.45 + 0.18 * Math.sin(t * 1.1 + 0.6));
      }
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      root.style.setProperty('--x', `${pos.x.toFixed(1)}px`);
      root.style.setProperty('--y', `${pos.y.toFixed(1)}px`);
      root.style.setProperty('--r', `${spot.r.toFixed(1)}px`);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e) => {
      const r = rect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
    };

    const lightOn = () => {
      if (litNow) return;
      litNow = true;
      const r = rect();
      const full = Math.hypot(r.width, r.height) * 1.2;
      gsap.to(spot, { r: full, duration: DUR[3], ease: EASE });
      gsap.to(ev, {
        v: 0,
        duration: DUR[3],
        ease: EASE,
        onUpdate: () => {
          if (evRef.current) evRef.current.textContent = ev.v.toFixed(1).replace('-0.0', '0.0').replace('-', '−');
        },
      });
      root.dataset.lit = 'true';
      setLit(true);
      cleanupTriggers();
      // Mask helemaal weg na het openen: scheelt rekenwerk tijdens het scrollen.
      gsap.delayedCall(DUR[3], () => {
        cancelAnimationFrame(raf);
        root.dataset.unmasked = 'true';
      });
    };

    const onScrollIntent = () => lightOn();
    const timer = ready ? setTimeout(lightOn, AUTO_LIGHT_MS) : null;
    const keyIntent = (e) => {
      if (['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) lightOn();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('wheel', onScrollIntent, { passive: true });
    window.addEventListener('touchmove', onScrollIntent, { passive: true });
    window.addEventListener('scroll', onScrollIntent, { passive: true });
    window.addEventListener('keydown', keyIntent);

    function cleanupTriggers() {
      clearTimeout(timer);
      window.removeEventListener('wheel', onScrollIntent);
      window.removeEventListener('touchmove', onScrollIntent);
      window.removeEventListener('scroll', onScrollIntent);
      window.removeEventListener('keydown', keyIntent);
    }

    if (window.scrollY > 10) lightOn();

    return () => {
      cancelAnimationFrame(raf);
      cleanupTriggers();
      window.removeEventListener('pointermove', onMove);
      gsap.killTweensOf([spot, ev]);
      t0 = 0;
    };
  }, [ready, reduced]);

  return (
    <section ref={rootRef} className="hero" data-lit="false" aria-labelledby="hero-title">
      <div className="hero__stage">
        <LoopVideo name="reel-boterlap-tafel" className="hero__video" eager label="achtergrondvideo" />
      </div>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__hud container" aria-hidden="true">
        <span className="label">
          EV <b ref={evRef}>{reduced ? '0.0' : '−3.0'}</b>
        </span>
        <span className="label hero__hint">{lit ? 'Belicht' : 'Beweeg om te belichten'}</span>
      </div>

      <div className="hero__content container">
        <h1 id="hero-title" className="display h1 hero__title">
          {HERO.claim}
        </h1>
        <div className="hero__bottom">
          <p className="lead hero__sub">{HERO.sub}</p>
          <div className="hero__ctas">
            <button type="button" className="btn btn--primary" onClick={openReel}>
              <svg className="btn__icon" viewBox="0 0 10 12" aria-hidden="true">
                <path d="M0 0l10 6-10 6z" fill="currentColor" />
              </svg>
              Bekijk de showreel
            </button>
            <ApertureLink to="/contact" className="btn">
              Plan een gesprek
            </ApertureLink>
          </div>
        </div>
      </div>
    </section>
  );
}
