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
        <h3 className="kids-section-title" style={{ fontSize: '1.1rem' }}>🎯 Πρόοδος Αποστολών</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kids-space-md)' }}>
        {missions.map(m => {
          const count = myObservations.filter(o => o.mission_id === m.id).length;
          return (
            <div key={m.id} className="kids-card" style={{ padding: 'var(--kids-space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kids-space-md)' }}>
                <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Fredoka', sans-serif" }}>{m.title}</div>
                  <div className="kids-progress" style={{ marginTop: '6px' }}>
                    <div className="kids-progress-bar" style={{ width: `${Math.min(count * 10, 100)}%` }} />
                  </div>
                </div>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: 'var(--kids-purple)' }}>
                  {count}
                </span>
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
