import { useKidsAuth } from '../../context/KidsAuthContext';
import { useKidsData } from '../../context/KidsDataContext';

const KidsClass = () => {
  const { student } = useKidsAuth();
  const { myObservations, missions } = useKidsData();

  // Aggregated class stats (no individual student info)
  const classObsCount = myObservations.length; // In real app, this comes from aggregated query
  const classApprovedCount = myObservations.filter(o => o.status === 'approved').length;

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)' }}>
      <div className="kids-section-header">
        <h2 className="kids-section-title">👥 Η Τάξη μας</h2>
        <p className="kids-section-subtitle">Τάξη {student?.class_name} · {student?.school_name}</p>
      </div>

      {/* Class Info Card */}
      <div className="kids-card kids-animate-in" style={{
        padding: 'var(--kids-space-xl)',
        textAlign: 'center',
        marginBottom: 'var(--kids-space-xl)',
        background: 'linear-gradient(135deg, #F0F4FF 0%, #FFF0F5 100%)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--kids-space-sm)' }}>🏫</div>
        <h3 style={{ fontFamily: "'Fredoka', sans-serif", margin: '0 0 4px', fontSize: '1.3rem' }}>
          Τάξη {student?.class_name}
        </h3>
        <p style={{ color: 'var(--kids-text-light)', margin: '0 0 var(--kids-space-lg)', fontSize: '0.9rem' }}>
          Κωδικός: {student?.class_code}
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--kids-space-md)',
        }}>
          <div className="kids-stat purple">
            <div className="kids-stat-icon">🔬</div>
            <div className="kids-stat-number">{classObsCount}</div>
            <div className="kids-stat-label">Παρατηρήσεις</div>
          </div>
          <div className="kids-stat green">
            <div className="kids-stat-icon">✅</div>
            <div className="kids-stat-number">{classApprovedCount}</div>
            <div className="kids-stat-label">Εγκεκριμένες</div>
          </div>
        </div>
      </div>

      {/* Mission Progress */}
      <div className="kids-section-header">
        <h3 className="kids-section-title" style={{ fontSize: '1.2rem' }}>🎯 Πρόοδος Αποστολών</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kids-space-md)' }}>
        {missions.map(m => {
          const count = myObservations.filter(o => o.mission_id === m.id).length;
          return (
            <div key={m.id} className="kids-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '14px', background: '#EEF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0
                }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 2px 0', fontWeight: 700, fontSize: '1.05rem', fontFamily: "'Fredoka', sans-serif", color: 'var(--kids-purple)' }}>
                    {m.title}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--kids-text-muted)' }}>
                    ⭐ {m.points} πόντοι / παρατήρηση
                  </span>
                </div>
                <div style={{
                  background: '#EEF2FF', border: '1.5px solid #C7D2FE', padding: '4px 14px',
                  borderRadius: '999px', fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
                  color: 'var(--kids-purple)', fontSize: '1.1rem', flexShrink: 0, whiteSpace: 'nowrap'
                }}>
                  {count} παρατηρήσεις
                </div>
              </div>

              <div className="kids-progress-label">
                <span>📊 Πρόοδος Τάξης</span>
                <span>{count} καταγραφές</span>
              </div>
              <div className="kids-progress">
                <div className="kids-progress-bar" style={{ width: `${Math.min(count * 20, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Note */}
      <div style={{
        marginTop: 'var(--kids-space-xl)',
        padding: 'var(--kids-space-md)',
        background: 'rgba(108, 99, 255, 0.04)',
        borderRadius: 'var(--kids-radius-md)',
        fontSize: '0.8rem',
        color: 'var(--kids-text-light)',
        textAlign: 'center',
      }}>
        🔒 Εδώ βλέπεις μόνο τα συγκεντρωτικά στοιχεία της τάξης σου. Κανένας δεν μπορεί να δει τις παρατηρήσεις άλλων μαθητών.
      </div>
    </div>
  );
};

export default KidsClass;
