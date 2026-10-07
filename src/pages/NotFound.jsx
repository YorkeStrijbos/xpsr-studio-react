import { ApertureLink } from '../components/Aperture.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';

export default function NotFound() {
  usePageTitle('Niet gevonden');
  return (
    <header className="page-head page-head--center container">
      <span className="mono label--red">404</span>
      <h1 className="display h1">Onderbelicht</h1>
      <p className="lead">Deze pagina bestaat niet, of staat nog in het donker.</p>
      <ApertureLink to="/" className="btn btn--primary">
        Terug naar home
      </ApertureLink>
    </header>
  );
}
