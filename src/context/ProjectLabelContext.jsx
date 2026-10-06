import { createContext, useContext, useMemo, useRef } from 'react';

const ProjectLabelContext = createContext(null);

export function ProjectLabelProvider({ children }) {
  const labelRef = useRef(null);

  const api = useMemo(() => ({
    labelRef,
    show(text) {
      const el = labelRef.current;
      if (!el) return;
      el.textContent = text || '';
      el.style.opacity = 1;
    },
    move(x, y) {
      const el = labelRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${x + 18}px, ${y + 10}px, 0)`;
    },
    hide() {
      const el = labelRef.current;
      if (!el) return;
      el.style.opacity = 0;
    },
  }), []);

  return (
    <ProjectLabelContext.Provider value={api}>
      {children}
    </ProjectLabelContext.Provider>
  );
}

export function useProjectLabel() {
  const ctx = useContext(ProjectLabelContext);
  if (!ctx) throw new Error('useProjectLabel must be used within ProjectLabelProvider');
  return ctx;
}
