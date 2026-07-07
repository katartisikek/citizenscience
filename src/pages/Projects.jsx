import { useState } from 'react';
import { ArrowRight, MapPin, Calendar, Users, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

const statusColors = {
  'Ενεργό':        { bg: 'var(--primary-100)',  text: 'var(--primary-700)',  border: 'var(--primary-300)' },
  'Ολοκληρωμένο':  { bg: 'var(--gray-100)',   text: 'var(--gray-600)',   border: 'var(--gray-200)' },
};

const Projects = () => {
  const { projects } = useData();
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('All');

  const tData = (item, key) => i18n.language.startsWith('en') && item[`${key}_en`] ? item[`${key}_en`] : item[key];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.status === filter);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="section-sm">
        <div className="container">
          <span className="overline">{t('projects.overline', 'Δράσεις')}</span>
          <h1 style={{ marginBottom: '1rem' }}>{t('projects.title', 'Τα Projects μας')}</h1>
          <p className="text-lead">
            {t('projects.desc', 'Ανακαλύψτε τις δράσεις του Citizen Science Hub. Δείτε αποτελέσματα παλαιότερων ερευνών και βρείτε ενεργά projects στα οποία μπορείτε να συμμετέχετε σήμερα.')}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {[
              { key: 'All', label: t('projects.filter_all', 'Όλα') },
              { key: 'Ενεργό', label: t('projects.filter_active', 'Ενεργά') },
              { key: 'Ολοκληρωμένο', label: t('projects.filter_completed', 'Ολοκληρωμένα') },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`btn ${filter === tab.key ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="bento-grid">
            {filteredProjects.map(project => {
              const sc = statusColors[project.status] || statusColors['Ολοκληρωμένο'];
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
                    {/* Status badge */}
                    <span style={{
                      position: 'absolute', top: '0.875rem', left: '0.875rem',
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
                    <h3 style={{ marginBottom: '0.625rem', fontSize: '1.25rem' }}>{tData(project, 'title')}</h3>
                    <p style={{ color: 'var(--color-text)', fontSize: '0.93rem', flex: 1, marginBottom: '1.25rem', lineHeight: 1.6 }}>
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
              <p>{t('projects.no_results', 'Δεν βρέθηκαν projects για αυτή την κατηγορία.')}</p>
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
