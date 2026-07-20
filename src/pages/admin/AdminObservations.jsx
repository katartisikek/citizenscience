import { useData } from '../../context/DataContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { summarizeObservationData } from '../../lib/dataTypes';

const AdminObservations = () => {
  const { observations, projects, updateObservationStatus } = useData();

  const statusBadge = (status) => {
    const map = { pending: 'Εκκρεμεί', approved: 'Εγκεκριμένη', rejected: 'Απορρίφθηκε' };
    return map[status] || status;
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Παρατηρήσεις</h1>
      {observations.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
          Δεν υπάρχουν παρατηρήσεις ακόμα.
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Project</th>
                <th style={{ padding: '1rem' }}>Δεδομένα</th>
                <th style={{ padding: '1rem' }}>Τοποθεσία</th>
                <th style={{ padding: '1rem' }}>Ημερομηνία</th>
                <th style={{ padding: '1rem' }}>Κατάσταση</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {observations.map(obs => {
                const project = projects.find(p => p.id === obs.project_id);
                const summary = summarizeObservationData(obs.data);
                return (
                  <tr key={obs.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <strong>{project?.title || `#${obs.project_id}`}</strong>
                      {obs.photo_url && (
                        <img src={obs.photo_url} alt="" style={{ display: 'block', width: 48, height: 48, objectFit: 'cover', borderRadius: 4, marginTop: 4 }} />
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', maxWidth: 220 }}>
                      {summary.length
                        ? summary.join(' · ')
                        : (obs.data?.questionnaire ? 'Ερωτηματολόγιο' : '—')}
                      {obs.data?.consent && (
                        <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--primary-700)' }}>GDPR ✓</div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                      {obs.lat != null && obs.lng != null ? `${Number(obs.lat).toFixed(4)}, ${Number(obs.lng).toFixed(4)}` : '—'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                      {obs.created_at ? new Date(obs.created_at).toLocaleDateString('el-GR') : '—'}
                    </td>
                    <td style={{ padding: '1rem' }}>{statusBadge(obs.status)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {obs.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => updateObservationStatus(obs.id, 'approved')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => updateObservationStatus(obs.id, 'rejected')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}>
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminObservations;
