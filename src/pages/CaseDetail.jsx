import { useParams } from 'react-router-dom';
import { ApertureLink } from '../components/Aperture.jsx';
import { LoopVideo, Picture } from '../components/Media.jsx';
import NotFound from './NotFound.jsx';
import { filled, getCase, hasMedia, nextCase } from '../data/cases.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/pages.css';

/** Alleen ingevulde velden: een placeholder is nooit zichtbaar. */
function CaseMeta({ c, className = '' }) {
  const rows = [
    ['Klant', c.client],
    ['Branche', c.branch],
    ['Gemaakt', c.made],
    ['Jaar', c.year],
    ['Resultaat', c.result],
  ].filter(([, v]) => filled(v));
  return (
    <dl className={`case-meta ${className}`}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="mono">{k}</dt>
          <dd className={k === 'Resultaat' ? 'case-meta__result' : undefined}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/*
 * Casepagina: werk laten zien en daarna de stap naar een aanvraag.
 * Opbouw: kop, hero-beeld, meta, verhaal (alleen ingevulde blokken), quote van de klant (als die er is),
 * beeldreeks, credits en de volgende case. Daarna volgt de footer met "Zin in een draaidag?": de stap naar een aanvraag.
 * Cases zonder beeld zijn niet gepubliceerd en geven de 404.
 */
export default function CaseDetail() {
  const { slug } = useParams();
  const c = getCase(slug);
  usePageTitle(c && hasMedia(c) ? c.client : 'Niet gevonden');
  if (!c || !hasMedia(c)) return <NotFound />;

  const next = nextCase(c.slug);
  // Elk beeld maximaal één keer: zonder hero-video is de cover de hero en valt hij uit de galerij.
  const gallery = c.heroMotion || !c.cover ? c.gallery : c.gallery.filter((g) => g.name !== c.cover.name);
  const story = [
    ['Vraag', c.question],
    ['Aanpak', c.approach],
    ['Resultaat', c.outcome],
  ].filter(([, t]) => filled(t));
  const quote = c.quote && filled(c.quote.text) ? c.quote : null;
  const credits = (c.credits ?? []).filter(filled);

  return (
    <article className="case-detail">
      <header className="page-head container">
        <span className="mono label--red">Case</span>
        <h1 className="display h1">{c.client}</h1>
        {filled(c.line) && <p className="lead">{c.line}</p>}
      </header>

      <div className="case-detail__hero container">
        <div className="case-detail__hero-media">
          {c.heroMotion ? (
            <LoopVideo name={c.heroMotion} className="case-detail__hero-el" eager label={`video ${c.client}`} />
          ) : (
            <Picture name={c.cover.name} alt={c.cover.alt} priority sizes="100vw" imgClassName="case-detail__hero-el" />
          )}
        </div>
        <CaseMeta c={c} className="case-detail__meta" />
      </div>

      {story.length > 0 && (
        <section className="section container case-detail__story" aria-label="Over deze case">
          {story.map(([title, text]) => (
            <div key={title} className="case-detail__block">
              <h2 className="mono label--red">{title}</h2>
              <p className="lead">{text}</p>
            </div>
          ))}
        </section>
      )}

      {quote && (
        <figure className="container case-quote">
          <blockquote className="display case-quote__text">{quote.text}</blockquote>
          <figcaption className="case-quote__by">
            {quote.name}
            {filled(quote.role) && <span>, {quote.role}</span>}
          </figcaption>
        </figure>
      )}

      {gallery.length > 0 && (
        <section className="container case-detail__gallery" aria-label="Beelden">
          {gallery.map((g) => (
            <figure key={g.name} className="case-detail__shot">
              <Picture name={g.name} alt={g.alt} sizes="(min-width: 768px) 50vw, 100vw" />
            </figure>
          ))}
        </section>
      )}

      {credits.length > 0 && (
        <section className="container case-credits" aria-label="Credits">
          <h2 className="mono label--red">Credits</h2>
          <ul>
            {credits.map((cr) => (
              <li key={cr}>{cr}</li>
            ))}
          </ul>
        </section>
      )}

      {next && next.slug !== c.slug && (
        <ApertureLink to={`/cases/${next.slug}`} className="next-case" data-cursor="volgende">
          <div className="container next-case__inner">
            <div>
              <span className="mono">Volgende case</span>
              <span className="display h2 next-case__title">{next.client}</span>
            </div>
            <div className="next-case__media">
              <Picture name={(next.cover ?? next.gallery[0]).name} alt="" sizes="40vw" imgClassName="next-case__img" />
            </div>
          </div>
        </ApertureLink>
      )}
    </article>
  );
}
