import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useKidsData } from '../../context/KidsDataContext';

const TeacherLogin = () => {
  const { teacherLogin, teacherUser } = useKidsData();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (teacherUser) {
    navigate('/teacher');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      teacherLogin(email, password);
      navigate('/teacher');
    } catch (err) {
      setError(err.message || 'Αποτυχία σύνδεσης. Ελέγξτε τα στοιχεία σας.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0F172A',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#1E293B',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        padding: '2rem',
        color: 'white',
      }}>
        {/* Header Icon */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px',
          backgroundColor: '#0EA5E9', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem auto', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)',
        }}>
          <School size={28} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', margin: '0 0 0.25rem 0' }}>
          Πύλη Εκπαιδευτικών
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          Συνδεθείτε για να διαχειριστείτε τις τάξεις και τους μαθητές σας.
        </p>

        {error && (
          <div style={{
            backgroundColor: '#451A1A', border: '1px solid #7F1D1D', color: '#FCA5A5',
            padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 600,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Email Εκπαιδευτικού
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="m.papadopoulou@sch.gr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px',
                  color: 'white', fontSize: '0.95rem', outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Κωδικός Πρόσβασης
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px',
                  color: 'white', fontSize: '0.95rem', outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#0EA5E9', color: 'white', border: 'none',
              padding: '0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              marginTop: '0.5rem', transition: 'background-color 0.2s',
            }}
          >
            <span>{loading ? 'Σύνδεση...' : 'Είσοδος στην Πύλη'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div style={{
          marginTop: '1.5rem', padding: '0.85rem', backgroundColor: '#0F172A',
          borderRadius: '8px', border: '1px dashed #334155', fontSize: '0.8rem', color: '#94A3B8',
        }}>
          💡 <strong>Δοκιμαστικός Λογαριασμός Εκπαιδευτικού:</strong><br />
          Email: <code style={{ color: '#38BDF8' }}>m.papadopoulou@sch.gr</code><br />
          Password: <code style={{ color: '#38BDF8' }}>teacher123</code>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#94A3B8', fontSize: '0.85rem', textDecoration: 'none' }}>
            &larr; Πίσω στον Αρχικό Ιστότοπο
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
