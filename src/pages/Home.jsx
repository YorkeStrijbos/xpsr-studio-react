import Hero from '../components/Hero.jsx';
import LogoBar from '../components/LogoBar.jsx';
import Services from '../components/Services.jsx';
import CaseCard from '../components/CaseCard.jsx';
import Branches from '../components/Branches.jsx';
import Guarantee from '../components/Guarantee.jsx';
import Team from '../components/Team.jsx';
import CTA from '../components/CTA.jsx';
import { ApertureLink } from '../components/Aperture.jsx';
import { FEATURED } from '../data/cases.js';
import { usePageTitle } from '../lib/usePageTitle.js';

export default function Home() {
  usePageTitle(null);
  return (
    <>
      <Hero />
      <LogoBar />
      <Services />

      <section className="section" aria-labelledby="cases-title">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="label label--red">Uitgelicht</span>
              <h2 id="cases-title" className="display h2">
                Werk in beeld
              </h2>
            </div>
            <ApertureLink to="/cases" className="link-arrow">
              Alle cases
            </ApertureLink>
          </div>
          <div className="cases-feature">
            {FEATURED.map((c, i) => (
              <CaseCard key={c.slug} c={c} index={i} sizes="(min-width: 860px) 66vw, 100vw" />
            ))}
          </div>
        </div>
      </section>

      <Branches />
      <Guarantee />
      <Team />
      <CTA />
    </>
  );
}
