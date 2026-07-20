import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

const typeColors = {
  'Νέα':        { bg: 'var(--primary-100)',  text: 'var(--primary-700)' },
  'Εκδήλωση':   { bg: 'var(--secondary-200)',   text: 'var(--secondary-800)' },
  'Ανακοίνωση': { bg: 'var(--accent-200)',  text: 'var(--accent-700)' },
};

const upcomingEvents = [
  { date: '20', month: 'ΜΑΙ', month_en: 'MAY', title: 'Εκπαίδευση Εθελοντών Mosquito Watch', title_en: 'Mosquito Watch Volunteer Training', loc: 'Διαδικτυακά', loc_en: 'Online' },
  { date: '05', month: 'ΙΟΥ', month_en: 'JUL', title: 'Δειγματοληψία Νερού στον Γιόφυρο', title_en: 'Water Sampling at Giofyros', loc: 'Ηράκλειο', loc_en: 'Heraklion' },
  { date: '12', month: 'ΙΟΥ', month_en: 'JUL', title: 'Ημερίδα Citizen Science & Τοπική Κοινωνία', title_en: 'Citizen Science & Local Society Workshop', loc: 'Χανιά', loc_en: 'Chania' },
];

const News = () => {
  const { news } = useData();
  const { t, i18n } = useTranslation();

  const tData = (item, key) => i18n.language.startsWith('en') && item[`${key}_en`] ? item[`${key}_en`] : item[key];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="section-sm">
        <div className="container">
          <span className="overline">{t('news.overline', 'Ενημέρωση')}</span>
          <h1 style={{ marginBottom: '1rem' }}>{t('news.title', 'Νέα & Εκδηλώσεις')}</h1>
          <p className="text-lead">
            {t('news.desc', 'Μείνετε ενημερωμένοι για τις τελευταίες εξελίξεις, ανακοινώσεις και επερχόμενες εκδηλώσεις.')}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1.5rem, 4vw, 3rem)', alignItems: 'flex-start' }}>

            {/* ── Main: News Articles ─── */}
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              <h2 style={{ marginBottom: '1.75rem' }}>{t('news.latest', 'Τελευταία Νέα')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {news.map(item => {
                  const tc = typeColors[item.type] || typeColors['Νέα'];
                  return (
                    <article key={item.id} className="card" style={{ overflow: 'hidden' }}>
                      {/* Image */}
                      {item.image && (
                        <div style={{ height: 220, overflow: 'hidden' }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="news-img"
                            style={{
                              width: '100%', height: '100%', objectFit: 'cover',
                              transition: 'transform 0.5s var(--ease-out)',
                            }}
                          />
                        </div>
                      )}
                      {/* Body */}
                      <div style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
                          <span className="badge" style={{ background: tc.bg, color: tc.text }}>
                            {tData(item, 'type')}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                            <Clock size={14} /> {tData(item, 'date')}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{tData(item, 'title')}</h3>
                        <p style={{ color: 'var(--color-text)', marginBottom: '1.25rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
                          {tData(item, 'content')}
                        </p>
                        <button className="btn btn-ghost" style={{ padding: '0.5rem 0', color: 'var(--primary-700)', fontWeight: 600 }}>
                          {t('news.read_more', 'Διαβάστε περισσότερα')} <ChevronRight size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* ── Sidebar: Calendar ─── */}
            <div style={{ flex: '1 1 280px', minWidth: 0, maxWidth: '100%' }}>
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                position: 'sticky',
                top: 120,
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
                  <div className="icon-box" style={{ width: 40, height: 40 }}>
                    <CalendarIcon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem' }}>{t('news.upcoming', 'Προσεχείς Εκδηλώσεις')}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {upcomingEvents.map((ev, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '0.875rem',
                      paddingBottom: i < upcomingEvents.length - 1 ? '1.25rem' : 0,
                      borderBottom: i < upcomingEvents.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}>
                      {/* Date chip */}
                      <div style={{
                        minWidth: 52, height: 52,
                        background: 'var(--primary-100)',
                        border: '1px solid var(--primary-300)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--primary-700)', lineHeight: 1 }}>
                          {ev.date}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary-500)', letterSpacing: '0.05em' }}>
                          {tData(ev, 'month')}
                        </span>
                      </div>
                      {/* Info */}
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-dark)', margin: '0 0 0.25rem', lineHeight: 1.4 }}>
                          {tData(ev, 'title')}
                        </p>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                          <MapPin size={12} /> {tData(ev, 'loc')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                  {t('news.all_events', 'Όλες οι Εκδηλώσεις')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .card:hover .news-img { transform: scale(1.04); }
      `}</style>
    </div>
  );
};

export default News;
