import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion.js';

const PHASES = [
  { sel: '.s-blueprint', label: 'Fase 01 / Plan' },
  { sel: '.s-storyboard', label: 'Fase 02 / Script' },
  { sel: '.s-dayline', label: 'Fase 03 / Edit' },
  { sel: '.s-premiere', label: 'Fase 04 / Oplevering' },
];

/*
 * Doorlopend faselabel linksboven met een voortgangsbalk van vier segmenten, zichtbaar over
 * plan, script, edit en oplevering. Moet ná die secties gerenderd worden, zodat hun pins al bestaan.
 */
export default function ProcessBar() {
  const root = useRef(null);
  const labelRef = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const segs = el.querySelectorAll('.process__seg span');
    const id = requestAnimationFrame(() => {
      ctx.add(() => {
        // Zichtbaar zolang één van de vier fases actief is.
        const active = new Set();
        PHASES.forEach((p, i) => {
          const sec = document.querySelector(p.sel);
          if (!sec) return;
          const vars = {
            trigger: sec,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => {
              if (self.isActive) {
                active.add(i);
                labelRef.current.textContent = p.label;
              } else {
                active.delete(i);
              }
              el.classList.toggle('is-on', active.size > 0);
            },
          };
          if (prefersReducedMotion()) {
            ScrollTrigger.create({ ...vars, onUpdate: (self) => (segs[i].style.transform = `scaleX(${self.progress})`) });
          } else {
            gsap.fromTo(segs[i], { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...vars, scrub: true } });
          }
        });
      });
    });
    const ctx = gsap.context(() => {}, el);
    return () => {
      cancelAnimationFrame(id);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className="process" aria-hidden="true">
      <span ref={labelRef} className="mono process__label">
        {PHASES[0].label}
      </span>
      <span className="process__bar">
        {PHASES.map((p) => (
          <span key={p.sel} className="process__seg">
            <span />
          </span>
        ))}
      </span>
    </div>
  );
}
