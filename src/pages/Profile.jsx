import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, LogOut, ClipboardList, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { summarizeObservationData } from '../lib/dataTypes';

const roleLabels = {
  citizen: 'Πολίτης',
  researcher: 'Ερευνητής',
  entity: 'Φορέας',
  admin: 'Admin',
};

const Profile = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { observations, projects } = useData();
  const navigate = useNavigate();

  if (authLoading) return <div className="section text-center">Φόρτωση...</div>;

  if (!user) {
    return (
      <div className="section text-center">
        <h1>Προφίλ</h1>
        <p className="text-lead" style={{ margin: '1rem auto 2rem' }}>Συνδεθείτε για να δείτε το προφίλ σας.</p>
        <Link to="/login" className="btn btn-primary">Σύνδεση</Link>
      </div>
    );
  }

  const myObservations = observations.filter(o => o.user_id === user.id);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="animate-fade-in section">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={32} color="var(--primary-700)" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{profile?.full_name || user.email}</h1>
              <p style={{ color: 'var(--color-text-light)', margin: 0 }}>{user.email}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                <span style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '0.2rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                  {roleLabels[profile?.role] || 'Πολίτης'}
                </span>
                {profile?.area && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-light)' }}>
                    <MapPin size={14} /> {profile.area}
                  </span>
                )}
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-outline">
              <LogOut size={16} /> Αποσύνδεση
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={22} /> Οι Παρατηρήσεις μου
          </h2>
          <Link to="/projects" className="btn btn-primary">
            <Camera size={16} /> Νέα Καταγραφή
          </Link>
        </div>

        {myObservations.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <Camera size={48} style={{ margin: '0 auto 1rem', opacity: 0.4, color: 'var(--primary-500)' }} />
            <p style={{ color: 'var(--color-text-light)' }}>Δεν έχετε υποβάλει παρατηρήσεις ακόμα.</p>
            <Link to="/projects" className="btn btn-primary mt-2">Βρείτε ένα Project</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myObservations.map(obs => {
              const project = projects.find(p => p.id === obs.project_id);
              const summary = summarizeObservationData(obs.data);
              return (
                <div key={obs.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {obs.photo_url && (
                    <img src={obs.photo_url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{project?.title || `Project #${obs.project_id}`}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: '0.25rem 0 0' }}>
                      {obs.lat != null && obs.lng != null ? `${Number(obs.lat).toFixed(4)}, ${Number(obs.lng).toFixed(4)}` : '—'}
                      {' · '}
                      {obs.created_at ? new Date(obs.created_at).toLocaleDateString('el-GR') : '—'}
                    </p>
                    {summary.length > 0 && (
                      <p style={{ fontSize: '0.85rem', margin: '0.35rem 0 0', color: 'var(--primary-700)' }}>
                        {summary.join(' · ')}
                      </p>
                    )}
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
                    background: obs.status === 'approved' ? 'var(--primary-100)' : obs.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                    color: obs.status === 'approved' ? 'var(--primary-700)' : obs.status === 'rejected' ? '#991b1b' : '#92400e',
                  }}>
                    {obs.status === 'approved' ? 'Εγκεκριμένη' : obs.status === 'rejected' ? 'Απορρίφθηκε' : 'Εκκρεμεί'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
