import { useRef, useState } from 'react';
import { ApertureLink, useAperture } from './Aperture.jsx';
import { CONTACT, FOOTER, TAGLINE } from '../data/site.js';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import '../styles/footer.css';

const RING = 'Druk hier voor een draaidag  •  Druk hier voor een draaidag  •  ';

/*
 * Afsluiter met noodstop. Klik: de knop drukt in, korte flits, het diafragma sluit en opent op de contactpagina.
 * Onderaan een gestencild XPSR, gespoten op beton.
 */
export default function Footer() {
  const { go } = useAperture();
  const flashRef = useRef(null);
  const [pressed, setPressed] = useState(false);
  const year = new Date().getFullYear();

  const press = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (pressed) return;
    setPressed(true);
    if (prefersReducedMotion() || document.hidden) {
      go('/contact');
      setPressed(false);
      return;
    }
    // Knop drukt in, korte flits, dan sluit het diafragma en opent de contactpagina.
    gsap
      .timeline({ onComplete: () => setPressed(false) })
      .to({}, { duration: 0.15 })
      .fromTo(flashRef.current, { autoAlpha: 0.8 }, { autoAlpha: 0, duration: 0.12 })
      .add(() => go('/contact'), '+=0.1');
  };

  return (
    <footer className="fa">
      <div className="fa__stage">
        <h2 className="display fa__ask">{FOOTER.ask}</h2>

        <a href="/contact" className={`estop ${pressed ? 'is-pressed' : ''}`} onClick={press} aria-label={FOOTER.button}>
          <svg className="estop__ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="estop-path" d="M100 100m-84 0a84 84 0 1 1 168 0a84 84 0 1 1 -168 0" />
            </defs>
            <text className="estop__ring-text">
              <textPath href="#estop-path">{RING}</textPath>
            </text>
          </svg>
          <span className="estop__collar" aria-hidden="true" />
          <span className="estop__cap" aria-hidden="true" />
        </a>
        <p className="mono fa__hint">Noodstop werkt omgekeerd: indrukken = beginnen</p>
      </div>

      <div className="fa__info">
        <div className="container fa__grid">
          <p className="muted fa__tagline">{TAGLINE}</p>
          <div>
            <h2 className="mono">Adres</h2>
            <address>
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </address>
          </div>
          <div>
            <h2 className="mono">Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mono">Volg ons</h2>
            <ul>
              {CONTACT.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fa__concrete" aria-hidden="true">
          <svg className="fa__defs" width="0" height="0">
            {/* Verfnevel aan de randen: statische ruis die de lettervorm licht laat uitlopen. */}
            <filter id="spray" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
              <feGaussianBlur in="d" stdDeviation="0.6" />
            </filter>
          </svg>
          <p className="fa__mark">XPSR</p>
        </div>

        <div className="container fa__base">
          <span className="mono">© {year} XPSR Studio</span>
          <nav aria-label="Footer">
            <ApertureLink to="/cases" className="mono">Cases</ApertureLink>
            <ApertureLink to="/over-ons" className="mono">Over ons</ApertureLink>
            <ApertureLink to="/contact" className="mono">Contact</ApertureLink>
          </nav>
        </div>
      </div>

      <div ref={flashRef} className="fa__flash" aria-hidden="true" />
    </footer>
  );
}
