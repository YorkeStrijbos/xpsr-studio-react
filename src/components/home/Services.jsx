import { useLayoutEffect, useRef, useState } from 'react';
import { Camera } from '../drawings/Camera.jsx';
import { LoopVideo, Picture } from '../Media.jsx';
import NoSignal from '../NoSignal.jsx';
import { SERVICES } from '../../data/site.js';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion.js';

// Camera op 1,5x rond het midden. Midden van het camera-schermpje in de SVG (viewBox 1600 x 900),
// na de transform in <Camera> (1051, 367) en deze schaal.
const CAM_SCALE = 1.5;
const MONITOR = { x: 800 + (1051 - 800) * CAM_SCALE, y: 450 + (367 - 450) * CAM_SCALE };
const DIVE = 14;
const p2 = (n) => String(n).padStart(2, '0');

function Media({ s }) {
  if (s.media?.type === 'motion') return <LoopVideo name={s.media.name} className="svc__media" label={s.media.alt} />;
  if (s.media) return <Picture name={s.media.name} alt={s.media.alt} sizes="100vw" imgClassName="svc__media" />;
  return <NoSignal sub={s.label} />;
}

/** Overlay-detail per dienst, binnen de kaderlijnen. */
function Detail({ kind }) {
  switch (kind) {
    case 'focus':
      return <span className="svc__focus" aria-hidden="true" />;
    case 'callout':
      return (
        <svg className="svc__callout" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M30 40L18 18H4M64 34L78 14H96M50 46L50 56" />
          <circle cx="30" cy="40" r="1.2" />
          <circle cx="64" cy="34" r="1.2" />
          <circle cx="50" cy="46" r="1.2" />
        </svg>
      );
    case 'photo':
      return <span className="svc__shutter mono">1/250</span>;
    case 'drone':
      return (
        <>
          <span className="svc__horizon" aria-hidden="true" />
          <span className="svc__osd mono">H 62m &nbsp; D 140m &nbsp; 12 m/s</span>
        </>
      );
    case 'social':
      return (
        <>
          <span className="svc__safe svc__safe--top" aria-hidden="true" />
          <span className="svc__safe svc__safe--bottom" aria-hidden="true" />
        </>
      );
    default:
      return null;
  }
}

/** Zoeker: footage, kaderlijnen met mask, camera-UI en label. Gedeeld door desktop (gepind) en mobiel (per blok). */
function Viewfinder({ s, i, tcRef, frameRef }) {
  return (
    /* --ar wordt door GSAP geanimeerd; niet inline zetten, anders reset React het bij elke wissel. */
    <div ref={frameRef} className={`svc__vf svc__vf--${s.kind}`}>
      <div key={`m${i}`} className="svc__layer">
        <Media s={s} />
      </div>
      <span className="svc__glass" aria-hidden="true" />
      <div className="svc__frame">
        <Detail kind={s.kind} />
      </div>
      {s.kind === 'photo' && <span key={`f${i}`} className="svc__flash" aria-hidden="true" />}
      <div className="svc__ui mono" aria-hidden="true">
        <span className="svc__c svc__c--tl" />
        <span className="svc__c svc__c--tr" />
        <span className="svc__c svc__c--bl" />
        <span className="svc__c svc__c--br" />
        <span className="svc__cross" />
        <span className="svc__tl">
          <span className="svc__rec" /> REC <span ref={tcRef}>00:00:00:00</span>
        </span>
        <span className="svc__tr">
          {s.kind === 'drone' ? 'GPS 18 · ' : ''}Accu 78% &nbsp; SSD 412 GB
          <span className="svc__count">
            {p2(i + 1)} / {p2(SERVICES.length)}
          </span>
        </span>
        <span className="svc__bar">
          {s.cam.map((c) => (
            <span key={c}>{c}</span>
          ))}
          <span>{s.ar > 2 ? '2.39:1' : s.ar < 1 ? '9:16' : s.ar === 1.5 ? '3:2' : '16:9'}</span>
        </span>
      </div>
      <div className="svc__label">
        <p className="display svc__title">
          <span className="svc__line-in">{s.label}</span>
        </p>
        <p className="svc__line">{s.line}</p>
      </div>
    </div>
  );
}

/*
 * Eén draaidag. Zes opbrengsten. De camera tekent zichzelf wit op zwart, het REC-lampje gaat aan,
 * dan duikt de pagina het schermpje in en kijk je door de zoeker. Per dienst springen de kaderlijnen
 * naar een ander beeldformaat, met een harde cut naar de footage.
 * Mobiel: geen pin en geen duik; camera tekent zich, daaronder zes zoekers van 100svh.
 */
