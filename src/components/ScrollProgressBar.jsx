import { useEffect, useRef } from 'react';

export default function ScrollProgressBar() {
  const progressRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
      if (progressRef.current) progressRef.current.style.width = pct + '%';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={progressRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 2,
        background: '#E31E24',
        zIndex: 150,
        width: '0%',
      }}
    />
  );
}
