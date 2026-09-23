import { useKidsData } from '../../context/KidsDataContext';

const creteRegions = [
  { name: 'Ηράκλειο', emoji: '🏛️', lat: 35.34, lng: 25.13, color: '#6C63FF' },
  { name: 'Χανιά', emoji: '⛵', lat: 35.52, lng: 24.02, color: '#4ECDC4' },
  { name: 'Ρέθυμνο', emoji: '🏰', lat: 35.37, lng: 24.47, color: '#FF9F43' },
  { name: 'Λασίθι', emoji: '🌴', lat: 35.19, lng: 25.73, color: '#FF6B6B' },
];

const KidsExploreCrete = () => {
  const { missions, schoolStats, projects } = useKidsData();

  const totalSchools = schoolStats.length;
  const totalObservations = schoolStats.reduce((sum, s) => sum + (s.observation_count || 0), 0);
  const totalStudents = schoolStats.reduce((sum, s) => sum + (s.student_count || 0), 0);

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)' }}>
      <div className="kids-section-header">
        <h2 className="kids-section-title">🗺️ Εξερεύνησε την Κρήτη</h2>
        <p className="kids-section-subtitle">Δες τι ανακαλύπτουν τα σχολεία σε όλη την Κρήτη!</p>
      </div>

      {/* Crete Map Card */}
      <div className="kids-card kids-animate-in" style={{
        padding: 'var(--kids-space-xl)',
        background: 'linear-gradient(135deg, #E8F4F8 0%, #F0F4FF 50%, #FFF8F0 100%)',
        marginBottom: 'var(--kids-space-xl)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--kids-space-md)' }}>🏝️</div>
        <h3 style={{ fontFamily: "'Fredoka', sans-serif", margin: '0 0 var(--kids-space-lg)', fontSize: '1.3rem' }}>
          Κρήτη - Citizen Science Island
        </h3>

        {/* Region Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 'var(--kids-space-md)',
        }}>
          {creteRegions.map(region => {
            const regionSchools = schoolStats.filter(s =>
              s.city?.includes(region.name) || s.region?.includes(region.name)
            );
            const regionObs = regionSchools.reduce((sum, s) => sum + (s.observation_count || 0), 0);

            return (
              <div key={region.name} style={{
                background: 'var(--kids-surface)',
                borderRadius: 'var(--kids-radius-md)',
                padding: 'var(--kids-space-md)',
                border: `2px solid ${region.color}22`,
                transition: 'all var(--kids-t-base)',
                cursor: 'default',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{region.emoji}</div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: region.color }}>
                  {region.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--kids-text-muted)', marginTop: '4px' }}>
                  {regionSchools.length} σχολεία · {regionObs} παρατ.
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Stats */}
      <div className="kids-stats-grid kids-stagger" style={{ marginBottom: 'var(--kids-space-xl)' }}>
        <div className="kids-stat purple">
          <div className="kids-stat-icon">🏫</div>
          <div className="kids-stat-number">{totalSchools}</div>
          <div className="kids-stat-label">Σχολεία</div>
        </div>
        <div className="kids-stat turquoise">
          <div className="kids-stat-icon">👦</div>
          <div className="kids-stat-number">{totalStudents}</div>
          <div className="kids-stat-label">Μαθητές</div>
        </div>
        <div className="kids-stat green">
          <div className="kids-stat-icon">🔬</div>
          <div className="kids-stat-number">{totalObservations}</div>
          <div className="kids-stat-label">Παρατηρήσεις</div>
        </div>
        <div className="kids-stat orange">
          <div className="kids-stat-icon">🎯</div>
          <div className="kids-stat-number">{missions.length}</div>
          <div className="kids-stat-label">Αποστολές</div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="kids-section-header">
        <h3 className="kids-section-title" style={{ fontSize: '1.1rem' }}>📋 Ενεργά Projects</h3>
      </div>

      <div className="kids-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kids-space-md)' }}>
        {projects.map(project => (
          <div key={project.id} className="kids-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: 72, height: 72, borderRadius: '18px',
                    objectFit: 'cover', flexShrink: 0, border: '2px solid #E2E8F0',
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem', color: 'var(--kids-purple)' }}>
                  {project.title}
                </h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: 'var(--kids-text-light)', lineHeight: 1.4 }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="kids-chip" style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }}>
                    ✅ Ενεργό
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--kids-text-muted)', fontWeight: 600 }}>
                    🎯 {missions.filter(m => m.project_id === project.id).length} αποστολές
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fun Facts */}
      <div className="kids-card" style={{
        marginTop: 'var(--kids-space-xl)',
        padding: 'var(--kids-space-xl)',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFF0F5 100%)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--kids-space-sm)' }}>💡</div>
        <h4 style={{ fontFamily: "'Fredoka', sans-serif", margin: '0 0 var(--kids-space-sm)' }}>
          Ξέρεις ότι...
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--kids-text-light)', margin: 0 }}>
          Η Κρήτη φιλοξενεί πάνω από 2.000 ενδημικά φυτά που δεν υπάρχουν πουθενά αλλού στον κόσμο! 🌺
        </p>
      </div>
    </div>
  );
};

export default KidsExploreCrete;
