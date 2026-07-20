import { useData } from '../../context/DataContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const statusBadge = (status) => {
  const styles = {
    pending: { bg: '#fef3c7', color: '#92400e', label: 'Εκκρεμεί' },
    approved: { bg: 'var(--primary-100)', color: 'var(--primary-700)', label: 'Εγκρίθηκε' },
    rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Απορρίφθηκε' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

const AdminProposals = () => {
  const { proposals, updateProposalStatus } = useData();

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Προτάσεις Projects</h1>
      {proposals.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
          Δεν υπάρχουν προτάσεις ακόμα.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {proposals.map(p => (
            <div key={p.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{p.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: '0.25rem 0 0' }}>
                    {p.name} · {p.email} · {p.category} · {p.area}
                  </p>
                </div>
                {statusBadge(p.status)}
              </div>
              <p style={{ margin: '0 0 1rem', fontSize: '0.95rem' }}>{p.description}</p>
              {p.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    onClick={() => updateProposalStatus(p.id, 'approved')}>
                    <CheckCircle size={16} /> Έγκριση
                  </button>
                  <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    onClick={() => updateProposalStatus(p.id, 'rejected')}>
                    <XCircle size={16} /> Απόρριψη
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProposals;
