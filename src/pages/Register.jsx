import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { signUp, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', area: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        setError('Το Supabase δεν είναι ρυθμισμένο. Δείτε το .env.example');
        return;
      }
      await signUp(form);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Σφάλμα εγγραφής');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Leaf color="var(--color-primary)" size={40} style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Εγγραφή</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>Γίνετε Citizen Scientist</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><User size={14} /> Ονοματεπώνυμο</label>
            <input type="text" className="form-control" required value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label"><Mail size={14} /> Email</label>
            <input type="email" className="form-control" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label"><Lock size={14} /> Κωδικός</label>
            <input type="password" className="form-control" required minLength={6} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label"><MapPin size={14} /> Περιοχή / Δήμος</label>
            <input type="text" className="form-control" value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Ρόλος</label>
            <select className="form-control" value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="citizen">Πολίτης / Εθελοντής</option>
              <option value="researcher">Ερευνητής</option>
              <option value="entity">Φορέας / Δήμος</option>
            </select>
          </div>
          {error && <p style={{ color: '#c05530', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Εγγραφή...' : 'Δημιουργία Λογαριασμού'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
          Έχετε λογαριασμό; <Link to="/login">Σύνδεση</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
