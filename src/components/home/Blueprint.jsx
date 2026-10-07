import { useLayoutEffect, useRef, useState } from 'react';
import { LoopVideo } from '../Media.jsx';
import { SERVICES } from '../../data/site.js';
import { gsap, prefersReducedMotion } from '../../lib/motion.js';

const W = 1200;
const H = 760;
const CX = 600;
const CY = 390;
const RX = 440;
const RY = 290;
const ANGLES = [-150, -90, -30, 30, 90, 150];

const pos = ANGLES.map((a) => {
  const r = (a * Math.PI) / 180;
  return { x: CX + RX * Math.cos(r), y: CY + RY * Math.sin(r), a: r };
});

/** Maatlijn van de rand van de binnenste cirkel naar het onderdeel, met maatstreepjes. */
function leader(p) {
  const sx = CX + 128 * Math.cos(p.a);
  const sy = CY + 128 * Math.sin(p.a);
  const ex = p.x - 34 * Math.cos(p.a);
  const ey = p.y - 34 * Math.sin(p.a);
  const nx = -Math.sin(p.a) * 8;
  const ny = Math.cos(p.a) * 8;
  return `M${sx} ${sy}L${ex} ${ey}M${sx + nx} ${sy + ny}L${sx - nx} ${sy - ny}M${ex + nx} ${ey + ny}L${ex - nx} ${ey - ny}`;
}

/*
 * Diensten als technische tekening op beton. Lijnen worden getekend op scroll,
 * daarna schuiven de zes onderdelen als exploded view naar buiten. Hulpcirkels draaien langzaam.
 * TODO XPSR: lijntekening van een echte machine of hal aanleveren; dit is een generieke versie.
 */
