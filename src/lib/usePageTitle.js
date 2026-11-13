import { useEffect } from 'react';
import { META } from '../content/home.js';

const BASE = 'XPSR Studio';

/** Titel en meta-description per pagina. Zonder titel: de standaard van de homepage. */
export function usePageTitle(title, description = META.description) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : META.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
