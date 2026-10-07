import { useLayoutEffect, useRef } from 'react';
import { getStill } from '../../lib/media.js';
import { STATEMENT } from '../../data/site.js';
import { gsap, prefersReducedMotion, SplitText } from '../../lib/motion.js';
import { createIris } from '../../motion/iris.js';

/*
 * Statement op staal. Komt binnen met een bolle lensrand die vlak trekt.
 * Gepind: naast de kop opent het diafragma en toont een industriebeeld,
 * de woorden schuiven van gecentreerd naar uitgevuld, en "bedrijfsfilmpje" wordt doorgehaald.
 */
export default function Statement() {
  const root = useRef(null);
  const irisSvg = useRef(null);
  const img = getStill('reym-locatie');

  useLayoutEffect(() => {
    const el = root.current;
    const setIris = createIris(irisSvg.current, { cx: 0, cy: 0, L: 70, turn: 70 });
    const reduced = prefersReducedMotion();
    if (reduced) {
      setIris(46, 1);
      return;
    }
    setIris(6, 0);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Lensrand: bol naar vlak.
      gsap.fromTo(
        el,
        { '--curve': '22vh' },
        { '--curve': '0vh', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: true } },
      );

      mm.add({ wide: '(min-width: 860px)', narrow: '(max-width: 859px)' }, (c) => {
        const words = gsap.utils.toArray('.st__w', el);
        // Startpositie: elke regel gecentreerd. Verschil naar uitgevuld berekenen per woord.
        const offsets = words.map((w) => {
          const row = w.parentElement;
          const rr = row.getBoundingClientRect();
          const items = [...row.children];
          const total = items.reduce((s, it) => s + it.getBoundingClientRect().width, 0);
          const gap = c.conditions.wide ? 28 : 12;
          const packed = total + gap * (items.length - 1);
          let cursor = rr.left + (rr.width - packed) / 2;
          for (const it of items) {
            if (it === w) break;
            cursor += it.getBoundingClientRect().width + gap;
          }
          return cursor - w.getBoundingClientRect().left;
        });

        const split = new SplitText('.st__body, .st__punch', { type: 'lines', mask: 'lines' });
        const iris = { r: 6, o: 0 };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: c.conditions.wide ? '+=120%' : '+=90%', pin: true, scrub: 1 },
        });
        tl.to(iris, { r: 46, o: 1, duration: 1, onUpdate: () => setIris(iris.r, iris.o) }, 0)
          .fromTo('.st__window-img', { scale: 1.6 }, { scale: 1, duration: 1 }, 0)
          .fromTo(words, { x: (i) => offsets[i] }, { x: 0, duration: 0.5, ease: 'power2.inOut' }, 0.05)
          .fromTo('.st__strike', { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: 'power2.inOut' }, 0.45)
          .to('.st__struck', { opacity: 0.35, duration: 0.2 }, 0.55)
          .from(split.lines, { yPercent: 110, stagger: 0.04, duration: 0.25, ease: 'power3.out' }, 0.65);

        return () => split.revert();
      });
    }, el);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-statement st" aria-labelledby="st-title">
      <div className="st__stage">
        <div className="container st__grid">
          <div className="st__text">
            <h2 id="st-title" className="display st__rows">
              {STATEMENT.rows.map((row, i) => (
                <span key={i} className="st__row">
                  {row.map((part, j) =>
                    typeof part === 'string' ? (
                      <span key={j} className="st__w">
                        {part}
                      </span>
                    ) : (
                      <span key={j} className="st__w st__struck">
                        {part.struck}
                        <span className="st__strike" aria-hidden="true" />
                      </span>
                    ),
                  )}
                </span>
              ))}
            </h2>
            <div className="st__foot">
              <p className="display st__punch">{STATEMENT.punch}</p>
              <p className="st__body lead">{STATEMENT.body}</p>
            </div>
          </div>
          <div className="st__media">
            <svg ref={irisSvg} className="st__window" viewBox="-50 -50 100 100" aria-hidden="true">
              <defs>
                <clipPath id="st-hole">
                  <polygon data-iris-hole />
                </clipPath>
              </defs>
              <g clipPath="url(#st-hole)">
                <image className="st__window-img" href={img.jpg} x="-50" y="-50" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
              </g>
              <circle r="49" className="st__ring" />
              <path data-iris-blades className="st__blades" />
              <polygon data-iris-hole className="st__rim" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
