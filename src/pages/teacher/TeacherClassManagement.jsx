import { useState } from 'react';
import { Plus, Printer, RefreshCw, Users, X, UserPlus } from 'lucide-react';
import { useKidsData } from '../../context/KidsDataContext';

const TeacherClassManagement = () => {
  const { classes, students, addClass, addStudentsToClass } = useKidsData();

  const [selectedClassId, setSelectedClassId] = useState(1);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false);

  // Form states
  const [newClassName, setNewClassName] = useState('');
  const [newStudentCount, setNewStudentCount] = useState(5);

  const activeClass = classes.find(c => c.id === selectedClassId) || classes[0] || { name: 'Β2', code: 'ECO-B2-26', id: 1 };
  const activeClassStudents = students.filter(s => s.class_id === activeClass.id);

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName) return;
    const code = `ECO-${newClassName.trim().toUpperCase()}-26`;
    const createdClass = addClass({ school_id: 1, teacher_id: 1, name: newClassName.trim(), code });
    setSelectedClassId(createdClass.id);
    setShowAddClassModal(false);
    setNewClassName('');
    alert(`Το τμήμα "${newClassName}" (Κωδικός: ${code}) δημιουργήθηκε!`);
  };

  const handleGenerateStudents = (e) => {
    e.preventDefault();
    addStudentsToClass(activeClass.id, 1, parseInt(newStudentCount) || 5);
    setShowAddStudentsModal(false);
    alert(`Προστέθηκαν ${newStudentCount} νέοι μαθητές στο τμήμα ${activeClass.name}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
            👥 Διαχείριση Τάξεων & Κάρτες PIN Μαθητών
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Δημιουργήστε τμήματα και εκτυπώστε ψευδώνυμους λογαριασμούς (Student Aliases) χωρίς PII.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowAddClassModal(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            <span>Νέο Τμήμα</span>
          </button>

          <button onClick={() => setShowAddStudentsModal(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={18} />
            <span>Προσθήκη Μαθητών</span>
          </button>

          <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={18} />
            <span>Εκτύπωση Καρτών PIN</span>
          </button>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E2E8F0', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {classes.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClassId(c.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: selectedClassId === c.id ? '#0EA5E9' : '#64748B',
              borderBottom: selectedClassId === c.id ? '3px solid #0EA5E9' : '3px solid transparent',
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
            }}
          >
            Τμήμα {c.name} (Κωδικός: {c.code})
          </button>
        ))}
      </div>

      {/* Active Class Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase' }}>ΕΝΕΡΓΟ ΤΜΗΜΑ</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Τμήμα {activeClass.name}</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Κωδικός Τάξης: <strong style={{ color: '#0F172A' }}>{activeClass.code}</strong></div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>{activeClassStudents.length} Ενεργοί Μαθητές</div>
        </div>
      </div>

      {/* Printable Alias Cards Grid */}
      <div className="printable-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {activeClassStudents.map(student => (
          <div
            key={student.id}
            style={{
              background: 'white',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase' }}>
                  CS KIDS CARD
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{activeClass.code}</span>
              </div>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                🆔 {student.alias}
              </div>

              <div style={{ background: '#F1F5F9', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>4-DIGIT PIN:</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6C63FF', letterSpacing: '2px' }}>
                  {student.pin}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                Privacy: Pseudonymous
              </span>
              <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>● Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Class */}
      {showAddClassModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Δημιουργία Νέου Τμήματος</h3>
              <button onClick={() => setShowAddClassModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Όνομα Τμήματος (π.χ. Β2, Γ1, Δ3)</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="π.χ. Δ2"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddClassModal(false)} className="btn btn-outline">Ακύρωση</button>
                <button type="submit" className="btn btn-primary">Δημιουργία Τμήματος</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Students */}
      {showAddStudentsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Προσθήκη Μαθητών στο {activeClass.name}</h3>
              <button onClick={() => setShowAddStudentsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleGenerateStudents} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Πλήθος Νέων Μαθητών</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  className="form-input"
                  value={newStudentCount}
                  onChange={e => setNewStudentCount(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                  Θα δημιουργηθούν αυτόματα ψευδώνυμα IDs (π.χ. {activeClass.name}-000{activeClassStudents.length + 1}) με τυχαία PINs.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddStudentsModal(false)} className="btn btn-outline">Ακύρωση</button>
                <button type="submit" className="btn btn-primary">Δημιουργία Μαθητών</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-cards, .printable-cards * { visibility: visible; }
          .printable-cards { position: absolute; left: 0; top: 0; width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default TeacherClassManagement;
