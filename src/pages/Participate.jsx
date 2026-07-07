import { useState } from 'react';
import { Download, HelpCircle, UserPlus, CheckCircle, Globe } from 'lucide-react';

const Participate = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interests: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we would normally send to backend
    setSubmitted(true);
  };

  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h1 style={{ color: 'var(--color-primary)' }}>Συμμετοχή Πολιτών</h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
              Γίνετε Citizen Scientist. Η συνεισφορά σας κάνει τη διαφορά στην προστασία του περιβάλλοντος.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '3rem' }}>
            {/* Steps & App Download */}
            <div>
              <h2 className="mb-3">Πώς να ξεκινήσετε</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <UserPlus color="var(--color-primary)" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4>1. Εγγραφείτε</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Συμπληρώστε τη φόρμα για να ενημερώνεστε για δράσεις στην περιοχή σας.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Globe color="var(--color-secondary)" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4>2. Μπείτε στην Πλατφόρμα</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Επισκεφθείτε την πλατφόρμα μας από το κινητό ή τον υπολογιστή σας – δεν απαιτείται εγκατάσταση.</p>
                    <button className="btn btn-secondary mt-1" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      Σύνδεση
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <CheckCircle color="var(--color-accent)" size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h4>3. Συλλέξτε Δεδομένα</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Ακολουθήστε τις οδηγίες του project και κάντε τις παρατηρήσεις σας στο πεδίο.</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={20} color="var(--color-primary)" /> Συχνές Ερωτήσεις
                </h3>
                <details style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  <summary style={{ fontWeight: 500, cursor: 'pointer', outline: 'none' }}>Πρέπει να έχω επιστημονικές γνώσεις;</summary>
                  <p style={{ marginTop: '0.5rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Όχι. Κάθε project έχει απλές και σαφείς οδηγίες ώστε να μπορεί να συμμετέχει ο καθένας, ανεξαρτήτως υποβάθρου.</p>
                </details>
                <details>
                  <summary style={{ fontWeight: 500, cursor: 'pointer', outline: 'none' }}>Πώς χρησιμοποιούνται τα δεδομένα μου;</summary>
                  <p style={{ marginTop: '0.5rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Τα δεδομένα αναλύονται από ερευνητές και είναι ανοιχτά προσβάσιμα (ανώνυμα) μέσω του Hub για περιβαλλοντικές μελέτες.</p>
                </details>
              </div>
            </div>

            {/* Registration Form */}
            <div>
              <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-primary)' }}>
                <h2 className="mb-3">Φόρμα Εγγραφής Citizen Scientist</h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Εγγραφείτε στο δίκτυό μας για να ενημερώνεστε πρώτοι για νέα projects.
                </p>
                
                {submitted ? (
                  <div style={{ backgroundColor: 'rgba(42, 111, 77, 0.1)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <CheckCircle size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: 'var(--color-primary)' }}>Επιτυχής Εγγραφή!</h3>
                    <p>Σας ευχαριστούμε για το ενδιαφέρον σας. Θα λαμβάνετε σύντομα ενημερώσεις μας.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Ονοματεπώνυμο</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Περιοχή / Δήμος</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Περιοχές ενδιαφέροντος (π.χ. Νερό, Βιοποικιλότητα)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.interests}
                        onChange={(e) => setFormData({...formData, interests: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%' }}>
                      Εγγραφή στο Δίκτυο
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
