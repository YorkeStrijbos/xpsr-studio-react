import { useLayoutEffect, useRef } from 'react';
import { SCRIPT, STORYBOARD } from '../../data/site.js';
import { gsap, prefersReducedMotion, SplitText } from '../../lib/motion.js';

/*
 * Schetsen per paneel (viewBox 160 x 90, 16:9). Losse potloodlijnen met pathLength=1,
 * zodat ze zichzelf kunnen tekenen. Rode lijnen = camerabeweging, zoals op echt storyboardpapier.
 */
function Sketch({ kind }) {
  const L = (p) => <path className="sb__ink" pathLength="1" {...p} />;
  const R = (p) => <path className="sb__ink sb__ink--red" pathLength="1" {...p} />;
  switch (kind) {
    case 'wide':
      return (
        <>
          <L d="M0 62L160 62M20 62L60 30H100L140 62" />
          <L d="M30 62V44H52V62M108 62V40H132V62" />
          <L d="M60 30V14H100V30M70 14V6H90V14" />
          <L d="M78 62V52a3 3 0 0 1 6 0V62M81 49a3 3 0 1 0 0.1 0" />
          <R d="M22 80H138M130 76L138 80L130 84" />
        </>
      );
    case 'medium':
      return (
        <>
          <L d="M90 88V60c0-10 8-16 18-16s18 6 18 16v28" />
          <L d="M108 42a10 10 0 1 0 0.1 0M98 34h20a10 6 0 0 0-20 0" />
          <L d="M12 88V50H70V88M18 56H64V70H18Z" />
          <L d="M70 64H92" />
        </>
      );
    case 'close':
      return (
        <>
          <L d="M20 70C40 60 58 58 74 62L92 66M30 82C48 74 62 72 80 74" />
          <L d="M92 66L120 58M116 52L124 64" />
          <R d="M122 58l14-10M124 60l18 0M122 62l12 12M120 56l4-16" />
          <L d="M0 86H160" />
        </>
      );
    case 'interview':
      return (
        <>
          <L d="M53 0V90M107 0V90M0 30H160M0 60H160" className="sb__ink sb__ink--guide" />
          <L d="M96 90V66c0-10 8-16 18-16s18 6 18 16v24" />
          <L d="M114 48a10 10 0 1 0 0.1 0" />
          <L d="M20 20h22v14h-22z" />
        </>
      );
    case 'drone':
      return (
        <>
          <L d="M10 12H70V40H10ZM84 18H150V60H84ZM20 52H66V82H20Z" />
          <L d="M0 46H160M76 0V90" />
          <L d="M100 30h30v18h-30z" />
          <R d="M80 70L80 50M74 56L80 48L86 56" />
        </>
      );
    case 'end':
      return (
        <>
          <L d="M48 30H112V52H48Z" />
          <L d="M58 38H102M58 44H90" />
          <L d="M62 64H98V74H62Z" />
          <R d="M54 26L106 26" />
        </>
      );
    default:
      return null;
  }
}

function Scene({ sc, i }) {
  const body = sc.circle
    ? sc.body.split(sc.circle).flatMap((part, k, arr) =>
        k < arr.length - 1 ? [part, <span key={k} className="script__circled">{sc.circle}</span>] : [part],
      )
    : sc.body;
  return (
    <div className="script__scene" data-i={i}>
      <p className="script__head">{sc.head}</p>
      {sc.speaker ? (
        <>
          <p className="script__speaker">{sc.speaker}</p>
          <p className="script__line script__line--dialog">{body}</p>
        </>
      ) : (
        <p className="script__line">{body}</p>
      )}
      <span className="script__cursor" aria-hidden="true" />
      {sc.note && (
        <span className="script__note" aria-hidden="true">
          <svg viewBox="0 0 120 20">
            <path pathLength="1" d="M2 14C30 8 70 18 118 10" />
          </svg>
          {sc.note}
        </span>
      )}
    </div>
  );
}

function Panel({ s, i }) {
  return (
    <li className="sb__panel" data-i={i}>
      <div className="sb__frame">
        <svg viewBox="0 0 160 90" aria-hidden="true">
          <Sketch kind={s.sketch} />
        </svg>
        <span className="mono sb__no">{String(i + 1).padStart(2, '0')}</span>
        <span className="sb__check" aria-hidden="true" />
      </div>
      <div className="sb__meta">
        <span className="mono">
          <b>Shot</b> {s.type}
        </span>
        <span className="mono">
          <b>Camera</b> {s.move}
        </span>
        <span className="mono">
          <b>Duur</b> {s.dur}
        </span>
      </div>
    </li>
  );
}

/*
 * Fase 02 / Script. Links een scriptpagina die zichzelf typt, rechts het storyboard.
 * Gepind: per scène typen de regels, daarna tekent het bijbehorende paneel zich, trekt de rode lijn
 * van scène naar paneel en verschijnt het vinkje. Aan het eind slaat de stempel DRAAIVERSIE op het script,
 * en schuift alles naar boven weg richting de edit.
 * Mobiel: geen pin; scène en paneel wisselen elkaar af en tekenen zich als ze in beeld komen.
 */
