import { useKidsAuth } from '../../context/KidsAuthContext';
import { useKidsData } from '../../context/KidsDataContext';

const KidsProgress = () => {
  const { student } = useKidsAuth();
  const { missions, myObservations, myTotalCount, myApprovedCount, totalPoints, myBadges } = useKidsData();

  const missionProgress = missions.map(m => {
    const count = myObservations.filter(o => o.mission_id === m.id).length;
    const approved = myObservations.filter(o => o.mission_id === m.id && o.status === 'approved').length;
    return { ...m, count, approved };
  });

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)' }}>
      <div className="kids-section-header">
        <h2 className="kids-section-title">📊 Η Πρόοδός μου</h2>
        <p className="kids-section-subtitle">Δες πόσο έχεις προχωρήσει!</p>
      </div>

      {/* Overall Stats */}
      <div className="kids-card kids-animate-in" style={{ marginBottom: 'var(--kids-space-xl)', padding: 'var(--kids-space-xl)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--kids-space-sm)' }}>🌟</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--kids-purple)' }}>
          {totalPoints}
        </div>
        <div style={{ color: 'var(--kids-text-light)', fontWeight: 600 }}>Συνολικοί Πόντοι</div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--kids-space-md)', marginTop: 'var(--kids-space-xl)',
          padding: 'var(--kids-space-md)', background: 'rgba(108, 99, 255, 0.04)',
          borderRadius: 'var(--kids-radius-md)',
        }}>
          <div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--kids-turquoise)' }}>{myTotalCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--kids-text-muted)' }}>Παρατηρήσεις</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--kids-green)' }}>{myApprovedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--kids-text-muted)' }}>Εγκεκριμένες</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--kids-orange)' }}>{myBadges.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--kids-text-muted)' }}>Βραβεία</div>
          </div>
        </div>
      </div>

      {/* Per-Mission Progress */}
      <div className="kids-section-header">
        <h3 className="kids-section-title" style={{ fontSize: '1.2rem' }}>🎯 Πρόοδος ανά Αποστολή</h3>
      </div>

      <div className="kids-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kids-space-md)' }}>
        {missionProgress.map(m => (
          <div key={m.id} className="kids-card" style={{ padding: 'var(--kids-space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kids-space-md)', marginBottom: 'var(--kids-space-md)' }}>
              <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontSize: '0.95rem' }}>{m.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--kids-text-muted)' }}>⭐ {m.points} πόντοι/παρατήρηση</span>
              </div>
              <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: 'var(--kids-purple)', fontSize: '1.2rem' }}>
                {m.count}
              </span>
            </div>

            <div className="kids-progress-label">
              <span>{m.approved} εγκεκριμένες</span>
              <span>{m.count} σύνολο</span>
            </div>
            <div className="kids-progress">
              <div
                className="kids-progress-bar"
                style={{ width: `${m.count > 0 ? Math.min((m.approved / m.count) * 100, 100) : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Student Info */}
      <div className="kids-card" style={{ marginTop: 'var(--kids-space-xl)', padding: 'var(--kids-space-lg)' }}>
        <h4 style={{ fontFamily: "'Fredoka', sans-serif", margin: '0 0 var(--kids-space-md)' }}>👤 Τα Στοιχεία μου</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--kids-text-light)' }}>Ψευδώνυμο</span>
            <span style={{ fontWeight: 600 }}>{student?.alias}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--kids-text-light)' }}>Τάξη</span>
            <span style={{ fontWeight: 600 }}>{student?.class_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--kids-text-light)' }}>Σχολείο</span>
            <span style={{ fontWeight: 600 }}>{student?.school_name}</span>
          </div>
        </div>
        <div style={{
          marginTop: 'var(--kids-space-md)', padding: 'var(--kids-space-sm) var(--kids-space-md)',
          background: 'rgba(46, 204, 113, 0.06)', borderRadius: 'var(--kids-radius-sm)',
          fontSize: '0.75rem', color: 'var(--kids-green)', fontWeight: 500,
        }}>
          🔒 Τα προσωπικά σου στοιχεία είναι ασφαλή. Μόνο το ψευδώνυμό σου εμφανίζεται στην πλατφόρμα.
        </div>
      </div>
    </div>
  );
};

export default KidsProgress;
