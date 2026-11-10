import { EASE, gsap } from '../lib/motion.js';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-_';

/** Tekst "scrambelt" van ruis naar de echte tekst. Alleen textContent, geen layout. */
export function scramble(el, { duration = 0.6, delay = 0 } = {}) {
  const final = el.dataset.final ?? el.textContent;
  el.dataset.final = final;
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1,
    duration,
    delay,
    ease: EASE.linear,
    onUpdate: () => {
      const n = Math.floor(final.length * state.p);
      let out = final.slice(0, n);
      for (let i = n; i < final.length; i++) {
        out += final[i] === ' ' ? ' ' : CHARS[(Math.random() * CHARS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = final;
    },
  });
}
