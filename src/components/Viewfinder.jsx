import { forwardRef } from 'react';
import '../styles/viewfinder.css';

/** De markup van het vizier. Gedrag zit in src/motion/viewfinder.js. */
export const ViewfinderLayer = forwardRef(function ViewfinderLayer(_, ref) {
  return (
    <div ref={ref} className="vf" aria-hidden="true">
      <div className="vf-par">
        <span className="vf-ring">
          <svg viewBox="-50 -50 100 100">
            <circle r="48" className="vf-ring__outer" />
            <polygon data-iris-hole className="vf-ring__hole" />
            <path data-iris-blades className="vf-ring__blades" />
          </svg>
        </span>
        <span className="vf-dot">
          <span className="vf-dot__core" />
        </span>
      </div>
      <span className="vf-c vf-c--tl" />
      <span className="vf-c vf-c--tr" />
      <span className="vf-c vf-c--bl" />
      <span className="vf-c vf-c--br" />
    </div>
  );
});

/** Klein, statisch vizier naast het logo (zoals op elke pagina in de nav). */
export function MiniViewfinder() {
  return (
    <span className="vf-mini" aria-hidden="true">
      <span className="vf-mini__dot" />
      <svg className="vf-mini__ring" viewBox="-50 -50 100 100">
        <circle r="46" />
      </svg>
    </span>
  );
}
