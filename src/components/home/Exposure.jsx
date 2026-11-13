import { useLayoutEffect, useRef } from 'react';
import { Picture } from '../Media.jsx';
import { EASE, gsap, prefersReducedMotion } from '../../lib/motion.js';

const BARS = 48;
const STOPS = [-3, -2, -1, 0, 1, 2, 3];

/** Histogramvorm bij een bepaalde belichting: de massa schuift van links (donker) naar rechts (licht). */
function histogram(ev) {
  const center = 0.5 + ev * 0.16;
  const spread = 0.17 - Math.abs(ev) * 0.025;
  return Array.from({ length: BARS }, (_, i) => {
    const x = i / (BARS - 1);
    const main = Math.exp(-((x - center) ** 2) / (2 * spread ** 2));
    const shadow = 0.35 * Math.exp(-((x - (center - 0.22)) ** 2) / (2 * 0.06 ** 2));
    const clip = (ev < -1.5 && i < 3) || (ev > 1 && i > BARS - 4) ? 1 : 0;
    return Math.min(1, main + shadow + clip);
  });
}

// Bij elke stap een geloofwaardige combinatie van diafragma, ISO en sluitertijd.
const SETTINGS = [
  { ev: -3, f: 'f/11', iso: 'ISO 100', s: '1/500' },
  { ev: -2, f: 'f/8', iso: 'ISO 100', s: '1/250' },
  { ev: -1, f: 'f/5.6', iso: 'ISO 200', s: '1/125' },
  { ev: 0, f: 'f/2.8', iso: 'ISO 400', s: '1/50' },
  { ev: 1, f: 'f/2', iso: 'ISO 800', s: '1/50' },
  { ev: 2, f: 'f/1.4', iso: 'ISO 1600', s: '1/25' },
];

const fmt = (ev) => {
  const v = Math.abs(ev) < 0.05 ? 0 : ev;
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}`;
};

/*
 * Wij zorgen voor de juiste exposure. Gepind: het beeld gaat van zwaar onderbelicht (EV −3) via overbelicht
 * (zebra-strepen, EV +1,5) naar precies goed (EV 0). Histogram, belichtingsschaal en camera-instellingen lopen mee.
 * Op EV 0 komt de kop met de groeigarantie.
 * TODO XPSR: garantievoorwaarden laten checken voordat dit live gaat.
 */
export default function Exposure() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const bars = el.querySelectorAll('.expo__histo rect');
    const evText = el.querySelector('.expo__ev-value');
    const needle = el.querySelector('.expo__needle');
    const fEl = el.querySelector('[data-k="f"]');
    const isoEl = el.querySelector('[data-k="iso"]');
    const sEl = el.querySelector('[data-k="s"]');
    const img = el.querySelector('.expo__img');

    const render = (ev) => {
      // Elke stop verdubbelt of halveert het licht.
      img.style.filter = `brightness(${(2 ** ev).toFixed(3)}) contrast(${(1 - ev * 0.04).toFixed(3)})`;
      evText.textContent = fmt(ev);
      needle.style.left = `${((ev + 3) / 6) * 100}%`;
      histogram(ev).forEach((h, i) => {
        bars[i].setAttribute('height', (h * 40).toFixed(2));
        bars[i].setAttribute('y', (40 - h * 40).toFixed(2));
      });
      const near = SETTINGS.reduce((a, b) => (Math.abs(b.ev - ev) < Math.abs(a.ev - ev) ? b : a));
      fEl.textContent = near.f;
      isoEl.textContent = near.iso;
      sEl.textContent = near.s;
      el.classList.toggle('is-correct', Math.abs(ev) < 0.08);
      el.classList.toggle('is-over', ev > 0.6);
    };

    if (prefersReducedMotion()) {
      render(0);
      return;
    }
    render(-3);
    const ctx = gsap.context(() => {
      const st = { ev: -3 };
      gsap
        .timeline({
          defaults: { ease: EASE.linear },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=130%', pin: true, scrub: 1 },
        })
        .to(st, { ev: 1.5, duration: 1, ease: EASE.move, onUpdate: () => render(st.ev) })
        .to(st, { ev: 0, duration: 0.6, ease: EASE.reveal, onUpdate: () => render(st.ev) })
        .fromTo('.expo__copy > *', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.3 }, '-=0.1')
        .to({}, { duration: 0.4 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="s-exposure expo" aria-labelledby="expo-title">
      <div className="expo__image">
        <Picture name="one-love-cruise" alt="Steigerbouwers aan het werk op een gevel" sizes="100vw" imgClassName="expo__img" />
        <span className="expo__zebra" aria-hidden="true" />
      </div>
      <div className="expo__shade" aria-hidden="true" />

      <div className="expo__copy container">
        <span className="mono label--red">Groeigarantie / social</span>
        <h2 id="expo-title" className="display expo__title">
          Wij zorgen voor de juiste exposure.
        </h2>
        <p className="lead">Meer weergaven dan de drie maanden ervoor. Lukt dat niet, dan is de volgende maand gratis.</p>
      </div>

      {/* Camera-monitor onderin: belichtingsschaal, histogram en instellingen. */}
      <div className="expo__hud container" aria-hidden="true">
        <div className="expo__meter">
          <div className="expo__ev">
            <span className="mono">EV</span>
            <span className="display expo__ev-value">−3.0</span>
            <span className="mono expo__status">
              <span className="expo__under">Onderbelicht</span>
              <span className="expo__over">Overbelicht</span>
              <span className="expo__ok">Juiste belichting</span>
            </span>
          </div>
          <div className="expo__scale">
            {STOPS.map((s) => (
              <span key={s} className={`expo__tick ${s === 0 ? 'is-zero' : ''}`}>
                <span className="mono">{s > 0 ? `+${s}` : s < 0 ? `−${Math.abs(s)}` : '0'}</span>
              </span>
            ))}
            <span className="expo__needle" />
          </div>
        </div>
        <svg className="expo__histo" viewBox={`0 0 ${BARS * 3} 40`} preserveAspectRatio="none">
          {Array.from({ length: BARS }, (_, i) => (
            <rect key={i} x={i * 3} y="40" width="2.2" height="0" />
          ))}
        </svg>
        <dl className="expo__settings mono">
          <div>
            <dt>Diafragma</dt>
            <dd data-k="f">f/11</dd>
          </div>
          <div>
            <dt>ISO</dt>
            <dd data-k="iso">ISO 100</dd>
          </div>
          <div>
            <dt>Sluiter</dt>
            <dd data-k="s">1/500</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
