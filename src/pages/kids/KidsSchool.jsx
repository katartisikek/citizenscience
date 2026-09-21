import { useKidsAuth } from '../../context/KidsAuthContext';
import { useKidsData } from '../../context/KidsDataContext';

const KidsSchool = () => {
  const { student } = useKidsAuth();
  const { schoolStats, mySchool, schoolRank, badges, badgeAwards } = useKidsData();

  const getRankClass = (i) => {
    if (i === 0) return 'gold';
    if (i === 1) return 'silver';
    if (i === 2) return 'bronze';
    return 'normal';
  };

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)' }}>
      {/* School Header */}
      <div className="kids-welcome kids-animate-in" style={{
        background: 'linear-gradient(135deg, #FF9F43 0%, #FF6B6B 50%, #6C63FF 100%)',
      }}>
        <h1>🏫 {student?.school_name}</h1>
        <p>
          {mySchool ? (
            <>
              {schoolRank > 0 ? `🏆 ${schoolRank}η θέση στην κατάταξη · ` : ''}
              {mySchool.observation_count} παρατηρήσεις · {mySchool.student_count} μαθητές
            </>
          ) : (
            'Φόρτωση...'
          )}
        </p>
      </div>

      {/* School Stats */}
      {mySchool && (
        <div className="kids-stats-grid kids-stagger" style={{ marginBottom: 'var(--kids-space-xl)' }}>
          <div className="kids-stat purple">
            <div className="kids-stat-icon">👥</div>
            <div className="kids-stat-number">{mySchool.student_count}</div>
            <div className="kids-stat-label">Μαθητές</div>
          </div>
          <div className="kids-stat turquoise">
            <div className="kids-stat-icon">📚</div>
            <div className="kids-stat-number">{mySchool.class_count}</div>
            <div className="kids-stat-label">Τάξεις</div>
          </div>
          <div className="kids-stat green">
            <div className="kids-stat-icon">🔬</div>
            <div className="kids-stat-number">{mySchool.observation_count}</div>
            <div className="kids-stat-label">Παρατηρήσεις</div>
          </div>
          <div className="kids-stat orange">
            <div className="kids-stat-icon">🏅</div>
            <div className="kids-stat-number">{mySchool.badge_count}</div>
            <div className="kids-stat-label">Βραβεία</div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="kids-section-header">
        <h2 className="kids-section-title">🏆 Κατάταξη Σχολείων</h2>
        <p className="kids-section-subtitle">Ποιο σχολείο βγαίνει πρώτο στις παρατηρήσεις;</p>
      </div>

      <div className="kids-leaderboard kids-animate-in">
        <div className="kids-leaderboard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: "'Fredoka', sans-serif", margin: 0, fontSize: '1.1rem' }}>
              📊 Top Σχολεία
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--kids-text-muted)' }}>
              {schoolStats.length} σχολεία
            </span>
          </div>
        </div>

        {schoolStats.map((school, i) => (
          <div
            key={school.school_id}
            className={`kids-leaderboard-row ${school.school_id === student?.school_id ? 'highlight' : ''}`}
          >
            <div className={`kids-leaderboard-rank ${getRankClass(i)}`}>
              {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div className="kids-leaderboard-name">
                {school.school_name}
                {school.school_id === student?.school_id && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--kids-purple)', marginLeft: '6px' }}>
                    (Εσύ!)
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--kids-text-muted)' }}>
                {school.city} · {school.student_count} μαθητές · {school.class_count} τάξεις
              </div>
            </div>
            <div className="kids-leaderboard-score">
              {school.observation_count}
            </div>
          </div>
        ))}

        {schoolStats.length === 0 && (
          <div style={{ padding: 'var(--kids-space-xl)', textAlign: 'center' }}>
            <p style={{ color: 'var(--kids-text-muted)' }}>Δεν υπάρχουν δεδομένα ακόμα</p>
          </div>
        )}
      </div>

      {/* School Badges */}
      <div style={{ marginTop: 'var(--kids-space-xl)' }}>
        <div className="kids-section-header">
          <h3 className="kids-section-title" style={{ fontSize: '1.1rem' }}>🏅 Βραβεία Σχολείου</h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 'var(--kids-space-md)',
        }}>
          {badges.filter(b => b.target_type === 'school').map(badge => {
            const earned = badgeAwards.some(a => a.badge_id === badge.id && a.school_id === student?.school_id);
            return (
              <div key={badge.id} className={`kids-badge-card ${earned ? 'earned' : 'locked'}`}>
                <div className="kids-badge-icon" style={{ fontSize: '2rem' }}>{badge.icon}</div>
                <div className="kids-badge-name" style={{ fontSize: '0.75rem' }}>{badge.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KidsSchool;
