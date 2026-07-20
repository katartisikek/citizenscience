import { useState } from 'react';
import { Send, CheckCircle, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Propose = () => {
  const { t } = useTranslation();
  const { addProposal } = useData();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', title: '', category: 'Βιοποικιλότητα', area: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addProposal({ ...form, user_id: user?.id || null });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Σφάλμα υποβολής');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h1 style={{ color: 'var(--color-primary)' }}>{t('propose.title', 'Προτείνετε Νέο Project')}</h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
              {t('propose.desc', 'Έχετε μια ιδέα για ένα νέο έργο Citizen Science;')}
            </p>
          </div>

          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Η Πρότασή σας Υποβλήθηκε!</h2>
                <p style={{ color: 'var(--color-text-light)' }}>Η επιστημονική μας ομάδα θα τη μελετήσει.</p>
                <button className="btn btn-primary mt-4" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', title: '', category: 'Βιοποικιλότητα', area: '', description: '' }); }}>
                  Υποβολή Νέας Πρότασης
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Όνομα / Οργανισμός *</label>
                    <input type="text" className="form-control" required value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-control" required value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="form-group mt-2">
                  <label className="form-label">Τίτλος Ιδέας / Project *</label>
                  <input type="text" className="form-control" required value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '1rem' }} className="mt-2">
                  <div className="form-group">
                    <label className="form-label">Θεματική Κατηγορία</label>
                    <select className="form-control" value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}>
                      {['Βιοποικιλότητα', 'Δημόσια Υγεία', 'Ποιότητα Νερού', 'Ποιότητα Αέρα', 'Κλιματική Αλλαγή', 'Άλλο'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Περιοχή Εφαρμογής</label>
                    <input type="text" className="form-control" value={form.area}
                      onChange={e => setForm({ ...form, area: e.target.value })} />
                  </div>
                </div>
                <div className="form-group mt-2">
                  <label className="form-label">Περιγραφή *</label>
                  <textarea className="form-control" required style={{ minHeight: '150px' }} value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                {error && <p style={{ color: '#c05530', fontSize: '0.9rem' }}>{error}</p>}
                <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={loading}>
                    <Send size={18} /> {loading ? 'Υποβολή...' : 'Υποβολή Πρότασης'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Propose;
