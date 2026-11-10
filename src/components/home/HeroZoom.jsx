import { useLayoutEffect, useRef } from 'react';
import { ApertureLink } from '../Aperture.jsx';
import { Picture } from '../Media.jsx';
import { useOpenReel } from '../Reel.jsx';
import { HERO, STATEMENT } from '../../data/site.js';
import { DUR, EASE, STAGGER, gsap, prefersReducedMotion } from '../../lib/motion.js';

const RADIUS = 14; // hoekradius van het kaartje in de kop, in px
const p2 = (n) => String(n).padStart(2, '0');

/*
 * Hero en statement in één camerabeweging.
 * In de kop zit een klein beeld ("Jullie bouwen [beeld] het."). Op scroll zoomt dat beeld uit tot schermvullend,
 * de woorden wijken opzij, de zoeker-HUD gaat aan en het statement licht woord voor woord op.
 * Techniek: het beeld ligt altijd schermvullend klaar en wordt geknipt (clip-path inset) tot de plek van het kaartje;
 * de knip loopt naar nul. Zo blijft het beeld scherp, er wordt niets opgeschaald.
 * TODO XPSR: industriële reel als loop aanleveren; nu een still van REYM.
 */
export default function HeroZoom() {
  const openReel = useOpenReel();
  const root = useRef(null);
  const tcRef = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const stage = el.querySelector('.hz__stage');
    const media = el.querySelector('.hz__media');
    const slot = el.querySelector('.hz__slot');
    const reduced = prefersReducedMotion();

    // Afstand van het kaartje tot de randen van de stage.
    // zoom.k: 0 = kaartje, 1 = schermvullend (scroll). zoom.open: 0 = punt in het midden van het kaartje, 1 = kaartje (intro).
    let ins = { t: 0, r: 0, b: 0, l: 0, w: 0, h: 0 };
    const zoom = { k: 0, open: reduced ? 1 : 0 };
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const c = slot.getBoundingClientRect();
      ins = { t: c.top - s.top, r: s.right - c.right, b: s.bottom - c.bottom, l: c.left - s.left, w: c.width, h: c.height };
    };
    const apply = () => {
      const f = 1 - zoom.k;
      const x = (ins.w / 2) * (1 - zoom.open);
      const y = (ins.h / 2) * (1 - zoom.open);
      media.style.clipPath = `inset(${(ins.t + y) * f}px ${(ins.r + x) * f}px ${(ins.b + y) * f}px ${(ins.l + x) * f}px round ${RADIUS * f}px)`;
    };
    measure();
    apply();

    if (reduced) {
      el.classList.add('is-static');
      const onResize = () => {
        measure();
        apply();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const ctx = gsap.context(() => {
      // Binnenkomst: woorden rijzen op uit hun masker, het kaartje opent vanuit het midden.
      // Intro animeert de binnenste elementen (.hz__in, .hz__fade), scroll de buitenste: ze zitten elkaar nooit in de weg.
      gsap.from('.hz__claim .hz__in', { yPercent: 110, duration: DUR.reveal, ease: EASE.reveal, stagger: STAGGER.words, delay: 0.2 });
      gsap.to(zoom, { open: 1, duration: DUR.reveal, ease: EASE.reveal, delay: 0.35, onUpdate: apply });
      gsap.from('.hz__fade', { autoAlpha: 0, y: 16, duration: DUR.slow, ease: EASE.reveal, delay: 0.6, stagger: STAGGER.lines });

      // Woorden wijken weg van het kaartje: links naar links, rechts naar rechts, de tweede regel zakt.
      const words = gsap.utils.toArray('.hz__claim .hz__word', el);
      const slotX = () => {
        const c = slot.getBoundingClientRect();
        return c.left + c.width / 2;
      };
      const dx = (w) => {
        const r = w.getBoundingClientRect();
        return (r.left + r.width / 2 - slotX()) * 0.9;
      };

      const sWords = gsap.utils.toArray('.hz__sw', el);
      const tl = gsap.timeline({ defaults: { ease: EASE.linear } });
      tl.to(zoom, { k: 1, duration: 1, ease: EASE.move, onUpdate: apply }, 0)
        // Eindigt op 1,12: de still heeft een zwarte film-gate-rand die zo grotendeels buiten beeld valt.
        .fromTo('.hz__img', { scale: 1.35 }, { scale: 1.12, duration: 1.2, ease: EASE.out }, 0)
        .to(words, { x: (i, w) => dx(w), autoAlpha: 0, duration: 0.6, ease: EASE.in }, 0)
        .to('.hz__meta, .hz__label', { autoAlpha: 0, y: -20, duration: 0.3 }, 0)
        .to('.hz__slot', { autoAlpha: 0, duration: 0.1 }, 0)
        // Volledig in beeld: zoeker aan, beeld zakt weg achter het statement.
        .to('.hz__hud', { autoAlpha: 1, duration: 0.15 }, 0.95)
        .to('.hz__shade', { opacity: 1, duration: 0.3 }, 1)
        .set('.hz__statement', { autoAlpha: 1 }, 1.05)
        .to(sWords, { opacity: 1, duration: 0.12, stagger: 0.08 }, 1.1);
      const strikeAt = 1.1 + 0.08 * sWords.findIndex((w) => w.classList.contains('hz__struck')) + 0.12;
      tl.fromTo('.hz__strike', { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: EASE.move }, strikeAt)
        .to('.hz__struck', { opacity: 0.35, duration: 0.15 }, strikeAt + 0.2)
        .fromTo('.hz__foot', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.25 }, '>-0.05')
        .to({}, { duration: 0.3 });

      tl.eventCallback('onUpdate', () => {
        const sec = Math.max(0, tl.time() - 0.95) * 8;
        if (tcRef.current) tcRef.current.textContent = `00:00:${p2(Math.floor(sec))}:${p2(Math.floor((sec % 1) * 25))}`;
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=170%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            apply();
          },
        },
      }).add(tl);
    }, el);

    return () => ctx.revert();
  }, []);

  const [first, second] = HERO.claim;
  const firstWords = first.split(' ');

  return (
    <section ref={root} className="s-hero hz" aria-labelledby="hero-title">
      <div className="hz__stage">
        {/* Het beeld zelf opent de reel (cursor "play"); de knop in de intro doet hetzelfde voor toetsenbord en touch. */}
        <div className="hz__media" aria-hidden="true" data-cursor="play" onClick={openReel}>
          <Picture name="reym-een-dag-uit-het-leven-van-juri" alt="" priority sizes="100vw" imgClassName="hz__img" />
          <div className="hz__shade" />
          <div className="hz__hud mono">
            <span className="hz__c hz__c--tl" />
            <span className="hz__c hz__c--tr" />
            <span className="hz__c hz__c--bl" />
            <span className="hz__c hz__c--br" />
            <span className="hz__rec">
              <span className="hz__dot" /> REC <span ref={tcRef}>00:00:00:00</span>
            </span>
            <span className="hz__spec">4K / 25P / LOG</span>
          </div>
        </div>

        <div className="hz__intro container">
          <p className="mono hz__label">
            <span className="hz__fade">
              <span className="hz__dot" aria-hidden="true" /> {HERO.label}
            </span>
          </p>
          {/* Het kaartje staat vóór het laatste woord van de eerste regel. */}
          <h1 id="hero-title" className="display hz__claim">
            <span className="hz__line">
              {firstWords.map((w, i) => (
                <span key={i} className="hz__group">
                  {i === firstWords.length - 1 && <span className="hz__slot" aria-hidden="true" />}
                  <span className="hz__word">
                    <span className="hz__in">{w}</span>
                  </span>
                </span>
              ))}
            </span>
            <span className="hz__line">
              {second.split(' ').map((w, i) => (
                <span key={i} className="hz__word">
                  <span className="hz__in">{w}</span>
                </span>
              ))}
            </span>
          </h1>
          <div className="hz__meta">
            <p className="lead hz__sub hz__fade">{HERO.sub}</p>
            <div className="hz__ctas hz__fade">
              <button type="button" className="btn btn--primary" onClick={openReel}>
                <svg className="btn__icon" viewBox="0 0 10 12" aria-hidden="true">
                  <path d="M0 0l10 6-10 6z" fill="currentColor" />
                </svg>
                Bekijk de reel
              </button>
              <ApertureLink to="/contact" className="btn">
                Plan een draaidag
              </ApertureLink>
            </div>
          </div>
        </div>

        <div className="hz__statement container">
          <h2 className="display hz__rows">
            {STATEMENT.rows.map((row, i) => (
              <span key={i} className="hz__row">
                {row.flatMap((part, j) =>
                  typeof part === 'string'
                    ? part.split(' ').map((w, k) => (
                        <span key={`${j}-${k}`} className="hz__sw">
                          {w}
                        </span>
                      ))
                    : [
                        <span key={j} className="hz__sw hz__struck">
                          {part.struck}
                          <span className="hz__strike" aria-hidden="true" />
                        </span>,
                      ],
                )}
              </span>
            ))}
          </h2>
          <div className="hz__foot">
            <p className="display hz__punch">{STATEMENT.punch}</p>
            <p className="lead hz__body">{STATEMENT.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
