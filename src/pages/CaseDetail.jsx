import { useParams } from 'react-router-dom';
import { ApertureLink } from '../components/Aperture.jsx';
import { LoopVideo, Picture } from '../components/Media.jsx';
import NotFound from './NotFound.jsx';
import NoSignal from '../components/NoSignal.jsx';
import { getCase, nextCase } from '../data/cases.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/pages.css';

function CaseMeta({ c, className = '' }) {
  return (
    <dl className={`case-meta ${className}`}>
      {[
        ['Klant', c.client],
        ['Branche', c.branch],
        ['Gemaakt', c.made],
        ['Resultaat', c.result],
      ].map(([k, v]) => (
        <div key={k}>
          <dt className="mono">{k}</dt>
          <dd className={k === 'Resultaat' ? 'case-meta__result' : undefined}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Placeholder({ label }) {
  return <NoSignal sub={label} />;
}

export default function CaseDetail() {
  const { slug } = useParams();
  const c = getCase(slug);
  usePageTitle(c ? c.client : 'Niet gevonden');
  if (!c) return <NotFound />;

  const next = nextCase(c.slug);
  // Elk beeld maximaal één keer: zonder hero-video is de cover de hero en valt hij uit de galerij.
  const gallery = c.heroMotion || !c.cover ? c.gallery : c.gallery.filter((g) => g.name !== c.cover.name);

  return (
    <article className="case-detail">
      <header className="page-head container">
        <span className="mono label--red">Case</span>
        <h1 className="display h1">{c.client}</h1>
      </header>

      <div className="case-detail__hero container">
        <div className="case-detail__hero-media">
          {c.heroMotion ? (
            <LoopVideo name={c.heroMotion} className="case-detail__hero-el" eager label={`video ${c.client}`} />
          ) : c.cover ? (
            <Picture name={c.cover.name} alt={c.cover.alt} priority sizes="100vw" imgClassName="case-detail__hero-el" />
          ) : (
            <Placeholder label={`Hero-video ${c.client}`} />
          )}
        </div>
        <CaseMeta c={c} className="case-detail__meta" />
      </div>

      <section className="section container case-detail__story" aria-label="Over deze case">
        {[
          ['Vraag', c.question],
          ['Aanpak', c.approach],
          ['Resultaat', c.outcome],
        ].map(([title, text]) => (
          <div key={title} className="case-detail__block">
            <h2 className="mono label--red">{title}</h2>
            <p className="lead">{text}</p>
          </div>
        ))}
      </section>

      <section className="container case-detail__gallery" aria-label="Beelden">
        {gallery.length > 0 ? (
          gallery.map((g) => (
            <figure key={g.name} className="case-detail__shot">
              <Picture name={g.name} alt={g.alt} sizes="(min-width: 768px) 50vw, 100vw" />
            </figure>
          ))
        ) : (
          <div className="case-detail__shot case-detail__shot--empty">
            {/* TODO XPSR: 6 tot 10 stills voor deze case aanleveren. */}
            <Placeholder label="Beelden volgen" />
          </div>
        )}
      </section>

      <ApertureLink to={`/cases/${next.slug}`} className="next-case" data-cursor="volgende">
        <div className="container next-case__inner">
          <div>
            <span className="mono">Volgende case</span>
            <span className="display h2 next-case__title">{next.client}</span>
          </div>
          <div className="next-case__media">
            {next.cover ? (
              <Picture name={next.cover.name} alt="" sizes="40vw" imgClassName="next-case__img" />
            ) : (
              <Placeholder label={next.client} />
            )}
          </div>
        </div>
      </ApertureLink>
    </article>
  );
}
