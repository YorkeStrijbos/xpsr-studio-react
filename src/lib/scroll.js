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
