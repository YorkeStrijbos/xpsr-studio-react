import { useLayoutEffect, useRef, useState } from 'react';
import { LoopVideo, Picture } from '../Media.jsx';
import { SHOOT_DAY } from '../../data/site.js';
import { gsap, prefersReducedMotion } from '../../lib/motion.js';

const { start: START, end: END, shots: SHOTS } = SHOOT_DAY;
const SPAN = END - START;
const TRACKS = [
  { id: 'V2', name: 'Drone / social' },
  { id: 'V1', name: 'Camera' },
  { id: 'F', name: 'Foto' },
  { id: 'A1', name: 'Geluid' },
];
const HOURS = Array.from({ length: SPAN + 1 }, (_, i) => START + i);
const pct = (t) => ((t - START) / SPAN) * 100;
const clock = (t) => {
  const h = Math.floor(t);
  const m = Math.floor((t - h) * 60);
  const s = Math.floor(((t - h) * 60 - m) * 60);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(h)}:${p(m)}:${p(s)}`;
};
// Geluid loopt mee onder de camera-shots met spraak of omgevingsgeluid.
const AUDIO = SHOTS.filter((s) => s.track === 'V1' && s.media?.type === 'motion').concat(SHOTS.filter((s) => s.title.startsWith('Werkvloer')));

function Monitor({ shot, index }) {
  return (
    <div className="day__monitor">
      <div className="day__screen">
        {shot.media?.type === 'motion' ? (
          <LoopVideo key={shot.title} name={shot.media.name} className="day__media" label={shot.media.alt} />
        ) : shot.media ? (
          <Picture key={shot.title} name={shot.media.name} alt={shot.media.alt} sizes="(min-width: 860px) 50vw, 100vw" imgClassName="day__media" />
        ) : (
          <div key={shot.title} className="day__ph">
            <span className="mono">[PLACEHOLDER] {shot.title}</span>
          </div>
        )}
        <span className="day__safe" aria-hidden="true" />
        <span className="mono day__tag">
          <span className="day__rec" aria-hidden="true" /> Shot {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="day__info">
        <p className="mono day__time">
          {clock(shot.from)} / {clock(shot.to)}
        </p>
        <h3 className="display day__title">{shot.title}</h3>
        <p className="day__line">{shot.line}</p>
        <ul className="day__settings">
          {shot.settings.map((s) => (
            <li key={s} className="mono">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/*
 * Eén draaidag als montage-tijdlijn. Gepind: een rode afspeelkop loopt op scroll van 07:00 tot 17:00,
 * het actieve shot licht op en de monitor toont wat er gebeurt plus de camera-instellingen.
 */
export default function DayTimeline() {
  const root = useRef(null);
  const tcRef = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      const head = el.querySelector('.day__head');
      const state = { t: START };
      gsap.to(state, {
        t: END,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: '+=260%', pin: true, scrub: 0.6 },
        onUpdate: () => {
          head.style.left = `${pct(state.t)}%`;
          tcRef.current.textContent = `${clock(state.t)}:00`;
          // Actief = laatste shot dat al begonnen is.
          let idx = 0;
          SHOTS.forEach((s, i) => {
            if (state.t >= s.from - 0.1) idx = i;
          });
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const shot = SHOTS[active];

  return (
    <section ref={root} className="s-dayline day" aria-labelledby="day-title">
      <div className="container day__inner">
        <header className="day__header">
          <span className="mono label--red">Draaiboek / dag 01</span>
          <h2 id="day-title" className="display h2">
            Zo ziet een draaidag eruit.
          </h2>
        </header>

        <Monitor shot={shot} index={active} />

        <div className="day__timeline" aria-hidden="true">
          <div className="day__bar">
            <span className="mono day__tc">
              <span ref={tcRef}>{clock(START)}:00</span>
            </span>
            <span className="mono">{SHOOT_DAY.after}</span>
          </div>
          <div className="day__grid">
            <div className="day__labels">
              <span className="mono day__ruler-label">TC</span>
              {TRACKS.map((t) => (
                <span key={t.id} className="mono">
                  {t.id}
                  <span className="day__lbl-full">&nbsp;{t.name}</span>
                </span>
              ))}
            </div>
            <div className="day__lanes">
              <div className="day__ruler">
                {HOURS.map((h) => (
                  <span key={h} className="mono" style={{ left: `${pct(h)}%` }}>
                    {String(h).padStart(2, '0')}:00
                  </span>
                ))}
              </div>
              {TRACKS.map((t) => (
                <div key={t.id} className="day__lane">
                  {(t.id === 'A1' ? AUDIO : SHOTS.filter((s) => s.track === t.id)).map((s) => {
                    const i = SHOTS.indexOf(s);
                    return (
                      <span
                        key={s.title}
                        className={`day__clip ${t.id === 'A1' ? 'day__clip--audio' : ''} ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
                        style={{ left: `${pct(s.from)}%`, width: `${pct(s.to) - pct(s.from)}%` }}
                      >
                        {t.id !== 'A1' && <span className="mono">{s.title}</span>}
                      </span>
                    );
                  })}
                </div>
              ))}
              <span className="day__head" />
            </div>
          </div>
        </div>

        {/* Voor screenreaders en reduced motion: het draaiboek als lijst. */}
        <ol className="day__list">
          {SHOTS.map((s) => (
            <li key={s.title}>
              <span className="mono">
                {clock(s.from).slice(0, 5)} / {clock(s.to).slice(0, 5)}
              </span>{' '}
              <strong>{s.title}</strong>. {s.line} <span className="mono">{s.settings.join(' · ')}</span>
            </li>
          ))}
          <li>{SHOOT_DAY.after}</li>
        </ol>
      </div>
    </section>
  );
}