export default function Blueprint() {
  const root = useRef(null);
  const [active, setActive] = useState(null);
  const svc = active == null ? null : SERVICES[active];

  useLayoutEffect(() => {
    const el = root.current;
    const draw = gsap.utils.toArray('.bp__draw', el);
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { '--curve': '22vh' },
        { '--curve': '0vh', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: true } },
      );

      mm.add('(min-width: 860px)', () => {
        const parts = gsap.utils.toArray('.bp__part', el);
        const labels = gsap.utils.toArray('.bp__label', el);
        const leaders = gsap.utils.toArray('.bp__leader', el);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=160%', pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(draw, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.015 }, 0)
          .fromTo(parts, { x: (i) => CX - pos[i].x, y: (i) => CY - pos[i].y, scale: 0.3, autoAlpha: 0, svgOrigin: (i) => `${pos[i].x} ${pos[i].y}` }, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: 'power3.out', stagger: 0.03 }, 0.45)
          .fromTo(
            labels,
            {
              x: (i) => ((CX - pos[i].x) / W) * el.querySelector('.bp__canvas').clientWidth,
              y: (i) => ((CY - pos[i].y) / H) * el.querySelector('.bp__canvas').clientHeight,
              autoAlpha: 0,
            },
            { x: 0, y: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out', stagger: 0.03 },
            0.45,
          )
          .fromTo(leaders, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.25, stagger: 0.03 }, 0.7);
      });

      mm.add('(max-width: 859px)', () => {
        gsap.fromTo(draw, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          ease: 'none',
          stagger: 0.02,
          scrollTrigger: { trigger: '.bp__canvas', start: 'top 85%', end: 'bottom 40%', scrub: true },
        });
        gsap.utils.toArray('.bp__row', el).forEach((row) => {
          gsap.fromTo(row, { '--line': 0 }, { '--line': 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 85%', end: 'top 45%', scrub: true } });
        });
      });
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-blueprint bp" aria-labelledby="bp-title" data-active={active ?? undefined}>
      <div className="bp__inner container">
        <header className="bp__head">
          <span className="mono">Blad A / Diensten</span>
          <h2 id="bp-title" className="display h2" data-stamp>
            Eén draaidag. Zes opbrengsten.
          </h2>
        </header>

        <div className="bp__canvas">
          <svg className="bp__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <g className="bp__orbit bp__orbit--a">
              <circle className="bp__draw bp__helper" pathLength="1" cx={CX} cy={CY} r="128" />
              <circle className="bp__draw bp__helper bp__helper--dash" pathLength="1" cx={CX} cy={CY} r="210" />
            </g>
            <g className="bp__orbit bp__orbit--b">
              <ellipse className="bp__draw bp__helper bp__helper--dash" pathLength="1" cx={CX} cy={CY} rx={RX} ry={RY} />
              <line className="bp__draw bp__helper" pathLength="1" x1={CX - RX - 40} y1={CY} x2={CX + RX + 40} y2={CY} />
              <line className="bp__draw bp__helper" pathLength="1" x1={CX} y1={CY - RY - 40} x2={CX} y2={CY + RY + 40} />
            </g>

            {/* Generieke machine: voet, behuizing, as, tandwielen, bouten. */}
            <g className="bp__machine">
              <rect className="bp__draw" pathLength="1" x={CX - 92} y={CY + 40} width="184" height="22" />
              <rect className="bp__draw" pathLength="1" x={CX - 70} y={CY - 50} width="140" height="90" />
              <rect className="bp__draw" pathLength="1" x={CX - 18} y={CY - 92} width="36" height="42" />
              <circle className="bp__draw" pathLength="1" cx={CX - 30} cy={CY - 5} r="26" />
              <circle className="bp__draw" pathLength="1" cx={CX - 30} cy={CY - 5} r="8" />
              <circle className="bp__draw" pathLength="1" cx={CX + 34} cy={CY + 8} r="18" />
              <path className="bp__draw" pathLength="1" d={`M${CX - 56} ${CY + 51}h6M${CX + 50} ${CY + 51}h6M${CX + 10} ${CY - 36}h44v20h-44z`} />
              <text className="bp__center-label" x={CX} y={CY + 92} textAnchor="middle">
                JOUW BEDRIJF
              </text>
            </g>

            {pos.map((p, i) => (
              <path key={`l${i}`} className={`bp__leader ${active === i ? 'is-on' : ''}`} pathLength="1" d={leader(p)} />
            ))}
            {pos.map((p, i) => (
              <g key={`p${i}`} className="bp__part">
                <circle cx={p.x} cy={p.y} r="30" className={`bp__node ${active === i ? 'is-on' : ''}`} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" className="bp__code">
                  {SERVICES[i].code}
                </text>
              </g>
            ))}
          </svg>

          <ul className="bp__labels">
            {SERVICES.map((s, i) => {
              const p = pos[i];
              const side = Math.cos(p.a) < -0.1 ? 'left' : Math.cos(p.a) > 0.1 ? 'right' : 'mid';
              const vert = Math.sin(p.a) < 0 ? 'up' : 'down';
              return (
                <li
                  key={s.code}
                  className={`bp__label bp__label--${side} bp__label--${vert} ${active === i ? 'is-on' : ''}`}
                  style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
                >
                  <div className="bp__label-in">
                  <button
                    type="button"
                    className="bp__btn"
                    onPointerEnter={() => setActive(i)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    aria-describedby={`bp-line-${i}`}
                  >
                    <span className="mono bp__num">{s.code}</span>
                    <span className="bp__title">{s.title}</span>
                  </button>
                  <span id={`bp-line-${i}`} className="bp__line">
                    {s.line}
                  </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className={`bp__panel ${svc ? 'is-open' : ''}`} aria-hidden={!svc}>
            {svc && (
              <>
                <div className="bp__panel-media">
                  {svc.code === 'A-01' ? (
                    <LoopVideo name="loop-reym-juri" className="bp__panel-video" label="recruitmentfilm REYM" />
                  ) : (
                    // TODO XPSR: per dienst een korte loop aanleveren.
                    <div className="placeholder">
                      <span className="mono">[PLACEHOLDER] Loop {svc.title}</span>
                    </div>
                  )}
                </div>
                <p className="mono">{svc.code}</p>
                <p className="bp__panel-title">{svc.title}</p>
                <p>{svc.line}</p>
              </>
            )}
          </aside>
        </div>

        {/* Mobiele variant: verticale lijst met dezelfde lijn-animatie. */}
        <ol className="bp__list">
          {SERVICES.map((s) => (
            <li key={s.code} className="bp__row">
              <span className="mono">{s.code}</span>
              <span className="bp__title">{s.title}</span>
              <span className="bp__line">{s.line}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
