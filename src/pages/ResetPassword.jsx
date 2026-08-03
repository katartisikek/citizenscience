import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, KeyRound, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const { user, loading: authLoading, verifyPasswordRecovery, updatePassword, signOut } = useAuth();
  const recoveryTokenHash = new URLSearchParams(window.location.search).get('token_hash');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(Boolean(recoveryTokenHash));
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    if (!recoveryTokenHash) return;
    let active = true;

    verifyPasswordRecovery(recoveryTokenHash)
      .then(() => {
        if (!active) return;
        window.history.replaceState(window.history.state, '', '/reset-password');
      })
      .catch((err) => {
        if (active) setLinkError(err.message || 'Ο σύνδεσμος δεν είναι έγκυρος.');
      })
      .finally(() => {
        if (active) setVerifying(false);
      });

    return () => {
      active = false;
    };
  }, [recoveryTokenHash, verifyPasswordRecovery]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Ο νέος κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.');
      return;
    }
    if (password !== confirmation) {
      setError('Οι δύο κωδικοί δεν ταιριάζουν.');
      return;
    }

    setSaving(true);
    try {
      await updatePassword(password);
      await signOut();
      setSuccess(true);
      setPassword('');
      setConfirmation('');
    } catch (err) {
      setError(err.message || 'Η αλλαγή του κωδικού απέτυχε. Ζητήστε νέο σύνδεσμο επαναφοράς.');
    } finally {
      setSaving(false);
    }
  };

  const content = () => {
    if (success) {
      return (
        <div role="status" style={{ textAlign: 'center' }}>
          <CheckCircle size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem' }}>Ο κωδικός άλλαξε</h1>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            Μπορείτε πλέον να συνδεθείτε με τον νέο κωδικό σας.
          </p>
          <Link to="/login" className="btn btn-primary">Σύνδεση</Link>
        </div>
      );
    }

    if (authLoading || verifying) {
      return <p style={{ textAlign: 'center' }}>Έλεγχος συνδέσμου επαναφοράς...</p>;
    }

    if (linkError || !user) {
      return (
        <div role="alert" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Ο σύνδεσμος δεν είναι έγκυρος</h1>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            {linkError || 'Ο σύνδεσμος μπορεί να έχει λήξει ή να έχει ήδη χρησιμοποιηθεί.'}
          </p>
          <Link to="/forgot-password" className="btn btn-primary">Αποστολή νέου συνδέσμου</Link>
        </div>
      );
    }

    return (
      <>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <KeyRound color="var(--color-primary)" size={40} style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ορισμός νέου κωδικού</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
            Επιλέξτε έναν νέο κωδικό τουλάχιστον 8 χαρακτήρων.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="new-password"><Lock size={14} /> Νέος κωδικός</label>
            <input
              id="new-password"
              type="password"
              className="form-control"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password"><Lock size={14} /> Επιβεβαίωση κωδικού</label>
            <input
              id="confirm-password"
              type="password"
              className="form-control"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmation}
              onChange={event => setConfirmation(event.target.value)}
            />
          </div>
          {error && <p role="alert" style={{ color: '#c05530', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
            {saving ? 'Αποθήκευση...' : 'Αλλαγή κωδικού'}
          </button>
        </form>
      </>
    );
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: '2.5rem 2rem' }}>
        {content()}
      </div>
    </div>
  );
};

export default ResetPassword;
