import { useLayoutEffect, useRef } from 'react';
import CameraHud from './CameraHud.jsx';
import { STATEMENTS } from '../../content/home.js';
import { EASE, MQ, gsap } from '../../lib/motion.js';
import { vfEls } from '../../motion/viewfinder.js';

const DIM = 0.14; // woorden die nog niet "belicht" zijn

/*
 * Statements als één scène op een rood-zwart vlak met de camera-zoeker erover.
 * Desktop: gepind. Er staat altijd een statement in beeld: de woorden lichten één voor één op terwijl je scrolt,
 * daarna wisselt het naar het volgende: eerst uit, dan in (nooit twee tegelijk, geen afgeknipte regels).
 * Bij "Tijd om de lichten aan te zetten" gaat het licht aan: het vlak wordt fel, met een korte flits.
 * Mobiel: geen pin; de statements staan onder elkaar en lichten op terwijl je erlangs scrolt.
 * Reduced motion: alles in eindstand, alle statements leesbaar, licht aan.
 */
export default function Pain() {
  const root = useRef(null);
  const all = [...STATEMENTS.lines, STATEMENTS.turn];

  useLayoutEffect(() => {
    const el = root.current;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(MQ.motionDesktop, () => {
        const lines = gsap.utils.toArray('.pain__line', el);
        const words = lines.map((l) => l.querySelectorAll('.pain__w'));
        gsap.set(lines, { autoAlpha: 0 });
        gsap.set(lines[0], { autoAlpha: 1 });
        gsap.set(el.querySelectorAll('.pain__w'), { opacity: DIM });

        const tl = gsap.timeline({ defaults: { ease: EASE.linear } });
        if (vfEls.core) tl.set(vfEls.core, { scale: 0 }, 0);
        lines.forEach((line, i) => {
          const at = i; // elk statement een segment van 1
          // Woorden lichten op over 60% van het segment.
          tl.to(words[i], { opacity: 1, duration: 0.6 / words[i].length, stagger: 0.6 / words[i].length }, at);
          if (i < lines.length - 1) {
            // Wissel naar het volgende statement: eerst uit, direct daarna in. Nooit twee tegelijk, nooit lang leeg.
            tl.to(line, { autoAlpha: 0, duration: 0.09 }, at + 0.8).fromTo(lines[i + 1], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.09 }, at + 0.875);
          }
        });
        // Lichten aan: fel vlak en een korte flits, daarna even laten staan.
        const end = lines.length - 1 + 0.62;
        tl.to('.pain__lit', { opacity: 1, duration: 0.25, ease: EASE.reveal }, end)
          .fromTo('.pain__flash', { opacity: 0 }, { opacity: 0.35, duration: 0.04, yoyo: true, repeat: 1 }, end)
          .to({}, { duration: 0.35 });

        gsap
          .timeline({
            scrollTrigger: { trigger: '.pain__pin', start: 'top top', end: `+=${lines.length * 80}%`, pin: true, scrub: 0.4, invalidateOnRefresh: true },
          })
          .add(tl);
      });

      // Mobiel: geen pin, per statement oplichten tijdens het langs scrollen; licht aan bij het laatste.
      mm.add(MQ.motionMobile, () => {
        gsap.utils.toArray('.pain__line', el).forEach((line) => {
          gsap.fromTo(line.querySelectorAll('.pain__w'), { opacity: DIM }, { opacity: 1, stagger: 0.1, ease: EASE.linear, scrollTrigger: { trigger: line, start: 'top 80%', end: 'center 45%', scrub: true } });
        });
        gsap.to('.pain__lit', { opacity: 1, ease: EASE.linear, scrollTrigger: { trigger: '.pain__line--turn', start: 'top 70%', end: 'center 50%', scrub: true } });
      });
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-pain pain" aria-labelledby="pain-title">
      <div className="pain__pin">
        <div className="pain__bg" aria-hidden="true">
          <div className="pain__lit" />
          <div className="pain__flash" />
        </div>
        <CameraHud className="pain__hud" />
        <h2 id="pain-title" className="sr-only">
          Het probleem
        </h2>
        <ol className="pain__lines container">
          {all.map((l, i) => (
            <li key={l} className={`pain__line display ${i === all.length - 1 ? 'pain__line--turn' : ''}`}>
              {l.split(' ').map((w, k) => (
                <span key={k} className="pain__w">
                  {w}{' '}
                </span>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