export default function Storyboard() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const links = el.querySelector('.sb__links');

    // Rode verbindingslijnen van scène naar paneel (strak, niet doorhangend), in sectie-pixels.
    const measure = () => {
      const sr = el.querySelector('.sb__desk').getBoundingClientRect();
      links.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
      el.querySelectorAll('.sb__desk .script__scene').forEach((sc, i) => {
        const panel = el.querySelector(`.sb__desk .sb__panel[data-i="${i}"] .sb__frame`);
        const path = links.querySelector(`[data-i="${i}"]`);
        if (!panel || !path) return;
        const a = sc.getBoundingClientRect();
        const b = panel.getBoundingClientRect();
        const x1 = a.right - sr.left + 6;
        const y1 = a.top - sr.top + 10;
        const x2 = b.left - sr.left - 6;
        const y2 = b.top - sr.top + b.height / 2;
        path.setAttribute('d', `M${x1} ${y1}H${x1 + 18}L${x2 - 18} ${y2}H${x2}`);
      });
    };

    if (prefersReducedMotion()) {
      measure();
      return;
    }
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 860px)', () => {
        measure();
        const scenes = gsap.utils.toArray('.sb__desk .script__scene', el);
        const panels = gsap.utils.toArray('.sb__desk .sb__panel', el);
        const splits = scenes.map((sc) => new SplitText(sc.querySelectorAll('.script__head, .script__speaker, .script__line'), { type: 'chars' }));
        gsap.set(el.querySelectorAll('.sb__desk .sb__ink, .sb__link, .script__note path'), { strokeDashoffset: 1 });
        gsap.set(el.querySelectorAll('.sb__desk .sb__check, .script__note, .script__stamp'), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=200%', pin: true, scrub: 1, onRefresh: measure },
        });
        scenes.forEach((sc, i) => {
          const panel = panels[i];
          const note = sc.querySelector('.script__note');
          tl.set(sc, { attr: { 'data-typing': '1' } })
            .from(splits[i].chars, { autoAlpha: 0, stagger: 0.004, duration: 0.01 })
            .set(sc, { attr: { 'data-typing': '0' } })
            .to(panel.querySelectorAll('.sb__ink:not(.sb__ink--red)'), { strokeDashoffset: 0, duration: 0.25, stagger: 0.02 })
            .to(panel.querySelectorAll('.sb__ink--red'), { strokeDashoffset: 0, duration: 0.1 })
            .to(links.querySelector(`[data-i="${i}"]`), { strokeDashoffset: 0, duration: 0.1 }, '<')
            .fromTo(panel.querySelector('.sb__check'), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.08, ease: 'back.out(3)' });
          if (note) {
            tl.to(note, { autoAlpha: 1, duration: 0.05 }).to(note.querySelector('path'), { strokeDashoffset: 0, duration: 0.1 });
          }
        });
        tl.fromTo('.script__stamp', { scale: 2.2, rotate: -14, autoAlpha: 0 }, { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.12, ease: 'power4.in' })
          .to('.sb__desk', { x: 2, duration: 0.02, repeat: 3, yoyo: true })
          .set('.sb__desk', { x: 0 })
          .to({}, { duration: 0.3 })
          // Overgang naar de edit: alles schuift naar boven weg.
          .to('.sb__inner', { yPercent: -100, duration: 0.5, ease: 'power2.in' });

        return () => splits.forEach((s) => s.revert());
      });

      mm.add('(max-width: 859px)', () => {
        gsap.utils.toArray('.sb__mobile .sb__panel', el).forEach((p) => {
          gsap.fromTo(p.querySelectorAll('.sb__ink'), { strokeDashoffset: 1 }, {
            strokeDashoffset: 0,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: p, start: 'top 80%', end: 'center 50%', scrub: true },
          });
        });
      });
    }, el);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-storyboard sb" aria-labelledby="sb-title">
      <div className="container sb__inner">
        <header className="sb__head">
          <span className="mono phase-slot">Fase 02 / Script</span>
          <h2 id="sb-title" className="display sb__title">
            Elk shot staat op papier voordat de camera aangaat.
          </h2>
        </header>

        <div className="sb__desk">
          <article className="script" aria-label="Script">
            <span className="script__clip" aria-hidden="true" />
            {SCRIPT.map((sc, i) => (
              <Scene key={sc.head} sc={sc} i={i} />
            ))}
            <span className="script__stamp" aria-hidden="true">
              Draaiversie
            </span>
          </article>
          <ol className="sb__grid" aria-label="Storyboard">
            {STORYBOARD.map((s, i) => (
              <Panel key={s.sketch} s={s} i={i} />
            ))}
          </ol>
          <svg className="sb__links" aria-hidden="true">
            {SCRIPT.map((_, i) => (
              <path key={i} className="sb__link" data-i={i} pathLength="1" />
            ))}
          </svg>
        </div>

        {/* Mobiel: scène, paneel, scène, paneel. */}
        <ol className="sb__mobile" aria-hidden="true">
          {SCRIPT.map((sc, i) => (
            <li key={sc.head} className="sb__pair">
              <div className="script script--card">
                <Scene sc={sc} i={i} />
              </div>
              <ul className="sb__grid sb__grid--one">
                <Panel s={STORYBOARD[i]} i={i} />
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
