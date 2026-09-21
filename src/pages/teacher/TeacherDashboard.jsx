import { Link } from 'react-router-dom';
import { Users, ClipboardCheck, Award, Printer, ShieldCheck } from 'lucide-react';
import { useKidsData } from '../../context/KidsDataContext';

const TeacherDashboard = () => {
  const { observations, mySchool } = useKidsData();

  const mockClasses = [
    { id: 1, name: 'Τάξη Β2', code: 'ECO-B2-26', studentsCount: 22, observationsCount: 64 },
    { id: 2, name: 'Τάξη Γ1', code: 'ECO-G1-26', studentsCount: 20, observationsCount: 78 },
  ];

  const pendingObs = observations.filter(o => o.status === 'pending');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
          🎓 Πίνακας Εκπαιδευτικού
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Διαχειριστείτε τις τάξεις σας, εκτυπώστε PINs μαθητών και επικυρώστε τις επιστημονικές παρατηρήσεις.
        </p>
      </div>

      {/* Top Banner Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Ενεργές Τάξεις</span>
            <Users size={20} color="#0EA5E9" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem' }}>2</div>
          <div style={{ fontSize: '0.8rem', color: '#0EA5E9', marginTop: '0.25rem' }}>42 Pseudonymous Students</div>
        </div>

        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Παρατηρήσεις Τάξης</span>
            <ClipboardCheck size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem' }}>142</div>
          <div style={{ fontSize: '0.8rem', color: '#10B981', marginTop: '0.25rem' }}>120 Εγκεκριμένες</div>
        </div>

        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Εκκρεμούν προς Έλεγχο</span>
            <ShieldCheck size={20} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginTop: '0.5rem' }}>{pendingObs.length || 2}</div>
          <div style={{ fontSize: '0.8rem', color: '#D97706', marginTop: '0.25rem' }}>Χρειάζονται έγκριση</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0F172A' }}>
            🖨️ Εκτύπωση Καρτών PIN Μαθητών
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Δημιουργήστε και εκτυπώστε αυτόματα τις ατομικές κάρτες εισόδου των μαθητών (π.χ. B2-0001, B2-0002) με το 4ψήφιο PIN τους.
          </p>
          <Link to="/teacher/classes" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Printer size={18} />
            <span>Διαχείριση & Εκτύπωση PINs</span>
          </Link>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0F172A' }}>
            🔍 Έλεγχος & Επικύρωση Δεδομένων
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Επιβεβαιώστε την εγκυρότητα των φωτογραφιών και μετρήσεων που υπέβαλαν οι μαθητές πριν δημοσιευθούν στον ανοικτό χάρτη.
          </p>
          <Link to="/teacher/observations" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <ClipboardCheck size={18} />
            <span>Προβολή Παρατηρήσεων ({pendingObs.length || 2})</span>
          </Link>
        </div>
      </div>

      {/* Classes Overview List */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0F172A' }}>
          👥 Οι Τάξεις Μου
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockClasses.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>{c.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Κωδικός Τάξης: <code style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: '4px', color: '#0F172A' }}>{c.code}</code>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{c.studentsCount} Μαθητές</div>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>{c.observationsCount} παρατηρήσεις</div>
                </div>

                <Link to="/teacher/classes" className="btn btn-sm btn-outline" style={{ textDecoration: 'none' }}>
                  Διαχείριση PINs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
