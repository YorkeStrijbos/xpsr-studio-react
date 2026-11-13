import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ViewfinderLayer } from '../components/Viewfinder.jsx';
import { useAperture } from '../components/Aperture.jsx';
import HeroZoom from '../components/home/HeroZoom.jsx';
import Pain from '../components/home/Pain.jsx';
import AboutCream from '../components/home/AboutCream.jsx';
import CasesRail from '../components/home/CasesRail.jsx';
import ServicesList from '../components/home/ServicesList.jsx';
import { ScrollTrigger, gsap, prefersReducedMotion } from '../lib/motion.js';
import { buildStops, placeAt, registerViewfinder, travelTo } from '../motion/viewfinder.js';
import { homeStops, introStop } from '../motion/stops.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import { scrollToElement } from '../lib/scroll.js';
import '../styles/home.css';

export default function Home() {
  usePageTitle(null);
  const { ready } = useAperture();
  const { hash } = useLocation();

  // Ankers uit de nav (/#diensten): naar de sectie scrollen zodra de pins hun ruimte hebben ingenomen.
  useEffect(() => {
    if (!hash) return;
    const id = setTimeout(() => scrollToElement(document.querySelector(hash)), 120);
    return () => clearTimeout(id);
  }, [hash]);
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
    mm.add('(min-width: 0px)', (c) => {
      const stops = homeStops();
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

  return (
    <>
      <ViewfinderLayer ref={vfRef} />
      <HeroZoom />
      <Pain />
      <ServicesList />
      <CasesRail />
      <AboutCream />
    </>
  );
}
