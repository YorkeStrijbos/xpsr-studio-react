import CaseCard from '../components/CaseCard.jsx';
import CTA from '../components/CTA.jsx';
import { CASES } from '../data/cases.js';
import { usePageTitle } from '../lib/usePageTitle.js';

export default function Cases() {
  usePageTitle('Cases');
  return (
    <>
      <header className="page-head container">
        <span className="label label--red">Cases</span>
        <h1 className="display h1">Belicht werk</h1>
        <p className="lead">Foto, video en social voor horeca en food, industrie en techniek en events.</p>
      </header>

      <section className="section" aria-label="Alle cases">
        <div className="container cases-grid">
          {CASES.map((c, i) => (
            <CaseCard key={c.slug} c={c} index={i} variant="grid" sizes="(min-width: 860px) 50vw, 100vw" />
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
