import { forwardRef, useEffect, useRef, useState } from 'react';
import { getMotion, getStill } from '../lib/media.js';
import { useReducedMotion } from '../lib/motion.js';

export function Picture({ name, alt, sizes = '100vw', priority = false, className, imgClassName }) {
  const s = getStill(name);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={s.avif} sizes={sizes} />
      <source type="image/webp" srcSet={s.webp} sizes={sizes} />
      <img
        src={s.jpg}
        alt={alt}
        width={s.width}
        height={s.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={imgClassName}
        draggable="false"
      />
    </picture>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 1l9 5-9 5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor" />
    </svg>
  );
}

/**
 * Decoratieve video-loop: laadt pas vlak voor de viewport, speelt alleen als hij zichtbaar is,
 * en heeft altijd een pauzeknop. Bij reduced motion start hij gepauzeerd op de poster.
 */
export const LoopVideo = forwardRef(function LoopVideo(
  { name, className, eager = false, active = true, label = 'video' },
  forwardedRef,
) {
  const m = getMotion(name);
  const reduced = useReducedMotion();
  const ownRef = useRef(null);
  const ref = forwardedRef ?? ownRef;
  const [near, setNear] = useState(eager);
  const [visible, setVisible] = useState(eager);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: '25% 0px' },
    );
    // Herstel na een eerdere cleanup (StrictMode mount effecten twee keer).
    if (el.hasAttribute('src')) {
      el.removeAttribute('src');
      el.load();
    }
    io.observe(el);
    return () => {
      io.disconnect();
      // Download expliciet afbreken: een verwijderde <video> houdt anders zijn verbinding open.
      // Een src-attribuut gaat voor de <source>-kinderen, dus een lege src stopt het laden.
      el.pause();
      el.setAttribute('src', '');
      el.load();
    };
  }, [ref]);

  const shouldPlay = near && visible && active && !paused && !reduced;

  // Bronnen worden pas toegevoegd als de video in de buurt komt; daarna opnieuw laden.
  useEffect(() => {
    if (near && !eager) ref.current?.load();
  }, [near, eager, ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !near) return;
    if (shouldPlay) el.play().catch(() => {});
    else el.pause();
  }, [shouldPlay, near, ref]);

  return (
    <>
      <video
        ref={ref}
        className={className}
        poster={m.poster}
        width={m.width}
        height={m.height}
        muted
        loop
        playsInline
        preload={near ? 'auto' : 'none'}
        aria-hidden="true"
        tabIndex={-1}
      >
        {near && <source src={m.mp4} type="video/mp4" />}
        {near && m.webm && <source src={m.webm} type="video/webm" />}
      </video>
      {!reduced && (
        <button
          type="button"
          className="media-toggle"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? `Speel ${label} af` : `Pauzeer ${label}`}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
      )}
    </>
  );
});
