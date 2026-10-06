import { ApertureLink } from './Aperture.jsx';
import { Wordmark } from './Nav.jsx';
import { CONTACT, TAGLINE } from '../data/site.js';
import '../styles/footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <ApertureLink to="/" aria-label="XPSR Studio, naar home">
            <Wordmark />
          </ApertureLink>
          <p className="muted">{TAGLINE}</p>
        </div>

        <div>
          <h2 className="label">Adres</h2>
          <address>
            {CONTACT.street}
            <br />
            {CONTACT.city}
          </address>
        </div>

        <div>
          <h2 className="label">Contact</h2>
          <ul>
            <li>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="label">Volg ons</h2>
          <ul>
            {CONTACT.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer__base">
        <span className="label">© {year} XPSR Studio</span>
        <nav aria-label="Footer">
          <ApertureLink to="/cases" className="label">Cases</ApertureLink>
          <ApertureLink to="/over-ons" className="label">Over ons</ApertureLink>
          <ApertureLink to="/contact" className="label">Contact</ApertureLink>
        </nav>
      </div>
    </footer>
  );
}
