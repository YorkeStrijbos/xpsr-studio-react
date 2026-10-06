import { useEffect } from 'react';

const BASE = 'XPSR Studio';
const DEFAULT = `${BASE} | Foto, video en social uit Harderwijk`;

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : DEFAULT;
  }, [title]);
}
