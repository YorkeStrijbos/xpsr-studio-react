import { useLayoutEffect, useRef } from 'react';
import { ApertureLink } from '../Aperture.jsx';
import { Picture } from '../Media.jsx';
import { useOpenReel } from '../Reel.jsx';
import { HERO } from '../../data/site.js';
import { gsap, prefersReducedMotion } from '../../lib/motion.js';

/*
 * Hero: donkere hal, spotlight volgt de cursor.
 * Op scroll breekt de claim per woord uit elkaar en schaalt de hero terug onder het staal.
 * TODO XPSR: industriële reel (lassen, slijpen, machines, vakmensen) als master aanleveren; nu een still van REYM.
 */
export default function HeroV2() {
  const openReel = useOpenReel();
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // Spotlight met lerp. Touch: de spot beweegt vanzelf.
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const pos = { x: el.clientWidth * 0.66, y: el.clientHeight * 0.45 };
      const target = { ...pos };
      const onMove = (e) => {
        target.x = e.clientX;
        target.y = e.clientY;
      };
      let t = 0;
      const tick = () => {
        if (window.scrollY > el.offsetHeight) return;
        if (!fine) {
          t += 0.012;
          target.x = el.clientWidth * (0.5 + 0.3 * Math.sin(t * 0.8));
          target.y = el.clientHeight * (0.45 + 0.15 * Math.sin(t * 1.3 + 1));
        }
        pos.x += (target.x - pos.x) * 0.12;
        pos.y += (target.y - pos.y) * 0.12;
        el.style.setProperty('--x', `${pos.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${pos.y.toFixed(1)}px`);
      };
      if (!reduced) {
        gsap.ticker.add(tick);
        window.addEventListener('pointermove', onMove, { passive: true });
      }

      // Claim breekt uit elkaar: woorden links van het midden naar links, rechts naar rechts.
      if (!reduced) {
        const words = gsap.utils.toArray('.hero2__word', el);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        });
        words.forEach((w) => {
          const line = w.parentElement;
          const lr = line.getBoundingClientRect();
          const wr = w.getBoundingClientRect();
          const rel = (wr.left + wr.width / 2 - lr.left) / lr.width - 0.5; // -0.5 .. 0.5
          tl.to(w, { xPercent: rel * 260, ease: 'none' }, 0);
        });
        tl.to('.hero2__meta', { yPercent: 60, autoAlpha: 0, ease: 'none' }, 0)
          .to('.hero2__scene', { scale: 0.92, autoAlpha: 0.35, ease: 'none' }, 0);
      }

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('pointermove', onMove);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="s-hero hero2" aria-labelledby="hero-title">
      <div className="hero2__scene">
        <Picture
          name="reym-een-dag-uit-het-leven-van-juri"
          alt=""
          priority
          sizes="100vw"
          className="hero2__base"
          imgClassName="hero2__img"
        />
        <div className="hero2__lit" aria-hidden="true">
          <Picture name="reym-een-dag-uit-het-leven-van-juri" alt="" sizes="100vw" imgClassName="hero2__img" />
        </div>
        <div className="hero2__glow" aria-hidden="true" />
      </div>

      <div className="hero2__content container">
        <p className="mono hero2__label">
          <span className="hero2__rec" aria-hidden="true" /> {HERO.label}
        </p>
        <h1 id="hero-title" className="display hero2__claim">
          {HERO.claim.map((line) => (
            <span key={line} className="hero2__line">
              {line.split(' ').map((w, i) => (
                <span key={i} className="hero2__word">
                  {w}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <div className="hero2__meta">
          <p className="lead hero2__sub">{HERO.sub}</p>
          <div className="hero2__ctas">
            <button type="button" className="btn btn--primary" onClick={openReel} data-cursor="PLAY">
              <svg className="btn__icon" viewBox="0 0 10 12" aria-hidden="true">
                <path d="M0 0l10 6-10 6z" fill="currentColor" />
              </svg>
              Bekijk de reel
            </button>
            <ApertureLink to="/contact" className="btn">
              Plan een draaidag
            </ApertureLink>
          </div>
        </div>
      </div>
    </section>
  );
}
