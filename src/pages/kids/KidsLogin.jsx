import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKidsAuth } from '../../context/KidsAuthContext';
import '../../kids.css';

const KidsLogin = () => {
  const { login, loading, error, setError, isLoggedIn } = useKidsAuth();
  const navigate = useNavigate();
  const [classCode, setClassCode] = useState('');
  const [alias, setAlias] = useState('');
  const [pin, setPin] = useState('');

  if (isLoggedIn) {
    navigate('/kids');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classCode.trim() || !alias.trim() || !pin.trim()) {
      setError('Συμπλήρωσε όλα τα πεδία!');
      return;
    }
    try {
      await login(classCode, alias, pin);
      navigate('/kids');
    } catch {
      // Error is set in context
    }
  };

  return (
    <div className="kids-login">
      <div className="kids-login-card kids-animate-in">
        <div className="kids-login-mascot">🌿</div>
        <div className="kids-login-logo">
          <h1>Citizen Science Kids</h1>
          <p>Εξερεύνησε τη φύση γύρω σου!</p>
        </div>

        {error && <div className="kids-login-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="kids-input-group">
            <label className="kids-input-label">🏫 Κωδικός Τάξης</label>
            <input
              type="text"
              className="kids-input"
              placeholder="π.χ. ECO-B2-26"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              autoComplete="off"
              id="kids-class-code"
            />
          </div>

          <div className="kids-input-group">
            <label className="kids-input-label">👤 Ψευδώνυμο Μαθητή</label>
            <input
              type="text"
              className="kids-input"
              placeholder="π.χ. B2-0147"
              value={alias}
              onChange={(e) => setAlias(e.target.value.toUpperCase())}
              autoComplete="off"
              id="kids-alias"
            />
          </div>

          <div className="kids-input-group">
            <label className="kids-input-label">🔑 PIN</label>
            <input
              type="password"
              className="kids-input"
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={8}
              autoComplete="off"
              inputMode="numeric"
              id="kids-pin"
            />
          </div>

          <button
            type="submit"
            className="kids-btn kids-btn-primary kids-btn-lg kids-btn-block"
            disabled={loading}
            id="kids-login-btn"
          >
            {loading ? (
              <span>⏳ Σύνδεση...</span>
            ) : (
              <span>🚀 Ας ξεκινήσουμε!</span>
            )}
          </button>
        </form>

        <div style={{
          marginTop: 'var(--kids-space-xl)',
          textAlign: 'center',
          padding: 'var(--kids-space-md)',
          background: 'rgba(108, 99, 255, 0.04)',
          borderRadius: 'var(--kids-radius-md)',
          fontSize: '0.8rem',
          color: 'var(--kids-text-light)',
        }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>💡 Demo Mode</p>
          <p style={{ margin: 0 }}>Class: ECO-B2-26 · Alias: B2-0001 · PIN: 1234</p>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: 'var(--kids-space-md)',
        }}>
          <a
            href="/"
            style={{
              color: 'var(--kids-text-muted)',
              textDecoration: 'none',
              fontSize: '0.8rem',
            }}
          >
            ← Πίσω στο Citizen Science Hub
          </a>
        </div>
      </div>
    </div>
  );
};

export default KidsLogin;
