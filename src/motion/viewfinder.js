import { gsap } from '../lib/motion.js';
import { createIris } from './iris.js';

/*
 * Het vizier: REC-punt, diafragmaring en vier zoekerhoeken in één fixed laag.
 * Secties geven "stops" op; tussen twee stops scrubt het vizier mee met de scroll.
 * Posities zijn middelpunten (xPercent/yPercent -50), opgegeven als fractie van het scherm.
 */

const els = { root: null, par: null, dot: null, core: null, ring: null, corners: [], iris: null };
const CORNER = 18; // px, maat van één hoekje

export function registerViewfinder(root) {
  els.root = root;
  els.par = root.querySelector('.vf-par');
  els.dot = root.querySelector('.vf-dot');
  // De kern is apart te schalen (rood vlak), zodat secties niet botsen met de overgangen op .vf-dot.
  els.core = root.querySelector('.vf-dot__core');
  els.ring = root.querySelector('.vf-ring');
  els.corners = [...root.querySelectorAll('.vf-c')];
  els.iris = createIris(root.querySelector('.vf-ring svg'), { cx: 0, cy: 0, L: 60, turn: 60 });
  els.iris(34, 1);
  gsap.set([els.dot, els.ring], { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' });
  return els;
}

export const vfEls = els;

/** Lamellen van de ring: open = 0 (bijna dicht) tot 1 (open). */
export function setRingAperture(open) {
  els.iris?.(10 + open * 30, open);
}

// Posities: fractie van het scherm, of een functie die pixels teruggeeft (meten op het moment van refresh).
const vw = (f) => (typeof f === 'function' ? () => f() : () => window.innerWidth * f);
const vh = (f) => (typeof f === 'function' ? () => f() : () => window.innerHeight * f);
const val = (v, d) => (v == null ? d : typeof v === 'function' ? () => v() : v);

/** Zet een stop om naar tween-vars met functies, zodat resize/refresh klopt. */
function dotVars(s) {
  return { x: vw(s.x), y: vh(s.y), scale: val(s.scale, 1), autoAlpha: val(s.opacity, 1) };
}
function ringVars(s) {
  return { x: vw(s.x), y: vh(s.y), scale: val(s.scale, 1), rotate: val(s.rotate, 0), autoAlpha: val(s.opacity, 1) };
}

/** Hoeken naar een rechthoek (in px, viewport-coördinaten). */
export function cornerTargets(rect) {
  const { left, top, width, height } = rect;
  return [
    { x: left, y: top },
    { x: left + width - CORNER, y: top },
    { x: left, y: top + height - CORNER },
    { x: left + width - CORNER, y: top + height - CORNER },
  ];
}

function cornerFracRect(c) {
  return {
    left: window.innerWidth * (c.x - c.w / 2),
    top: window.innerHeight * (c.y - c.h / 2),
    width: window.innerWidth * c.w,
    height: window.innerHeight * c.h,
  };
}

export function frameCorners(rect, vars = {}) {
  const t = cornerTargets(rect);
  els.corners.forEach((c, i) => gsap.to(c, { x: t[i].x, y: t[i].y, autoAlpha: 1, duration: 0.6, ease: 'xpsr', overwrite: 'auto', ...vars }));
}

export function setCorners(rect) {
  const t = cornerTargets(rect);
  els.corners.forEach((c, i) => gsap.set(c, { x: t[i].x, y: t[i].y }));
}

export function placeAt(stop) {
  gsap.set(els.dot, dotVars(stop.dot));
  gsap.set(els.ring, ringVars(stop.ring));
  if (stop.corners) {
    setCorners(cornerFracRect(stop.corners));
    gsap.set(els.corners, { autoAlpha: stop.corners.opacity ?? 1 });
  }
}

/** Animeert (niet gescrubd) naar een stop, bijvoorbeeld na de preloader. */
export function travelTo(stop, duration = 1.2) {
  const tl = gsap.timeline({ defaults: { duration, ease: 'xpsr' } });
  tl.to(els.dot, { ...dotVars(stop.dot) }, 0).to(els.ring, { ...ringVars(stop.ring) }, 0);
  if (stop.corners) {
    const t = cornerTargets(cornerFracRect(stop.corners));
    els.corners.forEach((c, i) => tl.to(c, { x: t[i].x, y: t[i].y, autoAlpha: stop.corners.opacity ?? 1 }, 0));
  }
  return tl;
}

/**
 * Bouwt scrubbed overgangen tussen opeenvolgende stops.
 * Elke stop: { trigger, start?, end?, dot, ring, corners?, aperture? }.
 */
export function buildStops(stops) {
  const tweens = [];
  for (let i = 1; i < stops.length; i++) {
    // Een sectie kan het vizier zelf verder animeren (pin); "exit" is dan de eindstand waar de volgende overgang begint.
    const prev = stops[i - 1];
    const a = prev.exit ? { ...prev, ...prev.exit } : prev;
    const b = stops[i];
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: b.trigger,
        start: b.start ?? 'top bottom',
        end: b.end ?? 'top top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    tl.fromTo(els.dot, dotVars(a.dot), { ...dotVars(b.dot), immediateRender: false }, 0);
    tl.fromTo(els.ring, ringVars(a.ring), { ...ringVars(b.ring), immediateRender: false }, 0);
    if (b.corners && a.corners) {
      els.corners.forEach((c, k) => {
        tl.fromTo(
          c,
          { x: () => cornerTargets(cornerFracRect(a.corners))[k].x, y: () => cornerTargets(cornerFracRect(a.corners))[k].y, autoAlpha: a.corners.opacity ?? 1 },
          { x: () => cornerTargets(cornerFracRect(b.corners))[k].x, y: () => cornerTargets(cornerFracRect(b.corners))[k].y, autoAlpha: b.corners.opacity ?? 1, immediateRender: false },
          0,
        );
      });
    }
    const ca = a.core ?? 1;
    const cb = b.core ?? 1;
    if (ca !== cb) tl.fromTo(els.core, { scale: ca }, { scale: cb, immediateRender: false }, 0);
    if (a.aperture != null && b.aperture != null) {
      const st = { v: a.aperture };
      tl.fromTo(st, { v: a.aperture }, { v: b.aperture, onUpdate: () => setRingAperture(st.v), immediateRender: false }, 0);
    }
    tweens.push(tl);
  }
  return tweens;
}
