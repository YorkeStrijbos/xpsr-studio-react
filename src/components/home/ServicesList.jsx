import { useId, useLayoutEffect, useRef, useState } from 'react';
import { ApertureLink } from '../Aperture.jsx';
import { LoopVideo, Picture } from '../Media.jsx';
import NoSignal from '../NoSignal.jsx';
import { SERVICES } from '../../data/site.js';
import { gsap } from '../../lib/motion.js';
import { revealIn, riseIn } from '../../motion/reveal.js';

const p2 = (n) => String(n).padStart(2, '0');
const fmt = (ar) => (ar > 2 ? '2.39:1' : ar < 1 ? '9:16' : ar === 1.5 ? '3:2' : '16:9');

function Media({ s, sizes }) {
  if (s.media?.type === 'motion') return <LoopVideo name={s.media.name} className="svl__img" label={s.media.alt} />;
  if (s.media) return <Picture name={s.media.name} alt={s.media.alt} sizes={sizes} imgClassName="svl__img" />;
  return <NoSignal sub={s.label} />;
}

/** Klein rood zeskant: het diafragma als bullet, per dienst een eigen stand. */
function Mark({ i }) {
  return (
    <svg className="svl__mark" viewBox="-10 -10 20 20" aria-hidden="true" style={{ rotate: `${i * 20}deg` }}>
      <polygon points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5" />
    </svg>
  );
}

/*
 * Eén draaidag. Zes opbrengsten. Links een accordion met de diensten, rechts een beeldkaart die meewisselt,
 * met daaronder ronde thumbnails om direct te kiezen. Geen pin: gewoon scrollen.
 */
export default function ServicesList() {
  const root = useRef(null);
  // Open op de eerste dienst die al beeld heeft. TODO XPSR: terug naar 0 zodra elke dienst een loop heeft.
  const [open, setOpen] = useState(() => Math.max(0, SERVICES.findIndex((sv) => sv.media)));
  const uid = useId();
  const s = SERVICES[open];

  useLayoutEffect(() => {
    const el = root.current;
    let undo = () => {};
    const ctx = gsap.context(() => {
      undo = revealIn(el);
      riseIn('.svl__item', '.svl__list', { stagger: 0.06 });
      riseIn('.svl__card, .svl__thumbs', '.svl__aside');
    }, el);
    return () => {
      undo();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-services svl" aria-labelledby="svl-title">
      <div className="container">
        <h2 id="svl-title" className="display svl__h" data-reveal>
          Eén draaidag. <span className="accent">Zes opbrengsten.</span>
        </h2>

        <div className="svl__grid">
          <ul className="svl__list">
            {SERVICES.map((sv, i) => {
              const isOpen = i === open;
              return (
                <li key={sv.code} className={`svl__item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="svl__head"
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-${i}`}
                    onClick={() => setOpen(i)}
                  >
                    <Mark i={i} />
                    <span className="svl__title">{sv.title}</span>
                    <span className="svl__toggle" aria-hidden="true" />
                  </button>
                  <div id={`${uid}-${i}`} className="svl__panel" role="region" aria-label={sv.title}>
                    <div className="svl__panel-in">
                      <p className="svl__line">{sv.line}</p>
                      <p className="mono svl__cam">
                        {sv.cam.join(' / ')} / {fmt(sv.ar)}
                      </p>
                      <ApertureLink to="/cases" className="link-arrow">
                        Bekijk de cases
                      </ApertureLink>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="svl__aside">
            <div className="svl__card">
              {/* key: bij een wissel komt het nieuwe beeld met een korte zoom binnen */}
              <div key={s.code} className="svl__media">
                <Media s={s} sizes="(min-width: 860px) 45vw, 90vw" />
              </div>
              <div className="svl__cap">
                <span className="mono">Dienst {p2(open + 1)} / {p2(SERVICES.length)}</span>
                <span className="svl__cap-title">{s.title}</span>
              </div>
              <ApertureLink to="/contact" className="svl__go" aria-label={`Plan een draaidag voor ${s.title}`}>
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 10L10 2M4 2h6v6" />
                </svg>
              </ApertureLink>
            </div>
            <div className="svl__thumbs" role="group" aria-label="Kies een dienst">
              {SERVICES.map((sv, i) => (
                <button
                  key={sv.code}
                  type="button"
                  className={`svl__thumb ${i === open ? 'is-on' : ''}`}
                  aria-label={sv.title}
                  aria-pressed={i === open}
                  onClick={() => setOpen(i)}
                >
                  {sv.media?.type === 'still' ? <Picture name={sv.media.name} alt="" sizes="56px" imgClassName="svl__img" /> : <span className="mono">{p2(i + 1)}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
