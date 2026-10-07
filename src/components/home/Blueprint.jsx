import { useLayoutEffect, useRef, useState } from 'react';
import { StencilPlaceholder } from '../Industrial.jsx';
import { LoopVideo } from '../Media.jsx';
import PinItem from './PinItem.jsx';
import { PIN_ITEMS, SERVICES } from '../../data/site.js';
import { Draggable, gsap, prefersReducedMotion } from '../../lib/motion.js';

const VW = 1600;
const VH = 900;
const CX = 800;
const CY = 450;
const RX = 450;
const RY = 300;
const IN_RX = 320;
const IN_RY = 215;
const ANGLES = [-150, -90, -30, 30, 90, 150]; // per dienst A-01 t/m A-06

const NODES = ANGLES.map((a) => {
  const r = (a * Math.PI) / 180;
  return { x: CX + RX * Math.cos(r), y: CY + RY * Math.sin(r), a: r };
});

// Welk camera-onderdeel bij welke dienst hoort (zie brief): licht rood op als die dienst actief is.
const PART_OF = ['body', 'lens', 'mic', 'flash', 'drone', 'screen'];

/**
 * Technische tekening van een cinema-camera in zijaanzicht (lens links), met de zes onderdelen die bij de diensten horen.
 * Alle lijnen hebben pathLength=1 zodat ze zichzelf kunnen tekenen. Geschaald en gecentreerd rond (CX, CY).
 */
function Camera() {
  const L = (p) => <path className="bp__line" pathLength="1" {...p} />;
  const C = (p) => <circle className="bp__line" pathLength="1" {...p} />;
  // Afgeronde rechthoek als <path>: <rect> met pathLength tekent in Chrome niet altijd helemaal dicht.
  const R = (p) => {
    const [x, y, w, h] = [p.x, p.y, p.width, p.height].map(Number);
    const r = Math.min(Number(p.rx ?? 0), w / 2, h / 2);
    const d = `M${x + r} ${y}H${x + w - r}${r ? `A${r} ${r} 0 0 1 ${x + w} ${y + r}` : ''}V${y + h - r}${r ? `A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` : ''}H${x + r}${r ? `A${r} ${r} 0 0 1 ${x} ${y + h - r}` : ''}V${y + r}${r ? `A${r} ${r} 0 0 1 ${x + r} ${y}` : ''}Z`;
    return <path className="bp__line" pathLength="1" d={d} />;
  };
  const ridges = Array.from({ length: 14 }, (_, i) => 540 + i * 6);
  return (
    <g transform="translate(800 450) scale(0.86) translate(-757 -405)">
      {/* Body (Recruitmentfilm): behuizing, ventilatie, knoppen, viewfinder, accu, baseplate en rods */}
      <g data-part="body">
        <R x="700" y="380" width="240" height="180" rx="10" />
        <R x="716" y="396" width="120" height="70" rx="4" />
        <L d="M860 400v52M870 400v52M880 400v52M890 400v52M900 400v52M910 400v52" />
        <C cx="740" cy="500" r="9" />
        <C cx="770" cy="500" r="9" />
        <C cx="800" cy="500" r="9" />
        <C cx="905" cy="510" r="16" />
        <C cx="905" cy="510" r="7" />
        <R x="716" y="530" width="70" height="14" rx="3" />
        <R x="940" y="388" width="34" height="30" rx="4" />
        <R x="974" y="384" width="26" height="38" rx="10" />
        <R x="940" y="430" width="44" height="116" rx="6" />
        <L d="M950 448h24M950 462h24M950 476h24" />
        <C cx="962" cy="528" r="3" />
        <C cx="972" cy="528" r="3" />
        <R x="700" y="560" width="260" height="14" rx="3" />
        <L d="M600 586H990M600 598H990" />
        <R x="640" y="580" width="22" height="24" rx="3" />
        <R x="930" y="580" width="22" height="24" rx="3" />
        <L d="M760 574l-10 30h140l-10-30" />
      </g>
      {/* Lens (Bedrijfsfilm): mount, tubus met focusring, opdruk, zonnekap */}
      <g data-part="lens">
        <R x="682" y="398" width="18" height="144" rx="3" />
        <R x="490" y="406" width="192" height="128" rx="6" />
        <L d={ridges.map((x) => `M${x} 412v116`).join('')} />
        <L d="M626 406v128M650 406v128" />
        <L d="M500 470h28" />
        <text x="634" y="476" className="bp__lens-text" transform="rotate(-90 634 476)">24-70 f/2.8</text>
        <L d="M490 400l-60 -18v176l60 -18" />
        <L d="M440 392v156" />
      </g>
      {/* Microfoon (Explainer / productfilm): shotgun-mic in houder op de greep */}
      <g data-part="mic">
        <R x="500" y="286" width="230" height="24" rx="12" />
        <L d="M530 290v16M550 290v16M570 290v16M590 290v16M610 290v16M630 290v16" />
        <R x="660" y="282" width="16" height="32" rx="3" />
        <R x="700" y="282" width="16" height="32" rx="3" />
        <L d="M680 314v14h32v-14" />
      </g>
      {/* Greep met flitsschoen en flitser (Fotografie) */}
      <g data-part="flash">
        <L d="M730 380v-44M900 380v-44" />
        <R x="700" y="318" width="260" height="20" rx="10" />
        <R x="808" y="306" width="44" height="12" rx="2" />
        <R x="812" y="252" width="36" height="54" rx="4" />
        <R x="800" y="222" width="60" height="32" rx="4" />
        <L d="M808 230h44M808 238h44M808 246h44" />
      </g>
      {/* Zijmonitor op arm (Social content) */}
      <g data-part="screen">
        <L d="M960 328h18l14 -16" />
        <R x="990" y="270" width="118" height="78" rx="6" />
        <R x="1000" y="280" width="98" height="58" rx="2" />
        <L d="M1000 330l26 -22 18 14 22 -26 32 34" />
      </g>
      {/* Drone (Drone): zweeft naast de camera, zijaanzicht met rotoren, poten en gimbal */}
      <g data-part="drone">
        <R x="530" y="214" width="62" height="20" rx="8" />
        <L d="M530 222H486M592 222H636" />
        <R x="480" y="208" width="12" height="16" rx="2" />
        <R x="630" y="208" width="12" height="16" rx="2" />
        <L d="M452 206h68M602 206h68" />
        <L d="M546 234l-10 22h-10M576 234l10 22h10" />
        <C cx="561" cy="244" r="7" />
      </g>
    </g>
  );
}

