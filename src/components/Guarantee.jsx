import { useEffect, useRef, useState } from 'react';
import { GUARANTEE } from '../data/site.js';
import { gsap, prefersReducedMotion } from '../lib/motion.js';

const STOPS = [-3, -2, -1, 0, 1, 2, 3];

/*
 * Groeigarantie met een belichtingsmeter: bij scroll schuift de naald van onderbelicht (−3) naar correct (0).
 */
export default function Guarantee() {
  const meterRef = useRef(null);
  const needleRef = useRef(null);
  const valueRef = useRef(null);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    const meter = meterRef.current;
    if (prefersReducedMotion()) {
      gsap.set(needleRef.current, { left: '50%' });
      valueRef.current.textContent = '0.0';
      setCorrect(true);
      return;
    }
    const state = { ev: -3 };
    const tween = gsap.to(state, {
      ev: 0,
      ease: 'none',
      scrollTrigger: { trigger: meter, start: 'top 85%', end: 'top 35%', scrub: 0.6 },
      onUpdate: () => {
        const pct = ((state.ev + 3) / 6) * 100;
        needleRef.current.style.left = `${pct}%`;
        valueRef.current.textContent = state.ev.toFixed(1).replace('-0.0', '0.0').replace('-', '−');
        setCorrect(state.ev > -0.05);
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="section guarantee" id="groeigarantie" aria-labelledby="guarantee-title">
      <div className="container grid">
        <div className="guarantee__copy">
          <span className="label label--red">Groeigarantie</span>
          <h2 id="guarantee-title" className="display h2">
            {GUARANTEE.title}
          </h2>
          <p className="lead">{GUARANTEE.body}</p>
          <p className="muted guarantee__how">{GUARANTEE.how}</p>
        </div>

        <figure className="guarantee__meter" ref={meterRef}>
          <div className="meter" role="img" aria-label="Belichtingsmeter: van onderbelicht naar correct belicht">
            <div className="meter__readout">
              <span className="label">Belichting</span>
              <span className="display meter__value">
                EV <span ref={valueRef}>−3.0</span>
              </span>
            </div>
            <div className="meter__scale">
              <div className="meter__ticks">
                {STOPS.map((s) => (
                  <span key={s} className={`meter__tick ${s === 0 ? 'is-zero' : ''}`}>
                    <span className="label">{s > 0 ? `+${s}` : s < 0 ? `−${Math.abs(s)}` : '0'}</span>
                  </span>
                ))}
              </div>
              <span ref={needleRef} className="meter__needle" />
            </div>
            <div className="meter__states">
              <span className={`label ${correct ? '' : 'is-on'}`}>Onderbelicht</span>
              <span className={`label ${correct ? 'is-on' : ''}`}>Correct belicht</span>
            </div>
          </div>
          <figcaption className="label meter__caption">Jouw weergaven, gemeten tegen de drie maanden ervoor</figcaption>
        </figure>
      </div>
    </section>
  );
}
