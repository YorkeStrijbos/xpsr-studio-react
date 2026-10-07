import { useLayoutEffect, useRef, useState } from 'react';
import { StencilPlaceholder } from '../Industrial.jsx';
import { LoopVideo, Picture } from '../Media.jsx';
import { SHOOT_DAY } from '../../data/site.js';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion.js';

const { start: START, end: END, shots: SHOTS } = SHOOT_DAY;
const SPAN = END - START;
const PLAY_END = 0.86; // daarna: renderscherm
const HOURS = Array.from({ length: Math.floor(SPAN) + 1 }, (_, i) => START + i);
const pct = (t) => ((t - START) / SPAN) * 100;
const p2 = (n) => String(n).padStart(2, '0');
const tc = (t) => {
  const h = Math.floor(t);
  const mFloat = (t - h) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  const f = Math.floor((((mFloat - m) * 60) % 1) * 25);
  return `${p2(h)}:${p2(m)}:${p2(s)}:${p2(f)}`;
};
const short = (t) => tc(t).slice(0, 5);

// Waveform: 200 staafjes, één keer gegenereerd met een vaste seed (altijd hetzelfde beeld).
const WAVE = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 200 }, (_, i) => {
    const t = START + (i / 199) * SPAN;
    const talking = SHOTS.some((s) => s.audio && t >= s.from && t <= s.to);
    return (talking ? 0.45 : 0.12) + rnd() * (talking ? 0.55 : 0.3);
  });
})();

function Media({ shot }) {
  if (shot.media?.type === 'motion') return <LoopVideo name={shot.media.name} className="edit__media" label={shot.media.alt} />;
  if (shot.media) return <Picture name={shot.media.name} alt={shot.media.alt} sizes="100vw" imgClassName="edit__media" />;
  return <StencilPlaceholder label="Beeld volgt" sub={`${short(shot.from)} / ${shot.title}`} />;
}

/*
 * Zo ziet een draaidag eruit. Het scherm wordt een montageprogramma: programmamonitor over de volle breedte,
 * tijdlijn met sporen eronder. Scrollen is de afspeelkop. Na de laatste clip: wit scherm met renderbalk.
 * Mobiel: geen pin; monitor sticky bovenin, clips verticaal eronder.
 */