/** Spaak van de binnen-ellips naar het knooppunt van een dienst, met maatstreepjes. */
function spoke(n) {
  const sx = CX + IN_RX * Math.cos(n.a);
  const sy = CY + IN_RY * Math.sin(n.a);
  const ex = n.x - 36 * Math.cos(n.a);
  const ey = n.y - 36 * Math.sin(n.a);
  const tx = -Math.sin(n.a) * 8;
  const ty = Math.cos(n.a) * 8;
  return `M${sx} ${sy}L${ex} ${ey}M${sx + tx} ${sy + ty}L${sx - tx} ${sy - ty}M${ex + tx} ${ey + ty}L${ex - tx} ${ey - ty}`;
}

/** Doorhangende draad (kwadratische boog) van punaise naar knooppunt. */
function stringPath(x1, y1, x2, y2, sag = 40) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
}

function Lightbox({ service, onClose }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const d = ref.current;
    if (service != null && !d.open) d.showModal();
    if (service == null && d.open) d.close();
  }, [service]);
  const s = service != null ? SERVICES[service] : null;
  return (
    <dialog ref={ref} className="bp__lightbox" onClose={onClose} onClick={(e) => e.target === ref.current && ref.current.close()} aria-label={s ? s.title : 'Dienst'}>
      {s && (
        <div className="bp__lightbox-in">
          <div className="bp__lightbox-media">
            {s.code === 'A-01' ? (
              <LoopVideo name="loop-reym-juri" className="bp__lightbox-video" eager label="recruitmentfilm REYM" />
            ) : (
              // TODO XPSR: per dienst de echte loop aanleveren.
              <StencilPlaceholder label="Loop volgt" sub={`${s.code} / ${s.title}`} />
            )}
          </div>
          <p className="mono label--red">{s.code}</p>
          <p className="display bp__lightbox-title">{s.title}</p>
          <p>{s.line}</p>
          <button type="button" className="btn" onClick={() => ref.current.close()}>
            Sluiten
          </button>
        </div>
      )}
    </dialog>
  );
}

/*
 * Fase 01 / Plan. Blauwdruk met prikbord: het web met de camera in het midden en de zes diensten eromheen,
 * en rond het web de muur van een productiehuis tijdens de voorbereiding.
 * Gepind: blauwdruk tekent zichzelf; per dienst zoomt de pagina licht in, vallen de items op de muur,
 * gaat de punaise erin en trekt de rode draad naar het web. Daarna: alles in beeld, stempel GOEDGEKEURD.
 * Na de pin: hover licht de draad op, klik op een polaroid opent een lightbox, items zijn sleepbaar.
 */
