import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple mock authentication for demo
    if (password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Λάθος κωδικός. Δοκιμάστε: admin123');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
        <Leaf color="var(--color-primary)" size={48} style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Admin Login</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>Είσοδος στο διαχειριστικό</p>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} /> Κωδικός Πρόσβασης
            </label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Εισάγετε τον κωδικό"
              required
            />
          </div>
          
          {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'left' }}>{error}</p>}
          
          <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%' }}>
            Σύνδεση
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
          Για το demo, ο κωδικός είναι <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;
