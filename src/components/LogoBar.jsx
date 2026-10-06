import { CLIENTS } from '../data/site.js';

// TODO XPSR: woordmerken vervangen door SVG-logo's (wit/grijs) zodra ze met toestemming zijn aangeleverd.
export default function LogoBar() {
  const row = (hidden) => (
    <ul className="logobar__row" aria-hidden={hidden || undefined}>
      {CLIENTS.map((c) => (
        <li key={c} className="logobar__item">
          {c}
        </li>
      ))}
    </ul>
  );

  return (
    <section className="logobar" aria-label="Klanten">
      <p className="label logobar__label container">Werkt voor onder meer</p>
      <div className="logobar__track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
