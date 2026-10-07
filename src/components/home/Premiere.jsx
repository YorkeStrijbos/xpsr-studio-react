import { useLayoutEffect, useRef, useState } from 'react';
import { ApertureLink } from '../Aperture.jsx';
import { StencilPlaceholder } from '../Industrial.jsx';
import { LoopVideo, Picture } from '../Media.jsx';
import { gsap, prefersReducedMotion, SplitText } from '../../lib/motion.js';

// TODO XPSR: echte eindfilm, fotoselectie en reels per project aanleveren.
const PHOTOS = [
  { name: 'reym-locatie', alt: 'Luchtfoto van een REYM-locatie' },
  { name: 'one-love-cruise', alt: 'Steigerbouwers aan het werk' },
  { name: 'reym-een-dag-uit-het-leven-van-juri', alt: 'Juri van REYM met helm en masker' },
  { name: 'block-corporate', alt: 'Teamfoto in een witte studio' },
  { name: 'zwarte-boer-foodstyling', alt: 'Gestyled gerecht' },
];

/*
 * Fase 04 / Oplevering. Sluit aan op de exportbalk van de edit: twee toneelgordijnen schuiven dicht
 * terwijl de sectie binnenkomt ("Twee weken later. Première."). Gepind: de gordijnen slaan open en plooien op,
 * daarachter de eindfilm full-bleed en de drie opleveringen op het podium.
 * De film speelt pas als de gordijnen voor meer dan de helft open zijn.
 * Mobiel: geen pin, gordijnen openen vanzelf als de sectie in beeld komt. Reduced motion: meteen open.
 */
export default function Premiere() {
  const root = useRef(null);
  const [playing, setPlaying] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (prefersReducedMotion()) {
      el.classList.add('is-open');
      setPlaying(true);
      return;
    }
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 860px)', () => {
        const claim = new SplitText('.premiere__claim', { type: 'lines', mask: 'lines' });
        gsap.set('.premiere__stage > :not(.phase-slot)', { autoAlpha: 0 });

        // Dicht terwijl de sectie binnenschuift.
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: 1 } })
          .fromTo('.curtain--l', { xPercent: -100 }, { xPercent: 0, ease: 'power3.out' }, 0)
          .fromTo('.curtain--r', { xPercent: 100 }, { xPercent: 0, ease: 'power3.out' }, 0)
          .fromTo('.premiere__title', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.6);

        // Open: verschuiven en samenplooien (scaleX vanaf de buitenkant), daarna kort naslingeren.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1,
            onUpdate: (self) => setPlaying(self.progress > 0.35),
          },
        });
        tl.to({}, { duration: 0.4 })
          .to('.premiere__title', { autoAlpha: 0, duration: 0.15 })
          .to('.curtain--l', { scaleX: 0.22, skewX: 4, duration: 0.8, ease: 'power2.inOut' })
          .to('.curtain--r', { scaleX: 0.22, skewX: -4, duration: 0.8, ease: 'power2.inOut' }, '<')
          .to('.curtain', { skewX: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' })
          .fromTo('.premiere__film', { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6 }, '-=0.9')
          .to('.premiere__stage > :not(.phase-slot)', { autoAlpha: 1, duration: 0.01 }, '-=0.2')
          .from('.deliverable', { y: 80, autoAlpha: 0, stagger: 0.12, duration: 0.4, ease: 'back.out(1.6)' })
          .from(claim.lines, { yPercent: 110, stagger: 0.08, duration: 0.3 })
          .from('.premiere__cta', { autoAlpha: 0, y: 20, duration: 0.2 })
          .to({}, { duration: 0.3 });
        return () => claim.revert();
      });

      mm.add('(max-width: 859px)', () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 60%', onEnter: () => setPlaying(true) } })
          .to('.curtain--l', { scaleX: 0.22, duration: 1.6, ease: 'power2.inOut' })
          .to('.curtain--r', { scaleX: 0.22, duration: 1.6, ease: 'power2.inOut' }, '<')
          .to('.premiere__title', { autoAlpha: 0, duration: 0.3 }, '<');
      });
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="s-premiere premiere" aria-labelledby="premiere-title">
      <div className="premiere__theater">
        <div className="premiere__film">
          <LoopVideo name="loop-reym-juri" className="premiere__video" active={playing} label="eindfilm" />
        </div>
        <div className="premiere__vignette" aria-hidden="true" />

        <div className="premiere__stage container">
          <span className="mono phase-slot">Fase 04 / Oplevering</span>
          <h2 id="premiere-title" className="display premiere__claim">
            Opgeleverd. Klaar om gezien te worden.
          </h2>
          <ul className="premiere__deliverables">
            <li className="deliverable deliverable--film">
              <div className="deliverable__frame">
                <Picture name="reym-een-dag-uit-het-leven-van-juri" alt="" sizes="320px" imgClassName="deliverable__img" />
                <span className="deliverable__play" aria-hidden="true" />
              </div>
              <span className="mono">Film</span>
            </li>
            <li className="deliverable deliverable--photos">
              <div className="deliverable__fan">
                {PHOTOS.map((p, i) => (
                  <span key={p.name} className="deliverable__photo" style={{ '--i': i - 2 }}>
                    <Picture name={p.name} alt={p.alt} sizes="160px" />
                  </span>
                ))}
              </div>
              <span className="mono">Foto’s</span>
            </li>
            <li className="deliverable deliverable--reels">
              <div className="deliverable__phones">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="deliverable__phone">
                    {i === 1 ? <Picture name="rosel-bts" alt="Verticale social clip" sizes="90px" /> : <StencilPlaceholder label="9:16" />}
                  </span>
                ))}
              </div>
              <span className="mono">Reels</span>
            </li>
          </ul>
          <ApertureLink to="/contact" className="btn btn--primary premiere__cta">
            Plan een draaidag
          </ApertureLink>
        </div>
      </div>

      {/* Toneel: gordijnkap blijft staan, gordijnen schuiven. */}
      <div className="curtain curtain--l" aria-hidden="true" />
      <div className="curtain curtain--r" aria-hidden="true" />
      <div className="valance" aria-hidden="true" />
      <div className="premiere__title" aria-hidden="true">
        <p className="premiere__title-main">Twee weken later.</p>
        <p className="mono">Première</p>
      </div>
      <div className="premiere__spot" aria-hidden="true" />
    </section>
  );
}
