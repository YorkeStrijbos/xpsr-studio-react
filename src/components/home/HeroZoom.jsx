import { useLayoutEffect, useRef } from 'react';
import { ApertureLink, useAperture } from '../Aperture.jsx';
import { LoopVideo } from '../Media.jsx';
import { useOpenReel } from '../Reel.jsx';
import { HERO, MANIFEST } from '../../content/home.js';
import { DUR, EASE, MQ, STAGGER, ScrollTrigger, gsap, useMediaQuery } from '../../lib/motion.js';
import { playOnScroll } from '../../lib/scroll.js';

const ZOOM = 70; // eindschaal van de kop: ruim genoeg om met één letterstreep het hele scherm te vullen
const CAP = 0.735; // hoofdletterhoogte van Anton, als deel van de korps
const LEADING = 0.86;

/*
 * Zoompunt: het gevulde letterpunt dat het dichtst bij het schermmidden ligt. Wie puur rond dat punt schaalt,
 * vliegt recht vooruit; ligt het punt in een letter (niet in een gat of tussen de regels), dan vult de letter
 * uiteindelijk het hele scherm. De kop wordt daarvoor onzichtbaar op een canvas getekend, met dezelfde opmaak
 * als de SVG, en vanuit het midden in steeds grotere cirkels afgezocht naar een punt dat ruim binnen een
 * letterstreep ligt (een schijfje van 6 px rondom moet ook gevuld zijn).
 */
const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
function findZoomPoint(texts, fs, W, H) {
  const cx = W / 2;
  const cy = H / 2;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0, 0, W, H);
  ctx.font = `${fs}px ${getComputedStyle(texts[0]).fontFamily}`;
  ctx.letterSpacing = getComputedStyle(texts[0]).letterSpacing; // gelijk aan --tracking-display
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';
  texts.forEach((t) => ctx.fillText(t.textContent, +t.getAttribute('x'), +t.getAttribute('y')));
  const data = ctx.getImageData(0, 0, W, H).data;
  const filled = (x, y) => {
    const xi = Math.round(x);
    const yi = Math.round(y);
    return xi >= 0 && yi >= 0 && xi < W && yi < H && data[(yi * W + xi) * 4 + 3] > 200;
  };
  const solid = (x, y) => filled(x, y) && [0, 1, 2, 3, 4, 5, 6, 7].every((k) => filled(x + 6 * Math.cos(k * 0.785), y + 6 * Math.sin(k * 0.785)));
  for (let r = 0; r < Math.max(W, H) / 2; r += 3) {
    const steps = Math.max(8, Math.round((2 * Math.PI * r) / 3));
    for (let k = 0; k < steps; k++) {
      const x = cx + r * Math.cos((k / steps) * 2 * Math.PI);
      const y = cy + r * Math.sin((k / steps) * 2 * Math.PI);
      if (solid(x, y)) return { x, y };
    }
  }
  return { x: cx, y: cy };
}

/*
 * De kop is de video. Footage speelt vanaf het eerste frame in de letters van de claim.
 * Techniek: een SVG over de video, met een zwart vlak waarin de tekst als gat is uitgespaard (mask).
 * Desktop, gepind; één scroll speelt de zoom op tijd af: de tekst in het mask schaalt op rond de I van het laatste woord. Dat is een
 * SVG-transform, dus vector: geen gigantische rasters zoals bij het schalen van een HTML-laag. We vliegen door
 * de letter heen, de video vult het scherm en het statement licht woord voor woord op.
 * Mobiel en reduced motion: geen pin en geen zoom. Video in de letters (vier regels), daaronder het statement.
 */
