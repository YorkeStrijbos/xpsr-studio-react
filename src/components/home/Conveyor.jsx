import { useLayoutEffect, useRef } from 'react';
import { Picture } from '../Media.jsx';
import { CONVEYOR } from '../../data/site.js';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion.js';

const ROLLERS = 14;

/*
 * Andere branches op een lopende band. Snelheid volgt de scrollsnelheid,
 * rollers draaien mee en bij snel scrollen kantelen de items licht naar achteren.
 */
export default function Conveyor() {
  const root = useRef(null);
  const belt = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      const items = belt.current;
      const rollers = gsap.utils.toArray('.belt__roller-spoke', el);
      const tiltTo = gsap.quickTo('.belt__item', 'rotate', { duration: 0.5, ease: 'power3' });
      let x = 0;
      let visible = false;
      let speed = 1;
      const trig = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (visible = self.isActive),
      });
      const tick = (_, dt) => {
        if (!visible) return;
        const v = trig.getVelocity(); // px per seconde
        const target = 1 + Math.min(Math.abs(v) / 250, 12);
        speed += (target - speed) * 0.08;
        const dir = v < 0 ? -1 : 1;
        x -= speed * dir * dt * 0.06;
        const half = items.scrollWidth / 2;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        gsap.set(items, { x });
        gsap.set(rollers, { rotate: `-=${speed * dir * dt * 0.4}` });
        tiltTo(-Math.max(-8, Math.min(8, v / 200)));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    }, el);
    return () => ctx.revert();
  }, []);

  const row = (hidden) =>
    CONVEYOR.map((it, i) => (
      <li key={`${hidden ? 'b' : 'a'}${i}`} className={`belt__item ${it.media ? 'belt__item--img' : ''}`} aria-hidden={hidden || undefined}>
        {it.media ? (
          <Picture name={it.media} alt={hidden ? '' : it.alt} sizes="220px" imgClassName="belt__img" />
        ) : (
          <span className="display">{it.label}</span>
        )}
      </li>
    ));

  return (
    <section ref={root} className="s-conveyor belt" aria-labelledby="belt-title">
      <div className="container">
        <span className="mono">Tweede ring</span>
        <h2 id="belt-title" className="display h2">
          Industrie eerst. Maar we kunnen meer.
        </h2>
      </div>
      <div className="belt__line">
        <ul ref={belt} className="belt__items">
          {row(false)}
          {row(true)}
        </ul>
        <div className="belt__surface" aria-hidden="true">
          {Array.from({ length: ROLLERS }, (_, i) => (
            <span key={i} className="belt__roller">
              <span className="belt__roller-spoke" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
