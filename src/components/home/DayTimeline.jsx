import { useLayoutEffect, useRef, useState } from 'react';
import { LoopVideo, Picture } from '../Media.jsx';
import NoSignal from '../NoSignal.jsx';
import { useOpenReel } from '../Reel.jsx';
import { SHOOT_DAY } from '../../data/site.js';
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText } from '../../lib/motion.js';

const { start: START, end: END, shots: SHOTS } = SHOOT_DAY;
const SPAN = END - START;
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

// Render-queue na de draaidag. TODO XPSR: aantallen en formaten per project bevestigen.
const EXPORTS = [
  { name: 'Bedrijfsfilm', format: '2.39:1 4K' },
  { name: 'Recruitment', format: '16:9 4K' },
  { name: 'Reels (6)', format: '9:16 1080' },
  { name: 'Foto’s (24)', format: 'RAW + JPG' },
];
const PREMIERE_FILM = 'loop-reym-juri'; // TODO XPSR: echte eindfilm aanleveren.

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
  return <NoSignal sub={`${short(shot.from)} / ${shot.title}`} />;
}

function Queue({ barsRef }) {
  return (
    <div className="edit__queue mono">
      <div className="edit__queue-row edit__queue-row--head">
        <span>Export</span>
        <span>Formaat</span>
        <span>Status</span>
      </div>
      {EXPORTS.map((e, i) => (
        <div key={e.name} className="edit__queue-row">
          <span>{e.name}</span>
          <span>{e.format}</span>
          <span className="edit__queue-status">
            <span className="edit__queue-bar">
              <span
                ref={(n) => {
                  if (barsRef) barsRef.current[i] = n;
                }}
              />
            </span>
            <span className="edit__queue-pct">100%</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function PremiereInfo({ openReel }) {
  return (
    <>
      <h3 className="display edit__claim">Klaar om gezien te worden.</h3>
      <ul className="edit__exports mono">
        {EXPORTS.map((e) => (
          <li key={e.name}>
            <span className="edit__check" aria-hidden="true">
              ✓
            </span>{' '}
            {e.name} <span className="edit__exports-fmt">{e.format}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--primary edit__cta" onClick={openReel} data-cursor="PLAY">
        Bekijk de reel
      </button>
    </>
  );
}

/*
 * Zo ziet een draaidag eruit, en wat er daarna uit komt. Eén doorlopende scène:
 * 1. Montageprogramma: scrollen is de afspeelkop over de draaidag (07:00 tot 17:30).
 * 2. Render: een render-queue schuift over de tijdlijn, balken lopen op met scroll.
 * 3. Filmleader: 3, 2, 1 met draaiende sweep en flikkering.
 * 4. Première: eindfilm full-bleed, claim, exportlijst en "Bekijk de reel".
 * Mobiel: geen pin; clips verticaal, daarna queue, leader (op tijd) en première.
 */
export default function DayTimeline() {
  const openReel = useOpenReel();
  const root = useRef(null);
  const tcRef = useRef(null);
  const headRef = useRef(null);
  const barsRef = useRef([]);
  const numRef = useRef(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState('fwd');
  const [playing, setPlaying] = useState(false);
  const activeRef = useRef(0);

  const show = (idx) => {
    if (idx === activeRef.current) return;
    setDir(idx > activeRef.current ? 'fwd' : 'back');
    setPrev(activeRef.current);
    activeRef.current = idx;
    setActive(idx);
  };

  useLayoutEffect(() => {
    const el = root.current;
    if (prefersReducedMotion()) {
      el.classList.add('is-static');
      setPlaying(true);
      return;
    }
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 860px)', () => {
        const st = { p: 0 };
        const q = { v: 0 };
        const queueBars = barsRef.current;
        const queuePcts = el.querySelectorAll('.edit__stagequeue .edit__queue-pct');
        const claim = new SplitText(el.querySelector('.edit__premiere .edit__claim'), { type: 'lines', mask: 'lines' });
        gsap.set(['.edit__stagequeue', '.edit__leader', '.edit__premiere'], { autoAlpha: 0 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
        // 1. Afspelen over de draaidag.
        tl.to(st, {
          p: 1,
          duration: 6,
          onUpdate: () => {
            const t = START + st.p * SPAN;
            headRef.current.style.left = `${st.p * 100}%`;
            tcRef.current.textContent = tc(t);
            let idx = 0;
            SHOTS.forEach((s, i) => {
              if (t >= s.from) idx = i;
            });
            show(idx);
          },
        });
        // 2. Render-queue schuift over de tijdlijn; balken lopen op (per rij iets later).
        tl.fromTo('.edit__stagequeue', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out' })
          .to(q, {
            v: 1,
            duration: 1.6,
            onUpdate: () => {
              queueBars.forEach((b, i) => {
                const local = gsap.utils.clamp(0, 1, (q.v - i * 0.12) / 0.64);
                if (b) b.style.transform = `scaleX(${local})`;
                if (queuePcts[i]) queuePcts[i].textContent = `${Math.round(local * 100)}%`;
              });
            },
          })
          .to({}, { duration: 0.3 })
          // 3. Filmleader: alles naar zwart, 3-2-1.
          .to('.edit__leader', { autoAlpha: 1, duration: 0.15 });
        [3, 2, 1].forEach((n) => {
          tl.set(numRef.current, { textContent: String(n) })
            .fromTo('.edit__leader .edit__leader-dial', { '--sweep': '0deg' }, { '--sweep': '360deg', duration: 0.6 })
            .to('.edit__leader', { opacity: 0.82, duration: 0.03, yoyo: true, repeat: 1 }, '-=0.06');
        });
        // 4. Première: één wit frame, dan de eindfilm.
        const premiereAt = tl.duration();
        tl.fromTo('.edit__flash', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.08, immediateRender: false })
          .set('.edit__leader', { autoAlpha: 0 }, '<')
          .set('.edit__premiere', { autoAlpha: 1 }, '<')
          .from(claim.lines, { yPercent: 110, stagger: 0.08, duration: 0.3, ease: 'power3.out' })
          .from('.edit__premiere .edit__exports li', { autoAlpha: 0, x: 20, stagger: 0.08, duration: 0.2 }, '<0.1')
          .from('.edit__premiere .edit__cta', { autoAlpha: 0, y: 16, duration: 0.2 })
          .to({}, { duration: 0.6 });

        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: '+=520%',
          pin: true,
          scrub: 0.6,
          animation: tl,
          onUpdate: () => setPlaying(tl.time() >= premiereAt),
        });
        return () => claim.revert();
      });

      mm.add('(max-width: 859px)', () => {
        gsap.utils.toArray('.edit__row', el).forEach((row, i) => {
          ScrollTrigger.create({ trigger: row, start: 'top 60%', end: 'bottom 60%', onToggle: (self) => self.isActive && show(i) });
        });
        gsap.fromTo('.edit__vhead', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.edit__rows', start: 'top 60%', end: 'bottom 60%', scrub: true } });
        // Leader speelt op tijd (3 s) zodra hij in beeld is, daarna start de film.
        const num = el.querySelector('.edit__mleader .edit__leader-num');
        const lt = gsap.timeline({ paused: true, onComplete: () => setPlaying(true) });
        [3, 2, 1].forEach((n) => {
          lt.set(num, { textContent: String(n) }).fromTo('.edit__mleader .edit__leader-dial', { '--sweep': '0deg' }, { '--sweep': '360deg', duration: 1, ease: 'none' });
        });
        ScrollTrigger.create({ trigger: '.edit__mleader', start: 'top 60%', once: true, onEnter: () => lt.play() });
      });
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
    // show werkt via activeRef en hoeft niet als afhankelijkheid mee
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shot = SHOTS[active];

  return (
    <section ref={root} className="s-dayline edit" aria-labelledby="edit-title">
      {/* Programmamonitor */}
      <div className="edit__monitor">
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

      {/* Desktop: render-queue, leader en première als lagen over de hele scène. */}
      <div className="edit__stagequeue" aria-hidden="true">
        <Queue barsRef={barsRef} />
      </div>
      <div className="edit__leader" aria-hidden="true">
        <div className="edit__leader-dial" />
        <span ref={numRef} className="edit__leader-num">
          3
        </span>
      </div>
      <div className="edit__premiere">
        <div className="edit__premiere-film">
          <LoopVideo name={PREMIERE_FILM} className="edit__media" active={playing} label="eindfilm" />
        </div>
        <div className="edit__premiere-shade" aria-hidden="true" />
        {/* TODO XPSR: eindfilm met geluid; nu stil. */}
        <span className="mono edit__sound" aria-hidden="true">
          Geluid uit
        </span>
        <div className="edit__premiere-info container">
          <PremiereInfo openReel={openReel} />
        </div>
      </div>
      <div className="edit__flash" aria-hidden="true" />

      {/* Mobiel en screenreaders: clips verticaal, afspeelkop van boven naar beneden, dan de oplevering. */}
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
      </ol>
      <div className="edit__mdelivery">
        <Queue />
        <div className="edit__mleader" aria-hidden="true">
          <div className="edit__leader-dial" />
          <span className="edit__leader-num">3</span>
        </div>
        <div className="edit__mpremiere">
          <div className="edit__premiere-film">
            <LoopVideo name={PREMIERE_FILM} className="edit__media" active={playing} label="eindfilm" />
          </div>
          <PremiereInfo openReel={openReel} />
        </div>
      </div>
    </section>
  );
}
