import { useLayoutEffect, useRef } from 'react';
import { ApertureLink } from '../Aperture.jsx';
import { Picture } from '../Media.jsx';
import Accent from '../Accent.jsx';
import { ABOUT, CLIENTS } from '../../content/home.js';
import { EASE, STAGGER, gsap, prefersReducedMotion } from '../../lib/motion.js';
import { revealIn, riseIn } from '../../motion/reveal.js';
import { lightSurface } from '../../motion/surface.js';

// Elk beeld één keer per pagina: deze stills staan nergens anders op de homepage.
const STRIP = [
  { name: 'studio-portret', alt: 'Portret in de studio', w: 'wide' },
  { name: 'rosel-bts', alt: 'Achter de schermen bij Rosèl', w: 'narrow' },
  { name: 'stelz-hard-drinks-launch', alt: 'Lancering van Stëlz Hard Drinks', w: 'wide' },
  { name: 'showreel-2026', alt: 'Still uit de showreel 2026', w: 'mid' },
  { name: 'one-love-cruise', alt: 'Publiek op de One Love Cruise', w: 'mid' },
];

/*
 * Over XPSR en klanten op een crème paneel met ronde bovenhoeken.
 * Links de kop en het verhaal, rechts een feitengrid; daaronder een fotostrip die op scroll meedrijft
 * en een klantengrid met dunne lijnen.
 */
export default function AboutCream() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    let undo = () => {};
    const ctx = gsap.context(() => {
      undo = revealIn(el);
      lightSurface(el);
      riseIn('.cream__copy > p, .cream__copy > a', '.cream__copy');
      riseIn('.cream__fact', '.cream__facts');
      riseIn('.cream__client', '.cream__clients', { y: 20, stagger: STAGGER.items });
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '.cream__strip-track',
        { xPercent: 0 },
        { xPercent: -18, ease: EASE.linear, scrollTrigger: { trigger: '.cream__strip', start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }, el);
    return () => {
      undo();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-about cream" aria-labelledby="cream-title">
      <div className="container cream__grid">
        <div className="cream__copy">
          <p className="mono cream__eyebrow">{ABOUT.label}</p>
          <h2 id="cream-title" className="display cream__h" data-reveal>
            <Accent text={`${ABOUT.heading.before} ${ABOUT.heading.accent}`} />
          </h2>
          <p className="lead cream__lead">{ABOUT.lead}</p>
          <ApertureLink to="/over-ons" className="link-arrow">
            {ABOUT.link}
          </ApertureLink>
        </div>
        <dl className="cream__facts">
          {ABOUT.facts.map((f) => (
            <div key={f.big} className="cream__fact">
              <dt className="display cream__big">{f.big}</dt>
              <dd className="mono cream__small">{f.small}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="cream__strip" aria-hidden="true">
        <div className="cream__strip-track">
          {STRIP.map((s) => (
            <div key={s.name} className={`cream__shot cream__shot--${s.w}`}>
              <Picture name={s.name} alt="" sizes="30vw" imgClassName="cream__img" />
            </div>
          ))}
        </div>
      </div>

      {/* Klanten: alle namen gelijkwaardig. TODO XPSR: toestemming per klant; monochrome SVG-logo's (fase 5). */}
      <div className="container cream__clients-wrap">
        <h2 className="display cream__h cream__h--sm" data-reveal>
          <Accent text={CLIENTS.heading} />
        </h2>
        <ul className="cream__clients">
          {CLIENTS.names.map((c) => (
            <li key={c} className="cream__client">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
