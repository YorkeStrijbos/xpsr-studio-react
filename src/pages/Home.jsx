import { useCallback, useLayoutEffect, useRef } from 'react';
import { ViewfinderLayer } from '../components/Viewfinder.jsx';
import { useAperture } from '../components/Aperture.jsx';
import HeroV2 from '../components/home/HeroV2.jsx';
import Statement from '../components/home/Statement.jsx';
import Pain from '../components/home/Pain.jsx';
import CasesScan from '../components/home/CasesScan.jsx';
import Blueprint from '../components/home/Blueprint.jsx';
import Conveyor from '../components/home/Conveyor.jsx';
import AboutStack from '../components/home/AboutStack.jsx';
import DayTimeline from '../components/home/DayTimeline.jsx';
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText } from '../lib/motion.js';
import { buildStops, placeAt, registerViewfinder, travelTo } from '../motion/viewfinder.js';
import { homeStops, introStop } from '../motion/stops.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/home.css';

export default function Home() {
  usePageTitle(null);
  const { ready } = useAperture();
  const stopsRef = useRef(null);

  // Callback-ref: het vizier moet geregistreerd zijn vóór de layout-effecten van de secties draaien.
  const vfRef = useCallback((node) => {
    if (node && !prefersReducedMotion()) {
      registerViewfinder(node);
      placeAt(introStop());
    }
  }, []);

  // Vizier: scrubbed rollen per sectie.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add({ wide: '(min-width: 860px)', narrow: '(max-width: 859px)' }, (c) => {
      const stops = homeStops(c.conditions.wide);
      stopsRef.current = stops;
      // Wachten tot alle secties hun pins hebben gezet, dan pas de overgangen bouwen.
      const id = requestAnimationFrame(() => {
        c.add(() => buildStops(stops)); // binnen de context, zodat revert ze opruimt
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      return () => cancelAnimationFrame(id);
    });
    return () => mm.revert();
  }, []);

  // Na de preloader reist het vizier van het logo naar zijn plek in de hero.
  useLayoutEffect(() => {
    if (!ready || prefersReducedMotion() || window.scrollY > 10) return;
    const t = setTimeout(() => stopsRef.current && travelTo(stopsRef.current[0], 1.2), 50);
    return () => clearTimeout(t);
  }, [ready]);

  // Koppen: regels komen op uit een masker; maximaal drie "stempel"-koppen.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.s-conveyor .h2, .s-dayline .h2').forEach((h) => {
        const split = new SplitText(h, { type: 'lines', mask: 'lines' });
        gsap.from(split.lines, { yPercent: 110, stagger: 0.08, duration: 0.9, ease: 'xpsr', scrollTrigger: { trigger: h, start: 'top 85%' } });
      });
      gsap.utils.toArray('[data-stamp]').slice(0, 3).forEach((h) => {
        gsap
          .timeline({ scrollTrigger: { trigger: h, start: 'top 80%' } })
          .from(h, { scale: 1.4, autoAlpha: 0, duration: 0.35, ease: 'power4.in' })
          .to(h, { x: 2, duration: 0.04, repeat: 5, yoyo: true, ease: 'none' })
          .set(h, { x: 0 });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <ViewfinderLayer ref={vfRef} />
      <HeroV2 />
      <Statement />
      <Pain />
      <CasesScan />
      <Blueprint />
      <Conveyor />
      <AboutStack />
      <DayTimeline />
    </>
  );
}
