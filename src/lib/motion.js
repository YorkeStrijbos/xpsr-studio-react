import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { useSyncExternalStore } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Draggable);

/*
 * Motion tokens: de enige plek voor easing, duur, stagger en breakpoints. Alle animaties gebruiken deze waarden.
 * tokens.css spiegelt ze voor CSS-transities (--ease-reveal, --ease-move, --dur-*).
 */
export const EASE = {
  reveal: 'expo.out', // tekst en blokken die binnenkomen
  move: 'power3.inOut', // transities: iets gaat van A naar B
  out: 'power3.out', // korte reacties (hover, klik)
  in: 'power3.in', // iets verdwijnt
  snap: 'expo.in', // hard weg, bijvoorbeeld een vlak dat tot een punt krimpt
  linear: 'none', // gescrubd aan scroll
};

export const DUR = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  reveal: 1.1,
};

export const STAGGER = {
  words: 0.045,
  lines: 0.08,
  items: 0.06,
};

// Mobiel < 768px: geen pins, eenvoudiger varianten. Gebruik met gsap.matchMedia.
export const MQ = {
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
  // Pinnen en scrubben alleen als er beweging mag en het scherm breed genoeg is.
  motionDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  motionMobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
};

gsap.defaults({ ease: EASE.out, duration: DUR.base });

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

export { gsap, ScrollTrigger, SplitText, Flip, Draggable };
