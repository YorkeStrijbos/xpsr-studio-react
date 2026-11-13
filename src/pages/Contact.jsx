import { useState } from 'react';
import { CONTACT } from '../data/site.js';
import { CONTACT_PAGE as T } from '../content/contact.js';
import { SERVICES } from '../content/home.js';
import { BRANCHES } from '../content/branches.js';
import { usePageTitle } from '../lib/usePageTitle.js';
import '../styles/pages.css';

/*
 * Contact: een kort aanvraagformulier en wat er daarna gebeurt.
 * Versturen opent het mailprogramma met een kant-en-klare mail naar XPSR (mailto): geen externe dienst,
 * geen opslag. TODO XPSR: later eventueel een formulierdienst kiezen; dan alleen handleSubmit aanpassen.
 */
export default function Contact() {
  usePageTitle('Contact', 'Plan een draaidag met XPSR Studio. Film, foto en social content, productiehuis uit Harderwijk.');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const what = f.getAll('what');
    const body = [
      `Wat: ${what.length ? what.join(', ') : '-'}`,
      `Branche: ${f.get('branche') || '-'}`,
      `Wanneer: ${f.get('when') || '-'}`,
      '',
      f.get('message') || '',
      '',
      `${f.get('name')}${f.get('company') ? `, ${f.get('company')}` : ''}`,
      f.get('email'),
      f.get('phone') || '',
    ].join('\n');
    const subject = `${T.form.subject}: ${f.get('company') || f.get('name')}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <header className="page-head container">
        <span className="mono label--red">{T.label}</span>
        <h1 className="display h1">{T.heading}</h1>
        <p className="lead">{T.lead}</p>
      </header>

      <section className="section container contact" aria-label={T.form.title}>
        <form className="contact__form" onSubmit={handleSubmit}>
          <fieldset className="contact__field">
            <legend className="label">{T.form.what}</legend>
            <div className="contact__chips">
              {SERVICES.map((s) => (
                <label key={s.code} className="contact__chip">
                  <input type="checkbox" name="what" value={s.title} />
                  <span>{s.title}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="contact__row">
            <label className="contact__field">
              <span className="label">{T.form.branche}</span>
              <select name="branche" defaultValue="">
                <option value="" disabled>
                  Kies een branche
                </option>
                {BRANCHES.map((b) => (
                  <option key={b.slug}>{b.name}</option>
                ))}
                <option>Anders</option>
              </select>
            </label>
            <label className="contact__field">
              <span className="label">{T.form.when}</span>
              <select name="when" defaultValue="">
                <option value="" disabled>
                  Kies
                </option>
                {T.form.whenOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="contact__field">
            <span className="label">{T.form.message}</span>
            <textarea name="message" rows={4} />
          </label>

          <div className="contact__row">
            <label className="contact__field">
              <span className="label">{T.form.name}</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label className="contact__field">
              <span className="label">{T.form.company}</span>
              <input name="company" autoComplete="organization" />
            </label>
          </div>
          <div className="contact__row">
            <label className="contact__field">
              <span className="label">{T.form.email}</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="contact__field">
              <span className="label">{T.form.phone}</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
          </div>

          <div className="contact__submit">
            <button type="submit" className="btn btn--primary">
              {T.form.submit}
            </button>
            <p className="contact__note" role="status">
              {sent ? T.form.sent : T.form.note}
            </p>
          </div>
        </form>

        <aside className="contact__side">
          <div>
            <h2 className="label">{T.steps.title}</h2>
            <ol className="contact__steps">
              {T.steps.items.map((s) => (
                <li key={s.no}>
                  <span className="mono contact__no">{s.no}</span>
                  <span className="display contact__step">{s.title}</span>
                  <span className="contact__line">{s.line}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="label">{T.direct}</h2>
            <p>
              <a href={`mailto:${CONTACT.email}`} className="link-arrow">
                {CONTACT.email}
              </a>
            </p>
            <p>
              <a href={CONTACT.phoneHref} className="link-arrow">
                {CONTACT.phone}
              </a>
            </p>
            <address className="contact__address">
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </address>
          </div>
        </aside>
      </section>
    </>
  );
}
