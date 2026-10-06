import { useRef, useState } from 'react';
import { ProjectLabelProvider } from './context/ProjectLabelContext.jsx';
import GrainOverlay from './components/GrainOverlay.jsx';
import ScrollProgressBar from './components/ScrollProgressBar.jsx';
import ProjectLabel from './components/ProjectLabel.jsx';
import HeaderLogo from './components/HeaderLogo.jsx';
import Lightbox from './components/Lightbox.jsx';
import TopBar from './components/TopBar.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquees from './components/Marquees.jsx';
import Statement from './components/Statement.jsx';
import Services from './components/Services.jsx';
import FeaturedWork from './components/FeaturedWork.jsx';
import Branches from './components/Branches.jsx';
import Philosophy from './components/Philosophy.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [showLightbox, setShowLightbox] = useState(false);
  const logoRef = useRef(null);

  return (
    <ProjectLabelProvider>
      <GrainOverlay />
      <ScrollProgressBar />
      <ProjectLabel />
      <HeaderLogo logoRef={logoRef} />

      <div style={{ position: 'relative', background: '#0b0908' }}>
        {showLightbox && <Lightbox open={showLightbox} onClose={() => setShowLightbox(false)} />}

        <TopBar />
        <Nav />
        <Hero logoRef={logoRef} onOpenLightbox={() => setShowLightbox(true)} />
        <Marquees />
        <Statement />
        <Services />
        <FeaturedWork />
        <Branches />
        <Philosophy />
        <CTA />
        <Footer />
      </div>
    </ProjectLabelProvider>
  );
}
