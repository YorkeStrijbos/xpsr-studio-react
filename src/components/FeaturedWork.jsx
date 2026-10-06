import { useEffect, useRef } from 'react';
import { useProjectLabel } from '../context/ProjectLabelContext.jsx';
import { prefersReducedMotion, rafThrottle } from '../utils/interactions.js';

import imgReymJuri from '../assets/images/proj-reym-een-dag-uit-het-leven-van-juri.jpg';
import imgStudioPortret from '../assets/images/proj-studio-portret.jpg';
import imgRodeoBandshoot from '../assets/images/proj-rodeo-film-bandshoot.jpg';
import imgBoterlapKeuken from '../assets/images/proj-boterlap-in-de-keuken.jpg';
import imgBlockCorporate from '../assets/images/proj-block-corporate.jpg';
import imgZwarteBoer from '../assets/images/proj-zwarte-boer-foodstyling.jpg';
import imgOneLoveCruise from '../assets/images/proj-one-love-cruise.jpg';
import imgStelz from '../assets/images/proj-stelz-hard-drinks-launch.jpg';
import imgRoselBroodjeszaak from '../assets/images/proj-rosel-de-lekkerste-broodjeszaak-van-amsterdam.jpg';
import imgBijRosa from '../assets/images/proj-bij-rosa.jpg';
import imgBoterlapGerechten from '../assets/images/proj-boterlap-gerechten.jpg';
import imgSocialBts from '../assets/images/proj-social-content-behind-the-scenes.jpg';
import imgRoselBts from '../assets/images/proj-rosel-bts.jpg';
import imgShowreel from '../assets/images/proj-showreel-2026.jpg';
import imgBoterlap from '../assets/images/proj-boterlap.jpg';
import imgReymLocatie from '../assets/images/proj-reym-locatie.jpg';

const LANES = [
  {
    marginTop: 40,
    speed: 0.03,
    tiles: [
      { label: 'REYM — Een dag uit het leven van Juri', aspect: '3/4', img: imgReymJuri },
      { label: 'Studio portret', aspect: '4/5', img: imgStudioPortret },
      { label: 'Rodeo Film — Bandshoot', aspect: '4/5', img: imgRodeoBandshoot },
      { label: 'Boterlap — In de keuken', aspect: '1/1', img: imgBoterlapKeuken },
    ],
  },
  {
    marginTop: 200,
    speed: -0.045,
    tiles: [
      { label: 'Block — Corporate', aspect: '3/4', img: imgBlockCorporate },
      { label: 'Zwarte Boer — Foodstyling', aspect: '3/2', img: imgZwarteBoer },
      { label: 'One Love Cruise', aspect: '4/5', img: imgOneLoveCruise },
      { label: 'Stëlz Hard Drinks — Launch', aspect: '3/2', img: imgStelz },
    ],
  },
  {
    marginTop: -20,
    speed: 0.055,
    tiles: [
      { label: 'ROSÈL — De lekkerste broodjeszaak van Amsterdam', aspect: '4/3', img: imgRoselBroodjeszaak },
      { label: 'Bij Rosa', aspect: '4/5', img: imgBijRosa },
      { label: 'Boterlap — Gerechten', aspect: '16/9', img: imgBoterlapGerechten },
      { label: 'Social Content — Behind the Scenes', aspect: '3/2', img: imgSocialBts },
    ],
  },
  {
    marginTop: 120,
    speed: -0.035,
    tiles: [
      { label: 'Rosèl — BTS', aspect: '4/5', img: imgRoselBts },
      { label: 'Showreel 2026', aspect: '3/2', img: imgShowreel },
      { label: 'Boterlap', aspect: '4/5', img: imgBoterlap },
      { label: 'REYM — Locatie', aspect: '1/1', img: imgReymLocatie },
    ],
  },
];

function Tile({ tile, onEnter, onMove, onLeave }) {
  return (
    <div
      className="proj-tile"
      data-label={tile.label}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ position: 'relative', overflow: 'hidden', aspectRatio: tile.aspect }}
    >
      <img src={tile.img} alt={tile.label} draggable="false" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
    </div>
  );
}

