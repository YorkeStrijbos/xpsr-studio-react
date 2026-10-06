import { useState } from 'react';
import { LoopVideo, Picture } from './Media.jsx';
import { SERVICES } from '../data/site.js';
import { useMediaQuery } from '../lib/motion.js';

function ServiceMedia({ media, active }) {
  if (media.type === 'motion') {
    return <LoopVideo name={media.name} className="services__media-el" active={active} label={media.alt} />;
  }
  return <Picture name={media.name} alt={media.alt} sizes="(min-width: 960px) 50vw, 100vw" imgClassName="services__media-el" />;
}

/*
 * Drie lichtsets. Desktop: hover of focus op een dienst zet de spot op de bijbehorende set.
 * Mobiel: gestapeld, elke dienst met eigen beeld dat speelt zodra het in beeld is.
 */
export default function Services() {
  const wide = useMediaQuery('(min-width: 960px)');
  const [active, setActive] = useState(SERVICES[0].id);

  return (
    <section className="section services" id="diensten" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="label label--red">Wat we maken</span>
            <h2 id="services-title" className="display h2">
              Drie lichtsets
            </h2>
          </div>
          <p className="lead">Foto, video en social. Los te boeken, het sterkst samen.</p>
        </div>

        <div className="services__layout">
          <ol className="services__list">
            {SERVICES.map((s, i) => {
              const isActive = !wide || active === s.id;
              return (
                <li
                  key={s.id}
                  className={`services__item ${isActive ? 'is-active' : ''}`}
                  onPointerEnter={() => setActive(s.id)}
                  onFocus={() => setActive(s.id)}
                >
                  <h3 className="services__heading">
                    {wide ? (
                      <button
                        type="button"
                        className="services__trigger"
                        aria-pressed={active === s.id}
                        onClick={() => setActive(s.id)}
                      >
                        <span className="label">0{i + 1}</span>
                        <span className="display h3 services__title">{s.title}</span>
                      </button>
                    ) : (
                      <span className="services__trigger">
                        <span className="label">0{i + 1}</span>
                        <span className="display h3 services__title">{s.title}</span>
                      </span>
                    )}
                  </h3>
                  <div className="services__body">
                    <div className="services__body-inner">
                      <p className="services__line">{s.line}</p>
                      <ul className="services__deliverables">
                        {s.deliverables.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {!wide && (
                    <div className="services__media services__media--inline">
                      <ServiceMedia media={s.media} active />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {wide && (
            <div className="services__stage" aria-hidden="true">
              {SERVICES.map((s) => (
                <div key={s.id} className={`services__media ${active === s.id ? 'is-lit' : ''}`}>
                  <ServiceMedia media={s.media} active={active === s.id} />
                </div>
              ))}
              <div className="services__spot" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
