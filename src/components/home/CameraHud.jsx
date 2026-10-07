import { CAMERA_HUD } from '../../data/site.js';

const HISTO = [3, 5, 8, 12, 15, 18, 20, 21, 19, 16, 14, 13, 11, 9, 7, 6, 5, 4, 3, 2];
const LEVELS = [0.9, 0.75, 0.82, 0.6, 0.7, 0.4];

/** Camera-zoeker: kaderhoeken, derdenlijnen, middenkruis en de waarden die we tijdens het draaien bewaken. */
export default function CameraHud({ className = '' }) {
  return (
    <div className={`hud ${className}`} aria-hidden="true">
      <span className="hud__third hud__third--v1" />
      <span className="hud__third hud__third--v2" />
      <span className="hud__third hud__third--h1" />
      <span className="hud__third hud__third--h2" />
      <span className="hud__cross" />

      <span className="hud__frame hud__frame--tl" />
      <span className="hud__frame hud__frame--tr" />
      <span className="hud__frame hud__frame--bl" />
      <span className="hud__frame hud__frame--br" />

      <div className="hud__c hud__c--tl">
        <span className="mono">
          <span className="hud__rec" /> {CAMERA_HUD.tl[0]}
        </span>
        <span className="mono">{CAMERA_HUD.tl[1]}</span>
      </div>
      <div className="hud__c hud__c--tr">
        {CAMERA_HUD.tr.map((t) => (
          <span key={t} className="mono">
            {t}
          </span>
        ))}
      </div>
      <div className="hud__c hud__c--bl">
        <svg className="hud__histo" viewBox="0 0 64 24">
          {HISTO.map((h, i) => (
            <rect key={i} x={i * 3.2} y={24 - h} width="2.4" height={h} />
          ))}
        </svg>
        {CAMERA_HUD.bl.map((t) => (
          <span key={t} className="mono">
            {t}
          </span>
        ))}
      </div>
      <div className="hud__c hud__c--br">
        <span className="hud__levels">
          {LEVELS.map((l, i) => (
            <span key={i} style={{ '--l': l }} />
          ))}
        </span>
        {CAMERA_HUD.br.map((t) => (
          <span key={t} className="mono">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
