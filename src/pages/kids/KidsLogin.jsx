import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      // Error handles in context
    }
  };

  return (
    <div className="kids-login">
      <div className="kids-login-card">
        {/* 3D Pixar Style Cartoon Mascot Avatar */}
        <img
          src="/assets/kids_mascot_hero.jpg"
          alt="Kids Cartoon Mascot"
          className="kids-mascot-avatar"
        />

        <h1 className="kids-login-title">Citizen Science Kids</h1>
        <p style={{ color: '#64748B', fontFamily: "'Quicksand', sans-serif", fontWeight: 600, marginBottom: '20px' }}>
          🌿 Εξερεύνησε τη φύση γύρω σου!
        </p>

        {error && (
          <div style={{
            background: '#FFE2E2', border: '2px solid #FF8E8E', color: '#D63031',
            padding: '10px 14px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px',
          }}>
            ⚠️ {error}
          </div>
        )}

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
            />
          </div>

          <div className="kids-input-group">
            <label className="kids-input-label">👤 Ψευδώνυμο Μαθητή</label>
            <input
              type="text"
              className="kids-input"
              placeholder="π.χ. B2-0001"
              value={alias}
              onChange={(e) => setAlias(e.target.value.toUpperCase())}
              autoComplete="off"
            />
          </div>

          <div className="kids-input-group">
            <label className="kids-input-label">🔑 4-Ψήφιο PIN</label>
            <input
              type="password"
              className="kids-input"
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={8}
              autoComplete="off"
              inputMode="numeric"
            />
          </div>

          <button
            type="submit"
            className="kids-btn kids-btn-primary"
            style={{ width: '100%', marginTop: '10px', fontSize: '1.2rem', padding: '16px' }}
            disabled={loading}
          >
            {loading ? <span>⏳ Σύνδεση...</span> : <span>🚀 Ας ξεκινήσουμε!</span>}
          </button>
        </form>

        <div style={{
          marginTop: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '16px',
          fontSize: '0.8rem', color: '#64748B', border: '2px dashed #CBD5E1',
        }}>
          💡 <strong>Demo Mode:</strong> Class: <code>ECO-B2-26</code> · Alias: <code>B2-0001</code> · PIN: <code>1234</code>
        </div>

        <div style={{ marginTop: '16px' }}>
          <Link to="/" style={{ color: '#6C63FF', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
            &larr; Πίσω στο Citizen Science Hub
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KidsLogin;
