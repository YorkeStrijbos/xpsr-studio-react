import { Picture } from './Media.jsx';
import NoSignal from './NoSignal.jsx';

/** Portret met zoekerhoeken. Gedeeld door het Over XPSR-paneel op de homepage en de Over ons-pagina. */
export default function Portrait({ p }) {
  return (
    <figure className="portrait">
      <div className="portrait__img">
        {p.portrait ? (
          <Picture name={p.portrait} alt={`Portret van ${p.name}`} sizes="(min-width: 768px) 22vw, 45vw" />
        ) : (
          <NoSignal sub={`Portret ${p.name.split(' ')[0]}`} />
        )}
      </div>
      <span className="portrait__c portrait__c--tl" aria-hidden="true" />
      <span className="portrait__c portrait__c--tr" aria-hidden="true" />
      <span className="portrait__c portrait__c--bl" aria-hidden="true" />
      <span className="portrait__c portrait__c--br" aria-hidden="true" />
      <figcaption>
        <span className="portrait__name">{p.name}</span>
        <span className="mono">{p.role}</span>
      </figcaption>
    </figure>
  );
}
