import { useState } from 'react';
import { Users, Shield, ShieldOff } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const roleLabels = {
  citizen: 'Πολίτης',
  researcher: 'Ερευνητής',
  entity: 'Φορέας',
  admin: 'Admin',
};

const AdminUsers = () => {
  const { profiles, updateUserRole } = useData();
  const { user, profile } = useAuth();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const adminCount = profiles.filter((p) => p.role === 'admin').length;

  const filtered = profiles.filter((p) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.email || '').toLowerCase().includes(q) ||
      (p.full_name || '').toLowerCase().includes(q)
    );
  });

  const promote = async (target) => {
    setError('');
    setBusyId(target.id);
    try {
      await updateUserRole(target.id, 'admin');
    } catch (err) {
      setError(err.message || 'Σφάλμα ενημέρωσης ρόλου');
    } finally {
      setBusyId(null);
    }
  };

  const demote = async (target) => {
    if (target.id === user?.id) {
      setError('Δεν μπορείτε να αφαιρέσετε τον δικό σας ρόλο admin.');
      return;
    }
    if (adminCount <= 1) {
      setError('Πρέπει να υπάρχει τουλάχιστον ένας admin.');
      return;
    }
    if (!window.confirm(`Αφαίρεση admin από ${target.email || target.full_name};`)) return;
    setError('');
    setBusyId(target.id);
    try {
      await updateUserRole(target.id, 'citizen');
    } catch (err) {
      setError(err.message || 'Σφάλμα ενημέρωσης ρόλου');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={28} /> Χρήστες & Admins
        </h1>
        <input
          className="form-control"
          style={{ maxWidth: 280 }}
          placeholder="Αναζήτηση email / όνομα"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
        Ορίστε άλλους administrators από εγγεγραμμένους χρήστες. Συνδεδεμένος: <strong>{profile?.email || user?.email}</strong>
      </p>

      {error && <p style={{ color: '#c05530', marginBottom: '1rem' }}>{error}</p>}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Όνομα</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Ρόλος</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem' }}>{p.full_name || '—'}</td>
                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{p.email || '—'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    background: p.role === 'admin' ? 'var(--primary-100)' : 'var(--color-border)',
                    color: p.role === 'admin' ? 'var(--primary-700)' : 'var(--color-text)',
                  }}>
                    {roleLabels[p.role] || p.role}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {p.role === 'admin' ? (
                    <button
                      className="btn btn-outline"
                      disabled={busyId === p.id || p.id === user?.id || adminCount <= 1}
                      onClick={() => demote(p)}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <ShieldOff size={14} /> Αφαίρεση Admin
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      disabled={busyId === p.id}
                      onClick={() => promote(p)}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Shield size={14} /> Ορισμός Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                  Δεν βρέθηκαν χρήστες. Βεβαιωθείτε ότι τρέξατε το migration και υπάρχουν εγγραφές στον πίνακα profiles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
