import { ArrowLeft, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '../context/DataContext';

const NewsDetail = () => {
  const { id } = useParams();
  const { news, loading } = useData();
  const { t, i18n } = useTranslation();
  const item = news.find(entry => String(entry.id) === String(id));
  const translated = (key) => i18n.language.startsWith('en') && item?.[`${key}_en`]
    ? item[`${key}_en`]
    : item?.[key];

  if (loading) {
    return <section className="section"><div className="container">{t('common.loading', 'Φόρτωση...')}</div></section>;
  }

  if (!item) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 760, textAlign: 'center' }}>
          <h1>{t('news.not_found', 'Η είδηση δεν βρέθηκε')}</h1>
          <Link to="/news" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            <ArrowLeft size={16} /> {t('news.back', 'Πίσω στα νέα')}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="animate-fade-in">
      {item.image && (
        <div style={{ width: '100%', height: 'clamp(260px, 45vw, 520px)', overflow: 'hidden' }}>
          <img src={item.image} alt={translated('title')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <Link to="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> {t('news.back', 'Πίσω στα νέα')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--color-text-light)' }}>
            <span className="badge">{translated('type')}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={15} /> {translated('date')}
            </span>
          </div>
          <h1>{translated('title')}</h1>
          <div style={{ marginTop: '2rem', fontSize: '1.05rem', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
            {translated('content')}
          </div>
        </div>
      </section>
    </article>
  );
};

export default NewsDetail;
