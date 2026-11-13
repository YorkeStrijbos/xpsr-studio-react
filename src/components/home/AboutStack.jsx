import { useLayoutEffect, useRef } from 'react';
import Portrait from '../Portrait.jsx';
import Workflow from './Workflow.jsx';
import { ABOUT, CLIENTS_INDUSTRY, CLIENTS_OTHER, TEAM } from '../../data/site.js';
import { EASE, ScrollTrigger, gsap, prefersReducedMotion } from '../../lib/motion.js';

/*
 * Over XPSR: links stapelen de koppen zich op, rechts scrolt de tekst door.
 * Actieve kop wit, eerdere koppen op 40%. Zoekerhoeken stellen scherp op de portretten.
 */
export default function AboutStack() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const heads = gsap.utils.toArray('.stack__head', el);
    const blocks = gsap.utils.toArray('.stack__block', el);
    const ctx = gsap.context(() => {
      blocks.forEach((b, i) => {
        ScrollTrigger.create({
          trigger: b,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (!self.isActive) return;
            heads.forEach((h, k) => {
              h.classList.toggle('is-active', k === i);
              h.classList.toggle('is-past', k < i);
            });
          },
        });
      });
      if (prefersReducedMotion()) return;
      // Zoekerhoeken van groot naar strak, beeld van zacht naar scherp.
      gsap.utils.toArray('.portrait', el).forEach((f) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 85%', end: 'center 55%', scrub: true } });
        tl.fromTo(f.querySelectorAll('.portrait__c'), { x: (i) => (i % 2 ? 28 : -28), y: (i) => (i < 2 ? -28 : 28) }, { x: 0, y: 0, ease: EASE.reveal }, 0)
          .fromTo(f.querySelector('.portrait__img'), { scale: 1.08, opacity: 0.5 }, { scale: 1, opacity: 1, ease: EASE.reveal }, 0);
      });
    }, el);
    heads[0]?.classList.add('is-active');
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="s-about stack" aria-labelledby="about-title">
      <div className="container stack__grid">
        <div className="stack__heads">
          <h2 id="about-title" className="mono stack__eyebrow">
            Over XPSR
          </h2>
          <div className="stack__pile">
            {ABOUT.map((a) => (
              <p key={a.head} className="stack__head display" aria-hidden="true">
                {a.head}
              </p>
            ))}
          </div>
        </div>
        <div className="stack__body">
          {ABOUT.map((a) => (
            <article key={a.head} className="stack__block">
              <h3 className="mono label--red">{a.head}</h3>
              <p className="lead stack__text">{a.body}</p>
              {a.kind === 'team' && (
                <div className="stack__team">
                  {TEAM.map((p) => (
                    <Portrait key={p.name} p={p} />
                  ))}
                </div>
              )}
              {a.steps && <Workflow steps={a.steps} />}
              {a.badges && (
                <ul className="stack__badges">
                  {a.badges.map((b) => (
                    <li key={b} className="mono">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {a.kind === 'clients' && (
                // TODO XPSR: toestemming per klant checken; logo's als SVG aanleveren.
                <div className="stack__clients">
                  <ul className="stack__clients-main">
                    {CLIENTS_INDUSTRY.map((c) => (
                      <li key={c} className="display">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <ul className="stack__clients-other">
                    {CLIENTS_OTHER.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
