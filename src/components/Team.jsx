import { Picture } from './Media.jsx';
import { TEAM } from '../data/site.js';

export default function Team({ headingLevel = 2 }) {
  const H = `h${headingLevel}`;
  return (
    <section className="section team" aria-labelledby="team-title">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="label label--red">De ringmasters</span>
            <H id="team-title" className="display h2">
              Onder de spot
            </H>
          </div>
          <p className="lead">Twee oprichters, één team. Je praat met de mensen die het ook maken.</p>
        </div>

        <ul className="team__grid">
          {TEAM.map((p) => (
            <li key={p.name} className="person">
              <div className="person__portrait">
                {p.portrait ? (
                  <Picture name={p.portrait} alt={`Portret van ${p.name}`} sizes="(min-width: 860px) 40vw, 100vw" />
                ) : (
                  <div className="placeholder">
                    <span className="label">[PLACEHOLDER] Portret {p.name.split(' ')[0]}</span>
                  </div>
                )}
              </div>
              <h3 className="display h3">{p.name}</h3>
              <p className="label person__role">{p.role}</p>
              <p className="muted">{p.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
