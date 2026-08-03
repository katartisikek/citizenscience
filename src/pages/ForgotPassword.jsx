import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const { requestPasswordReset, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Η επαναφορά κωδικού απαιτεί σύνδεση με το Supabase.');
      }
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Η αποστολή του email απέτυχε. Δοκιμάστε ξανά.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <KeyRound color="var(--color-primary)" size={40} style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ξεχάσατε τον κωδικό;</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
            Εισαγάγετε το email του λογαριασμού σας και θα σας στείλουμε ασφαλή σύνδεσμο επαναφοράς.
          </p>
        </div>

        {sent ? (
          <div role="status">
            <div style={{ padding: '1rem', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              Αν υπάρχει λογαριασμός με αυτό το email, θα λάβετε σύντομα οδηγίες επαναφοράς. Ελέγξτε και τον φάκελο ανεπιθύμητης αλληλογραφίας.
            </div>
            <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={() => setSent(false)}>
              Αποστολή ξανά
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-email"><Mail size={14} /> Email</label>
              <input
                id="reset-email"
                type="email"
                className="form-control"
                required
                autoComplete="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </div>
            {error && <p role="alert" style={{ color: '#c05530', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Αποστολή...' : 'Αποστολή email επαναφοράς'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} /> Επιστροφή στη σύνδεση
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
