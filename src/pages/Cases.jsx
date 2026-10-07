import { useLayoutEffect, useRef } from 'react';
import { ScanCard, bindScan } from '../components/home/CasesScan.jsx';
import { CASES } from '../data/cases.js';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/home.css';

export default function Cases() {
  usePageTitle('Cases');
  const grid = useRef(null);
  const industry = CASES.filter((c) => c.industry);
  const other = CASES.filter((c) => !c.industry);

  useLayoutEffect(() => {
    const cards = grid.current.querySelectorAll('.scan');
    if (prefersReducedMotion()) {
      cards.forEach((c) => c.style.setProperty('--scan', '100%'));
      return;
    }
    const ctx = gsap.context(() => {
      cards.forEach((card) => bindScan(card, { start: 'top 85%', end: 'center 50%' }));
    }, grid.current);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={grid}>
      <header className="page-head container">
        <span className="mono label--red">Cases</span>
        <h1 className="display h1">Uit de hal</h1>
        <p className="lead">Film, foto en social voor maakbedrijven, machinebouw, installatietechniek en industriële dienstverlening.</p>
      </header>

      <section className="section container" aria-label="Industrie">
        <div className="cases-page">
          {industry.map((c, i) => (
            <ScanCard key={c.slug} c={c} index={i} />
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="other-title">
        <h2 id="other-title" className="display h2 cases-page__sub">
          Ook buiten de hal
        </h2>
        <div className="cases-page">
          {other.map((c, i) => (
            <ScanCard key={c.slug} c={c} index={industry.length + i} />
          ))}
        </div>
      </section>
    </div>
  );
}
