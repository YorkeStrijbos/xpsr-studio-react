import { useLayoutEffect, useRef } from 'react';
import { ApertureLink } from '../Aperture.jsx';
import { LoopVideo, Picture } from '../Media.jsx';
import NoSignal from '../NoSignal.jsx';
import { PUBLISHED } from '../../data/cases.js';

// Alleen gepubliceerde cases (met beeld): een leeg beeldslot is erger dan geen slot. Maximaal zes.
const FEATURED = PUBLISHED.slice(0, 6);
import { WORK } from '../../content/home.js';
import Accent from '../Accent.jsx';
import { EASE, MQ, gsap, prefersReducedMotion } from '../../lib/motion.js';
import { revealIn } from '../../motion/reveal.js';

const isPlaceholder = (t) => !t || t.startsWith('[');

// De cover van REYM staat al in de hero; hier zijn loop, zodat elk beeld één keer op de pagina staat.
function Cover({ c }) {
  if (c.slug === 'reym' && c.heroMotion) return <LoopVideo name={c.heroMotion} className="rail__img" label={c.cover.alt} />;
  if (c.cover) return <Picture name={c.cover.name} alt={c.cover.alt} sizes="(min-width: 768px) 28vw, 80vw" imgClassName="rail__img" />;
  return <NoSignal sub={c.client} />;
}

/*
 * Cases als horizontale rail. Desktop: de sectie pint en verticaal scrollen schuift de kaarten naar links,
 * met een voortgangslijn onderaan. Mobiel: gewoon horizontaal swipen met snap.
 */
export default function CasesRail() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    let undo = () => {};
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      undo = revealIn(el);
      if (prefersReducedMotion()) return;
      mm.add(MQ.motionDesktop, () => {
        const track = el.querySelector('.rail__track');
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap
          .timeline({
            defaults: { ease: EASE.linear },
            scrollTrigger: {
              trigger: el.querySelector('.rail__stage'),
              start: 'top top',
              end: () => `+=${dist()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(track, { x: () => -dist() }, 0)
          .fromTo('.rail__bar', { scaleX: 0 }, { scaleX: 1 }, 0)
          // De kop wijkt iets terug, zoals bij Bitwip: de kaarten nemen het over.
          .to('.rail__intro', { autoAlpha: 0.25, duration: 0.3 }, 0.1);
      });
    }, el);
    return () => {
      undo();
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-cases rail" aria-labelledby="rail-title">
      <div className="rail__stage">
        <div className="rail__track">
          <div className="rail__intro">
            {/* TODO XPSR: kop kiezen uit WORK.headingOptions. */}
            <h2 id="rail-title" className="display rail__h" data-reveal>
              <Accent text={WORK.heading} />
            </h2>
            <ApertureLink to="/cases" className="link-arrow">
              {WORK.all}
            </ApertureLink>
          </div>
          {FEATURED.map((c) => (
            <article key={c.slug} className="rail__card">
              <ApertureLink to={`/cases/${c.slug}`} className="rail__media" data-cursor="bekijk" aria-label={`Bekijk de case ${c.client}`}>
                <Cover c={c} />
              </ApertureLink>
              <p className="mono rail__tags">
                {!isPlaceholder(c.made) && <span>{c.made}</span>}
                <span className="rail__dot" aria-hidden="true" />
                <span>{c.branch}</span>
              </p>
              <h3 className="rail__client">{c.client}</h3>
              {!isPlaceholder(c.line) && <p className="rail__line">{c.line}</p>}
              <ApertureLink to={`/cases/${c.slug}`} className="link-arrow rail__more">
                Bekijk de case
              </ApertureLink>
            </article>
          ))}
        </div>
        <div className="container" aria-hidden="true">
          <div className="rail__progress">
            <span className="rail__bar" />
          </div>
        </div>
      </div>
    </section>
  );
}
