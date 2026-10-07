import { useEffect } from 'react';

const BASE = 'XPSR Studio';
const DEFAULT = `${BASE} | Film en foto voor de industrie`;

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : DEFAULT;
  }, [title]);
}
