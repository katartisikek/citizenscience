import { useKidsData } from '../../context/KidsDataContext';
import { useKidsAuth } from '../../context/KidsAuthContext';

const KidsDiscoveries = () => {
  const { student } = useKidsAuth();
  const { myObservations, missions } = useKidsData();

  return (
    <div className="kids-container" style={{ padding: 'var(--kids-space-lg) var(--kids-space-md)' }}>
      <div className="kids-section-header">
        <h2 className="kids-section-title">🔬 Οι Ανακαλύψεις μου</h2>
        <p className="kids-section-subtitle">Όλες οι παρατηρήσεις που έχεις κάνει</p>
      </div>

      {myObservations.length === 0 ? (
        <div className="kids-empty kids-animate-in">
          <div className="kids-empty-icon">🔭</div>
          <div className="kids-empty-title">Δεν έχεις ανακαλύψεις ακόμα!</div>
          <div className="kids-empty-text">Ξεκίνα μια αποστολή για να κάνεις την πρώτη σου παρατήρηση.</div>
        </div>
      ) : (
        <div className="kids-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kids-space-md)' }}>
          {myObservations.map(obs => {
            const mission = missions.find(m => m.id === obs.mission_id);
            return (
              <div key={obs.id} className="kids-card" style={{ padding: 'var(--kids-space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--kids-space-md)' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--kids-radius-md)',
                    background: 'rgba(108, 99, 255, 0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', flexShrink: 0,
                  }}>
                    {mission?.icon || '📝'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                      <h4 style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontSize: '1rem' }}>
                        {mission?.title || 'Αποστολή'}
                      </h4>
                      <span className={`kids-status ${obs.status}`}>
                        {obs.status === 'pending' ? '⏳ Αναμονή' :
                         obs.status === 'approved' ? '✅ Εγκρίθηκε' :
                         obs.status === 'needs_revision' ? '📝 Αναθεώρηση' : '❌ Απορρίφθηκε'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--kids-text-muted)', margin: '4px 0' }}>
                      📅 {new Date(obs.submitted_at).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {obs.notes && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--kids-text-light)', margin: '8px 0 0' }}>
                        {obs.notes}
                      </p>
                    )}
                    {obs.data && Object.keys(obs.data).length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {Object.entries(obs.data).map(([key, value]) => (
                          <span key={key} style={{
                            padding: '2px 10px', borderRadius: 'var(--kids-radius-full)',
                            background: 'rgba(108, 99, 255, 0.06)', fontSize: '0.75rem',
                            color: 'var(--kids-text)', fontWeight: 500,
                          }}>
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KidsDiscoveries;
