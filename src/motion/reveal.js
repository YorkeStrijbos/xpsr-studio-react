import { DUR, EASE, STAGGER, SplitText, gsap, prefersReducedMotion } from '../lib/motion.js';

/*
 * Eén tekst-reveal voor de hele site: woorden rijzen op uit hun masker zodra de kop in beeld komt.
 * Niet gescrubd, maar afgespeeld: DUR.slow, STAGGER.words, EASE.reveal.
 * Gebruik: data-reveal op de kop, en revealIn(scope) in een gsap.context van de sectie.
 */
export function revealIn(scope) {
  if (prefersReducedMotion()) return () => {};
  const splits = gsap.utils.toArray('[data-reveal]', scope).map((el) => {
    const split = new SplitText(el, { type: 'words', mask: 'words' });
    gsap.from(split.words, {
      yPercent: 110,
      duration: DUR.slow,
      ease: EASE.reveal,
      stagger: STAGGER.words,
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
    duration: DUR.slow,
    ease: EASE.reveal,
    stagger: STAGGER.lines,
    scrollTrigger: { trigger, start: 'top 80%' },
    ...vars,
  });
}
