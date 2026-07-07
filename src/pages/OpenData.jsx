import { Database, Map as MapIcon, FileText, Download } from 'lucide-react';

const OpenData = () => {
  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-primary-light)', color: 'white', padding: '4rem 1rem' }}>
        <div className="container text-center">
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>Ανοικτά Δεδομένα</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', opacity: 0.9 }}>
            Η διαφάνεια είναι βασική αρχή του Citizen Science. Εδώ μπορείτε να βρείτε προσβάσιμα 
            τα αποτελέσματα των ερευνών μας, χάρτες, και αναφορές.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Dashboard Placeholder */}
          <div className="card mb-4" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapIcon color="var(--color-primary)" /> Διαδραστικοί Χάρτες &amp; Dashboards
              </h2>
              <select className="form-control" style={{ width: 'auto' }}>
                <option>Project: Mosquito Watch</option>
                <option>Project: Youth4Diagnostics</option>
              </select>
            </div>
            
            <div style={{ 
              width: '100%', 
              height: '400px', 
              backgroundColor: '#e2e8f0', 
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-light)'
            }}>
              <Database size={48} className="mb-2" opacity={0.5} />
              <p>Το Dashboard χάρτη θα φορτώσει εδώ.</p>
              <p style={{ fontSize: '0.85rem' }}>(Ενσωμάτωση δεδομένων σε πραγματικό χρόνο)</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Reports */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="var(--color-secondary)" /> Αναφορές &amp; Policy Makers
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[1, 2, 3].map(i => (
                  <li key={i} style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem' }}>Ετήσια Αναφορά Κουνουπιών 2025</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>PDF • 2.4 MB</p>
                    </div>
                    <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                      <Download size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Datasets */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database color="var(--color-accent)" /> Raw Open Data
              </h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Κατεβάστε τα ανώνυμα ακατέργαστα δεδομένα για δική σας ανάλυση, με άδεια ανοικτού κώδικα (όπου επιτρέπεται).
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[1, 2].map(i => (
                  <li key={i} style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem' }}>Water Quality Samples - Heraklion</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>CSV • Ενημερώθηκε χθες</p>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                      <Download size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OpenData;
