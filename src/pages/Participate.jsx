import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, CheckCircle, Globe, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Participate = () => {
  const { t } = useTranslation();
  const { addRegistration } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', area: '', interests: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addRegistration({
        name: formData.name,
        email: formData.email,
        area: formData.area,
        interests: formData.interests,
        user_id: user?.id || null,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Σφάλμα εγγραφής');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h1 style={{ color: 'var(--color-primary)' }}>{t('participate.title')}</h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
              {t('participate.subtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'clamp(1.5rem, 4vw, 3rem)', marginTop: 'clamp(1.5rem, 4vw, 3rem)' }}>
            <div>
              <h2 className="mb-3">{t('participate.how_to')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <UserPlus color="var(--color-primary)" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4>{t('participate.step1_title')}</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{t('participate.step1_desc')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Globe color="var(--color-secondary)" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4>{t('participate.step2_title')}</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{t('participate.step2_desc')}</p>
                    <Link to="/login" className="btn btn-secondary mt-1" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      {t('nav.login', 'Σύνδεση')}
                    </Link>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <CheckCircle color="var(--color-accent)" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4>{t('participate.step3_title')}</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{t('participate.step3_desc')}</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={20} color="var(--color-primary)" /> Συχνές Ερωτήσεις
                </h3>
                <details style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  <summary style={{ fontWeight: 500, cursor: 'pointer' }}>Πρέπει να έχω επιστημονικές γνώσεις;</summary>
                  <p style={{ marginTop: '0.5rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Όχι. Κάθε project έχει απλές οδηγίες.</p>
                </details>
                <details>
                  <summary style={{ fontWeight: 500, cursor: 'pointer' }}>Πώς χρησιμοποιούνται τα δεδομένα μου;</summary>
                  <p style={{ marginTop: '0.5rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Αναλύονται από ερευνητές και είναι ανοιχτά (ανώνυμα) μέσω του Hub.</p>
                </details>
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-primary)' }}>
                <h2 className="mb-3">{t('participate.form_title')}</h2>
                {submitted ? (
                  <div style={{ backgroundColor: 'rgba(42, 111, 77, 0.1)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <CheckCircle size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: 'var(--color-primary)' }}>Επιτυχής Εγγραφή!</h3>
                    <p>Σας ευχαριστούμε. Θα λαμβάνετε ενημερώσεις μας.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Ονοματεπώνυμο</label>
                      <input type="text" className="form-control" required value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" required value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Περιοχή / Δήμος</label>
                      <input type="text" className="form-control" value={formData.area}
                        onChange={e => setFormData({ ...formData, area: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Περιοχές ενδιαφέροντος</label>
                      <input type="text" className="form-control" value={formData.interests}
                        onChange={e => setFormData({ ...formData, interests: e.target.value })} />
                    </div>
                    {error && <p style={{ color: '#c05530', fontSize: '0.9rem' }}>{error}</p>}
                    <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%' }} disabled={loading}>
                      {loading ? 'Υποβολή...' : 'Εγγραφή στο Δίκτυο'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Participate;
