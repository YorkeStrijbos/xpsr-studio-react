/*
 * Diafragma met zes lamellen.
 * Het gat is een regelmatige zeshoek. Elke lamel-rand loopt door één zijde van die zeshoek
 * en steekt voorbij een hoekpunt naar buiten: zo ontstaat het bekende "molentje" van een lens.
 * Werkt in elk SVG-coördinatenstelsel; middelpunt (cx, cy), straal r, rotatie in graden.
 */

export function hexPoints(cx, cy, r, rot = 0) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = ((rot + i * 60) * Math.PI) / 180;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

export function hexAttr(cx, cy, r, rot) {
  return hexPoints(cx, cy, r, rot)
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');
}

/** Path met zes lamel-randen, elk een lijn vanaf hoekpunt i in de richting van hoekpunt i+1, lengte L. */
export function bladePath(cx, cy, r, rot, L) {
  const p = hexPoints(cx, cy, Math.max(r, 0.001), rot);
  let d = '';
  for (let i = 0; i < 6; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % 6];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ex = x1 + ((x2 - x1) / len) * L;
    const ey = y1 + ((y2 - y1) / len) * L;
    d += `M${x1.toFixed(2)} ${y1.toFixed(2)}L${ex.toFixed(2)} ${ey.toFixed(2)}`;
  }
  return d;
}

/** Zeshoek als CSS clip-path (in procenten van het element). */
export function hexClipPath(r, rot = 0) {
  return `polygon(${hexPoints(50, 50, r, rot)
    .map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`)
    .join(', ')})`;
}

/**
 * Koppelt een <svg> met [data-iris-hole] (polygons) en [data-iris-blades] (path) aan een setter.
 * Rotatie loopt mee met de opening, zoals bij een echte lens.
 */
export function createIris(svg, { cx = 0, cy = 0, L = 400, turn = 60 } = {}) {
  const holes = svg.querySelectorAll('[data-iris-hole]');
  const blades = svg.querySelectorAll('[data-iris-blades]');
  return function set(r, open = 1) {
    const rot = (1 - open) * turn;
    const pts = hexAttr(cx, cy, r, rot);
    holes.forEach((h) => h.setAttribute('points', pts));
    const d = bladePath(cx, cy, r, rot, L);
    blades.forEach((b) => b.setAttribute('d', d));
  };
}
