import { CAMERA_HUD } from '../../data/site.js';

const HISTO = [3, 5, 8, 12, 15, 18, 20, 21, 19, 16, 14, 13, 11, 9, 7, 6, 5, 4, 3, 2];
const LEVELS = [0.9, 0.75, 0.82, 0.6, 0.7, 0.4];

/**
 * Camera-zoeker, rustig: derdenlijnen, vier kaderhoeken, en per hoek één regel
 * (REC met timecode, instellingen, histogram met zebra, audiometers).
 */
export default function CameraHud({ className = '' }) {
  return (
    <div className={`hud ${className}`} aria-hidden="true">
      <span className="hud__third hud__third--v1" />
      <span className="hud__third hud__third--v2" />
      <span className="hud__third hud__third--h1" />
      <span className="hud__third hud__third--h2" />

      <span className="hud__frame hud__frame--tl" />
      <span className="hud__frame hud__frame--tr" />
      <span className="hud__frame hud__frame--bl" />
      <span className="hud__frame hud__frame--br" />

      <span className="mono hud__c hud__c--tl">
        <span className="hud__rec" /> {CAMERA_HUD.rec}
      </span>
      <span className="mono hud__c hud__c--tr">{CAMERA_HUD.spec}</span>
      <span className="mono hud__c hud__c--bl">
        <svg className="hud__histo" viewBox="0 0 64 24">
          {HISTO.map((h, i) => (
            <rect key={i} x={i * 3.2} y={24 - h} width="2.4" height={h} />
          ))}
        </svg>
        {CAMERA_HUD.zebra}
      </span>
      <span className="mono hud__c hud__c--br">
        {CAMERA_HUD.audio}
        <span className="hud__levels">
          {LEVELS.map((l, i) => (
            <span key={i} style={{ '--l': l }} />
          ))}
        </span>
      </span>
    </div>
  );
}
