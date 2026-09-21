import { useKidsData } from '../../context/KidsDataContext';

const KidsBadges = () => {
  const { badges, myBadgeIds } = useKidsData();

  const earnedBadges = badges.filter(b => myBadgeIds.has(b.id));
  const lockedBadges = badges.filter(b => !myBadgeIds.has(b.id));

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)' }}>
      <div className="kids-section-header">
        <h2 className="kids-section-title">🏅 Τα Βραβεία μου</h2>
        <p className="kids-section-subtitle">Κέρδισε βραβεία κάνοντας παρατηρήσεις!</p>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <>
          <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem', marginBottom: 'var(--kids-space-md)' }}>
            ✨ Κερδισμένα ({earnedBadges.length})
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 'var(--kids-space-md)',
            marginBottom: 'var(--kids-space-2xl)',
          }}>
            {earnedBadges.map(badge => (
              <div key={badge.id} className="kids-badge-card earned kids-animate-pop">
                <div className="kids-badge-icon">{badge.icon}</div>
                <div className="kids-badge-name">{badge.name}</div>
                <div className="kids-badge-desc">{badge.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Progress towards next badges */}
      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem', marginBottom: 'var(--kids-space-md)' }}>
        🔒 Ξεκλείδωσέ τα! ({lockedBadges.length})
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 'var(--kids-space-md)',
      }}>
        {lockedBadges.map(badge => (
          <div key={badge.id} className="kids-badge-card locked">
            <div className="kids-badge-icon">{badge.icon}</div>
            <div className="kids-badge-name">{badge.name}</div>
            <div className="kids-badge-desc">
              {badge.criteria_type === 'observation_count'
                ? `${badge.criteria_value} παρατηρήσεις`
                : badge.criteria_type === 'mission_complete'
                ? 'Ολοκλήρωσε αποστολή'
                : badge.description}
            </div>
            <div style={{
              marginTop: '8px',
              padding: '2px 8px',
              borderRadius: 'var(--kids-radius-full)',
              background: 'rgba(108, 99, 255, 0.06)',
              fontSize: '0.65rem',
              color: 'var(--kids-text-muted)',
              fontWeight: 600,
            }}>
              {badge.target_type === 'student' ? '👤 Μαθητής' : badge.target_type === 'class' ? '👥 Τάξη' : '🏫 Σχολείο'}
            </div>
          </div>
        ))}
      </div>

      {badges.length === 0 && (
        <div className="kids-empty">
          <div className="kids-empty-icon">🎖️</div>
          <div className="kids-empty-title">Τα βραβεία έρχονται σύντομα!</div>
          <div className="kids-empty-text">Ξεκίνα να κάνεις παρατηρήσεις για να κερδίσεις!</div>
        </div>
      )}
    </div>
  );
};

export default KidsBadges;
