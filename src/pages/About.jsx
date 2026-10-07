import AboutStack from '../components/home/AboutStack.jsx';
import DayTimeline from '../components/home/DayTimeline.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/home.css';

export default function About() {
  usePageTitle('Over ons');
  return (
    <>
      <header className="page-head container">
        <span className="mono label--red">Over ons</span>
        <h1 className="display h1">Industrie in het juiste licht</h1>
        <p className="lead">
          Een productiehuis uit Harderwijk voor film, foto en social. We komen binnen waar anderen niet mogen draaien, en
          laten zien wat jullie bouwen.
        </p>
      </header>
      <AboutStack />
      <DayTimeline />
    </>
  );
}
