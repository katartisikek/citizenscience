import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, MapPin, LogOut, ClipboardList, Camera, Phone, FolderKanban, Plus, X, CheckCircle,
} from 'lucide-react';
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
  const {
    observations, projects, myProjects, joinProject, isMemberOf,
  } = useData();
  const navigate = useNavigate();
  const [showJoin, setShowJoin] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [joinError, setJoinError] = useState('');

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

  const myObservations = observations.filter((o) => o.user_id === user.id);
  const availableProjects = projects.filter(
    (p) => p.status === 'Ενεργό' && !isMemberOf(p.id, user.id)
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleJoin = async (projectId) => {
    setJoinError('');
    setJoiningId(projectId);
    try {
      await joinProject(projectId, user.id);
      setShowJoin(false);
    } catch (err) {
      setJoinError(err.message || 'Σφάλμα εγγραφής στο project');
    } finally {
      setJoiningId(null);
    }
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
              {profile?.phone && (
                <p style={{ color: 'var(--color-text-light)', margin: '0.25rem 0 0', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem' }}>
                  <Phone size={14} /> {profile.phone}
                </p>
              )}
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
            <button type="button" onClick={handleLogout} className="btn btn-outline">
              <LogOut size={16} /> Αποσύνδεση
            </button>
          </div>
        </div>

        {/* My Projects */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FolderKanban size={22} /> Τα Projects μου
          </h2>
          <button type="button" className="btn btn-primary" onClick={() => { setJoinError(''); setShowJoin(true); }}>
            <Plus size={16} /> Εγγραφή σε Project
          </button>
        </div>

        {myProjects.length === 0 ? (
          <div className="card text-center" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
            <FolderKanban size={48} style={{ margin: '0 auto 1rem', opacity: 0.4, color: 'var(--primary-500)' }} />
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
              Δεν έχετε εγγραφεί σε κάποιο project ακόμα.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setShowJoin(true)}>
              Δείτε διαθέσιμα Projects
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
            {myProjects.map((project) => (
              <div key={project.id} className="card" style={{ padding: '1.15rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {project.image && (
                  <img src={project.image} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                )}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <h4 style={{ margin: 0 }}>{project.title}</h4>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                    {project.area} · {project.status}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/projects/${project.id}`} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                    Λεπτομέρειες
                  </Link>
                  {project.status === 'Ενεργό' && (
                    <Link to={`/projects/${project.id}/collect`} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                      <Camera size={14} /> Καταγραφή
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Observations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <ClipboardList size={22} /> Οι Παρατηρήσεις μου
          </h2>
        </div>

        {myObservations.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <Camera size={48} style={{ margin: '0 auto 1rem', opacity: 0.4, color: 'var(--primary-500)' }} />
            <p style={{ color: 'var(--color-text-light)' }}>Δεν έχετε υποβάλει παρατηρήσεις ακόμα.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myObservations.map((obs) => {
              const project = projects.find((p) => p.id === obs.project_id);
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

      {/* Join modal */}
      {showJoin && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 120,
            background: 'rgba(20, 30, 40, 0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowJoin(false)}
        >
          <div
            className="card animate-fade-in"
            style={{ width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Εγγραφή σε Project</h3>
              <button type="button" onClick={() => setShowJoin(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              Επιλέξτε ένα ενεργό project για να συμμετέχετε.
            </p>
            {joinError && <p style={{ color: '#c05530', fontSize: '0.9rem' }}>{joinError}</p>}

            {availableProjects.length === 0 ? (
              <p style={{ color: 'var(--color-text-light)', textAlign: 'center', padding: '1.5rem 0' }}>
                Δεν υπάρχουν άλλα ενεργά projects για εγγραφή.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {availableProjects.map((project) => (
                  <div key={project.id} style={{
                    display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap',
                    padding: '0.85rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                  }}>
                    {project.image && (
                      <img src={project.image} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <strong>{project.title}</strong>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                        {project.area}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem' }}
                      disabled={joiningId === project.id}
                      onClick={() => handleJoin(project.id)}
                    >
                      <CheckCircle size={14} />
                      {joiningId === project.id ? 'Εγγραφή...' : 'Εγγραφή'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
