import { useLayoutEffect, useRef } from 'react';
import Accent from '../Accent.jsx';
import { WERKWIJZE } from '../../content/home.js';
import { gsap } from '../../lib/motion.js';
import { revealIn, riseIn } from '../../motion/reveal.js';

/* Werkwijze: vijf stappen naast elkaar, met de VCA-regel eronder. De uitgebreide draaidag staat op /over-ons. */
export default function Werkwijze() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    let undo = () => {};
    const ctx = gsap.context(() => {
      undo = revealIn(el);
      riseIn('.ww__step', '.ww__steps');
      riseIn('.ww__vca', '.ww__vca');
    }, el);
    return () => {
      undo();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-werkwijze ww section--m" aria-labelledby="ww-title">
      <div className="container">
        <p className="mono ww__label">{WERKWIJZE.label}</p>
        <h2 id="ww-title" className="display ww__h" data-reveal>
          <Accent text={WERKWIJZE.heading} />
        </h2>
        <ol className="ww__steps">
          {WERKWIJZE.steps.map((s) => (
            <li key={s.no} className="ww__step">
              <span className="mono ww__no">{s.no}</span>
              <h3 className="display ww__title">{s.title}</h3>
              <p className="ww__line">{s.line}</p>
            </li>
          ))}
        </ol>
        <p className="ww__vca">
          <span className="ww__rec" aria-hidden="true" /> {WERKWIJZE.vca}
        </p>
      </div>
    </section>
  );
}
