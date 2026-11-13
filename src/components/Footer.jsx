import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ApertureLink, useAperture } from './Aperture.jsx';
import { CONTACT } from '../data/site.js';
import { CTA as FOOTER, TAGLINE } from '../content/home.js';
import { DUR, EASE, gsap, prefersReducedMotion } from '../lib/motion.js';
import '../styles/footer.css';

const p2 = (n) => String(n).padStart(2, '0');

/*
 * Finale: het REC-punt. Het vizier begon als klein rood punt naast het logo en eindigt hier als knop.
 * Hover: de ring vult zich met een rode sweep, de timecode loopt, REC knippert.
 * Klik: vier zoekerhoeken schieten vanuit de schermhoeken naar de knop, de pagina stelt scherp (blur 6px naar 0),
 * één wit frame, dan de contactpagina.
 */
export default function Footer() {
  const { go } = useAperture();
  const recRef = useRef(null);
  const tcRef = useRef(null);
  const flashRef = useRef(null);
  const cornersRef = useRef(null);
  const state = useRef({ fill: null, start: 0, raf: 0, busy: false });
  const year = new Date().getFullYear();

  const tick = () => {
    const s = (performance.now() - state.current.start) / 1000;
    tcRef.current.textContent = `00:${p2(Math.floor(s / 60))}:${p2(Math.floor(s) % 60)}:${p2(Math.floor((s % 1) * 25))}`;
    state.current.raf = requestAnimationFrame(tick);
  };

  const enter = () => {
    if (prefersReducedMotion()) return;
    const st = state.current;
    st.fill?.kill();
    st.fill = gsap.to(recRef.current, { '--fill': '360deg', duration: 4, ease: EASE.linear });
    st.start = performance.now();
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(tick);
    recRef.current.classList.add('is-live');
  };

  const leave = () => {
    const st = state.current;
    st.fill?.kill();
    gsap.to(recRef.current, { '--fill': '0deg', duration: DUR.fast });
    cancelAnimationFrame(st.raf);
    tcRef.current.textContent = '00:00:00:00';
    recRef.current.classList.remove('is-live');
  };

  const press = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const st = state.current;
    if (st.busy) return;
    if (prefersReducedMotion() || document.hidden) {
      go('/contact');
      return;
    }
    st.busy = true;
    const r = recRef.current.getBoundingClientRect();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const C = 22;
    const pad = 14;
    const from = [
      [16, 16],
      [W - 16 - C, 16],
      [16, H - 16 - C],
      [W - 16 - C, H - 16 - C],
    ];
    const to = [
      [r.left - pad, r.top - pad],
      [r.right + pad - C, r.top - pad],
      [r.left - pad, r.bottom + pad - C],
      [r.right + pad - C, r.bottom + pad - C],
    ];
    const corners = cornersRef.current.children;
    gsap
      .timeline({
        onComplete: () => {
          st.busy = false;
          gsap.set(corners, { autoAlpha: 0 });
          gsap.set(['#main', '.fa'], { clearProps: 'filter' });
          go('/contact');
        },
      })
      .set(corners, { autoAlpha: 1, x: (i) => from[i][0], y: (i) => from[i][1] })
      .to(corners, { x: (i) => to[i][0], y: (i) => to[i][1], duration: DUR.fast, ease: EASE.move })
      .fromTo(['#main', '.fa'], { filter: 'blur(6px)' }, { filter: 'blur(0px)', duration: DUR.fast, ease: EASE.reveal }, '<0.1')
      .fromTo(flashRef.current, { autoAlpha: 0.9 }, { autoAlpha: 0, duration: 0.1, ease: EASE.linear });
  };

  // Op /contact staat het formulier al: daar geen tweede "Zin in een draaidag?".
  const { pathname } = useLocation();
  const showAsk = pathname !== '/contact';

  return (
    <>
      <footer className="fa">
        {showAsk && (
          <div className="fa__stage">
            <h2 className="display fa__ask">{FOOTER.ask}</h2>
            <a
              ref={recRef}
              href="/contact"
              className="rec"
              onClick={press}
              onPointerEnter={enter}
              onPointerLeave={leave}
              onFocus={enter}
              onBlur={leave}
              aria-label={FOOTER.button}
              data-cursor=""
            >
              <span ref={tcRef} className="rec__tc mono" aria-hidden="true">
                00:00:00:00
              </span>
              <span className="rec__label mono" aria-hidden="true">
                REC
              </span>
            </a>
            <p className="mono fa__hint">{FOOTER.button}</p>
          </div>
        )}

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
          <p className="fa__mark display" aria-hidden="true">
            XPSR
          </p>
          <div className="container fa__base">
            <span className="mono">© {year} XPSR Studio</span>
            <nav aria-label="Footer">
              <ApertureLink to="/cases" className="mono">Werk</ApertureLink>
              <ApertureLink to="/over-ons" className="mono">Over ons</ApertureLink>
              <ApertureLink to="/contact" className="mono">Contact</ApertureLink>
            </nav>
          </div>
        </div>
      </footer>

      {/* Klik-overgang: zoekerhoeken en wit frame (buiten de footer, zodat de blur ze niet raakt). */}
      <div ref={cornersRef} className="fa__corners" aria-hidden="true">
        <span className="fa__c fa__c--tl" />
        <span className="fa__c fa__c--tr" />
        <span className="fa__c fa__c--bl" />
        <span className="fa__c fa__c--br" />
      </div>
      <div ref={flashRef} className="fa__flash" aria-hidden="true" />
    </>
  );
}
