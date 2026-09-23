import { useState } from 'react';
import { useKidsData } from '../../context/KidsDataContext';
import '../../kids.css';

const KidsLeaderboard = () => {
  const { schoolStats, mySchool, schoolRank } = useKidsData();
  const [filterCity, setFilterCity] = useState('all');

  const cities = ['all', ...new Set(schoolStats.map(s => s.city))];

  const filteredStats = filterCity === 'all' 
    ? schoolStats 
    : schoolStats.filter(s => s.city === filterCity);

  // Aggregated platform totals (Demonstrating privacy-first scalability: 100 schools, 300 classes, 4500 students)
  const totalObservations = schoolStats.reduce((sum, s) => sum + s.observation_count, 0);
  const totalSchools = schoolStats.length;
  const totalStudents = schoolStats.reduce((sum, s) => sum + s.student_count, 0);

  return (
    <div className="kids-container">
      {/* Header Banner */}
      <div className="kids-card kids-card-gradient" style={{ textAlign: 'center', padding: '28px 20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏆</div>
        <h1 className="kids-title" style={{ color: 'white', marginBottom: '8px' }}>Πρωτάθλημα Σχολείων</h1>
        <p className="kids-subtitle" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', margin: '0 auto' }}>
          Δείτε πώς συγκεντρώνουν επιστημονικές παρατηρήσεις τα σχολεία της Κρήτης!
        </p>

        {/* Aggregate Privacy-First Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '12px',
          marginTop: '20px',
          background: 'rgba(255,255,255,0.15)',
          padding: '16px',
          borderRadius: 'var(--kids-radius-md)',
          backdropFilter: 'blur(10px)',
        }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFE66D' }}>{totalSchools}</div>
            <div style={{ fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>Σχολεία</div>
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFE66D' }}>{totalStudents}</div>
            <div style={{ fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>Μαθητές</div>
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFE66D' }}>{totalObservations}</div>
            <div style={{ fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>Παρατηρήσεις</div>
          </div>
        </div>
      </div>

      {/* My School Rank Banner */}
      {mySchool && (
        <div className="kids-card" style={{
          background: 'linear-gradient(135deg, #FFF9DB 0%, #FFF3BF 100%)',
          border: '2px solid #FCC419',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: '#FCC419', color: '#1A1528', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
            }}>
              #{schoolRank}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1A1528' }}>
                Το Σχολείο σου: {mySchool.school_name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                {mySchool.city} · {mySchool.observation_count} παρατηρήσεις · {mySchool.badge_count} παράσημα
              </div>
            </div>
          </div>
          <span className="kids-chip kids-chip-purple">
            🌟 {mySchool.approved_observations} Έγκυρες
          </span>
        </div>
      )}

      {/* City Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '18px' }}>
        {cities.map(city => {
          const active = filterCity === city;
          return (
            <button
              key={city}
              type="button"
              onClick={() => setFilterCity(city)}
              style={{
                borderRadius: '999px',
                padding: '8px 18px',
                fontSize: '0.88rem',
                whiteSpace: 'nowrap',
                border: active ? '2px solid #6C63FF' : '2px solid #CBD5E1',
                background: active ? 'linear-gradient(135deg, #6C63FF 0%, #8B85FF 100%)' : 'white',
                color: active ? 'white' : '#334155',
                fontWeight: 700,
                fontFamily: "'Fredoka', sans-serif",
                cursor: 'pointer',
                boxShadow: active ? '0 6px 16px rgba(108, 99, 255, 0.35)' : '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              {city === 'all' ? '🏛️ Όλες οι Πόλεις' : `📍 ${city}`}
            </button>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="kids-card" style={{ padding: '0', overflow: 'hidden' }}>
        {filteredStats.map((item, idx) => {
          const isTop3 = idx < 3;
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
          const isMySchool = item.school_id === mySchool?.school_id;

          return (
            <div
              key={item.school_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: idx < filteredStats.length - 1 ? '1px solid var(--kids-border)' : 'none',
                backgroundColor: isMySchool ? 'rgba(108, 99, 255, 0.08)' : isTop3 ? 'rgba(255, 230, 109, 0.15)' : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              {/* Rank / Medal */}
              <div style={{
                width: '40px',
                fontSize: isTop3 ? '1.5rem' : '1rem',
                fontWeight: 800,
                color: 'var(--kids-text-muted)',
                textAlign: 'center',
                flexShrink: 0,
              }}>
                {medal}
              </div>

              {/* School Info */}
              <div style={{ flex: 1, paddingLeft: '12px', minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.school_name}</span>
                  {isMySchool && <span className="kids-chip kids-chip-purple" style={{ fontSize: '0.7rem' }}>Εσύ!</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--kids-text-light)' }}>
                  📍 {item.city} · 🏫 {item.class_count} Τάξεις · 👥 {item.student_count} Μαθητές
                </div>
              </div>

              {/* Stats */}
              <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--kids-primary)' }}>
                  {item.observation_count} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>obs</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--kids-accent)', fontWeight: 600 }}>
                  🏅 {item.badge_count} παράσημα
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Guarantee Footer Note */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        borderRadius: 'var(--kids-radius-md)',
        background: '#EBF8FF',
        border: '1px solid #BEE3F8',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{ fontSize: '1.5rem' }}>🛡️</div>
        <div style={{ fontSize: '0.8rem', color: '#2B6CB0', lineHeight: 1.4 }}>
          <strong>Προστασία Ιδιωτικότητας (Privacy-First):</strong> Τα αποτελέσματα παρουσιάζονται συγκεντρωτικά ανά σχολείο. Κανένα προσωπικό στοιχείο ή ονοματεπώνυμο μαθητή δεν δημοσιοποιείται ή αποθηκεύεται.
        </div>
      </div>
    </div>
  );
};

export default KidsLeaderboard;
