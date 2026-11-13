import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion.js';

let lenis = null;

// Start Lenis gekoppeld aan de GSAP-ticker. Bij reduced motion blijft native scroll actief.
export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Vloeiend naar een element scrollen (onder de nav), via Lenis als die draait. */
export function scrollToElement(el) {
  if (!el) return;
  const offset = -parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '0');
  if (lenis) lenis.scrollTo(el, { offset });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
}

/**
 * Eén scroll-beweging speelt een gepinde scène helemaal af: zodra je de pin in scrollt, rolt de pagina vanzelf
 * door naar het eind (omlaag) of terug naar het begin (omhoog). Tijdens die rit wordt handmatig scrollen genegeerd.
 * Gebruik als onUpdate van een ScrollTrigger. Zonder Lenis (reduced motion) gewoon scrollen.
 */
// Laatste echte scroll-input van de gebruiker: een refresh of een programmatische scroll start geen rit.
let inputAt = 0;
if (typeof window !== 'undefined') {
  const mark = () => {
    inputAt = performance.now();
  };
  ['wheel', 'touchmove', 'keydown'].forEach((t) => window.addEventListener(t, mark, { passive: true, capture: true }));
}

export function snapThrough({ duration = 2 } = {}) {
  let busy = false;
  return (self) => {
    if (busy || !lenis || self.progress <= 0 || self.progress >= 1 || performance.now() - inputAt > 400) return;
    busy = true;
    lenis.scrollTo(self.direction > 0 ? self.end : self.start, {
      duration,
      easing: (t) => t,
      lock: true,
      force: true,
      onComplete: () => {
        busy = false;
      },
    });
  };
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
