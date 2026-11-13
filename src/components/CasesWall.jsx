import { useLayoutEffect, useRef, useState } from 'react';
import { Picture } from './Media.jsx';
import { CLOUD as ALL, CLOUD_BRANCHES as ALL_BRANCHES } from '../data/site.js';

// Alleen tegels met echt beeld, en alleen branches die beeld hebben.
const CLOUD = ALL.filter((c) => c.name);
const CLOUD_BRANCHES = ALL_BRANCHES.filter((b) => CLOUD.some((c) => c.branch === b));
import { DUR, EASE, gsap, prefersReducedMotion } from '../lib/motion.js';

/*
 * Wall: beelden op drie dieptes, filterbaar per branche. Verhuisd van de homepage naar /cases.
 * TODO fase 5: Flip bij het wisselen; tegels en branches zonder beeld worden al niet getoond.
 */
export default function CasesWall() {
  const root = useRef(null);
  const [branch, setBranch] = useState(null); // null = alle branches

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      // Dieptes bewegen met verschillende snelheid op scroll.
      gsap.utils.toArray('.cloud__item', el).forEach((item) => {
        const d = Number(item.dataset.depth);
        gsap.to(item, { yPercent: -120 * d, ease: EASE.linear, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      // Muis beweegt de wolk licht mee, per diepte.
      const layers = gsap.utils.toArray('.cloud__par', el).map((p) => ({
        d: Number(p.dataset.depth),
        x: gsap.quickTo(p, 'x', { duration: DUR.base, ease: EASE.reveal }),
        y: gsap.quickTo(p, 'y', { duration: DUR.base, ease: EASE.reveal }),
      }));
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(-nx * 60 * l.d);
          l.y(-ny * 40 * l.d);
        });
      };
      el.addEventListener('pointermove', onMove);
      return () => el.removeEventListener('pointermove', onMove);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`cloud ${branch ? 'is-filtered' : ''}`}>
      {/* Branche kiezen: de beelden van die branche lichten op, de rest zakt weg. */}
      <div className="cloud__filter" role="group" aria-label="Filter op branche">
        <span className="mono cloud__filter-label">Branche</span>
        <button type="button" className={`cloud__chip ${branch == null ? 'is-on' : ''}`} aria-pressed={branch == null} onClick={() => setBranch(null)}>
          Alle
        </button>
        {CLOUD_BRANCHES.map((b) => (
          <button
            key={b}
            type="button"
            className={`cloud__chip ${branch === b ? 'is-on' : ''}`}
            aria-pressed={branch === b}
            onClick={() => setBranch((cur) => (cur === b ? null : b))}
          >
            {b}
            <span className="cloud__count">{CLOUD.filter((c) => c.branch === b).length}</span>
          </button>
        ))}
      </div>
      {CLOUD.map((c, i) => (
        <div
          key={i}
          className={`cloud__item cloud__item--d${String(c.depth).replace('.', '')} ${branch && c.branch === branch ? 'is-match' : ''}`}
          data-depth={c.depth}
          style={{ left: `${c.x}%`, top: `${c.y}%`, '--w': c.w }}
        >
          <div className="cloud__par" data-depth={c.depth}>
            <div className="cloud__frame">
              <span className="cloud__tag mono">{c.branch}</span>
              <Picture name={c.name} alt={c.alt} sizes={`${c.w}vw`} imgClassName="cloud__img" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
