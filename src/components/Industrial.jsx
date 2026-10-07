import '../styles/industrial.css';

/**
 * Placeholder tot er echt beeld is: geen leeg grijs vak, maar een donker, korrelig "beeld"
 * met een gestencild label, zodat het ontwerp beoordeelbaar blijft.
 * TODO XPSR: vervangen door echte stills of loops.
 */
export function StencilPlaceholder({ label = 'Beeld volgt', sub, className = '' }) {
  return (
    <div className={`sph ${className}`} aria-hidden="true">
      <span className="sph__label">{label}</span>
      {sub && <span className="sph__sub">{sub}</span>}
    </div>
  );
}
