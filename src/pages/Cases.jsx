import { useLayoutEffect, useRef, useState } from 'react';
import CasesWall from '../components/CasesWall.jsx';
import { ScanCard, bindScan } from '../components/home/CasesScan.jsx';
import { CASES } from '../data/cases.js';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/home.css';

const VIEWS = [
  { id: 'wall', label: 'Wall' },
  { id: 'lijst', label: 'Lijst' },
];

/*
 * Werk: de wall (beelden per branche, van de homepage verhuisd) of een lijst met alle cases.
 * TODO fase 5: lijstweergave met naam, branche, type en jaar en een video-preview die de cursor volgt; Flip bij filteren.
 */
export default function Cases() {
  usePageTitle('Werk');
  const [view, setView] = useState('wall');
  const list = useRef(null);

  useLayoutEffect(() => {
    if (view !== 'lijst') return;
    const cards = list.current.querySelectorAll('.scan');
    if (prefersReducedMotion()) {
      cards.forEach((c) => c.style.setProperty('--scan', '100%'));
      return;
    }
    const ctx = gsap.context(() => {
      cards.forEach((card) => bindScan(card, { start: 'top 85%', end: 'center 50%' }));
    }, list.current);
    return () => ctx.revert();
  }, [view]);

  return (
    <div>
      <header className="page-head container">
        <span className="mono label--red">Werk</span>
        <h1 className="display h1">Werk</h1>
        <div className="view-toggle" role="group" aria-label="Weergave">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" className={`cloud__chip ${view === v.id ? 'is-on' : ''}`} aria-pressed={view === v.id} onClick={() => setView(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
      </header>

      {view === 'wall' ? (
        <CasesWall />
      ) : (
        <section ref={list} className="section container" aria-label="Alle cases">
          <div className="cases-page">
            {CASES.map((c, i) => (
              <ScanCard key={c.slug} c={c} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
