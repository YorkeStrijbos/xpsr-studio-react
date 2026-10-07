import { useEffect, useRef } from 'react';
import { gsap, useMediaQuery, useReducedMotion } from '../lib/motion.js';

/*
 * REC-cursor. Klein rood punt; boven [data-cursor="LABEL"] groeit hij met label,
 * boven links en knoppen krimpt hij. Alleen bij een muis.
 */
export default function Cursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const labelRef = useRef(null);
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    document.documentElement.classList.add('has-cursor');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3' });
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    let label = '';
    const onMove = (e) => {
      gsap.set(el, { autoAlpha: 1 });
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      const withLabel = target?.closest('[data-cursor]');
      const next = withLabel?.getAttribute('data-cursor') ?? '';
      if (next !== label) {
        label = next;
        labelRef.current.textContent = next;
        el.classList.toggle('is-label', !!next);
      }
      el.classList.toggle('is-link', !next && !!target?.closest('a, button'));
    };
    const onLeave = () => gsap.set(el, { autoAlpha: 0 });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__dot" />
      <span ref={labelRef} className="cursor__label" />
    </div>
  );
}
