/* Herbruikbare lijntekening in camera-taal: wit lijnwerk op zwart, lijnen tekenen zichzelf (pathLength=1). */
import '../../styles/drawings.css';

/**
 * Technische tekening van een cinema-camera in zijaanzicht (lens links), met de zes onderdelen die bij de diensten horen.
 * Alle lijnen hebben pathLength=1 zodat ze zichzelf kunnen tekenen. Geschaald en gecentreerd rond (CX, CY).
 */
export function Camera({ rec = false }) {
  const L = (p) => <path className="cam__line" pathLength="1" {...p} />;
  const C = (p) => <circle className="cam__line" pathLength="1" {...p} />;
  // Afgeronde rechthoek als <path>: <rect> met pathLength tekent in Chrome niet altijd helemaal dicht.
  const R = (p) => {
    const [x, y, w, h] = [p.x, p.y, p.width, p.height].map(Number);
    const r = Math.min(Number(p.rx ?? 0), w / 2, h / 2);
    const d = `M${x + r} ${y}H${x + w - r}${r ? `A${r} ${r} 0 0 1 ${x + w} ${y + r}` : ''}V${y + h - r}${r ? `A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` : ''}H${x + r}${r ? `A${r} ${r} 0 0 1 ${x} ${y + h - r}` : ''}V${y + r}${r ? `A${r} ${r} 0 0 1 ${x + r} ${y}` : ''}Z`;
    return <path className="cam__line" pathLength="1" d={d} />;
  };
  const ridges = Array.from({ length: 14 }, (_, i) => 540 + i * 6);
  return (
    <g transform="translate(800 450) scale(0.86) translate(-757 -405)">
      {/* Body (Recruitmentfilm): behuizing, ventilatie, knoppen, viewfinder, accu, baseplate en rods */}
      <g data-part="body">
        <R x="700" y="380" width="240" height="180" rx="10" />
        <R x="716" y="396" width="120" height="70" rx="4" />
        <L d="M860 400v52M870 400v52M880 400v52M890 400v52M900 400v52M910 400v52" />
        <C cx="740" cy="500" r="9" />
        <C cx="770" cy="500" r="9" />
        <C cx="800" cy="500" r="9" />
        <C cx="905" cy="510" r="16" />
        <C cx="905" cy="510" r="7" />
        <circle className="cam__rec" cx="728" cy="398" r="5" style={{ opacity: rec ? 1 : 0 }} />
        <R x="716" y="530" width="70" height="14" rx="3" />
        <R x="940" y="388" width="34" height="30" rx="4" />
        <R x="974" y="384" width="26" height="38" rx="10" />
        <R x="940" y="430" width="44" height="116" rx="6" />
        <L d="M950 448h24M950 462h24M950 476h24" />
        <C cx="962" cy="528" r="3" />
        <C cx="972" cy="528" r="3" />
        <R x="700" y="560" width="260" height="14" rx="3" />
        <L d="M600 586H990M600 598H990" />
        <R x="640" y="580" width="22" height="24" rx="3" />
        <R x="930" y="580" width="22" height="24" rx="3" />
        <L d="M760 574l-10 30h140l-10-30" />
      </g>
      {/* Lens (Bedrijfsfilm): mount, tubus met focusring, opdruk, zonnekap */}
      <g data-part="lens">
        <R x="682" y="398" width="18" height="144" rx="3" />
        <R x="490" y="406" width="192" height="128" rx="6" />
        <L d={ridges.map((x) => `M${x} 412v116`).join('')} />
        <L d="M626 406v128M650 406v128" />
        <L d="M500 470h28" />
        <text x="634" y="476" className="cam__text" transform="rotate(-90 634 476)">24-70 f/2.8</text>
        <L d="M490 400l-60 -18v176l60 -18" />
        <L d="M440 392v156" />
      </g>
      {/* Microfoon (Explainer / productfilm): shotgun-mic in houder op de greep */}
      <g data-part="mic">
        <R x="500" y="286" width="230" height="24" rx="12" />
        <L d="M530 290v16M550 290v16M570 290v16M590 290v16M610 290v16M630 290v16" />
        <R x="660" y="282" width="16" height="32" rx="3" />
        <R x="700" y="282" width="16" height="32" rx="3" />
        <L d="M680 314v14h32v-14" />
      </g>
      {/* Greep met flitsschoen en flitser (Fotografie) */}
      <g data-part="flash">
        <L d="M730 380v-44M900 380v-44" />
        <R x="700" y="318" width="260" height="20" rx="10" />
        <R x="808" y="306" width="44" height="12" rx="2" />
        <R x="812" y="252" width="36" height="54" rx="4" />
        <R x="800" y="222" width="60" height="32" rx="4" />
        <L d="M808 230h44M808 238h44M808 246h44" />
      </g>
      {/* Zijmonitor op arm (Social content) */}
      <g data-part="screen">
        <L d="M960 328h18l14 -16" />
        <R x="990" y="270" width="118" height="78" rx="6" />
        <R x="1000" y="280" width="98" height="58" rx="2" />
        <L d="M1000 330l26 -22 18 14 22 -26 32 34" />
      </g>
      {/* Drone (Drone): zweeft naast de camera, zijaanzicht met rotoren, poten en gimbal */}
      <g data-part="drone">
        <R x="530" y="214" width="62" height="20" rx="8" />
        <L d="M530 222H486M592 222H636" />
        <R x="480" y="208" width="12" height="16" rx="2" />
        <R x="630" y="208" width="12" height="16" rx="2" />
        <L d="M452 206h68M602 206h68" />
        <L d="M546 234l-10 22h-10M576 234l10 22h10" />
        <C cx="561" cy="244" r="7" />
      </g>
    </g>
  );
}
