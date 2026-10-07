import { CONTACT } from '../data/site.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/pages.css';

export default function Contact() {
  usePageTitle('Contact');
  return (
    <>
      <header className="page-head container">
        <span className="mono label--red">Contact</span>
        <h1 className="display h1">Plan een draaidag</h1>
        <p className="lead">Vertel wat jullie bouwen. Wij vertellen hoe één draaidag een recruitmentfilm, bedrijfsfilm, foto's en social oplevert.</p>
      </header>

      <section className="section container contact" aria-label="Contactgegevens">
        <div className="contact__primary">
          <h2 className="label">Mail</h2>
          <a href={`mailto:${CONTACT.email}`} className="display h2 contact__big">
            {CONTACT.email}
          </a>
          <h2 className="label">Bel of app</h2>
          <a href={CONTACT.phoneHref} className="display h2 contact__big">
            {CONTACT.phone}
          </a>
        </div>

        <div className="contact__side">
          <div>
            <h2 className="label">Studio</h2>
            <address className="lead">
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </address>
          </div>
          <div>
            <h2 className="label">Volg ons</h2>
            <ul className="contact__socials">
              {CONTACT.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="link-arrow">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
