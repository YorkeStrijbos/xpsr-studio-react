import { ScrollTrigger } from '../lib/motion.js';

/*
 * Markeert een licht vlak: zolang het midden van het scherm erop ligt, krijgt <html> de class is-light.
 * Korrel en cursor reageren daarop. Geeft de ScrollTrigger terug; maak hem binnen een gsap.context aan.
 */
export function lightSurface(trigger) {
  const root = document.documentElement;
  return ScrollTrigger.create({
    trigger,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: (self) => root.classList.toggle('is-light', self.isActive),
    onKill: () => root.classList.remove('is-light'),
  });
}
