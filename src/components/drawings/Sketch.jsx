/* Storyboard-schetsen per shot (viewBox 160 x 90). Wit lijnwerk op zwart; rood = camerabeweging. */
import '../../styles/drawings.css';

export function Sketch({ kind }) {
  const L = (p) => <path className="sketch__ink" pathLength="1" {...p} />;
  const R = (p) => <path className="sketch__ink sketch__ink--red" pathLength="1" {...p} />;
  switch (kind) {
    case 'wide':
      return (
        <>
          <L d="M0 62L160 62M20 62L60 30H100L140 62" />
          <L d="M30 62V44H52V62M108 62V40H132V62" />
          <L d="M60 30V14H100V30M70 14V6H90V14" />
          <L d="M78 62V52a3 3 0 0 1 6 0V62M81 49a3 3 0 1 0 0.1 0" />
          <R d="M22 80H138M130 76L138 80L130 84" />
        </>
      );
    case 'medium':
      return (
        <>
          <L d="M90 88V60c0-10 8-16 18-16s18 6 18 16v28" />
          <L d="M108 42a10 10 0 1 0 0.1 0M98 34h20a10 6 0 0 0-20 0" />
          <L d="M12 88V50H70V88M18 56H64V70H18Z" />
          <L d="M70 64H92" />
        </>
      );
    case 'close':
      return (
        <>
          <L d="M20 70C40 60 58 58 74 62L92 66M30 82C48 74 62 72 80 74" />
          <L d="M92 66L120 58M116 52L124 64" />
          <R d="M122 58l14-10M124 60l18 0M122 62l12 12M120 56l4-16" />
          <L d="M0 86H160" />
        </>
      );
    case 'interview':
      return (
        <>
          <L d="M53 0V90M107 0V90M0 30H160M0 60H160" className="sketch__ink sketch__ink--guide" />
          <L d="M96 90V66c0-10 8-16 18-16s18 6 18 16v24" />
          <L d="M114 48a10 10 0 1 0 0.1 0" />
          <L d="M20 20h22v14h-22z" />
        </>
      );
    case 'drone':
      return (
        <>
          <L d="M10 12H70V40H10ZM84 18H150V60H84ZM20 52H66V82H20Z" />
          <L d="M0 46H160M76 0V90" />
          <L d="M100 30h30v18h-30z" />
          <R d="M80 70L80 50M74 56L80 48L86 56" />
        </>
      );
    case 'end':
      return (
        <>
          <L d="M48 30H112V52H48Z" />
          <L d="M58 38H102M58 44H90" />
          <L d="M62 64H98V74H62Z" />
          <R d="M54 26L106 26" />
        </>
      );
    default:
      return null;
  }
}
