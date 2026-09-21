import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Calendar, Users, FolderOpen, Filter } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData, THEMATIC_CATEGORIES } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

const statusColors = {
  'Ενεργό':        { bg: 'var(--primary-100)',  text: 'var(--primary-700)',  border: 'var(--primary-300)' },
  'Ολοκληρωμένο':  { bg: 'var(--gray-100)',   text: 'var(--gray-600)',   border: 'var(--gray-200)' },
};

const Projects = () => {
  const { projects } = useData();
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const tData = (item, key) => i18n.language.startsWith('en') && item[`${key}_en`] ? item[`${key}_en`] : item[key];

  const filteredProjects = projects.filter(p => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesCategory = selectedCategory === 'all' || p.thematic_category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const activeCategoryObj = THEMATIC_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="section-sm">
        <div className="container">
          <span className="overline">{t('projects.overline', 'Δράσεις & Θεματικές')}</span>
          <h1 style={{ marginBottom: '1rem' }}>
            {activeCategoryObj ? tData(activeCategoryObj, 'title') : t('projects.title', 'Τα Projects μας')}
          </h1>
          <p className="text-lead">
            {activeCategoryObj
              ? tData(activeCategoryObj, 'description')
              : t('projects.desc', 'Ανακαλύψτε τις δράσεις του Citizen Science Hub χωρισμένες στις 4 θεματικές κατηγορίες. Δείτε αποτελέσματα παλαιότερων ερευνών και βρείτε ενεργά projects.')
            }
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">

          {/* ── THEMATIC CATEGORIES FILTER PILLS ───────────────── */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-light)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} /> Θεματικές Κατηγορίες:
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleCategoryChange('all')}
                className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.5rem 1.15rem', fontSize: '0.88rem', borderRadius: 'var(--radius-full)' }}
              >
                🏛️ Όλες οι Κατηγορίες ({projects.length})
              </button>

              {THEMATIC_CATEGORIES.map(cat => {
                const count = projects.filter(p => p.thematic_category === cat.id).length;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      padding: '0.5rem 1.15rem',
                      fontSize: '0.88rem',
                      borderRadius: 'var(--radius-full)',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  >
                    {cat.icon} {tData(cat, 'badgeText')} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            {[
              { key: 'All', label: t('projects.filter_all', 'Όλα τα Status') },
              { key: 'Ενεργό', label: t('projects.filter_active', 'Ενεργά') },
              { key: 'Ολοκληρωμένο', label: t('projects.filter_completed', 'Ολοκληρωμένα') },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: statusFilter === tab.key ? 'var(--color-primary)' : 'var(--color-text-light)',
                  borderBottom: statusFilter === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                  marginBottom: '-1rem',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="bento-grid">
            {filteredProjects.map(project => {
              const sc = statusColors[project.status] || statusColors['Ολοκληρωμένο'];
              const catObj = THEMATIC_CATEGORIES.find(c => c.id === project.thematic_category);

              return (
                <article key={project.id} className="bento-card">
                  {/* Image */}
                  <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.5s var(--ease-out)',
                      }}
                      className="proj-img"
                    />
                    
                    {/* Category badge */}
                    {catObj && (
                      <span style={{
                        position: 'absolute', top: '0.875rem', left: '0.875rem',
                        backgroundColor: catObj.bg, color: catObj.color,
                        border: `1px solid ${catObj.color}`,
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem', fontWeight: 700,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}>
                        {catObj.icon} {catObj.badgeText}
                      </span>
                    )}

                    {/* Status badge */}
                    <span style={{
                      position: 'absolute', top: '0.875rem', right: '0.875rem',
                      background: sc.bg, color: sc.text,
                      border: `1px solid ${sc.border}`,
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem', fontWeight: 600,
                    }}>
                      {tData(project, 'status')}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ marginBottom: '0.625rem', fontSize: '1.2rem', lineHeight: 1.35 }}>{tData(project, 'title')}</h3>
                    <p style={{ color: 'var(--color-text)', fontSize: '0.92rem', flex: 1, marginBottom: '1.25rem', lineHeight: 1.6 }}>
                      {tData(project, 'description')}
                    </p>

                    {/* Meta */}
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: '0.875rem',
                      paddingTop: '1rem', borderTop: '1px solid var(--color-border)',
                      marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-light)',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={14} style={{ color: 'var(--primary-500)' }} /> {tData(project, 'area')}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} style={{ color: 'var(--primary-500)' }} /> {tData(project, 'timeline')}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Users size={14} style={{ color: 'var(--primary-500)' }} /> {tData(project, 'participants')} {t('projects.participants_suffix', 'άτομα')}
                      </span>
                    </div>

                    <Link to={`/projects/${project.id}`} className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
                      {t('projects.btn_more', 'Περισσότερα')} <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-light)' }}>
              <FolderOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>{t('projects.no_results', 'Δεν βρέθηκαν projects για αυτή τη θεματική κατηγορία.')}</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .bento-card:hover .proj-img { transform: scale(1.04); }
      `}</style>
    </div>
  );
};

export default Projects;
