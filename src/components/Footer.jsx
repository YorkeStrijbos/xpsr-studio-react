import { useLayoutEffect, useRef } from 'react';
import { ApertureLink, useAperture } from './Aperture.jsx';
import { CONTACT, FOOTER, TAGLINE } from '../data/site.js';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { bladePath, hexAttr } from '../motion/iris.js';
import '../styles/footer.css';

/*
 * Afsluiter: de diafragmaring rijst op als een enorme boog terwijl beton overgaat in zwart.
 * In het midden de REC-knop "Plan een draaidag": magnetisch, pulseert, timecode loopt bij hover.
 * Daaronder de gegevens en een enorme XPSR-wordmark waarvan de letters oplichten.
 */
export default function Footer() {
  const root = useRef(null);
  const btn = useRef(null);
  const tc = useRef(null);
  const { go } = useAperture();
  const year = new Date().getFullYear();

  useLayoutEffect(() => {
    const el = root.current;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: '.fa__stage', start: 'top bottom', end: 'bottom bottom', scrub: true } })
        .fromTo('.fa__arc', { yPercent: 60, rotate: -40 }, { yPercent: 0, rotate: 0, ease: 'none' }, 0)
        .fromTo('.fa__night', { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none' }, 0.2)
        .fromTo('.fa__ask', { yPercent: 40 }, { yPercent: 0, ease: 'none' }, 0)
        .fromTo(btn.current, { scale: 0.2 }, { scale: 1, ease: 'back.out(1.6)', duration: 0.4 }, 0.6);

      gsap.fromTo(
        '.fa__mark span',
        { opacity: 0.12 },
        { opacity: 1, stagger: 0.15, ease: 'none', scrollTrigger: { trigger: '.fa__mark', start: 'top bottom', end: 'bottom bottom', scrub: true } },
      );

      // Magnetische knop + lopende timecode.
      const b = btn.current;
      const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      let start = 0;
      let running = false;
      const run = () => {
        const s = (performance.now() - start) / 1000;
        const p = (n) => String(n).padStart(2, '0');
        tc.current.textContent = `REC 00:${p(Math.floor(s / 60))}:${p(Math.floor(s) % 60)}:${p(Math.floor((s % 1) * 25))}`;
      };
      const onMove = (e) => {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const onEnter = () => {
        start = performance.now();
        if (!running) gsap.ticker.add(run);
        running = true;
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
        gsap.ticker.remove(run);
        running = false;
        tc.current.textContent = 'REC 00:00:00:00';
      };
      b.addEventListener('pointermove', onMove);
      b.addEventListener('pointerenter', onEnter);
      b.addEventListener('pointerleave', onLeave);
      return () => {
        gsap.ticker.remove(run);
        b.removeEventListener('pointermove', onMove);
        b.removeEventListener('pointerenter', onEnter);
        b.removeEventListener('pointerleave', onLeave);
      };
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="fa">
      <div className="fa__stage">
        <div className="fa__night" aria-hidden="true" />
        <h2 className="display h2 fa__ask">{FOOTER.ask}</h2>
        <svg className="fa__arc" viewBox="-100 -100 200 100" aria-hidden="true">
          <path d="M-92 0A92 92 0 0 1 92 0" className="fa__arc-band" />
          <path d={bladePath(0, 0, 52, 20, 60)} className="fa__arc-blades" />
          <polygon points={hexAttr(0, 0, 52, 20)} className="fa__arc-hole" />
        </svg>
        <a
          ref={btn}
          href="/contact"
          className="fa__rec"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            go('/contact');
          }}
        >
          <span className="fa__rec-label">{FOOTER.button}</span>
          <span ref={tc} className="mono fa__tc" aria-hidden="true">
            REC 00:00:00:00
          </span>
        </a>
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
        <p className="fa__mark display" aria-hidden="true">
          {'XPSR'.split('').map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </p>
        <div className="container fa__base">
          <span className="mono">© {year} XPSR Studio</span>
          <nav aria-label="Footer">
            <ApertureLink to="/cases" className="mono">Cases</ApertureLink>
            <ApertureLink to="/over-ons" className="mono">Over ons</ApertureLink>
            <ApertureLink to="/contact" className="mono">Contact</ApertureLink>
          </nav>
        </div>
      </div>
    </footer>
  );
}
