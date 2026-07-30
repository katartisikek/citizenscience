import { CheckCircle, Archive, Mail } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../../context/DataContext';

const statusLabel = {
  pending: 'Νέο',
  contacted: 'Έγινε επικοινωνία',
  closed: 'Ολοκληρώθηκε',
};

const AdminInbox = () => {
  const { entityInquiries, newsletterSubscribers, updateEntityInquiryStatus } = useData();
  const [error, setError] = useState('');

  const changeStatus = async (id, status) => {
    setError('');
    try {
      await updateEntityInquiryStatus(id, status);
    } catch (err) {
      setError(err.message || 'Η ενημέρωση απέτυχε.');
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Εισερχόμενα</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
        Αιτήματα συνεργασίας και εγγραφές newsletter.
      </p>
      {error && <div role="alert" style={{ color: '#991b1b', marginBottom: '1rem' }}>{error}</div>}

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
          Αιτήματα φορέων ({entityInquiries.length})
        </h2>
        {entityInquiries.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
            Δεν υπάρχουν αιτήματα ακόμα.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {entityInquiries.map(item => (
              <article key={item.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{item.organization}</h3>
                    <p style={{ margin: '0.3rem 0', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                      {item.contact_name} · <a href={`mailto:${item.email}`}>{item.email}</a>
                      {item.phone ? ` · ${item.phone}` : ''}
                    </p>
                    <small>{item.created_at ? new Date(item.created_at).toLocaleString('el-GR') : ''}</small>
                  </div>
                  <span className="badge">{statusLabel[item.status] || item.status}</span>
                </div>
                <p style={{ margin: '1rem 0', whiteSpace: 'pre-wrap' }}>{item.message}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a className="btn btn-outline" href={`mailto:${item.email}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    <Mail size={15} /> Email
                  </a>
                  {item.status === 'pending' && (
                    <button className="btn btn-primary" onClick={() => changeStatus(item.id, 'contacted')}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      <CheckCircle size={15} /> Έγινε επικοινωνία
                    </button>
                  )}
                  {item.status !== 'closed' && (
                    <button className="btn btn-ghost" onClick={() => changeStatus(item.id, 'closed')}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      <Archive size={15} /> Κλείσιμο
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
          Newsletter ({newsletterSubscribers.filter(item => item.status === 'active').length})
        </h2>
        {newsletterSubscribers.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
            Δεν υπάρχουν εγγραφές ακόμα.
          </div>
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Email', 'Γλώσσα', 'Κατάσταση', 'Ημερομηνία'].map(label => (
                    <th key={label} style={{ textAlign: 'left', padding: '0.9rem 1rem', borderBottom: '1px solid var(--color-border)' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {newsletterSubscribers.map(item => (
                  <tr key={item.id}>
                    <td style={{ padding: '0.9rem 1rem' }}><a href={`mailto:${item.email}`}>{item.email}</a></td>
                    <td style={{ padding: '0.9rem 1rem' }}>{item.locale?.toUpperCase()}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>{item.status === 'active' ? 'Ενεργό' : 'Ανενεργό'}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      {item.subscribed_at ? new Date(item.subscribed_at).toLocaleDateString('el-GR') : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminInbox;
