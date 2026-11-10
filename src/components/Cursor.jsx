import { useEffect, useRef } from 'react';
import { gsap, useMediaQuery, useReducedMotion } from '../lib/motion.js';

// Tekst per vorm. Een waarde die hier niet staat, wordt zelf als label getoond (bijvoorbeeld "volgende").
const LABELS = { '': '', link: '', play: '', bekijk: 'Bekijk', sleep: 'Sleep' };
const LERP = 0.2; // aandeel van de afstand per frame bij 60 fps

/*
 * REC-cursor. Een rode stip die vloeiend volgt (lerp op de GSAP-ticker, onafhankelijk van de framerate).
 * data-cursor="play" (video), "bekijk" (cases), "sleep" (carousel) of een eigen label: de stip groeit uit tot
 * een cirkel met icoon of tekst. Boven links en knoppen zonder data-cursor krimpt hij tot een stipje,
 * zodat hij nooit een knop afdekt. Altijd pointer-events: none. Alleen bij een muis, niet bij reduced motion.
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
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    const tick = (_t, dt) => {
      const k = 1 - Math.pow(1 - LERP, dt / (1000 / 60));
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
    };
    gsap.ticker.add(tick);

    let mode = '';
    const setMode = (next) => {
      if (next === mode) return;
      mode = next;
      el.dataset.mode = next in LABELS ? next : 'label';
      labelRef.current.textContent = next in LABELS ? LABELS[next] : next;
    };

    let first = true;
    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (first) {
        // Eerste beweging: direct op de muis, niet vanuit de hoek aan komen glijden.
        pos.x = target.x;
        pos.y = target.y;
        first = false;
      }
      el.classList.remove('is-out');
      update(e.target);
    };
    const update = (node) => {
      const t = node instanceof Element ? node : null;
      const withCursor = t?.closest('[data-cursor]');
      const value = withCursor?.getAttribute('data-cursor')?.toLowerCase() ?? '';
      if (value) setMode(value);
      else setMode(t?.closest('a, button, [role="button"], input, textarea, select, label') ? 'link' : '');
    };
    // Scrollen zonder de muis te bewegen: opnieuw kijken wat er onder de cursor ligt (één keer per frame).
    let queued = false;
    const onScroll = () => {
      if (queued || first) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update(document.elementFromPoint(target.x, target.y));
      });
    };
    const onLeave = () => el.classList.add('is-out');
    const onDown = () => el.classList.add('is-down');
    const onUp = () => el.classList.remove('is-down');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      gsap.ticker.remove(tick);
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="cursor is-out" data-mode="" aria-hidden="true">
      <span className="cursor__dot" />
      <svg className="cursor__icon cursor__icon--play" viewBox="0 0 12 14">
        <path d="M1 1l10 6-10 6z" />
      </svg>
      <svg className="cursor__icon cursor__icon--sleep" viewBox="0 0 40 12">
        <path d="M7 1L2 6l5 5M33 1l5 5-5 5M2 6h36" />
      </svg>
      <span ref={labelRef} className="cursor__label" />
    </div>
  );
}
