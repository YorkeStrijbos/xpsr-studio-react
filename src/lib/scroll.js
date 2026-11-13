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

// Laatste echte scroll-input van de gebruiker: een refresh of een programmatische scroll start geen scène.
let inputAt = 0;
if (typeof window !== 'undefined') {
  const mark = () => {
    inputAt = performance.now();
  };
  ['wheel', 'touchmove', 'keydown'].forEach((t) => window.addEventListener(t, mark, { passive: true, capture: true }));
}

/**
 * Eén scroll speelt een gepinde scène af. De tijdlijn loopt op tijd, niet op scroll: dat blijft vloeiend,
 * hoe je ook scrolt. Zodra je de pin in scrollt, springt de scroll (onzichtbaar, want gepind) naar het eind,
 * speelt de tijdlijn af en is scrollen even uit. Omhoog spoelt hij sneller terug naar het begin.
 * Geeft ScrollTrigger-callbacks terug. Komt er geen gebruiker aan te pas (anker, refresh), dan klopt de eindstand.
 */
export function playOnScroll(tl, { reverseSpeed = 1.8 } = {}) {
  let busy = false;
  const run = (self, forward) => {
    busy = true;
    lenis?.stop();
    lenis?.scrollTo(forward ? self.end : self.start, { immediate: true, force: true });
    tl.timeScale(forward ? 1 : reverseSpeed);
    tl.eventCallback(forward ? 'onComplete' : 'onReverseComplete', () => {
      busy = false;
      lenis?.start();
    });
    forward ? tl.play() : tl.reverse();
  };
  return {
    onUpdate: (self) => {
      if (busy || !lenis || performance.now() - inputAt > 400) return;
      if (self.direction > 0 && self.progress > 0 && tl.progress() < 1) run(self, true);
      else if (self.direction < 0 && self.progress < 1 && tl.progress() > 0) run(self, false);
    },
    onLeave: () => !busy && tl.progress(1),
    onLeaveBack: () => !busy && tl.progress(0),
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