export default function Services() {
  const root = useRef(null);
  const tcRef = useRef(null);
  const frameRef = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useLayoutEffect(() => {
    const el = root.current;
    const reduced = prefersReducedMotion();
    if (reduced) {
      el.classList.add('is-static');
      return;
    }
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 860px)', () => {
        const cam = el.querySelector('.svc__camg');
        const vf = el.querySelector('.svc__stage .svc__vf-wrap');
        gsap.set(cam, { svgOrigin: `${MONITOR.x} ${MONITOR.y}` });
        gsap.set(vf, { autoAlpha: 0 });

        gsap.set(frameRef.current, { '--ar': SERVICES[0].ar });
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
        tl.fromTo(el.querySelectorAll('.svc__stage .cam__line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.004 })
          .to(el.querySelector('.svc__stage .cam__rec'), { opacity: 1, duration: 0.05 })
          .to({}, { duration: 0.1 })
          // Duik in de monitor.
          .to(cam, { scale: DIVE, duration: 0.35, ease: 'power3.in' })
          .to('.svc__head', { autoAlpha: 0, duration: 0.1 }, '<')
          .to(el.querySelector('.svc__camsvg'), { autoAlpha: 0, duration: 0.05 })
          .to(vf, { autoAlpha: 1, duration: 0.05 }, '<');
        const starts = [];
        SERVICES.forEach((s) => {
          starts.push(tl.duration());
          tl.to(frameRef.current, { '--ar': s.ar, duration: 0.15, ease: 'power3.inOut' })
            .fromTo('.svc__stage .svc__line-in', { yPercent: 110 }, { yPercent: 0, duration: 0.12 }, '<0.05')
            .to({}, { duration: 0.35 });
        });

        let tcStart = 0;
        tl.eventCallback('onUpdate', () => {
          // Actieve dienst uit de tijd van de timeline: werkt ook bij terugscrollen.
          const t = tl.time();
          let idx = 0;
          starts.forEach((st, k) => {
            if (t >= st) idx = k;
          });
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
          const sec = Math.max(0, t - tcStart) * 6;
          if (tcRef.current) tcRef.current.textContent = `00:${p2(Math.floor(sec / 60))}:${p2(Math.floor(sec) % 60)}:${p2(Math.floor((sec % 1) * 25))}`;
        });
        tcStart = starts[0];

        ScrollTrigger.create({
          trigger: el.querySelector('.svc__stage'),
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 1,
          animation: tl,
        });
      });

      mm.add('(max-width: 859px)', () => {
        gsap.fromTo(el.querySelectorAll('.svc__mcam .cam__line'), { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          ease: 'none',
          stagger: 0.004,
          scrollTrigger: { trigger: '.svc__mcam', start: 'top 85%', end: 'bottom 40%', scrub: true },
        });
        gsap.utils.toArray('.svc__mlist .svc__vf', el).forEach((f) => {
          const ar = Number(f.dataset.ar);
          gsap.fromTo(f, { '--ar': 16 / 9 }, { '--ar': ar, duration: 0.6, ease: 'power3.inOut', scrollTrigger: { trigger: f, start: 'top 70%' } });
        });
      });
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const s = SERVICES[active];

  return (
    <section ref={root} className="s-services svc" aria-labelledby="svc-title">
      {/* Desktop: één gepinde scène. */}
      <div className="svc__stage">
        <header className="svc__head container">
          <h2 id="svc-title" className="display svc__h">
            Eén draaidag. Zes opbrengsten.
          </h2>
        </header>
        <svg className="svc__camsvg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g className="svc__camg">
            <g transform={`translate(800 450) scale(${CAM_SCALE}) translate(-800 -450)`}>
              <Camera />
            </g>
          </g>
        </svg>
        <div className="svc__vf-wrap">
          <Viewfinder s={s} i={active} tcRef={tcRef} frameRef={frameRef} />
        </div>
      </div>

      {/* Mobiel en reduced motion: camera, dan zes zoekers onder elkaar. Ook de leesbare lijst voor screenreaders. */}
      <div className="svc__mobile">
        <svg className="svc__mcam" viewBox="0 0 1600 900" aria-hidden="true">
          <Camera rec />
        </svg>
        <ol className="svc__mlist">
          {SERVICES.map((sv, i) => (
            <li key={sv.code} className="svc__mitem">
              <div className={`svc__vf svc__vf--${sv.kind}`} data-ar={sv.ar} style={{ '--ar': sv.ar }}>
                <div className="svc__layer">
                  <Media s={sv} />
                </div>
                <span className="svc__glass" aria-hidden="true" />
                <div className="svc__frame">
                  <Detail kind={sv.kind} />
                </div>
                <div className="svc__label">
                  <p className="mono svc__mcount">
                    {p2(i + 1)} / {p2(SERVICES.length)}
                  </p>
                  <h3 className="display svc__title">{sv.label}</h3>
                  <p className="svc__line">{sv.line}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
