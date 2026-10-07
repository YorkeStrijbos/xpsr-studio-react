import { useLayoutEffect, useRef } from 'react';
import { ApertureLink } from '../Aperture.jsx';
import { Picture } from '../Media.jsx';
import { HOME_CASES } from '../../data/cases.js';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion.js';
import { setCorners, vfEls } from '../../motion/viewfinder.js';
import { scramble } from '../../motion/scramble.js';

/** Eén kaart: technische laag eronder, echte laag erboven, onthuld door een rode laserlijn (--scan). */
export function ScanCard({ c, index }) {
  const visual = c.cover ? (
    <Picture name={c.cover.name} alt={c.cover.alt} sizes="(min-width: 860px) 40vw, 90vw" imgClassName="scan__img" />
  ) : (
    <div className="scan__ph">
      <span className="mono">[PLACEHOLDER] Beeld {c.client}</span>
    </div>
  );
  return (
    <article className="scan" data-cursor="BEKIJK">
      <ApertureLink to={`/cases/${c.slug}`} className="scan__link" aria-label={`Bekijk de case ${c.client}`}>
        <div className="scan__media">
          <div className="scan__tech" aria-hidden="true">
            {visual}
          </div>
          <div className="scan__real">{visual}</div>
          <span className="scan__laser" aria-hidden="true" />
          <span className="scan__no mono">{`C-${String(index + 1).padStart(2, '0')}`}</span>
          {!c.industry && <span className="scan__tag mono">Ook buiten de hal</span>}
        </div>
      </ApertureLink>
      <dl className="scan__meta mono">
        <div>
          <dt>Klant</dt>
          <dd data-scramble>{c.client}</dd>
        </div>
        <div>
          <dt>Wat</dt>
          <dd data-scramble>{c.made}</dd>
        </div>
        <div>
          <dt>Resultaat</dt>
          <dd data-scramble className="scan__result">
            {c.result}
          </dd>
        </div>
      </dl>
      <p className="scan__line">{c.line}</p>
    </article>
  );
}

/** Koppelt scan + scramble aan een kaart. Met containerAnimation voor de horizontale variant. */
export function bindScan(card, extra = {}) {
  const meta = card.querySelectorAll('[data-scramble]');
  let done = false;
  return gsap.fromTo(
    card,
    { '--scan': '0%' },
    {
      '--scan': '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        scrub: true,
        ...extra,
        onUpdate: (self) => {
          if (self.progress > 0.98 && !done) {
            done = true;
            meta.forEach((m, i) => scramble(m, { delay: i * 0.08 }));
          } else if (self.progress < 0.02) {
            done = false;
          }
        },
      },
    },
  );
}

/*
 * Cases uit de hal. Desktop: horizontaal gepind, zoekerhoeken kaderen de kaart die het dichtst bij het midden staat.
 * Mobiel: verticaal, scan op de gewone scroll.
 */
export default function CasesScan() {
  const root = useRef(null);
  const track = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (prefersReducedMotion()) {
      el.querySelectorAll('.scan').forEach((c) => c.style.setProperty('--scan', '100%'));
      return;
    }
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 860px)', () => {
        const cards = gsap.utils.toArray('.scan', el);
        const distance = () => track.current.scrollWidth - window.innerWidth;
        let active = null;
        const frame = () => {
          const mid = window.innerWidth / 2;
          let best = null;
          let bestD = Infinity;
          cards.forEach((c) => {
            const r = c.querySelector('.scan__media').getBoundingClientRect();
            const d = Math.abs(r.left + r.width / 2 - mid);
            if (d < bestD) {
              bestD = d;
              best = r;
            }
          });
          if (best) {
            setCorners({ left: best.left - 10, top: best.top - 10, width: best.width + 20, height: best.height + 20 });
            if (!active) {
              active = true;
              gsap.to(vfEls.corners, { autoAlpha: 1, duration: 0.3 });
            }
          }
        };
        const scrollTween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: frame,
            onLeave: () => {
              active = false;
              gsap.to(vfEls.corners, { autoAlpha: 0, duration: 0.3 });
            },
            onLeaveBack: () => {
              active = false;
              gsap.to(vfEls.corners, { autoAlpha: 0, duration: 0.3 });
            },
          },
        });
        cards.forEach((card) => bindScan(card, { containerAnimation: scrollTween, start: 'left 85%', end: 'center 50%' }));
      });

      mm.add('(max-width: 859px)', () => {
        gsap.utils.toArray('.scan', el).forEach((card) => bindScan(card, { start: 'top 85%', end: 'center 50%' }));
      });
    }, el);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(id);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-cases cases2" aria-labelledby="cases-title">
      <div ref={track} className="cases2__track">
        <header className="cases2__head">
          <span className="mono label--red">Cases / Industrie</span>
          <h2 id="cases-title" className="display h2 cases2__title" data-stamp>
            Uit de hal
          </h2>
          <ApertureLink to="/cases" className="link-arrow">
            Alle cases
          </ApertureLink>
        </header>
        {HOME_CASES.map((c, i) => (
          <ScanCard key={c.slug} c={c} index={i} />
        ))}
      </div>
    </section>
  );
}
