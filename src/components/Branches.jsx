import { useEffect, useRef } from 'react';
import { rafThrottle } from '../utils/interactions.js';

import imgHoreca from '../assets/images/proj-boterlap-in-de-keuken.jpg';
import imgIndustrie from '../assets/images/proj-reym-een-dag-uit-het-leven-van-juri.jpg';
import imgSport from '../assets/images/proj-one-love-cruise.jpg';
import imgMuziek from '../assets/images/proj-rodeo-film-bandshoot.jpg';
import imgCorporate from '../assets/images/proj-block-corporate.jpg';
import imgRetail from '../assets/images/proj-stelz-hard-drinks-launch.jpg';
import imgCreators from '../assets/images/proj-social-content-behind-the-scenes.jpg';

const BRANCHES = [
  { name: 'Horeca', img: imgHoreca, desc: 'Van intieme eetcafés tot drukke horecazaken — wij vangen de sfeer die gasten laat terugkomen.' },
  { name: 'Industrie & Techniek', img: imgIndustrie, desc: 'Technisch, precies en met karakter — wij laten zien wat er achter de schermen gebeurt.' },
  { name: 'Sport & Events', img: imgSport, desc: 'Energie, publiek en het moment zelf — vastgelegd zoals het voelde, niet alleen zoals het eruitzag.' },
  { name: 'Muziek & Entertainment', img: imgMuziek, desc: 'Beeld op het ritme van geluid — content die net zo hard raakt als de act zelf.' },
  { name: 'Corporate & Zakelijk', img: imgCorporate, desc: 'Helder, geloofwaardig en zonder poeha — wij vertalen strategie naar beeld dat overtuigt.' },
  { name: 'Retail & FMCG', img: imgRetail, desc: 'Van schap tot scherm — wij maken content die een product meteen begeerlijk maakt.' },
  { name: 'Creators & Social', img: imgCreators, desc: 'Kort, raak en gemaakt voor de scroll — content die stopt met scrollen.' },
];

const ITEM_SPACING_PX = 172;

export default function Branches() {
  const sectionRef = useRef(null);
  const arcRef = useRef(null);
  const outlineRef = useRef(null);
  const imageRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const items = arcRef.current ? [...arcRef.current.children] : [];
    const outlineItems = outlineRef.current ? [...outlineRef.current.children] : [];

    const render = () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const scrollable = sectionEl.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      const wheelPos = progress * (items.length - 1);

      const vw = window.innerWidth, vh = window.innerHeight;
      const R = 860;
      const stepDeg = (ITEM_SPACING_PX / R) * (180 / Math.PI);
      const targetX = vw * 0.09;
      const targetY = vh * 0.66;
      const cx = targetX - R;
      const cy = targetY;

      const nearestI = Math.max(0, Math.min(items.length - 1, Math.round(wheelPos)));

      items.forEach((item, i) => {
        const indexDist = Math.abs(i - wheelPos);
        const angleDeg = (i - wheelPos) * stepDeg;
        const angleRad = angleDeg * Math.PI / 180;
        const x = cx + R * Math.cos(angleRad);
        const y = cy + R * Math.sin(angleRad);
        const opacity = Math.max(1 - indexDist * 0.3, 0.1);
        const t = `translate(${x}px, ${y}px) translate(0, -50%) rotate(${angleDeg.toFixed(2)}deg)`;
        item.style.transform = t;
        item.style.transformOrigin = '0 50%';
        item.style.opacity = opacity.toFixed(3);
        item.style.color = '#F5F3F1';

        const outlineItem = outlineItems[i];
        if (outlineItem) {
          outlineItem.style.transform = t;
          outlineItem.style.transformOrigin = '0 50%';
          outlineItem.style.opacity = i === nearestI ? '1' : '0';
        }
      });

      if (imageRef.current) {
        const src = BRANCHES[nearestI].img;
        if (imageRef.current.dataset.i !== String(nearestI)) {
          imageRef.current.dataset.i = String(nearestI);
          imageRef.current.style.opacity = '0';
          imageRef.current.src = src;
          imageRef.current.alt = BRANCHES[nearestI].name;
          requestAnimationFrame(() => { if (imageRef.current) imageRef.current.style.opacity = '1'; });
        }
        if (descRef.current) {
          descRef.current.textContent = BRANCHES[nearestI].desc;
        }
      }
    };

    const throttled = rafThrottle(render);
    render();
    window.addEventListener('resize', throttled);
    window.addEventListener('scroll', throttled, { passive: true });
    return () => {
      window.removeEventListener('resize', throttled);
      window.removeEventListener('scroll', throttled);
    };
  }, []);

  const arcItemStyle = {
    position: 'absolute', left: 0, top: 0, fontFamily: "'Anton',sans-serif", fontSize: 'clamp(34px,5vw,74px)',
    color: '#F5F3F1', whiteSpace: 'nowrap', willChange: 'transform,opacity,filter',
  };
  const outlineItemStyle = {
    position: 'absolute', left: 0, top: 0, fontFamily: "'Anton',sans-serif", fontSize: 'clamp(34px,5vw,74px)',
    color: 'transparent', whiteSpace: 'nowrap', willChange: 'transform,opacity',
    WebkitTextStroke: '5px #F5F3F1', paintOrder: 'stroke', textShadow: '0 0 0 #F5F3F1, 0 0 10px rgba(245,243,241,0.4)',
  };

  return (
    <div ref={sectionRef} style={{ position: 'relative', height: '350vh', background: '#0b0908' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', right: 'clamp(24px,5vw,72px)', transform: 'translateY(-50%)', zIndex: 3, maxWidth: 360, textAlign: 'left' }}>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(28px,3.4vw,44px)', color: '#F5F3F1', margin: '0 0 20px' }}>ACTIEF IN ELKE BRANCHE</h2>
          <p ref={descRef} style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15, color: '#a8a19d', lineHeight: 1.7, maxWidth: '34ch', margin: 0, minHeight: '4.2em' }}>
            {BRANCHES[0].desc}
          </p>
        </div>

        <div ref={arcRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {BRANCHES.map((b) => (
            <div key={b.name} className="branche-arc-item" style={arcItemStyle}>{b.name}</div>
          ))}
        </div>

        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(30vw,360px)', aspectRatio: '4/5', zIndex: 2, borderRadius: 4, overflow: 'hidden', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)' }}>
          <img ref={imageRef} alt={BRANCHES[0].name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0, transition: 'opacity .4s ease' }} />
        </div>

        <div ref={outlineRef} style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
          {BRANCHES.map((b) => (
            <div key={b.name} className="branche-outline-item" style={outlineItemStyle}>{b.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
