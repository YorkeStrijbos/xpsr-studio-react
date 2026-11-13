import { useLayoutEffect, useRef, useState } from 'react';
import { Picture } from '../Media.jsx';
import CameraHud from './CameraHud.jsx';
import NoSignal from '../NoSignal.jsx';
import { CLOUD, CLOUD_BRANCHES, PAIN } from '../../data/site.js';
import { EASE, MQ, gsap, prefersReducedMotion } from '../../lib/motion.js';
import { frameCorners, vfEls } from '../../motion/viewfinder.js';

/*
 * Het probleem. Een schermvullend rood-zwart vlak met de camera-zoeker erover, direct vanaf het begin;
 * daarop verschijnen de regels één voor één. Daarna zweeft een wolk beelden op drie dieptes.
 */
export default function Pain() {
  const root = useRef(null);
  const cloud = useRef(null);
  const [branch, setBranch] = useState(null); // null = alle branches

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    const cloudEl = cloud.current;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add({ wide: MQ.desktop, narrow: MQ.mobile }, () => {
        const lines = gsap.utils.toArray('.pain__line', el);
        const tl = gsap.timeline({
          defaults: { ease: EASE.linear },
          scrollTrigger: { trigger: '.pain__pin', start: 'top top', end: '+=200%', pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        tl.set(vfEls.core, { scale: 0 }, 0);
        // Alle regels starten onzichtbaar onder hun masker.
        const spans = lines.map((l) => l.firstChild);
        gsap.set(spans, { yPercent: 110, y: 0, autoAlpha: 0 });

        // Per regel een vast slot: in (0,4), staan (0,4), uit (0,35), pauze (0,15).
        // In en uit zijn allebei expliciete fromTo's, zodat ook bij snel of terug scrollen
        // de vorige regel altijd helemaal weg is voordat de volgende binnenkomt.
        const IN = 0.4;
        const HOLD = 0.4;
        const OUT = 0.35;
        const GAP = 0.15;
        const SLOT = IN + HOLD + OUT + GAP;
        spans.forEach((span, i) => {
          const at = 0.3 + i * SLOT;
          tl.fromTo(span, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: IN, ease: EASE.out, immediateRender: false }, at);
          tl.fromTo(span, { yPercent: 0, autoAlpha: 1 }, { yPercent: -110, autoAlpha: 0, duration: OUT, ease: EASE.in, immediateRender: false }, at + IN + HOLD);
        });
        // Korte rust na de laatste regel, dan scrolt de sectie gewoon door.
        tl.to({}, { duration: 0.3 });
      });

      // Beeldwolk: dieptes bewegen met verschillende snelheid op scroll.
      gsap.utils.toArray('.cloud__item', el).forEach((item) => {
        const d = Number(item.dataset.depth);
        gsap.to(item, {
          yPercent: -120 * d,
          ease: EASE.linear,
          scrollTrigger: { trigger: cloudEl, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // Muis beweegt de wolk licht mee, per diepte.
      const layers = gsap.utils.toArray('.cloud__par', el).map((p) => ({
        d: Number(p.dataset.depth),
        x: gsap.quickTo(p, 'x', { duration: 0.8, ease: EASE.out }),
        y: gsap.quickTo(p, 'y', { duration: 0.8, ease: EASE.out }),
      }));
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(-nx * 60 * l.d);
          l.y(-ny * 40 * l.d);
        });
      };
      cloudEl.addEventListener('pointermove', onMove);

      // Hover: zoekerhoeken springen om het beeld heen.
      const items = gsap.utils.toArray('.cloud__frame', el);
      const enter = (e) => frameCorners(e.currentTarget.getBoundingClientRect(), { duration: 0.45 });
      items.forEach((it) => {
        it.addEventListener('pointerenter', enter);
        it.addEventListener('pointermove', enter);
      });
      const leave = () => gsap.to(vfEls.corners, { autoAlpha: 0, duration: 0.3 });
      cloudEl.addEventListener('pointerleave', leave);

      return () => {
        cloudEl.removeEventListener('pointermove', onMove);
        cloudEl.removeEventListener('pointerleave', leave);
        items.forEach((it) => {
          it.removeEventListener('pointerenter', enter);
          it.removeEventListener('pointermove', enter);
        });
      };
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-pain pain" aria-labelledby="pain-title">
      <div className="pain__pin">
        <div className="pain__disc" aria-hidden="true">
          <div className="pain__sun" />
        </div>
        <CameraHud className="pain__hud" />
        <h2 id="pain-title" className="sr-only">
          Het probleem
        </h2>
        <div className="pain__lines container">
          {PAIN.lines.map((l) => (
            <p key={l} className="pain__line display">
              <span>{l}</span>
            </p>
          ))}
          <p className="pain__line pain__line--turn display">
            <span>{PAIN.turn}</span>
          </p>
        </div>
      </div>

      <div ref={cloud} className={`cloud ${branch ? 'is-filtered' : ''}`} data-cursor="bekijk">
        {/* Branche kiezen: de beelden van die branche lichten op, de rest zakt weg. */}
        <div className="cloud__filter" role="group" aria-label="Filter op branche" data-cursor="">
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
                {c.name ? (
                  <Picture name={c.name} alt={c.alt} sizes={`${c.w}vw`} imgClassName="cloud__img" />
                ) : (
                  <NoSignal sub={c.placeholder} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
