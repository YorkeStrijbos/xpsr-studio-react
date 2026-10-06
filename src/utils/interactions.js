export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Coalesces bursts of scroll/resize events into at most one call per animation frame.
export function rafThrottle(fn) {
  let ticking = false;
  return (...args) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn(...args);
    });
  };
}

export function tiltMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  const base = parseFloat(e.currentTarget.dataset.angle || '0');
  e.currentTarget.style.transform = `rotate(${base}deg) perspective(800px) rotateX(${py * -10}deg) rotateY(${px * 10}deg) scale3d(1.05,1.05,1.05)`;
}

export function tiltLeave(e) {
  const base = parseFloat(e.currentTarget.dataset.angle || '0');
  e.currentTarget.style.transform = base ? `rotate(${base}deg)` : 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
}

export function magnetMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  e.currentTarget.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
}

export function magnetLeave(e) {
  e.currentTarget.style.transform = 'translate(0,0)';
}
