import { useState } from 'react';
import { Plus, School, UserPlus, Users, Download, Eye, MapPin, Search, ChevronRight, ShieldCheck, CheckCircle2, FileSpreadsheet, X, Key, ClipboardList } from 'lucide-react';
import { useKidsData } from '../../context/KidsDataContext';

const AdminKids = () => {
  const { schools, teachers, classes, students, observations, projects, addSchool, addTeacher, exportSchoolDataCSV } = useKidsData();

  const [activeTab, setActiveTab] = useState('schools'); // 'schools' | 'projects' | 'all-observations' | 'privacy'
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Modal states
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);

  // Form states
  const [newSchoolForm, setNewSchoolForm] = useState({ name: '', city: 'Ηράκλειο', address: '' });
  const [newTeacherForm, setNewTeacherForm] = useState({ name: '', email: '', phone: '', subject: 'Εκπαιδευτικός' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateSchool = (e) => {
    e.preventDefault();
    if (!newSchoolForm.name) return;
    addSchool(newSchoolForm);
    alert(`Το σχολείο "${newSchoolForm.name}" δημιουργήθηκε με επιτυχία!`);
    setShowAddSchoolModal(false);
    setNewSchoolForm({ name: '', city: 'Ηράκλειο', address: '' });
  };

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    if (!selectedSchool || !newTeacherForm.name) return;
    addTeacher({ ...newTeacherForm, school_id: selectedSchool.id });
    alert(`Ο/Η εκπαιδευτικός "${newTeacherForm.name}" προστέθηκε στο ${selectedSchool.name}!`);
    setShowAddTeacherModal(false);
    setNewTeacherForm({ name: '', email: '', phone: '', subject: 'Εκπαιδευτικός' });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏫 Citizen Science Kids Administration
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Διαχείριση Καρτελών Σχολείων, Καθηγητών, Τμημάτων, Μαθητών & Άντληση Δεδομένων.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowAddSchoolModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            <span>Νέα Καρτέλα Σχολείου</span>
          </button>

          <button
            onClick={() => exportSchoolDataCSV('all')}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={18} />
            <span>Άντληση Όλων των Δεδομένων (CSV)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E5E7EB', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'schools', label: '🏫 Καρτέλες Σχολείων & Καθηγητές' },
          { id: 'projects', label: '🎯 Σχολικά Έργα' },
          { id: 'all-observations', label: '📊 Όλα τα Δεδομένα Μαθητών' },
          { id: 'privacy', label: '🛡️ Κανόνες Privacy & GDPR' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedSchool(null); }}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Schools Hierarchy */}
      {activeTab === 'schools' && !selectedSchool && (
        <div>
          {/* Search bar */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #E5E7EB', flex: 1, maxWidth: '400px' }}>
              <Search size={18} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Αναζήτηση σχολείου ή πόλης..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }}
              />
            </div>
          </div>

          {/* School Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {schools
              .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.city.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(school => {
                const schoolTeachers = teachers.filter(t => t.school_id === school.id);
                const schoolClasses = classes.filter(c => c.school_id === school.id);
                const schoolStudents = students.filter(st => st.school_id === school.id);
                const schoolObs = observations.filter(o => o.school_id === school.id);

                return (
                  <div
                    key={school.id}
                    className="card"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', borderLeft: '4px solid #6C63FF' }}
                    onClick={() => setSelectedSchool(school)}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6C63FF', textTransform: 'uppercase' }}>
                            📍 {school.city}
                          </span>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.2rem' }}>
                            {school.name}
                          </h3>
                        </div>
                        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Ενεργό</span>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                        {school.address}
                      </p>

                      {/* Summary Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', backgroundColor: '#F9FAFB', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>👨‍🏫 Καθηγητές:</span>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)' }}>{schoolTeachers.length}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>👥 Τμήματα:</span>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)' }}>{schoolClasses.length}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>🆔 Μαθητές:</span>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)' }}>{schoolStudents.length}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)' }}>📊 Παρατηρήσεις:</span>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#6C63FF' }}>{schoolObs.length}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Προβολή Καρτέλας <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Selected School Detailed View */}
      {activeTab === 'schools' && selectedSchool && (
        <div className="card" style={{ padding: '2rem' }}>
          <button
            onClick={() => setSelectedSchool(null)}
            className="btn btn-sm btn-outline"
            style={{ marginBottom: '1.5rem' }}
          >
            &larr; Πίσω σε όλα τα σχολεία
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #E5E7EB' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6C63FF', textTransform: 'uppercase' }}>
                ΚΑΡΤΕΛΑ ΣΧΟΛΕΙΟΥ · {selectedSchool.city}
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.2rem' }}>
                {selectedSchool.name}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{selectedSchool.address}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <UserPlus size={18} />
                <span>Δημιουργία Καθηγητή</span>
              </button>

              <button
                onClick={() => exportSchoolDataCSV(selectedSchool.id)}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Download size={18} />
                <span>Άντληση Δεδομένων Σχολείου (CSV)</span>
              </button>
            </div>
          </div>

          {/* Section 1: Teachers of School */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              👨‍🏫 Εκπαιδευτικοί Σχολείου ({teachers.filter(t => t.school_id === selectedSchool.id).length})
            </h3>

            {teachers.filter(t => t.school_id === selectedSchool.id).length === 0 ? (
              <div style={{ padding: '1.5rem', background: '#F9FAFB', borderRadius: '8px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                Δεν έχει προστεθεί ακόμα καθηγητής σε αυτό το σχολείο. Πατήστε "Δημιουργία Καθηγητή".
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {teachers.filter(t => t.school_id === selectedSchool.id).map(teacher => (
                  <div key={teacher.id} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{teacher.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#0EA5E9', fontWeight: 600 }}>📧 {teacher.email}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>📞 {teacher.phone} · {teacher.subject}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Classes of School */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              👥 Τμήματα Σχολείου ({classes.filter(c => c.school_id === selectedSchool.id).length})
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {classes.filter(c => c.school_id === selectedSchool.id).map(c => {
                const classTeacher = teachers.find(t => t.id === c.teacher_id);
                const classStudents = students.filter(st => st.class_id === c.id);

                return (
                  <div key={c.id} style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>Τμήμα {c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0' }}>
                      Κωδικός: <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px' }}>{c.code}</code>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      Καθηγητής: <strong>{classTeacher?.name || 'Μαρίνα Παπαδοπούλου'}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6C63FF', marginTop: '0.5rem' }}>
                      {classStudents.length} Μαθητές (Pseudonymous)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Observations / Uploaded Data */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📊 Δεδομένα / Παρατηρήσεις Μαθητών Σχολείου ({observations.filter(o => o.school_id === selectedSchool.id).length})
              </h3>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '0.75rem' }}>ID</th>
                  <th style={{ padding: '0.75rem' }}>Τμήμα</th>
                  <th style={{ padding: '0.75rem' }}>Μαθητής</th>
                  <th style={{ padding: '0.75rem' }}>Δεδομένα</th>
                  <th style={{ padding: '0.75rem' }}>Σημειώσεις</th>
                  <th style={{ padding: '0.75rem' }}>Κατάσταση</th>
                  <th style={{ padding: '0.75rem' }}>Ημερομηνία</th>
                </tr>
              </thead>
              <tbody>
                {observations.filter(o => o.school_id === selectedSchool.id).map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>#{o.id}</td>
                    <td style={{ padding: '0.75rem' }}>{o.class_name || 'Β2'}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#6C63FF' }}>{o.student_alias}</td>
                    <td style={{ padding: '0.75rem' }}><code>{JSON.stringify(o.data)}</code></td>
                    <td style={{ padding: '0.75rem' }}>{o.notes || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${o.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#64748B' }}>{new Date(o.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: All Observations Export */}
      {activeTab === 'all-observations' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Όλα τα Συλλεχθέντα Επιστημονικά Δεδομένα</h3>
            <button onClick={() => exportSchoolDataCSV('all')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} /> Εξαγωγή CSV
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ padding: '0.75rem' }}>Σχολείο</th>
                <th style={{ padding: '0.75rem' }}>Τμήμα</th>
                <th style={{ padding: '0.75rem' }}>Μαθητής</th>
                <th style={{ padding: '0.75rem' }}>Δεδομένα</th>
                <th style={{ padding: '0.75rem' }}>Κατάσταση</th>
                <th style={{ padding: '0.75rem' }}>Ημερομηνία</th>
              </tr>
            </thead>
            <tbody>
              {observations.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>{o.school_name || '1ο Δημοτικό Ηρακλείου'}</td>
                  <td style={{ padding: '0.75rem' }}>{o.class_name || 'Β2'}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#6C63FF' }}>{o.student_alias}</td>
                  <td style={{ padding: '0.75rem' }}><code>{JSON.stringify(o.data)}</code></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-success">{o.status}</span></td>
                  <td style={{ padding: '0.75rem', color: '#64748B' }}>{new Date(o.submitted_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: New School */}
      {showAddSchoolModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Δημιουργία Νέας Καρτέλας Σχολείου</h3>
              <button onClick={() => setShowAddSchoolModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSchool} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Όνομα Σχολείου</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newSchoolForm.name}
                  onChange={e => setNewSchoolForm({ ...newSchoolForm, name: e.target.value })}
                  placeholder="π.χ. 4ο Δημοτικό Ηρακλείου"
                />
              </div>
              <div>
                <label className="form-label">Πόλη / Δήμος</label>
                <select
                  className="form-input"
                  value={newSchoolForm.city}
                  onChange={e => setNewSchoolForm({ ...newSchoolForm, city: e.target.value })}
                >
                  <option value="Ηράκλειο">Ηράκλειο</option>
                  <option value="Χανιά">Χανιά</option>
                  <option value="Ρέθυμνο">Ρέθυμνο</option>
                  <option value="Αγ. Νικόλαος">Αγ. Νικόλαος</option>
                  <option value="Σητεία">Σητεία</option>
                  <option value="Ιεράπετρα">Ιεράπετρα</option>
                </select>
              </div>
              <div>
                <label className="form-label">Διεύθυνση</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSchoolForm.address}
                  onChange={e => setNewSchoolForm({ ...newSchoolForm, address: e.target.value })}
                  placeholder="π.χ. Λεωφόρος Κνωσού 45"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddSchoolModal(false)} className="btn btn-outline">Ακύρωση</button>
                <button type="submit" className="btn btn-primary">Δημιουργία Σχολείου</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Teacher */}
      {showAddTeacherModal && selectedSchool && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Δημιουργία Καθηγητή για το {selectedSchool.name}</h3>
              <button onClick={() => setShowAddTeacherModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Ονοματεπώνυμο Εκπαιδευτικού</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newTeacherForm.name}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                  placeholder="π.χ. Μαρία Παπαδοπούλου"
                />
              </div>
              <div>
                <label className="form-label">Email Εκπαιδευτικού</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={newTeacherForm.email}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                  placeholder="m.papadopoulou@sch.gr"
                />
              </div>
              <div>
                <label className="form-label">Τηλέφωνο Επικοινωνίας</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTeacherForm.phone}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
                  placeholder="697xxxxxxx"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddTeacherModal(false)} className="btn btn-outline">Ακύρωση</button>
                <button type="submit" className="btn btn-primary">Δημιουργία Καθηγητή</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKids;
