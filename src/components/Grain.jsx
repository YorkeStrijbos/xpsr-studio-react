import { useEffect, useRef } from 'react';

const TILE = 160;

/*
 * Filmkorrel. Eén ruistegel van 160 px, één keer op een canvas gegenereerd, als herhaalde achtergrond
 * van een vaste laag. Die laag verspringt in stappen (CSS, ~10 fps): alleen transform, dus geen repaint per frame.
 * Boven lichte vlakken (html.is-light, zie motion/surface.js) valt de korrel weg.
 */
export default function Grain() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = TILE;
    canvas.height = TILE;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(TILE, TILE);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    ref.current.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
  }, []);

  return <div ref={ref} className="grain" aria-hidden="true" />;
}