export default function HeroZoom() {
  const openReel = useOpenReel();
  const { ready } = useAperture();
  const root = useRef(null);
  const intro = useRef(null);

  // Regels: desktop twee (de claimregels), mobiel vier (elke claimregel in tweeën).
  const mobile = useMediaQuery(MQ.mobile);
  const rows = HERO.claim.flatMap((l) => {
    const w = l.toUpperCase().split(' ');
    if (!mobile) return [w.join(' ')];
    const h = Math.ceil(w.length / 2);
    return [w.slice(0, h).join(' '), w.slice(h).join(' ')];
  });
  const zoomAt = useRef({ x: 0, y: 0 });

  // SVG-tekst opmaken: de breedste regel vult de breedte (binnen een maximum op hoogte), regels verticaal
  // gecentreerd. Daarna het zoompunt bepalen (zie findZoomPoint).
  useLayoutEffect(() => {
    const svg = root.current.querySelector('.hz__cut');
    const texts = [...svg.querySelectorAll('.hz__cut-text')];
    const layout = () => {
      const W = svg.clientWidth;
      const H = svg.clientHeight;
      if (!W || !H) return;
      texts.forEach((t) => t.setAttribute('font-size', '100'));
      const widest = Math.max(...texts.map((t) => t.getComputedTextLength()));
      const pad = mobile ? 32 : Math.max(64, W * 0.06);
      const fs = Math.min((100 * (W - pad)) / widest, (mobile ? 0.15 : 0.24) * H);
      const top = mobile ? H * 0.46 : H * 0.5 + 24; // iets onder het midden: de nav staat bovenin
      const b1 = top + (CAP * fs) / 2 - (LEADING * fs * (texts.length - 1)) / 2;
      texts.forEach((t, i) => {
        t.setAttribute('font-size', fs.toFixed(1));
        t.setAttribute('x', (W / 2).toFixed(1));
        t.setAttribute('y', (b1 + i * LEADING * fs).toFixed(1));
      });
      zoomAt.current = findZoomPoint(texts, fs, W, H);
    };
    layout();
    // Na het laden van Anton opnieuw opmaken en de scroll-tijdlijn het nieuwe zoompunt laten inlezen.
    document.fonts?.ready.then(() => {
      layout();
      ScrollTrigger.refresh();
    });
    window.addEventListener('resize', layout);
    return () => window.removeEventListener('resize', layout);
  }, [mobile]);

  useLayoutEffect(() => {
    const el = root.current;
    const stage = el.querySelector('.hz__stage');
    const cut = el.querySelector('.hz__cut');
    const zoomG = el.querySelector('.hz__cut-zoom');
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Intro: regels schuiven één voor één op, de kop komt licht ingezoomd binnen. Start na de preloader.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        intro.current = gsap
          .timeline({ paused: true })
          .from('.hz__cut-text', { y: 60, opacity: 0, duration: DUR.slow, ease: EASE.reveal, stagger: STAGGER.lines * 1.5 }, 0)
          // Wrapper, niet de video zelf: die schaalt al mee met de scroll-tijdlijn.
          .from('.hz__video', { scale: 1.25, duration: DUR.slow, ease: EASE.reveal }, 0)
          .from('.hz__fade', { autoAlpha: 0, y: 16, duration: DUR.slow, ease: EASE.reveal, stagger: STAGGER.lines }, 0.35);
        return () => {
          intro.current = null;
        };
      });

      mm.add(MQ.motionDesktop, () => {
        const sWords = gsap.utils.toArray('.hz__sw', el);
        // onUpdate: de knoppen faden nu op tijd, niet op scroll; de nav-check (hero-ctas) hoort het via dit event.
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.linear }, onUpdate: () => window.dispatchEvent(new Event('hero-scene')) });
        // Exponentieel schalen (ZOOM^p): elke stap even groot voor het oog, dus een constante vlucht door de letter.
        // Puur schalen rond het zoompunt, dat vrijwel op het schermmidden ligt: zo vlieg je recht vooruit.
        const fly = { p: 0 };
        const setScale = () => gsap.set(zoomG, { scale: ZOOM ** fly.p, svgOrigin: `${zoomAt.current.x} ${zoomAt.current.y}` });
        tl.fromTo(fly, { p: 0 }, { p: 1, duration: 1.3, ease: 'power2.inOut', onUpdate: setScale }, 0)
          .fromTo('.hz__vid', { scale: 1.12 }, { scale: 1, duration: 1.4, ease: EASE.reveal }, 0)
          .to('.hz__meta', { autoAlpha: 0, y: -16, duration: 0.3 }, 0)
          // Door de letter heen: het zwarte vlak valt weg, de video is schermvullend.
          .set(cut, { autoAlpha: 0 }, 1.3)
          .to('.hz__shade', { opacity: 1, duration: 0.4 }, 1.3)
          .set('.hz__statement', { autoAlpha: 1 }, 1.35)
          .to(sWords, { opacity: 1, duration: 0.25, stagger: 0.07 }, 1.4);
        const strikeAt = 1.4 + 0.07 * sWords.findIndex((w) => w.classList.contains('hz__struck')) + 0.25;
        tl.fromTo('.hz__strike', { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: EASE.move }, strikeAt)
          .to('.hz__struck', { opacity: 0.35, duration: 0.3 }, strikeAt + 0.3)
          .fromTo('.hz__foot', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.reveal }, '>-0.1');

        // Eén scroll is genoeg: de scène speelt op tijd af (zie playOnScroll), de pin houdt hem in beeld.
        ScrollTrigger.create({ trigger: stage, start: 'top top', end: '+=100%', pin: true, ...playOnScroll(tl) });
      });

      // Mobiel: het statement licht op en de streep tekent terwijl je erlangs scrolt.
      mm.add(MQ.motionMobile, () => {
        gsap.to('.hz__sw', { opacity: 1, stagger: 0.1, ease: EASE.linear, scrollTrigger: { trigger: '.hz__statement', start: 'top 80%', end: 'bottom 60%', scrub: true } });
        gsap.fromTo('.hz__strike', { scaleX: 0 }, { scaleX: 1, ease: EASE.linear, scrollTrigger: { trigger: '.hz__struck', start: 'top 75%', end: 'top 55%', scrub: true } });
      });
    }, el);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  // Zolang de knoppen in de hero in beeld zijn, verbergt de nav zijn eigen knoppen: nooit twee keer dezelfde set.
  // Gecontroleerd op scroll (één keer per frame): in de gepinde hero blijven de knoppen in beeld maar faden ze weg.
  useLayoutEffect(() => {
    const meta = root.current.querySelector('.hz__meta');
    const html = document.documentElement;
    let queued = false;
    const update = () => {
      queued = false;
      const r = meta.getBoundingClientRect();
      const cs = getComputedStyle(meta);
      const visible = r.top < window.innerHeight && r.bottom > 0 && cs.visibility !== 'hidden' && +cs.opacity > 0.5;
      html.classList.toggle('hero-ctas', visible);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    // De scrub ijlt na: na het laatste scroll-event nog even blijven controleren tot de fade stilstaat.
    let settle = 0;
    const onScrollEnd = () => {
      clearInterval(settle);
      let n = 0;
      settle = setInterval(() => {
        update();
        if (++n > 12) clearInterval(settle);
      }, 100);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hero-scene', onScroll);
    ScrollTrigger.addEventListener('scrollEnd', onScrollEnd);
    return () => {
      clearInterval(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hero-scene', onScroll);
      ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd);
      html.classList.remove('hero-ctas');
    };
  }, []);

  // Intro afspelen zodra de preloader de lens opent (of direct bij een volgend bezoek in deze sessie).
  useLayoutEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section ref={root} className="s-hero hz" aria-labelledby="hero-title">
      <div className="hz__stage">
        <div className="hz__screen">
          {/* De video opent de reel (cursor "play"); de knop onderin doet hetzelfde voor toetsenbord en touch. */}
          <div className="hz__video" data-cursor="play" onClick={openReel}>
            <LoopVideo slot="heroReel" className="hz__vid" eager label="hero-reel" />
          </div>
          <h1 id="hero-title" className="sr-only">
            {HERO.claim.join(' ')}
          </h1>
          <svg className="hz__cut" aria-hidden="true">
            <defs>
              <mask id="hz-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                <rect width="100%" height="100%" fill="#fff" />
                <g className="hz__cut-zoom">
                  {rows.map((r) => (
                    <text key={r} className="hz__cut-text" textAnchor="middle" fill="#000">
                      {r}
                    </text>
                  ))}
                </g>
              </mask>
            </defs>
            <rect width="100%" height="100%" className="hz__cut-plate" mask="url(#hz-cut)" />
          </svg>
          <div className="hz__shade" />
        </div>

        <div className="hz__meta container">
          <p className="lead hz__sub hz__fade">{HERO.sub}</p>
          <div className="hz__ctas hz__fade">
            <button type="button" className="btn btn--primary" onClick={openReel}>
              <svg className="btn__icon" viewBox="0 0 10 12" aria-hidden="true">
                <path d="M0 0l10 6-10 6z" fill="currentColor" />
              </svg>
              {HERO.primary}
            </button>
            <ApertureLink to="/contact" className="btn">
              {HERO.secondary}
            </ApertureLink>
          </div>
        </div>

        <div className="hz__statement container">
          <h2 className="display hz__rows">
            {MANIFEST.rows.map((row, i) => (
              <span key={i} className="hz__srow">
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
            <p className="display hz__punch">{MANIFEST.accent}</p>
            <p className="lead hz__body">{MANIFEST.body}</p>
            {/* Aan het eind van de zoom staat de reel schermvullend: hier door naar de volledige versie. */}
            <button type="button" className="btn hz__full" onClick={openReel}>
              <svg className="btn__icon" viewBox="0 0 10 12" aria-hidden="true">
                <path d="M0 0l10 6-10 6z" fill="currentColor" />
              </svg>
              {HERO.fullReel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
