import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getMotion } from '../lib/media.js';
import { SLOTS } from '../data/media.js';
import { lockScroll } from '../lib/scroll.js';
import '../styles/reel.css';

const ReelContext = createContext(() => {});

// Bron via het media-slot: /media/reel.mp4 zodra die er is, anders de fallback (zie src/data/media.js).
const REEL = SLOTS.reel;

export function ReelProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openReel = useCallback(() => setOpen(true), []);
  return (
    <ReelContext.Provider value={openReel}>
      {children}
      <ReelDialog open={open} onClose={() => setOpen(false)} />
    </ReelContext.Provider>
  );
}

export function useOpenReel() {
  return useContext(ReelContext);
}

function ReelDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const videoRef = useRef(null);
  const m = getMotion(REEL.fallback);
  const returnTo = useRef(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      // Onthouden waar de focus stond, zodat die bij sluiten terug naar de knop gaat.
      returnTo.current = document.activeElement;
      d.showModal();
      lockScroll(true);
      const v = videoRef.current;
      if (v && v.readyState === 0) v.load();
      v?.play().catch(() => {});
    } else if (!open) {
      if (d.open) d.close();
      // Bronnen zijn nu uit de DOM; opnieuw laden breekt de lopende download af.
      const v = videoRef.current;
      if (v && v.networkState !== HTMLMediaElement.NETWORK_EMPTY) v.load();
    }
  }, [open]);

  const handleClose = () => {
    videoRef.current?.pause();
    lockScroll(false);
    onClose();
    returnTo.current?.focus?.();
  };

  return (
    <dialog
      ref={dialogRef}
      className="reel"
      aria-label="Showreel XPSR Studio"
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="reel__frame">
        <video ref={videoRef} className="reel__video" poster={m.poster} controls playsInline loop preload="none">
          {open && <source src={REEL.file} type="video/mp4" />}
          {open && <source src={m.mp4} type="video/mp4" />}
          {open && m.webm && <source src={m.webm} type="video/webm" />}
        </video>
      </div>
      <button type="button" className="reel__close btn" onClick={() => dialogRef.current.close()}>
        Sluiten
      </button>
    </dialog>
  );
}
