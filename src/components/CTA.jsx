import { ApertureLink } from './Aperture.jsx';
import { CONTACT } from '../data/site.js';

export default function CTA() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container cta__inner">
        <h2 id="cta-title" className="display h2 cta__title">
          Klaar voor de juiste exposure?
        </h2>
        <div className="cta__actions">
          <ApertureLink to="/contact" className="btn btn--primary">
            Plan een gesprek
          </ApertureLink>
          <a href={`mailto:${CONTACT.email}`} className="link-arrow">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </section>
  );
}
