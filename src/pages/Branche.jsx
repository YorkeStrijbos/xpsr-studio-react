import { useParams } from 'react-router-dom';
import Accent from '../components/Accent.jsx';
import { ApertureLink } from '../components/Aperture.jsx';
import { Picture } from '../components/Media.jsx';
import { getBranche } from '../content/branches.js';
import { SERVICES } from '../content/home.js';
import { PUBLISHED } from '../data/cases.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import NotFound from './NotFound.jsx';
import '../styles/pages.css';

/*
 * Branchepagina: één template, gevoed door src/content/branches.js.
 * Opbouw: kop, intro, hero-beeld, relevante cases, diensten, FAQ, afsluitende CTA.
 * Lege onderdelen (geen cases, geen beeld) worden niet getoond.
 */
export default function Branche() {
  const { slug } = useParams();
  const b = getBranche(slug);
  usePageTitle(b?.meta.title ?? 'Niet gevonden', b?.meta.description);
  if (!b) return <NotFound />;

  const cases = PUBLISHED.filter(b.cases);
  const services = b.services.map((code) => SERVICES.find((s) => s.code === code)).filter(Boolean);

  return (
    <article className="branche">
      <header className="page-head container">
        <span className="mono label--red">Branche</span>
        <h1 className="display h1">
          <Accent text={b.name} />
        </h1>
        <p className="lead">{b.intro}</p>
      </header>

      {/* TODO XPSR: hero-video per branche (slot b.heroSlot); tot die er is de still, of niets. */}
      {b.image && (
        <div className="container branche__hero">
          <Picture name={b.image} alt="" sizes="100vw" imgClassName="branche__hero-img" priority />
        </div>
      )}

      {cases.length > 0 && (
        <section className="container section--m" aria-labelledby="branche-cases">
          <h2 id="branche-cases" className="display h3">
            Werk
          </h2>
          <ul className="branche__cases">
            {cases.map((c) => (
              <li key={c.slug}>
                <ApertureLink to={`/cases/${c.slug}`} className="branche__case">
                  <span className="display">{c.client}</span>
                  <span className="mono">{c.branch}</span>
                </ApertureLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container section--m" aria-labelledby="branche-services">
        <h2 id="branche-services" className="display h3">
          Diensten
        </h2>
        <ul className="branche__services">
          {services.map((s) => (
            <li key={s.code}>
              <span className="display">{s.title}</span>
              <span>{s.line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container section--m" aria-labelledby="branche-faq">
        <h2 id="branche-faq" className="display h3">
          Vragen
        </h2>
        <dl className="branche__faq">
          {b.faq.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
