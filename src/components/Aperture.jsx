import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { EASE, ScrollTrigger, gsap, prefersReducedMotion } from '../lib/motion.js';
import { scrollToTop } from '../lib/scroll.js';
import { createIris } from '../motion/iris.js';
import '../styles/aperture.css';

/*
 * Diafragma met zes lamellen over het hele scherm.
 * Preloader: REC + oplopende timecode, zoekerhoeken schuiven naar het midden, klik (flits), lens opent.
 * Paginatransitie: lamellen sluiten, korte flits, openen op de nieuwe pagina.
 * Reduced motion of verborgen tabblad: simpele fade of direct.
 */

const ApertureContext = createContext(null);
const SEEN_KEY = 'xpsr-seen';
const R_OPEN = 82; // in viewBox-eenheden; ruim genoeg om elk schermformaat te openen

function firstVisit() {
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Geen opslag: preloader gewoon tonen.
  }
  return true;
}

// Eén keer per page load bepalen (StrictMode roept initializers dubbel aan).
const SHOW_PRELOADER = typeof window !== 'undefined' && firstVisit();

function timecode(sec) {
  const f = Math.floor((sec % 1) * 25);
  const s = Math.floor(sec) % 60;
  const m = Math.floor(sec / 60) % 60;
  const p = (n) => String(n).padStart(2, '0');
  return `00:${p(m)}:${p(s)}:${p(f)}`;
}

