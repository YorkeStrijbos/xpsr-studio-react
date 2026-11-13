import { useLayoutEffect, useRef } from 'react';
import Accent from '../Accent.jsx';
import { ApertureLink } from '../Aperture.jsx';
import { Picture } from '../Media.jsx';
import { BRANCHES } from '../../content/branches.js';
import { BRANCHES_SECTION } from '../../content/home.js';
import { gsap } from '../../lib/motion.js';
import { revealIn, riseIn } from '../../motion/reveal.js';

/*
 * Branches: per sector een grote beeldkaart met één zin, door naar /branche/:slug.
 * Zonder beeld wordt de kaart typografisch (geen placeholderbeeld: een leeg slot is erger dan geen slot).
 */
export default function Branches() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    let undo = () => {};
    const ctx = gsap.context(() => {
      undo = revealIn(el);
      riseIn('.br__card', '.br__grid');
    }, el);
    return () => {
      undo();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="branches" className="s-branches br section--l" aria-labelledby="br-title">
      <div className="container">
        <p className="mono br__label">{BRANCHES_SECTION.label}</p>
        <h2 id="br-title" className="display br__h" data-reveal>
          <span className="line">{BRANCHES_SECTION.heading[0]}</span> <Accent className="line" text={BRANCHES_SECTION.heading[1]} />
        </h2>
        <ul className="br__grid">
          {BRANCHES.map((b) => (
            <li key={b.slug}>
              <ApertureLink to={`/branche/${b.slug}`} className={`br__card ${b.image ? '' : 'br__card--type'}`}>
                {b.image && <Picture name={b.image} alt="" sizes="(min-width: 768px) 33vw, 90vw" imgClassName="br__img" />}
                <span className="br__body">
                  <span className="display br__name">{b.name}</span>
                  <span className="br__line">{b.card}</span>
                </span>
                <span className="br__go" aria-hidden="true">
                  <svg viewBox="0 0 12 12">
                    <path d="M2 10L10 2M4 2h6v6" />
                  </svg>
                </span>
              </ApertureLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
