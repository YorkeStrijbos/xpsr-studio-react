import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ApertureProvider } from './components/Aperture.jsx';
import { ReelProvider } from './components/Reel.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Cursor from './components/Cursor.jsx';
import Grain from './components/Grain.jsx';
import Home from './pages/Home.jsx';
import Cases from './pages/Cases.jsx';
import CaseDetail from './pages/CaseDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import { initSmoothScroll } from './lib/scroll.js';

export default function App() {
  useEffect(() => initSmoothScroll(), []);

  return (
    <ApertureProvider>
      <ReelProvider>
        <a href="#main" className="skip-link">
          Naar de inhoud
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:slug" element={<CaseDetail />} />
            <Route path="/over-ons" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Cursor />
        <Grain />
      </ReelProvider>
    </ApertureProvider>
  );
}
