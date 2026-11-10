import { EASE, gsap, prefersReducedMotion, SplitText } from '../lib/motion.js';

/*
 * Eén tekst-reveal voor de hele site: woorden rijzen op uit hun masker zodra de kop in beeld komt.
 * Niet gescrubd, maar afgespeeld: 1,1 s, 45 ms tussen de woorden, onze xpsr-curve.
 * Gebruik: data-reveal op de kop, en revealIn(scope) in een gsap.context van de sectie.
 */
export function revealIn(scope) {
  if (prefersReducedMotion()) return () => {};
  const splits = gsap.utils.toArray('[data-reveal]', scope).map((el) => {
    const split = new SplitText(el, { type: 'words', mask: 'words' });
    gsap.from(split.words, {
      yPercent: 110,
      duration: 1.1,
      ease: EASE,
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
    return split;
  });
  return () => splits.forEach((s) => s.revert());
}

/** Blokken die rustig binnenkomen: omhoog en zichtbaar, dezelfde curve. */
export function riseIn(targets, trigger, vars = {}) {
  if (prefersReducedMotion()) return;
  gsap.from(targets, {
    autoAlpha: 0,
    y: 40,
    duration: 1.1,
    ease: EASE,
    stagger: 0.08,
    scrollTrigger: { trigger, start: 'top 80%' },
    ...vars,
  });
}
