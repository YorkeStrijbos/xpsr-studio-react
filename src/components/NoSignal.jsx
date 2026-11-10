/**
 * Placeholder tot er echt beeld is: donker korrelbeeld met NO SIGNAL in mono, zoals een monitor zonder input.
 * TODO XPSR: vervangen door echte footage of stills.
 */
export default function NoSignal({ sub, className = '' }) {
  return (
    <div className={`nosignal ${className}`} aria-hidden="true">
      <span className="nosignal__label">No signal</span>
      {sub && <span className="nosignal__sub">{sub}</span>}
    </div>
  );
}
