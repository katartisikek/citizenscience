import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save, CheckCircle } from 'lucide-react';

const AdminSettings = () => {
  const { settings, updateSettings } = useData();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>Γενικές Ρυθμίσεις &amp; Κείμενα</h1>
      </div>

      <div className="card" style={{ maxWidth: '800px', padding: '2rem' }}>
        {saved && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(42, 111, 77, 0.1)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} /> Οι αλλαγές αποθηκεύτηκαν επιτυχώς!
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <h3 className="mb-3">Κείμενα Αρχικής Σελίδας</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* EL Column */}
            <div>
              <h4 className="mb-3" style={{ color: 'var(--color-primary)' }}>Ελληνικά (EL)</h4>
              <div className="form-group">
                <label className="form-label">Κεντρικός Τίτλος (Hero Title)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.heroTitle} 
                  onChange={e => setFormData({...formData, heroTitle: e.target.value})} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Κεντρικό Κείμενο (Hero Subtitle)</label>
                <textarea 
                  className="form-control" 
                  style={{ minHeight: '80px' }}
                  value={formData.heroSubtitle} 
                  onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                ></textarea>
              </div>

              <div className="form-group mt-4">
                <label className="form-label">Κείμενο "Ποιοι Είμαστε"</label>
                <textarea 
                  className="form-control" 
                  style={{ minHeight: '100px' }}
                  value={formData.aboutText} 
                  onChange={e => setFormData({...formData, aboutText: e.target.value})}
                ></textarea>
              </div>
            </div>

            {/* EN Column */}
            <div>
              <h4 className="mb-3" style={{ color: 'var(--color-primary)' }}>English (EN)</h4>
              <div className="form-group">
                <label className="form-label">Hero Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.heroTitle_en || ''} 
                  onChange={e => setFormData({...formData, heroTitle_en: e.target.value})} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Hero Subtitle</label>
                <textarea 
                  className="form-control" 
                  style={{ minHeight: '80px' }}
                  value={formData.heroSubtitle_en || ''} 
                  onChange={e => setFormData({...formData, heroSubtitle_en: e.target.value})}
                ></textarea>
              </div>

              <div className="form-group mt-4">
                <label className="form-label">"About Us" Text</label>
                <textarea 
                  className="form-control" 
                  style={{ minHeight: '100px' }}
                  value={formData.aboutText_en || ''} 
                  onChange={e => setFormData({...formData, aboutText_en: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Αποθήκευση Αλλαγών
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
