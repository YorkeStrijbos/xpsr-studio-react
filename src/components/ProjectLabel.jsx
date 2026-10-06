import { useProjectLabel } from '../context/ProjectLabelContext.jsx';

export default function ProjectLabel() {
  const { labelRef } = useProjectLabel();
  return (
    <div
      ref={labelRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 130,
        pointerEvents: 'none',
        opacity: 0,
        willChange: 'transform, opacity',
        fontFamily: "'Manrope',sans-serif",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#E31E24',
        whiteSpace: 'nowrap',
        transition: 'opacity .15s ease',
      }}
    />
  );
}
