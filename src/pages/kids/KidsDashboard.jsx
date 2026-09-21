import { Link } from 'react-router-dom';
import { useKidsAuth } from '../../context/KidsAuthContext';
import { useKidsData } from '../../context/KidsDataContext';

const KidsDashboard = () => {
  const { student } = useKidsAuth();
  const { missions, myObservations, myTotalCount, myApprovedCount, totalPoints, myBadges, loading } = useKidsData();

  if (loading) {
    return (
      <div className="kids-container" style={{ padding: 'var(--kids-space-2xl) 0', textAlign: 'center' }}>
        <div className="kids-login-mascot">🌿</div>
        <p style={{ color: 'var(--kids-text-light)', fontFamily: "'Fredoka', sans-serif" }}>Φόρτωση...</p>
      </div>
    );
  }

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)' }}>
      {/* Welcome Banner */}
      <div className="kids-welcome kids-animate-in">
        <h1>Γεια σου, {student?.alias}! 🌿</h1>
        <p>Έτοιμος/η να εξερευνήσεις τη φύση σήμερα;</p>
      </div>

      {/* Quick Stats */}
      <div className="kids-stats-grid kids-stagger" style={{ marginBottom: 'var(--kids-space-xl)' }}>
        <div className="kids-stat purple">
          <div className="kids-stat-icon">🔬</div>
          <div className="kids-stat-number">{myTotalCount}</div>
          <div className="kids-stat-label">Παρατηρήσεις</div>
        </div>
        <div className="kids-stat green">
          <div className="kids-stat-icon">✅</div>
          <div className="kids-stat-number">{myApprovedCount}</div>
          <div className="kids-stat-label">Εγκεκριμένες</div>
        </div>
        <div className="kids-stat orange">
          <div className="kids-stat-icon">⭐</div>
          <div className="kids-stat-number">{totalPoints}</div>
          <div className="kids-stat-label">Πόντοι</div>
        </div>
        <div className="kids-stat turquoise">
          <div className="kids-stat-icon">🏅</div>
          <div className="kids-stat-number">{myBadges.length}</div>
          <div className="kids-stat-label">Βραβεία</div>
        </div>
      </div>

      {/* Active Missions */}
      <div className="kids-section-header">
        <h2 className="kids-section-title">🎯 Ενεργές Αποστολές</h2>
        <p className="kids-section-subtitle">Διάλεξε μια αποστολή και ξεκίνα!</p>
      </div>

      <div className="kids-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kids-space-md)' }}>
        {missions.map(mission => {
          const missionObs = myObservations.filter(o => o.mission_id === mission.id);
          return (
            <Link
              key={mission.id}
              to={`/kids/missions/${mission.id}/observe`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="kids-mission-card">
                <div className="kids-mission-card-header">
                  <div className={`kids-mission-icon ${mission.difficulty}`}>
                    {mission.icon}
                  </div>
                  <div className="kids-mission-info">
                    <h3 className="kids-mission-title">{mission.title}</h3>
                    <p className="kids-mission-desc">{mission.description}</p>
                  </div>
                </div>
                <div className="kids-mission-meta">
                  <span className={`kids-mission-tag ${mission.difficulty}`}>
                    {mission.difficulty === 'easy' ? '🟢 Εύκολο' : mission.difficulty === 'medium' ? '🟡 Μέτριο' : '🔴 Δύσκολο'}
                  </span>
                  <span className="kids-mission-points">
                    ⭐ {mission.points} πόντοι
                  </span>
                  {missionObs.length > 0 && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--kids-green)',
                      fontWeight: 600,
                    }}>
                      ✅ {missionObs.length} παρατηρήσεις
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {missions.length === 0 && (
          <div className="kids-empty">
            <div className="kids-empty-icon">🔭</div>
            <div className="kids-empty-title">Δεν υπάρχουν αποστολές ακόμα</div>
            <div className="kids-empty-text">Ο εκπαιδευτικός σου θα προσθέσει σύντομα νέες αποστολές!</div>
          </div>
        )}
      </div>

      {/* Recent Observations */}
      {myObservations.length > 0 && (
        <div style={{ marginTop: 'var(--kids-space-2xl)' }}>
          <div className="kids-section-header">
            <h2 className="kids-section-title">📋 Πρόσφατες Παρατηρήσεις</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kids-space-sm)' }}>
            {myObservations.slice(0, 3).map(obs => {
              const mission = missions.find(m => m.id === obs.mission_id);
              return (
                <div key={obs.id} className="kids-card" style={{ padding: 'var(--kids-space-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--kids-space-md)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{mission?.icon || '📝'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{mission?.title || 'Αποστολή'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--kids-text-muted)' }}>
                        {new Date(obs.submitted_at).toLocaleDateString('el-GR')}
                      </div>
                    </div>
                    <span className={`kids-status ${obs.status}`}>
                      {obs.status === 'pending' ? '⏳ Αναμονή' : obs.status === 'approved' ? '✅ Εγκρίθηκε' : obs.status === 'needs_revision' ? '📝 Αναθεώρηση' : '❌ Απορρίφθηκε'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/kids/discoveries" className="kids-btn kids-btn-ghost kids-btn-sm" style={{ marginTop: 'var(--kids-space-md)' }}>
            Δες όλες →
          </Link>
        </div>
      )}
    </div>
  );
};

export default KidsDashboard;
