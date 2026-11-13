/**
 * Kop met precies één accentwoord: het laatste woord wordt rood (design system: hooguit één accentwoord per kop,
 * alleen op grote tekst). Geef `className` mee om de wrapper bijvoorbeeld als vaste regel te tonen.
 */
export default function Accent({ text, className }) {
  const words = text.split(' ');
  const last = words.pop();
  return (
    <span className={className}>
      {words.length > 0 && `${words.join(' ')} `}
      <span className="accent">{last}</span>
    </span>
  );
}
