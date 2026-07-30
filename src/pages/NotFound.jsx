import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { i18n } = useTranslation();
  const english = i18n.language.startsWith('en');

  return (
    <section className="section animate-fade-in">
      <div className="container" style={{ maxWidth: 680, textAlign: 'center', paddingBlock: '5rem' }}>
        <span className="overline">404</span>
        <h1>{english ? 'Page not found' : 'Η σελίδα δεν βρέθηκε'}</h1>
        <p className="text-lead">
          {english
            ? 'The address may be incorrect or the page may have moved.'
            : 'Η διεύθυνση μπορεί να είναι λάθος ή η σελίδα να έχει μετακινηθεί.'}
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          <Home size={17} /> {english ? 'Back to home' : 'Επιστροφή στην αρχική'}
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
