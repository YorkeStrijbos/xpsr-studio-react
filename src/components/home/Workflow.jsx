import { useLayoutEffect, useRef } from 'react';
import { Camera } from '../drawings/Camera.jsx';
import { Sketch } from '../drawings/Sketch.jsx';
import { SCRIPT, STORYBOARD } from '../../data/site.js';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion.js';

/* Inhoud per monitor. Alles wit lijnwerk of mono op zwart, in camera- en softwaretaal. */
function PlanScreen() {
  return (
    <svg className="wf__cam" viewBox="300 150 1000 600" aria-hidden="true">
      <Camera rec />
    </svg>
  );
}

function ScriptScreen() {
  const lines = SCRIPT.flatMap((sc) => [sc.head, ...(sc.speaker ? [sc.speaker] : []), sc.body]);
  return (
    <div className="prompter" aria-hidden="true">
      {/* Twee keer dezelfde tekst, zodat de lus naadloos is. */}
      <div className="prompter__text">
        {[...lines, ...lines].map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </div>
  );
}

function StoryboardScreen() {
  return (
    <div className="wf__board" aria-hidden="true">
      {STORYBOARD.map((s) => (
        <svg key={s.sketch} className="wf__panel" viewBox="-8 -6 176 102">
          <rect x="-6" y="-4" width="172" height="98" className="wf__panel-frame" />
          <Sketch kind={s.sketch} />
        </svg>
      ))}
    </div>
  );
}

function DayScreen() {
  const clips = [
    [0, 10, 0],
    [10, 24, 0],
    [24, 58, 0],
    [58, 72, 0],
    [72, 86, 1],
    [86, 97, 0],
  ];
  return (
    <div className="wf__day" aria-hidden="true">
      <span className="wf__day-tc mono">07:00 / 17:30</span>
      <div className="wf__lanes">
        {[0, 1].map((lane) => (
          <div key={lane} className="wf__lane">
            {clips
              .filter((c) => c[2] === lane)
              .map(([a, b]) => (
                <span key={a} className="wf__clip" style={{ left: `${a}%`, width: `${b - a}%` }} />
              ))}
          </div>
        ))}
        <div className="wf__lane wf__lane--audio" />
        <span className="wf__head" />
      </div>
    </div>
  );
}

function DeliveryScreen() {
  const rows = ['Bedrijfsfilm', 'Recruitment', 'Reels (6)', 'Foto’s (24)'];
  return (
    <div className="wf__render mono" aria-hidden="true">
      {rows.map((r) => (
        <div key={r} className="wf__render-row">
          <span>{r}</span>
          <span className="wf__render-bar">
            <span />
          </span>
        </div>
      ))}
    </div>
  );
}

const SCREENS = { plan: PlanScreen, script: ScriptScreen, storyboard: StoryboardScreen, day: DayScreen, delivery: DeliveryScreen };

/** Bouwt de loop-animatie per monitor. Speelt alleen als de monitor in beeld is. */
function buildLoop(kind, el) {
  switch (kind) {
    case 'plan':
      return gsap
        .timeline({ repeat: -1, repeatDelay: 1 })
        .fromTo(el.querySelectorAll('.cam__line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, stagger: 0.02, ease: 'none' })
        .fromTo(el.querySelector('.cam__rec'), { opacity: 0 }, { opacity: 1, duration: 0.1 })
        .to({}, { duration: 1.4 });
    case 'script':
      return gsap.fromTo(el.querySelector('.prompter__text'), { yPercent: 0 }, { yPercent: -50, ease: 'none', duration: 18, repeat: -1 });
    case 'storyboard': {
      const panels = el.querySelectorAll('.wf__panel');
      const tl = gsap.timeline({ repeat: -1 });
      tl.set(panels, { opacity: 0.22 });
      panels.forEach((p) => {
        tl.fromTo(p.querySelectorAll('.sketch__ink'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.05, ease: 'none' })
          .to(p, { opacity: 1, duration: 0.15 }, '<');
      });
      return tl.to({}, { duration: 1.2 });
    }
    case 'day':
      return gsap.fromTo(el.querySelector('.wf__head'), { left: '0%' }, { left: '100%', duration: 5, ease: 'none', repeat: -1 });
    case 'delivery':
      return gsap
        .timeline({ repeat: -1, repeatDelay: 0.8 })
        .fromTo(el.querySelectorAll('.wf__render-bar > span'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, stagger: 0.35, ease: 'power1.inOut' })
        .to({}, { duration: 0.8 });
    default:
      return null;
  }
}

/*
 * Werkwijze in vijf stappen, elk met een kleine monitor (16:9, zoekerhoeken, mono-label).
 * Plan: de camera tekent zich. Script: teleprompter. Storyboard: panelen lichten op. Draaidag: mini-tijdlijn.
 * Oplevering: renderbalken. Monitors spelen alleen als ze in beeld zijn.
 */
export default function Workflow({ steps }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.wf__monitor', el).forEach((m) => {
        const loop = buildLoop(m.dataset.kind, m);
        if (!loop) return;
        loop.pause();
        ScrollTrigger.create({
          trigger: m,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <ol ref={root} className="wf">
      {steps.map((s) => {
        const Screen = SCREENS[s.monitor];
        return (
          <li key={s.no} className="wf__step">
            <div className="wf__monitor" data-kind={s.monitor}>
              <span className="wf__c wf__c--tl" aria-hidden="true" />
              <span className="wf__c wf__c--tr" aria-hidden="true" />
              <span className="wf__c wf__c--bl" aria-hidden="true" />
              <span className="wf__c wf__c--br" aria-hidden="true" />
              <span className="wf__tag mono" aria-hidden="true">
                <span className="wf__rec" /> {s.no} / {s.title}
              </span>
              <div className="wf__screen">
                <Screen />
              </div>
            </div>
            <h4 className="display wf__title">{s.title}</h4>
            <p className="wf__line">{s.line}</p>
          </li>
        );
      })}
    </ol>
  );
}
