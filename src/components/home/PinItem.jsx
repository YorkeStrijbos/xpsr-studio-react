import { StencilPlaceholder } from '../Industrial.jsx';

/* Kleine schetsjes in potloodstijl voor storyboard-strook, machineschets en plattegrond. */
const STRIP = ['M2 22H38M8 22L16 10H26L34 22', 'M10 24V12a6 6 0 0 1 12 0V24M16 8a3 3 0 1 0 0.1 0', 'M4 20C12 16 20 15 28 17M28 17L36 12', 'M4 6H36V24H4ZM14 12H26'];

function Fix({ fix }) {
  if (fix === 'tape') return <span className="pin__tape" aria-hidden="true" />;
  if (fix === 'pin') return <span className="pin__pin" aria-hidden="true" />;
  return null;
}

function Body({ it }) {
  switch (it.kind) {
    case 'polaroid':
    case 'slate':
      return (
        <div className="pol">
          <div className="pol__img">
            {it.kind === 'slate' ? (
              <svg viewBox="0 0 60 44" className="pol__slate">
                <path d="M6 18H54V40H6Z M6 10L52 4L54 12L8 18Z" />
                <path d="M14 9L18 16M26 7L30 14M38 6L42 13" />
              </svg>
            ) : (
              <StencilPlaceholder label="Foto volgt" />
            )}
          </div>
          <p className="pol__caption">{it.caption}</p>
        </div>
      );
    case 'script':
      return (
        <div className="paper paper--script">
          <p className="paper__head">{it.head}</p>
          <p>{it.body}</p>
        </div>
      );
    case 'postit':
      return <div className="postit">{it.text}</div>;
    case 'note':
      return <div className="paper paper--note">{it.text}</div>;
    case 'strip':
      return (
        <div className="paper paper--strip">
          {STRIP.map((d, i) => (
            <svg key={i} viewBox="0 0 40 28">
              <path d={d} />
            </svg>
          ))}
        </div>
      );
    case 'sketch':
      return (
        <div className="paper paper--sketch">
          <svg viewBox="0 0 120 80">
            <path d="M20 50H90V64H20ZM34 30H76V50H34ZM46 18H64V30H46Z" />
            <path className="red" d="M96 40C106 40 110 30 104 22M100 26L104 20L108 27" />
            <path className="red" d="M14 20L28 32M28 32L20 31M28 32L27 24" />
          </svg>
          <p className="paper__hand">onderdeel B</p>
        </div>
      );
    case 'contact':
      return (
        <div className="contact-sheet">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={i === 5 ? 'is-picked' : ''} />
          ))}
        </div>
      );
    case 'map':
      return (
        <div className="paper paper--map">
          <svg viewBox="0 0 140 90">
            <path d="M10 10H60V40H10ZM72 14H130V54H72ZM18 52H58V82H18ZM70 62H110V82H70Z" />
            <path className="red dashed" d="M30 86C40 60 70 70 90 40S120 20 132 8" />
            <circle className="red" cx="30" cy="86" r="3" />
          </svg>
        </div>
      );
    case 'reels':
      return (
        <div className="reels">
          {[0, 1, 2].map((i) => (
            <div key={i} className="pol pol--tall">
              <div className="pol__img">
                <StencilPlaceholder label="9:16" />
              </div>
            </div>
          ))}
        </div>
      );
    case 'callsheet':
      return (
        <div className="paper paper--call">
          <p className="paper__head">Callsheet / dag 01</p>
          <dl>
            <div>
              <dt>Datum</dt>
              <dd>[PLACEHOLDER]</dd>
            </div>
            <div>
              <dt>Locatie</dt>
              <dd>Jouw hal</dd>
            </div>
            <div>
              <dt>Crew</dt>
              <dd>Yorke, Liam</dd>
            </div>
            <div>
              <dt>VCA</dt>
              <dd>Ja</dd>
            </div>
          </dl>
        </div>
      );
    case 'gaffer':
      return (
        <svg className="gaffer" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" />
          <circle cx="50" cy="50" r="20" />
          <path d="M50 6H96V24H58" />
        </svg>
      );
    default:
      return null;
  }
}

/** Eén item op het prikbord. Positie en scheefstand komen uit PIN_ITEMS (zie site.js). */
export default function PinItem({ it, index, positioned = true }) {
  const style = positioned ? { left: `${it.x}%`, top: `${it.y}%`, '--rot': `${it.rot}deg` } : { '--rot': `${it.rot}deg` };
  return (
    <div
      className={`pin pin--${it.kind}`}
      style={style}
      data-service={it.s ?? ''}
      data-rot={it.rot}
      data-index={index}
      data-cursor={it.kind === 'polaroid' ? 'BEKIJK' : undefined}
    >
      <Fix fix={it.fix} />
      <Body it={it} />
    </div>
  );
}
