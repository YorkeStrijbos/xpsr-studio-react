import { useLayoutEffect, useRef } from 'react';
import CameraHud from './CameraHud.jsx';
import { STATEMENTS } from '../../content/home.js';
import { EASE, MQ, gsap, prefersReducedMotion } from '../../lib/motion.js';
import { vfEls } from '../../motion/viewfinder.js';

/*
 * Statements. Een schermvullend donker vlak met de camera-zoeker erover; daarop verschijnen de regels één voor één.
 * TODO fase 4: één scène met scrubbare achtergrondvideo die bij het laatste statement opengaat.
 */
export default function Pain() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add({ wide: MQ.desktop, narrow: MQ.mobile }, () => {
        const lines = gsap.utils.toArray('.pain__line', el);
        const tl = gsap.timeline({
          defaults: { ease: EASE.linear },
          scrollTrigger: { trigger: '.pain__pin', start: 'top top', end: '+=200%', pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        tl.set(vfEls.core, { scale: 0 }, 0);
        // Alle regels starten onzichtbaar onder hun masker.
        const spans = lines.map((l) => l.firstChild);
        gsap.set(spans, { yPercent: 110, y: 0, autoAlpha: 0 });

        // Per regel een vast slot: in (0,4), staan (0,4), uit (0,35), pauze (0,15).
        // In en uit zijn allebei expliciete fromTo's, zodat ook bij snel of terug scrollen
        // de vorige regel altijd helemaal weg is voordat de volgende binnenkomt.
        const IN = 0.4;
        const HOLD = 0.4;
        const OUT = 0.35;
        const GAP = 0.15;
        const SLOT = IN + HOLD + OUT + GAP;
        spans.forEach((span, i) => {
          const at = 0.3 + i * SLOT;
          tl.fromTo(span, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: IN, ease: EASE.reveal, immediateRender: false }, at);
          tl.fromTo(span, { yPercent: 0, autoAlpha: 1 }, { yPercent: -110, autoAlpha: 0, duration: OUT, ease: EASE.move, immediateRender: false }, at + IN + HOLD);
        });
        // Korte rust na de laatste regel, dan scrolt de sectie gewoon door.
        tl.to({}, { duration: 0.3 });
      });

    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-pain pain" aria-labelledby="pain-title">
      <div className="pain__pin">
        <div className="pain__disc" aria-hidden="true">
          <div className="pain__sun" />
        </div>
        <CameraHud className="pain__hud" />
        <h2 id="pain-title" className="sr-only">
          Het probleem
        </h2>
        <div className="pain__lines container">
          {STATEMENTS.lines.map((l) => (
            <p key={l} className="pain__line display">
              <span>{l}</span>
            </p>
          ))}
          <p className="pain__line pain__line--turn display">
            <span>{STATEMENTS.turn}</span>
          </p>
        </div>
      </div>

    </section>
  );
}