export default function Blueprint() {
  const root = useRef(null);
  const [lightbox, setLightbox] = useState(null);

  useLayoutEffect(() => {
    const el = root.current;
    const stage = el.querySelector('.bp__stage');
    const stringsSvg = el.querySelector('.bp__strings');
    const items = gsap.utils.toArray('.bp__stage .pin', el);
    const nodeEls = gsap.utils.toArray('.bp__node', el);
    // Scheefstand via GSAP (niet via CSS rotate), zodat het niet botst met de val-animatie en het slepen.
    gsap.set(items, { rotate: (i, it) => Number(it.dataset.rot) });

    // Draden: punaise (bovenmidden van het item) naar het knooppunt van de dienst, in stage-pixels.
    const geo = { nodes: [] };
    const measure = () => {
      const prev = gsap.getProperty(stage, 'scale');
      gsap.set(stage, { scale: 1 });
      const sr = stage.getBoundingClientRect();
      geo.nodes = nodeEls.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 };
      });
      stringsSvg.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
      items.forEach((it) => drawString(it));
      gsap.set(stage, { scale: prev });
    };
    const drawString = (it) => {
      const s = it.dataset.service;
      if (s === '') return;
      const path = stringsSvg.querySelector(`[data-for="${it.dataset.index}"]`);
      const n = geo.nodes[Number(s)];
      if (!path || !n) return;
      const x = it.offsetLeft + it.offsetWidth / 2 + (gsap.getProperty(it, 'x') || 0);
      const y = it.offsetTop + 6 + (gsap.getProperty(it, 'y') || 0);
      path.setAttribute('d', stringPath(x, y, n.x, n.y, 40));
    };
    measure();
    window.addEventListener('resize', measure);

    // Hover: item naar voren, draad en spaak van die dienst rood.
    const enter = (e) => {
      const s = e.currentTarget.dataset.service;
      if (s !== '') el.dataset.active = s;
    };
    const leave = () => delete el.dataset.active;
    const click = (e) => {
      const it = e.currentTarget;
      if (it.classList.contains('pin--polaroid') && it.dataset.service !== '' && !it.dataset.dragged) setLightbox(Number(it.dataset.service));
      delete it.dataset.dragged;
    };
    items.forEach((it) => {
      it.addEventListener('pointerenter', enter);
      it.addEventListener('pointerleave', leave);
      it.addEventListener('click', click);
    });

    const reduced = prefersReducedMotion();
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (reduced) return;
      mm.add('(min-width: 860px)', () => {
        const sheet = el.querySelector('.bp__sheet');
        gsap.set(items, { autoAlpha: 0 });
        gsap.set('.bp__string', { strokeDashoffset: 1 });
        gsap.set('.bp__stamp', { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=260%', pin: true, scrub: 1, invalidateOnRefresh: true, onRefresh: measure },
        });
        tl.set(el, { '--curve': '0vh' }, 0) // tijdens de pin altijd vlak
          .fromTo('.bp__line, .bp__helper', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.004 }, 0)
          .set(items.filter((it) => it.dataset.service === ''), { autoAlpha: 1 });

        SERVICES.forEach((s, i) => {
          const own = items.filter((it) => it.dataset.service === String(i));
          const strings = own.map((it) => stringsSvg.querySelector(`[data-for="${it.dataset.index}"]`)).filter(Boolean);
          const n = NODES[i];
          const origin = `${(n.x / VW) * 100}% ${(n.y / VH) * 100}%`;
          tl.to(stage, { scale: 1.6, transformOrigin: origin, duration: 0.4, ease: 'power2.inOut' })
            .set(el, { attr: { 'data-step': String(i) } }, '<0.2')
            .set(sheet, { textContent: `0${i + 1}/06` }, '<')
            .fromTo(
              own,
              { y: -140, rotate: () => gsap.utils.random(-25, 25), autoAlpha: 0 },
              { y: 0, rotate: (k, it) => Number(it.dataset.rot), autoAlpha: 1, stagger: 0.08, duration: 0.3, ease: 'back.out(2)' },
            )
            .fromTo(own.map((it) => it.querySelector('.pin__pin, .pin__tape')).filter(Boolean), { scale: 1.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.08, duration: 0.15 }, '-=0.1')
            .to(strings, { strokeDashoffset: 0, duration: 0.25 }, '<')
            .to({}, { duration: 0.25 })
            .to(stage, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
        });
        tl.set(el, { attr: { 'data-step': '' } })
          .fromTo('.bp__stamp', { scale: 2.4, rotate: -18, autoAlpha: 0 }, { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.2, ease: 'power4.in' })
          .to({}, { duration: 0.3 });

        // Na de pin: items slepen, draden rekken mee. Loslaten: item blijft liggen.
        const drags = items.map((it) =>
          Draggable.create(it, {
            onDrag: () => drawString(it),
            onDragStart: () => (it.dataset.dragged = '1'),
            zIndexBoost: true,
          })[0],
        );
        return () => drags.forEach((d) => d.kill());
      });

      mm.add('(max-width: 859px)', () => {
        gsap.fromTo('.bp__line, .bp__helper', { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.bp__web', start: 'top 85%', end: 'bottom 40%', scrub: true },
        });
        gsap.utils.toArray('.bp__card', el).forEach((card) => {
          gsap.from(card.querySelectorAll('.pin'), {
            y: -60,
            autoAlpha: 0,
            rotate: () => gsap.utils.random(-15, 15),
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: card, start: 'top 75%' },
          });
        });
      });
    }, el);

    return () => {
      window.removeEventListener('resize', measure);
      items.forEach((it) => {
        it.removeEventListener('pointerenter', enter);
        it.removeEventListener('pointerleave', leave);
        it.removeEventListener('click', click);
      });
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-blueprint bp" aria-labelledby="bp-title">
      <div className="bp__stage">
        <svg className="bp__web" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <ellipse className="bp__helper" pathLength="1" cx={CX} cy={CY} rx={IN_RX} ry={IN_RY} />
          <ellipse className="bp__faint" cx={CX} cy={CY} rx={RX} ry={RY} />
          <Camera />
          {NODES.map((n, i) => (
            <g key={i} className="bp__svc" data-svc={i} data-part={PART_OF[i]}>
              <path className="bp__line bp__spoke" pathLength="1" d={spoke(n)} />
              <circle className="bp__node" cx={n.x} cy={n.y} r="30" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" className="bp__code">
                {SERVICES[i].code}
              </text>
              <text
                x={n.x + (Math.cos(n.a) >= 0 ? 44 : -44)}
                y={n.y + (Math.abs(Math.cos(n.a)) < 0.2 ? (Math.sin(n.a) < 0 ? -44 : 56) : 6)}
                textAnchor={Math.abs(Math.cos(n.a)) < 0.2 ? 'middle' : Math.cos(n.a) > 0 ? 'start' : 'end'}
                className="bp__svc-title"
              >
                {SERVICES[i].title}
              </text>
            </g>
          ))}
        </svg>

        {/* Rode draden: boven het web, onder de items. */}
        <svg className="bp__strings" aria-hidden="true">
          {PIN_ITEMS.map((it, i) => (it.s == null ? null : <path key={i} className="bp__string" data-for={i} data-svc={it.s} pathLength="1" />))}
        </svg>

        <div className="bp__wall" aria-hidden="true">
          {PIN_ITEMS.map((it, i) => (
            <PinItem key={i} it={it} index={i} />
          ))}
        </div>
      </div>

      <header className="bp__head container">
        <span className="mono phase-slot">Fase 01 / Plan</span>
        <h2 id="bp-title" className="display bp__h">
          Eén draaidag. Zes opbrengsten.
        </h2>
      </header>

      {/* Tekeninghoofd in witte lijnen, met stempel. */}
      <div className="bp__tb-wrap" aria-hidden="true">
        <dl className="bp__titleblock mono">
          <div>
            <dt>Project</dt>
            <dd>Jouw bedrijf</dd>
          </div>
          <div>
            <dt>Schaal</dt>
            <dd>1:1</dd>
          </div>
          <div>
            <dt>Getekend</dt>
            <dd>XPSR Studio</dd>
          </div>
          <div>
            <dt>Blad</dt>
            <dd className="bp__sheet">00/06</dd>
          </div>
          <div>
            <dt>Rev</dt>
            <dd>A</dd>
          </div>
        </dl>
        <p className="bp__stamp">Goedgekeurd</p>
      </div>

      {/* Diensten als kaarten met hun eigen collage: zichtbaar op mobiel, leesbaar voor screenreaders. */}
      <ol className="bp__cards container">
        {SERVICES.map((s, i) => (
          <li key={s.code} className="bp__card">
            <div className="bp__card-wall" aria-hidden="true">
              {PIN_ITEMS.filter((it) => it.s === i)
                .slice(0, 3)
                .map((it, k) => (
                  <PinItem key={k} it={it} index={`m${i}${k}`} positioned={false} />
                ))}
            </div>
            <span className="mono">{s.code}</span>
            <span className="bp__card-title">{s.title}</span>
            <span className="bp__card-line">{s.line}</span>
          </li>
        ))}
      </ol>

      <Lightbox service={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
