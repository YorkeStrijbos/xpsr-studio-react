import { useEffect, useRef } from 'react';
import { ApertureLink } from './Aperture.jsx';
import { Picture } from './Media.jsx';
import { gsap, prefersReducedMotion } from '../lib/motion.js';

/** Metadata in camerastijl: klant, branche, wat gemaakt is, resultaat. */
export function CaseMeta({ c, as: Tag = 'dl', className = '' }) {
  return (
    <Tag className={`case-meta ${className}`}>
      <div>
        <dt className="label">Klant</dt>
        <dd>{c.client}</dd>
      </div>
      <div>
        <dt className="label">Branche</dt>
        <dd>{c.branch}</dd>
      </div>
      <div>
        <dt className="label">Gemaakt</dt>
        <dd>{c.made}</dd>
      </div>
      <div>
        <dt className="label">Resultaat</dt>
        <dd className="case-meta__result">{c.result}</dd>
      </div>
    </Tag>
  );
}

/**
 * Casekaart. Het beeld start onderbelicht en "ontwikkelt" tijdens het scrollen naar volle belichting.
 */
export default function CaseCard({ c, index, sizes, variant = 'feature' }) {
  const mediaRef = useRef(null);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { filter: 'brightness(0.12) contrast(1.25) saturate(0.4)' },
      {
        filter: 'brightness(1) contrast(1) saturate(1)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'center 55%', scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <article className={`case-card case-card--${variant}`}>
      <ApertureLink to={`/cases/${c.slug}`} className="case-card__link" aria-label={`Bekijk de case ${c.client}`}>
        <div className="case-card__media">
          <div ref={mediaRef} className="case-card__develop">
            <Picture name={c.cover.name} alt={c.cover.alt} sizes={sizes} imgClassName="case-card__img" />
          </div>
          <span className="case-card__frame label" aria-hidden="true">
            {String(index + 1).padStart(2, '0')} / {c.client}
          </span>
        </div>
      </ApertureLink>
      <CaseMeta c={c} />
    </article>
  );
}
