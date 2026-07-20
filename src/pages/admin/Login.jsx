import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, isSupabaseConfigured } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { profile: loggedProfile } = await signIn(form);
        if (loggedProfile?.role !== 'admin') {
          setError('Αυτός ο λογαριασμός δεν έχει δικαιώματα διαχειριστή.');
          return;
        }
        navigate('/admin');
      } else {
        // Demo fallback when Supabase not configured
        if (form.password === 'admin123') {
          sessionStorage.setItem('admin_auth', 'true');
          navigate('/admin');
        } else {
          setError('Λάθος κωδικός.');
        }
      }
    } catch (err) {
      setError(err.message || 'Σφάλμα σύνδεσης');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
        <Leaf color="var(--color-primary)" size={48} style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Admin Login</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>Είσοδος στο διαχειριστικό</p>

        <form onSubmit={handleLogin}>
          {isSupabaseConfigured ? (
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label"><Mail size={16} /> Email Admin</label>
              <input type="email" className="form-control" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          ) : null}
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label"><Lock size={16} /> Κωδικός Πρόσβασης</label>
            <input type="password" className="form-control" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder={isSupabaseConfigured ? 'Κωδικός admin' : 'admin123 (demo)'} />
          </div>

          {error && <p style={{ color: '#c05530', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'left' }}>{error}</p>}

          <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Σύνδεση...' : 'Σύνδεση'}
          </button>
        </form>

        {!isSupabaseConfigured && (
          <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
            Demo mode — κωδικός: <strong>admin123</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
