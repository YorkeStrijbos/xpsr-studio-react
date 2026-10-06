export default function GrainOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        pointerEvents: 'none',
        opacity: 0.5,
        mixBlendMode: 'overlay',
        backgroundImage:
          'repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.09) 0, transparent 1px, transparent 2px)',
        backgroundSize: '3px 3px',
        animation: 'grainShift 0.4s steps(4) infinite',
      }}
    />
  );
}
