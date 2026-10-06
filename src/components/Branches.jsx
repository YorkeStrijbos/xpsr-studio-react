import { Picture } from './Media.jsx';
import { ALSO_ACTIVE, BRANCHES } from '../data/site.js';

export default function Branches() {
  return (
    <section className="section branches" aria-labelledby="branches-title">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="label label--red">Focus</span>
            <h2 id="branches-title" className="display h2">
              Drie branches
            </h2>
          </div>
          <p className="lead">{ALSO_ACTIVE}</p>
        </div>

        <ul className="branches__grid">
          {BRANCHES.map((b, i) => (
            <li key={b.id} className="branch">
              <div className="branch__media">
                <Picture name={b.media.name} alt={b.media.alt} sizes="(min-width: 860px) 33vw, 100vw" imgClassName="branch__img" />
              </div>
              <div className="branch__body">
                <span className="label">0{i + 1}</span>
                <h3 className="display h3">{b.name}</h3>
                <p className="muted">{b.line}</p>
                <p className="label branch__client">
                  Klant: <span>{b.client}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