export function ApertureProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const layerRef = useRef(null);
  const svgRef = useRef(null);
  const flashRef = useRef(null);
  const preRef = useRef(null);
  const tcRef = useRef(null);
  const irisRef = useRef(null);
  const busy = useRef(false);
  const showPreloader = SHOW_PRELOADER;
  const [ready, setReady] = useState(!showPreloader);

  useLayoutEffect(() => {
    irisRef.current = createIris(svgRef.current, { cx: 0, cy: 0, L: 220, turn: 50 });
  }, []);

  const setOpen = (v) => irisRef.current?.(Math.max(v, 0.001) * R_OPEN, v);

  // Preloader, maximaal 1,5 s (nu 1,3 s). Alleen bij het eerste bezoek per sessie.
  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!showPreloader) {
      layer.dataset.state = 'open';
      return;
    }
    setOpen(0);
    if (prefersReducedMotion()) {
      const t = gsap.to(layer, {
        autoAlpha: 0,
        duration: 0.4,
        delay: 0.3,
        onComplete: () => {
          layer.dataset.state = 'open';
          gsap.set(layer, { autoAlpha: 1 });
          setReady(true);
        },
      });
      return () => t.kill();
    }

    const pre = preRef.current;
    const corners = pre.querySelectorAll('.pre__c');
    const W = window.innerWidth;
    const H = window.innerHeight;
    const fw = Math.min(220, W * 0.4);
    const fh = fw * 0.6;
    const m = 24;
    const outer = [
      [m, m],
      [W - m - 18, m],
      [m, H - m - 18],
      [W - m - 18, H - m - 18],
    ];
    const inner = [
      [(W - fw) / 2, (H - fh) / 2],
      [(W + fw) / 2 - 18, (H - fh) / 2],
      [(W - fw) / 2, (H + fh) / 2 - 18],
      [(W + fw) / 2 - 18, (H + fh) / 2 - 18],
    ];
    corners.forEach((c, i) => gsap.set(c, { x: outer[i][0], y: outer[i][1] }));

    const clock = { t: 0 };
    const state = { o: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        layer.dataset.state = 'open';
      },
    });
    // De hero mag al opkomen terwijl de lens nog opengaat: zo loopt de flits naadloos door in de kop.
    tl.call(() => setReady(true), null, 0.8);
    // Totaal 1,3 s: timecode loopt, hoeken stellen scherp, flits, lens open naar de hero.
    tl.to(clock, { t: 1.2, duration: 1.2, ease: EASE.linear, onUpdate: () => (tcRef.current.textContent = timecode(clock.t)) }, 0)
      .to(corners, { x: (i) => inner[i][0], y: (i) => inner[i][1], duration: 0.5, ease: EASE.reveal }, 0.05)
      .fromTo(flashRef.current, { autoAlpha: 0.9 }, { autoAlpha: 0, duration: 0.08, ease: EASE.linear }, 0.6)
      .to(corners, { x: (i) => outer[i][0], y: (i) => outer[i][1], duration: 0.6, ease: EASE.reveal }, 0.66)
      .to(state, { o: 1, duration: 0.64, ease: EASE.reveal, onUpdate: () => setOpen(state.o) }, 0.66)
      .to(pre, { autoAlpha: 0, duration: 0.25 }, 1.0);
    return () => tl.kill();
  }, [showPreloader]);

  const go = useCallback(
    (to) => {
      if (busy.current || to === location.pathname) return;
      const layer = layerRef.current;
      busy.current = true;

      const swap = () => {
        navigate(to);
        scrollToTop();
      };

      // Verborgen tabblad: rAF staat stil, dus zonder animatie navigeren.
      if (document.hidden) {
        swap();
        busy.current = false;
        return;
      }

      if (prefersReducedMotion()) {
        layer.dataset.state = 'fade';
        gsap.fromTo(layer, { autoAlpha: 0 }, {
          autoAlpha: 1,
          duration: 0.25,
          onComplete: () => {
            swap();
            gsap.to(layer, {
              autoAlpha: 0,
              duration: 0.35,
              delay: 0.05,
              onComplete: () => {
                layer.dataset.state = 'open';
                gsap.set(layer, { autoAlpha: 1 });
                busy.current = false;
              },
            });
          },
        });
        return;
      }

      const state = { o: 1 };
      setOpen(1);
      layer.dataset.state = 'moving';
      gsap
        .timeline({
          onComplete: () => {
            layer.dataset.state = 'open';
            busy.current = false;
          },
        })
        .to(state, { o: 0, duration: 0.55, ease: EASE.in, onUpdate: () => setOpen(state.o) })
        .fromTo(flashRef.current, { autoAlpha: 0.85 }, { autoAlpha: 0, duration: 0.08, ease: EASE.linear })
        .add(swap)
        .to(state, { o: 1, duration: 0.8, ease: EASE.reveal, onUpdate: () => setOpen(state.o) }, '+=0.1');
    },
    [location.pathname, navigate],
  );

  // Na elke route-wissel: ScrollTrigger opnieuw meten.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <ApertureContext.Provider value={{ go, ready }}>
      {children}
      <div ref={layerRef} className="aperture" data-state={showPreloader ? 'closed' : 'open'} aria-hidden="true">
        <svg ref={svgRef} className="aperture__svg" viewBox="-50 -50 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="aperture-mask">
              <rect x="-200" y="-200" width="400" height="400" fill="#fff" />
              <polygon data-iris-hole fill="#000" />
            </mask>
          </defs>
          <rect x="-200" y="-200" width="400" height="400" className="aperture__plate" mask="url(#aperture-mask)" />
          <path data-iris-blades className="aperture__blades" />
          <polygon data-iris-hole className="aperture__rim" />
        </svg>
        <div ref={flashRef} className="aperture__flash" />
        {showPreloader && (
          <div ref={preRef} className="pre">
            <span className="pre__rec mono">
              <span className="pre__dot" /> REC
            </span>
            <span ref={tcRef} className="pre__tc mono">
              00:00:00:00
            </span>
            <span className="pre__c pre__c--tl" />
            <span className="pre__c pre__c--tr" />
            <span className="pre__c pre__c--bl" />
            <span className="pre__c pre__c--br" />
          </div>
        )}
      </div>
    </ApertureContext.Provider>
  );
}

export function useAperture() {
  return useContext(ApertureContext);
}

/** Link die via het diafragma navigeert. Nieuwe tab, modifier-klik e.d. blijven gewoon werken. */
export function ApertureLink({ to, onClick, ...rest }) {
  const { go } = useAperture();
  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        go(to);
      }}
      {...rest}
    />
  );
}