export default function FeaturedWork() {
  const { show, move, hide } = useProjectLabel();

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const laneRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const laneEls = useRef([]);
  const offset = useRef(0);
  const setWidth = useRef(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startOffset = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const clones = [];
    const originals = [...track.children];
    originals.forEach((lane, i) => laneEls.current.push({ el: lane, speed: LANES[i].speed }));
    originals.forEach((lane, i) => {
      const clone = lane.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
      clones.push(clone);
      laneEls.current.push({ el: clone, speed: LANES[i].speed });
    });

    const wrapOffset = () => {
      const w = setWidth.current;
      if (!w) return;
      while (offset.current <= -w) offset.current += w;
      while (offset.current > 0) offset.current -= w;
    };
    const renderOffset = () => {
      if (trackRef.current) trackRef.current.style.transform = `translateX(${offset.current}px)`;
    };
    const measureTrack = () => {
      if (!trackRef.current) return;
      setWidth.current = trackRef.current.scrollWidth / 2;
      wrapOffset();
      renderOffset();
    };
    const measureNatural = () => {
      laneEls.current.forEach((o) => {
        const prevT = o.el.style.transform;
        o.el.style.transform = 'none';
        const r = o.el.getBoundingClientRect();
        o.naturalTop = r.top + window.scrollY;
        o.naturalHeight = r.height;
        o.el.style.transform = prevT;
      });
    };

    measureTrack();
    measureNatural();
    window.addEventListener('resize', measureTrack);
    window.addEventListener('load', measureTrack);
    window.addEventListener('resize', measureNatural);
    window.addEventListener('load', measureNatural);

    const imgLoadCleanups = [];
    [...track.querySelectorAll('img')].forEach((img) => {
      if (!img.complete) {
        const onLoad = () => { measureTrack(); measureNatural(); };
        img.addEventListener('load', onLoad, { once: true });
        imgLoadCleanups.push(() => img.removeEventListener('load', onLoad));
      }
    });

    const handleScroll = () => {
      if (prefersReducedMotion()) {
        laneEls.current.forEach((o) => { o.el.style.transform = 'translate3d(0, 0, 0)'; });
        return;
      }
      const scrolled = window.scrollY;
      laneEls.current.forEach((o) => {
        if (o.naturalTop == null) return;
        const top = o.naturalTop - scrolled;
        const centerOffset = top + o.naturalHeight / 2 - window.innerHeight / 2;
        const raw = -centerOffset * o.speed;
        const clamped = Math.max(-70, Math.min(70, raw));
        o.el.style.transform = `translate3d(0, ${clamped}px, 0)`;
      });
    };
    const throttledScroll = rafThrottle(handleScroll);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('resize', measureTrack);
      window.removeEventListener('load', measureTrack);
      window.removeEventListener('resize', measureNatural);
      window.removeEventListener('load', measureNatural);
      window.removeEventListener('scroll', throttledScroll);
      imgLoadCleanups.forEach((fn) => fn());
      clones.forEach((c) => c.remove());
      laneEls.current = [];
    };
  }, []);

  const wrapOffsetNow = () => {
    const w = setWidth.current;
    if (!w) return;
    while (offset.current <= -w) offset.current += w;
    while (offset.current > 0) offset.current -= w;
  };
  const renderOffsetNow = () => {
    if (trackRef.current) trackRef.current.style.transform = `translateX(${offset.current}px)`;
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startOffset.current = offset.current;
    if (viewportRef.current) {
      viewportRef.current.style.cursor = 'grabbing';
      viewportRef.current.setPointerCapture(e.pointerId);
    }
  };
  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    offset.current = startOffset.current + (e.clientX - startX.current);
    wrapOffsetNow();
    renderOffsetNow();
  };
  const handlePointerUp = () => {
    dragging.current = false;
    if (viewportRef.current) viewportRef.current.style.cursor = 'grab';
  };
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    offset.current -= e.deltaX;
    wrapOffsetNow();
    renderOffsetNow();
  };

  const handleTileEnter = (e) => show(e.currentTarget.dataset.label);
  const handleTileMove = (e) => move(e.clientX, e.clientY);
  const handleTileLeave = () => hide();

  return (
    <div style={{ padding: '110px 0 0', background: '#0b0908', overflow: 'hidden' }}>
      <div style={{ animation: 'revealUp 0.9s cubic-bezier(.16,1,.3,1) both', marginBottom: 40, padding: '0 48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(32px,4.2vw,58px)', color: '#F5F3F1', margin: 0 }}>RECENTE PROJECTEN</h2>
        </div>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a736f', whiteSpace: 'nowrap' }}>Sleep om te bladeren ↔</span>
      </div>

      <div style={{ animation: 'revealUp 0.9s cubic-bezier(.16,1,.3,1) both', padding: '0 0 160px', position: 'relative' }}>
        <div style={{ transform: 'rotate(-3deg)', transformOrigin: 'center' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 260, zIndex: 5, pointerEvents: 'none', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', maskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 100%)', background: 'linear-gradient(to bottom, #0b0908 0%, rgba(11,9,8,0.85) 35%, rgba(11,9,8,0) 100%)' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: 160, left: 0, right: 0, height: 260, zIndex: 5, pointerEvents: 'none', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)', background: 'linear-gradient(to top, #0b0908 0%, rgba(11,9,8,0.85) 35%, rgba(11,9,8,0) 100%)' }} />

          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
            style={{ overflow: 'hidden', cursor: 'grab', touchAction: 'pan-y', userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <div ref={trackRef} style={{ display: 'flex', gap: 0, width: 'max-content', padding: 0, willChange: 'transform' }}>
              {LANES.map((lane, i) => (
                <div key={i} ref={laneRefs[i]} style={{ display: 'flex', flexDirection: 'column', gap: 0, width: 'min(56vw,520px)', willChange: 'transform', marginTop: lane.marginTop }}>
                  {lane.tiles.map((tile) => (
                    <Tile key={tile.label} tile={tile} onEnter={handleTileEnter} onMove={handleTileMove} onLeave={handleTileLeave} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
