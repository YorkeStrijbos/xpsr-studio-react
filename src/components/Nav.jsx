import { useEffect, useRef, useState } from 'react';
import { magnetMove, magnetLeave } from '../utils/interactions.js';

const LINKS = [
  { href: '#', label: 'Home' },
  { href: '#projecten', label: 'Projecten' },
  { href: '#over-ons', label: 'Over ons' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      const solid = window.scrollY > 40;
      navRef.current.style.background = solid ? '#0b0908' : 'rgba(11,9,8,0)';
      navRef.current.style.borderBottomColor = solid ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '18px 48px',
        background: 'rgba(11,9,8,0)',
        borderBottom: '1px solid rgba(255,255,255,0)',
        transition: 'background-color .35s ease, border-color .35s ease',
      }}
    >
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 40, fontFamily: "'Manrope',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {LINKS.map((l, i) => (
          <a key={l.label} href={l.href} className={i === 0 ? 'active' : ''}>{l.label}</a>
        ))}
      </div>
      <a
        href="#contact"
        className="desktop-only"
        onMouseMove={magnetMove}
        onMouseLeave={magnetLeave}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 26px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.25)',
          fontFamily: "'Manrope',sans-serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#F5F3F1',
          transition: 'transform .2s ease, border-color .2s ease',
        }}
      >
        Plan een gesprek <span style={{ color: '#E31E24' }}>→</span>
      </a>

      <button
        type="button"
        className="nav-toggle"
        aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 5,
          width: 42,
          height: 42,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 8,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span style={{ display: 'block', width: 18, height: 2, margin: '0 auto', background: '#F5F3F1', transition: 'transform .2s ease', transform: menuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none' }} />
        <span style={{ display: 'block', width: 18, height: 2, margin: '0 auto', background: '#F5F3F1', transition: 'transform .2s ease', transform: menuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none' }} />
      </button>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, top: 0, zIndex: 99, background: '#0b0908',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
          }}
        >
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={closeMenu}
              style={{ fontFamily: "'Anton',sans-serif", fontSize: 32, color: '#F5F3F1', textTransform: 'uppercase' }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            style={{
              marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 999,
              background: '#E31E24', color: '#0b0908', fontFamily: "'Manrope',sans-serif", fontWeight: 800,
              fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}
          >
            Plan een gesprek <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
