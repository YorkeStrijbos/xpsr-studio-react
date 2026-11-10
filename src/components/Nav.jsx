import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ApertureLink } from './Aperture.jsx';
import { useOpenReel } from './Reel.jsx';
import { MiniViewfinder } from './Viewfinder.jsx';
import { lockScroll } from '../lib/scroll.js';
import { DUR, EASE, STAGGER, gsap, prefersReducedMotion } from '../lib/motion.js';
import { hexClipPath } from '../motion/iris.js';
import '../styles/nav.css';

const LINKS = [
  { to: '/cases', label: 'Cases' },
  { to: '/over-ons', label: 'Over ons' },
  { to: '/contact', label: 'Contact' },
];

function PlayIcon() {
  return (
    <svg className="btn__icon" viewBox="0 0 10 12" aria-hidden="true">
      <path d="M0 0l10 6-10 6z" fill="currentColor" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wordmark__main">XPSR</span>
      <span className="wordmark__sub">Studio</span>
    </span>
  );
}

export default function Nav() {
  const openReel = useOpenReel();
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  // Verbergen bij omlaag scrollen, terug bij omhoog. Lenis scrolt het venster zelf, dus het scroll-event volstaat.
  // Drempel van 6 px tegen trillen; de eerste 120 px blijft hij altijd staan.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      const d = y - last;
      if (Math.abs(d) < 6) return;
      setHidden(d > 0 && y > 120);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu sluit bij navigatie.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    // Menu opent als een diafragma: zeshoekig gat dat groeit tot volledig scherm.
    if (!prefersReducedMotion()) {
      const st = { r: 0 };
      gsap.to(st, {
        r: 95,
        duration: DUR.slow,
        ease: EASE.reveal,
        onUpdate: () => menuRef.current && (menuRef.current.style.clipPath = hexClipPath(st.r, (1 - st.r / 95) * 60)),
        onComplete: () => menuRef.current && (menuRef.current.style.clipPath = 'none'),
      });
      gsap.from(menuRef.current.querySelectorAll('.menu__link'), { yPercent: 100, autoAlpha: 0, stagger: STAGGER.items, duration: DUR.base, ease: EASE.reveal, delay: 0.15 });
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`nav ${solid || menuOpen ? 'is-solid' : ''} ${menuOpen ? 'is-menu' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''}`}
      // Toetsenbord: focus in de nav haalt hem altijd terug.
      onFocus={() => setHidden(false)}
    >
      <div className="nav__inner container">
        <ApertureLink to="/" className="nav__logo" aria-label="XPSR Studio, naar home">
          {/* Op home start het grote vizier hier naast het logo; elders staat het mini-vizier. */}
          {pathname !== '/' && <MiniViewfinder />}
          <Wordmark />
        </ApertureLink>

        <nav className="nav__links" aria-label="Hoofdmenu">
          {LINKS.map((l) => (
            <ApertureLink
              key={l.to}
              to={l.to}
              className={`nav__link ${pathname.startsWith(l.to) ? 'is-active' : ''}`}
              aria-current={pathname.startsWith(l.to) ? 'page' : undefined}
            >
              {l.label}
            </ApertureLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button type="button" className="btn nav__reel" onClick={openReel}>
            <PlayIcon /> Reel
          </button>
          <ApertureLink to="/contact" className="btn btn--primary nav__cta">
            Plan een draaidag
          </ApertureLink>
          <button
            ref={toggleRef}
            type="button"
            className={`nav__toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div ref={menuRef} id="mobile-menu" className={`menu ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        <nav className="menu__links container" aria-label="Mobiel menu">
          <ApertureLink to="/" className="menu__link display">Home</ApertureLink>
          {LINKS.map((l) => (
            <ApertureLink key={l.to} to={l.to} className="menu__link display">
              {l.label}
            </ApertureLink>
          ))}
          <div className="menu__actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setMenuOpen(false);
                openReel();
              }}
            >
              <PlayIcon /> Reel
            </button>
            <ApertureLink to="/contact" className="btn btn--primary">
              Plan een draaidag
            </ApertureLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