export default function DayTimeline() {
  const root = useRef(null);
  const tcRef = useRef(null);
  const headRef = useRef(null);
  const barRef = useRef(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState('fwd');
  const [rendering, setRendering] = useState(false);
  const activeRef = useRef(0);

  const show = (idx) => {
    if (idx === activeRef.current) return;
    setDir(idx > activeRef.current ? 'fwd' : 'back');
    setPrev(activeRef.current);
    activeRef.current = idx;
    setActive(idx);
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 860px)', () => {
        const st = { p: 0 };
        gsap.to(st, {
          p: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: '+=300%', pin: true, scrub: 0.6 },
          onUpdate: () => {
            const play = Math.min(1, st.p / PLAY_END);
            const t = START + play * SPAN;
            headRef.current.style.left = `${play * 100}%`;
            tcRef.current.textContent = tc(Math.min(t, END));
            let idx = 0;
            SHOTS.forEach((s, i) => {
              if (t >= s.from) idx = i;
            });
            show(idx);
            const r = st.p > PLAY_END ? (st.p - PLAY_END) / (1 - PLAY_END) : 0;
            setRendering(r > 0);
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${r})`;
              barRef.current.parentElement.dataset.pct = `${Math.round(r * 100)}%`;
            }
          },
        });
      });

      mm.add('(max-width: 859px)', () => {
        gsap.utils.toArray('.edit__row', el).forEach((row, i) => {
          ScrollTrigger.create({ trigger: row, start: 'top 60%', end: 'bottom 60%', onToggle: (self) => self.isActive && show(i) });
        });
        gsap.fromTo('.edit__vhead', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.edit__rows', start: 'top 60%', end: 'bottom 60%', scrub: true } });
      });
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
    // show is stabiel genoeg: werkt via activeRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shot = SHOTS[active];

  return (
    <section ref={root} className="s-dayline edit" aria-labelledby="edit-title">
      {/* Programmamonitor */}
      <div className={`edit__monitor ${rendering ? 'is-rendering' : ''}`}>
        {prev != null && prev !== active && (
          <div key={`p${prev}`} className="edit__layer edit__layer--prev">
            <Media shot={SHOTS[prev]} />
          </div>
        )}
        <div key={`a${active}`} className={`edit__layer edit__layer--in edit__layer--${dir}`} onAnimationEnd={() => setPrev(null)}>
          <Media shot={shot} />
        </div>
        <div className="edit__shade" aria-hidden="true" />

        <div className="edit__hudtop">
          <p className="mono label--red phase-slot">Fase 03 / Edit</p>
          <h2 id="edit-title" className="display edit__title">
            Zo ziet een draaidag eruit.
          </h2>
          <p className="mono edit__tc" aria-hidden="true">
            <span ref={tcRef}>{tc(START)}</span>
          </p>
        </div>

        <div className="edit__label" aria-live="polite">
          <p className="mono edit__when">
            {short(shot.from)} / {short(shot.to)}
          </p>
          <p className="display edit__phase">{shot.title}</p>
          <p className="edit__line">{shot.line}</p>
          <ul className="edit__settings">
            {shot.settings.map((s) => (
              <li key={s} className="mono">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="edit__render" aria-hidden={!rendering}>
          <p className="display edit__after">{SHOOT_DAY.after}</p>
          <div className="edit__bar" data-pct="0%">
            <span ref={barRef} />
          </div>
          <p className="mono">Exporteren: film, foto’s, reels</p>
        </div>
      </div>

      {/* Tijdlijn (desktop) */}
      <div className="edit__timeline" aria-hidden="true">
        <div className="edit__labels">
          <span className="mono">TC</span>
          <span className="mono">Markers</span>
          <span className="mono">V2 Drone</span>
          <span className="mono">V1 Beeld</span>
          <span className="mono">A1 Geluid</span>
        </div>
        <div className="edit__lanes">
          <div className="edit__ruler">
            {HOURS.map((h) => (
              <span key={h} className="mono" style={{ left: `${pct(h)}%` }}>
                {p2(h)}:00
              </span>
            ))}
          </div>
          <div className="edit__lane edit__lane--markers">
            {SHOTS.map((s, i) => (
              <span key={s.title} className={`edit__marker ${i === active ? 'is-active' : ''}`} style={{ left: `${pct(s.from)}%` }}>
                <span className="mono">{p2(i + 1)}</span>
              </span>
            ))}
          </div>
          {['V2', 'V1'].map((track) => (
            <div key={track} className="edit__lane">
              {SHOTS.map((s, i) =>
                s.track === track ? (
                  <span
                    key={s.title}
                    className={`edit__clip ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
                    style={{ left: `${pct(s.from)}%`, width: `${pct(s.to) - pct(s.from)}%` }}
                  >
                    <span className="mono">{s.title}</span>
                  </span>
                ) : null,
              )}
            </div>
          ))}
          <div className="edit__lane edit__lane--audio">
            <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="edit__wave">
              {WAVE.map((h, i) => (
                <rect key={i} x={i + 0.15} y={10 - h * 9} width="0.7" height={h * 18} />
              ))}
            </svg>
          </div>
          <span ref={headRef} className="edit__head" />
        </div>
      </div>

      {/* Mobiel: clips verticaal, afspeelkop van boven naar beneden. Ook de leesbare lijst voor screenreaders. */}
      <ol className="edit__rows">
        <span className="edit__vhead" aria-hidden="true" />
        {SHOTS.map((s, i) => (
          <li key={s.title} className={`edit__row ${i === active ? 'is-active' : ''}`}>
            <span className="mono">
              {short(s.from)} / {short(s.to)}
            </span>
            <strong>{s.title}</strong>
            <span>{s.line}</span>
            <span className="mono edit__row-settings">{s.settings.join(' · ')}</span>
          </li>
        ))}
        <li className="edit__row edit__row--after">
          <strong>{SHOOT_DAY.after}</strong>
        </li>
      </ol>
    </section>
  );
}
