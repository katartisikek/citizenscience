import { useState } from 'react';
import { Check, X, ShieldAlert, Eye, Filter } from 'lucide-react';
import { useKidsData } from '../../context/KidsDataContext';

const TeacherObservations = () => {
  const { observations } = useKidsData();
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'approved'
  const [obsList, setObsList] = useState([
    {
      id: 101,
      student_alias: 'B2-0001',
      mission_title: 'Τα Φρούτα της Γειτονιάς μου',
      data: { fruit_type: 'Πορτοκαλιά', has_fruits: 'Ναι', tree_size: 'Μεγάλο' },
      notes: 'Μεγάλη πορτοκαλιά στην αυλή!',
      image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=400',
      status: 'pending',
      submitted_at: '2026-09-20T10:30:00Z',
    },
    {
      id: 102,
      student_alias: 'B2-0004',
      mission_title: 'Τα Λαχανικά της Αγοράς',
      data: { vegetable_type: 'Ντομάτες Κρήτης', origin: 'Τυμπάκι', is_organic: 'Ναι' },
      notes: 'Από τον παραγωγό κ. Γιώργο στη λαϊκή',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
      status: 'approved',
      submitted_at: '2026-09-19T11:15:00Z',
    },
  ]);

  const handleApprove = (id) => {
    setObsList(prev => prev.map(o => o.id === id ? { ...o, status: 'approved' } : o));
  };

  const handleReject = (id) => {
    setObsList(prev => prev.map(o => o.id === id ? { ...o, status: 'rejected' } : o));
  };

  const filtered = filter === 'all' ? obsList : obsList.filter(o => o.status === filter);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
            🔍 Έλεγχος & Επικύρωση Παρατηρήσεων
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Εγκρίνετε ή απορρίψτε τις παρατηρήσεις των μαθητών της τάξης σας πριν δημοσιευθούν.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'approved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {f === 'all' ? 'Όλες' : f === 'pending' ? 'Εκκρεμείς' : 'Εγκεκριμένες'}
            </button>
          ))}
        </div>
      </div>

      {/* Observations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(obs => (
          <div key={obs.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {obs.image && (
              <img src={obs.image} alt={obs.mission_title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0EA5E9' }}>
                  🆔 Μαθητής: {obs.student_alias}
                </span>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px',
                  backgroundColor: obs.status === 'approved' ? '#D1FAE5' : obs.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                  color: obs.status === 'approved' ? '#065F46' : obs.status === 'pending' ? '#92400E' : '#991B1B',
                }}>
                  {obs.status === 'approved' ? 'Εγκεκριμένη' : obs.status === 'pending' ? 'Εκκρεμεί' : 'Απορρίφθηκε'}
                </span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0F172A' }}>
                {obs.mission_title}
              </h3>

              {/* Data fields */}
              <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '0.75rem', flex: 1 }}>
                {Object.entries(obs.data).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                    <span style={{ color: '#64748B' }}>{k}:</span>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{String(v)}</span>
                  </div>
                ))}
                {obs.notes && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0', fontStyle: 'italic', color: '#475569' }}>
                    "{obs.notes}"
                  </div>
                )}
              </div>

              {/* Actions */}
              {obs.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleApprove(obs.id)}
                    className="btn btn-sm btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', backgroundColor: '#10B981', borderColor: '#10B981' }}
                  >
                    <Check size={16} /> Έγκριση
                  </button>
                  <button
                    onClick={() => handleReject(obs.id)}
                    className="btn btn-sm btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#EF4444', borderColor: '#FCA5A5' }}
                  >
                    <X size={16} /> Απόρριψη
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherObservations;
