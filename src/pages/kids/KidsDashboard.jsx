import { Link } from 'react-router-dom';
import { useKidsAuth } from '../../context/KidsAuthContext';
import { useKidsData } from '../../context/KidsDataContext';
import '../../kids.css';

const KidsDashboard = () => {
  const { student } = useKidsAuth();
  const { missions, myObservations, myTotalCount, myApprovedCount, totalPoints, mySchool, loading } = useKidsData();

  if (loading) {
    return (
      <div className="kids-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <img src="/assets/kids_mascot_hero.jpg" alt="Mascot" className="kids-mascot-avatar" />
        <p style={{ color: '#64748B', fontFamily: "'Fredoka', cursive", fontSize: '1.2rem', marginTop: '12px' }}>
          Φόρτωση αποστολών... 🌿
        </p>
      </div>
    );
  }

  return (
    <div className="kids-container" style={{ padding: '24px 16px 80px 16px' }}>
      {/* Cartoon Nature Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(108, 99, 255, 0.2)',
        marginBottom: '24px',
        border: '4px solid white',
      }}>
        <img
          src="/assets/kids_banner_nature.jpg"
          alt="Kids Nature Explorer"
          style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(30, 41, 59, 0.75) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/assets/kids_mascot_hero.jpg" alt="Mascot" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid #FFE66D' }} />
            <div>
              <h1 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.8rem', color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Γεια σου, {student?.alias}! 🌿
              </h1>
              <p style={{ color: '#FFE66D', fontFamily: "'Quicksand', sans-serif", fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>
                Έτοιμος/η να ανακαλύψεις τη φύση της Κρήτης σήμερα;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Playful Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <div className="kids-stat-card" style={{ borderColor: '#6C63FF', background: '#F0F4FF' }}>
          <div style={{ fontSize: '1.8rem' }}>🔬</div>
          <div className="number" style={{ color: '#6C63FF' }}>{myTotalCount}</div>
          <div className="label">Παρατηρήσεις</div>
        </div>

        <div className="kids-stat-card" style={{ borderColor: '#2ECC71', background: '#E8FAEF' }}>
          <div style={{ fontSize: '1.8rem' }}>✅</div>
          <div className="number" style={{ color: '#2ECC71' }}>{myApprovedCount}</div>
          <div className="label">Εγκεκριμένες</div>
        </div>

        <div className="kids-stat-card" style={{ borderColor: '#FF9F43', background: '#FFF5EB' }}>
          <div style={{ fontSize: '1.8rem' }}>⭐</div>
          <div className="number" style={{ color: '#FF9F43' }}>{totalPoints}</div>
          <div className="label">Πόντοι</div>
        </div>

        <div className="kids-stat-card" style={{ borderColor: '#4ECDC4', background: '#E8FAF8' }}>
          <div style={{ fontSize: '1.8rem' }}>🏫</div>
          <div className="number" style={{ color: '#0EA5E9', fontSize: '1.2rem' }}>{mySchool?.school_name || 'Σχολείο'}</div>
          <div className="label">Το Σχολείο μου</div>
        </div>
      </div>

      {/* Active Missions Section */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.5rem', color: '#1E293B', margin: 0 }}>
            🎯 Ενεργές Αποστολές
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '2px 0 0 0', fontWeight: 600 }}>
            Διάλεξε μια αποστολή και ξεκίνα να παρατηρείς!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {missions.map(mission => (
          <Link
            key={mission.id}
            to={`/kids/missions/${mission.id}/observe`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="kids-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                backgroundColor: mission.difficulty === 'easy' ? '#E8FAEF' : '#FFF5EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', border: '2px solid #CBD5E1', flexShrink: 0,
              }}>
                {mission.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.2rem', color: '#1E293B', margin: 0 }}>
                    {mission.title}
                  </h3>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px',
                    backgroundColor: mission.difficulty === 'easy' ? '#D1FAE5' : '#FEF3C7',
                    color: mission.difficulty === 'easy' ? '#065F46' : '#92400E',
                  }}>
                    {mission.difficulty === 'easy' ? '🟢 Εύκολο' : '🟡 Μέτριο'}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0, fontWeight: 600 }}>
                  {mission.description}
                </p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.1rem', color: '#6C63FF' }}>
                  ⭐ +{mission.points}
                </div>
                <span className="kids-btn kids-btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem', marginTop: '6px' }}>
                  Έναρξη 🚀
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KidsDashboard;
