import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DUR, EASE, EASE_IN, gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion.js';
import { scrollToTop } from '../lib/scroll.js';
import '../styles/aperture.css';

/*
 * Diafragma: één zwarte laag met een rond "gat" (radius --r).
 * Preloader = diafragma gaat open. Paginatransitie = dicht, navigeren, open.
 * Bij reduced motion: een simpele fade.
 */

const ApertureContext = createContext(null);
const SEEN_KEY = 'xpsr-seen';
const OPEN_R = 'max(100vw, 100vh)'; // ruim groter dan de halve diagonaal

function firstVisit() {
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Geen opslag beschikbaar: preloader gewoon tonen.
  }
  return true;
}

// Eén keer per page load bepalen (niet in render, StrictMode roept initializers dubbel aan).
const SHOW_PRELOADER = typeof window !== 'undefined' && firstVisit();

export function ApertureProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const layerRef = useRef(null);
  const markRef = useRef(null);
  const busy = useRef(false);
  const showPreloader = SHOW_PRELOADER;
  const [ready, setReady] = useState(!showPreloader);

  const setR = (v) => layerRef.current?.style.setProperty('--r', v);

  // Preloader: maximaal circa 1,5 seconde, alleen bij het eerste bezoek in deze sessie.
  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!showPreloader) {
      layer.dataset.state = 'open';
      return;
    }
    if (prefersReducedMotion()) {
      gsap.to(layer, { opacity: 0, duration: DUR[1], delay: 0.3, onComplete: () => {
        layer.dataset.state = 'open';
        gsap.set(layer, { opacity: 1 });
        setReady(true);
      } });
      return;
    }
    const state = { r: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        layer.dataset.state = 'open';
        setReady(true);
      },
    });
    tl.to(markRef.current, { opacity: 1, duration: 0.25 })
      .to(markRef.current, { opacity: 0, duration: 0.25 }, 0.55)
      .to(state, {
        r: 1,
        duration: DUR[2],
        ease: EASE,
        onUpdate: () => setR(`calc(${OPEN_R} * ${state.r})`),
      }, 0.6);
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
        gsap.fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.25, onComplete: () => {
          swap();
          gsap.to(layer, { opacity: 0, duration: 0.35, delay: 0.05, onComplete: () => {
            layer.dataset.state = 'open';
            gsap.set(layer, { opacity: 1 });
            busy.current = false;
          } });
        } });
        return;
      }

      const state = { r: 1 };
      const render = () => setR(`calc(${OPEN_R} * ${state.r})`);
      render();
      layer.dataset.state = 'moving';
      gsap.timeline({
        onComplete: () => {
          layer.dataset.state = 'open';
          busy.current = false;
        },
      })
        .to(state, { r: 0, duration: DUR[1], ease: EASE_IN, onUpdate: render })
        .add(swap)
        .to(state, { r: 1, duration: DUR[2], ease: EASE, onUpdate: render, delay: 0.12 });
    },
    [location.pathname, navigate],
  );

  // Na elke route-wissel: ScrollTrigger opnieuw meten (nieuwe pagina, nieuwe hoogtes).
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <ApertureContext.Provider value={{ go, ready }}>
      {children}
      <div
        ref={layerRef}
        className="aperture"
        data-state={showPreloader ? 'closed' : 'open'}
        aria-hidden="true"
      >
        {showPreloader && (
          <div ref={markRef} className="aperture__mark">
            <span className="display">XPSR</span>
            <span className="label">Studio</span>
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
