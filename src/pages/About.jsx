import Team from '../components/Team.jsx';
import CTA from '../components/CTA.jsx';
import { ApertureLink } from '../components/Aperture.jsx';
import { BRANCHES, ALSO_ACTIVE, GUARANTEE } from '../data/site.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/pages.css';

export default function About() {
  usePageTitle('Over ons');
  return (
    <>
      <header className="page-head container">
        <span className="label label--red">Over ons</span>
        <h1 className="display h1">Exposure met bewijs</h1>
        <p className="lead">
          XPSR Studio is een productiehuis voor foto, video en social uit Harderwijk. We maken content die gezien
          wordt, en we laten zien dát hij gezien wordt.
        </p>
      </header>

      <section className="section container about__facts" aria-label="Waar we voor staan">
        <div className="about__fact">
          <h2 className="label label--red">Wat</h2>
          <p className="lead">Foto, video en social. Van één shoot tot maandelijkse content met strategie.</p>
        </div>
        <div className="about__fact">
          <h2 className="label label--red">Voor wie</h2>
          <p className="lead">
            {BRANCHES.map((b) => b.name).join(', ').replace(/, ([^,]*)$/, ' en $1')}. {ALSO_ACTIVE}
          </p>
        </div>
        <div className="about__fact">
          <h2 className="label label--red">Garantie</h2>
          <p className="lead">{GUARANTEE.body}</p>
        </div>
      </section>

      <Team />

      <section className="section container about__more">
        <ApertureLink to="/cases" className="link-arrow">
          Bekijk ons werk
        </ApertureLink>
      </section>

      <CTA />
    </>
  );
}
