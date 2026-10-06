import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useSyncExternalStore } from 'react';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Spiegelt de tokens in tokens.css, zodat CSS en GSAP dezelfde motion-taal spreken.
CustomEase.create('xpsr', '0.16, 1, 0.3, 1');
CustomEase.create('xpsrIn', '0.7, 0, 0.84, 0');
export const EASE = 'xpsr';
export const EASE_IN = 'xpsrIn';
export const DUR = { 1: 0.6, 2: 0.9, 3: 1.2 };

const query = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(query).matches;
}

function subscribe(cb) {
  const mq = window.matchMedia(query);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}

export function useMediaQuery(q) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(q);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(q).matches,
    () => false,
  );
}

export { gsap, ScrollTrigger };
