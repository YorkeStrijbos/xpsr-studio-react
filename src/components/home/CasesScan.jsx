import { ApertureLink } from '../Aperture.jsx';
import { Picture } from '../Media.jsx';
import NoSignal from '../NoSignal.jsx';
import { EASE, gsap } from '../../lib/motion.js';
import { filled } from '../../data/cases.js';
import { scramble } from '../../motion/scramble.js';

/** Eén kaart: technische laag eronder, echte laag erboven, onthuld door een rode laserlijn (--scan). */
export function ScanCard({ c, index }) {
  const visual = c.cover ? (
    <Picture name={c.cover.name} alt={c.cover.alt} sizes="(min-width: 768px) 40vw, 90vw" imgClassName="scan__img" />
  ) : (
    <NoSignal sub={c.client} />
  );
  return (
    <article className="scan" data-cursor="bekijk">
      <ApertureLink to={`/cases/${c.slug}`} className="scan__link" aria-label={`Bekijk de case ${c.client}`}>
        <div className="scan__media">
          <div className="scan__tech" aria-hidden="true">
            {visual}
          </div>
          <div className="scan__real">{visual}</div>
          <span className="scan__laser" aria-hidden="true" />
          <span className="scan__no mono">{`C-${String(index + 1).padStart(2, '0')}`}</span>
        </div>
      </ApertureLink>
      {/* Alleen ingevulde velden: placeholders zijn nooit zichtbaar. */}
      <dl className="scan__meta mono">
        {[
          ['Klant', c.client],
          ['Wat', c.made],
          ['Resultaat', c.result],
        ]
          .filter(([, v]) => filled(v))
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd data-scramble className={k === 'Resultaat' ? 'scan__result' : undefined}>
                {v}
              </dd>
            </div>
          ))}
      </dl>
      {filled(c.line) && <p className="scan__line">{c.line}</p>}
    </article>
  );
}

/** Koppelt scan + scramble aan een kaart. Met containerAnimation voor de horizontale variant. */
export function bindScan(card, extra = {}) {
  const meta = card.querySelectorAll('[data-scramble]');
  let done = false;
  return gsap.fromTo(
    card,
    { '--scan': '0%' },
    {
      '--scan': '100%',
      ease: EASE.linear,
      scrollTrigger: {
        trigger: card,
        scrub: true,
        ...extra,
        onUpdate: (self) => {
          if (self.progress > 0.98 && !done) {
            done = true;
            meta.forEach((m, i) => scramble(m, { delay: i * 0.08 }));
          } else if (self.progress < 0.02) {
            done = false;
          }
        },
      },
    },
  );
}
