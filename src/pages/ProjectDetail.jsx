import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Target, Camera, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, loading } = useData();
  const { t, i18n } = useTranslation();

  const project = projects.find(p => String(p.id) === String(id));
  const tData = (item, key) => i18n.language.startsWith('en') && item?.[`${key}_en`] ? item[`${key}_en`] : item?.[key];

  if (loading) return <div className="section text-center">Φόρτωση...</div>;

  if (!project) {
    return (
      <div className="section text-center">
        <h1>Project δεν βρέθηκε</h1>
        <Link to="/projects" className="btn btn-primary mt-3">Πίσω στα Projects</Link>
      </div>
    );
  }

  const isActive = project.status === 'Ενεργό';

  return (
    <div className="animate-fade-in">
      <section className="section-sm">
        <div className="container">
          <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> {t('projects.title', 'Τα Projects μας')}
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            <div>
              <img src={project.image} alt={project.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', maxHeight: 360, objectFit: 'cover' }} />
            </div>
            <div>
              <span className="overline">{tData(project, 'status')}</span>
              <h1 style={{ marginBottom: '1rem' }}>{tData(project, 'title')}</h1>
              <p className="text-lead" style={{ marginBottom: '1.5rem' }}>{tData(project, 'description')}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} color="var(--primary-500)" /> <strong>Στόχος:</strong> {tData(project, 'goal')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--primary-500)" /> {tData(project, 'area')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color="var(--primary-500)" /> {tData(project, 'timeline')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} color="var(--primary-500)" /> {tData(project, 'participants')}
                </span>
              </div>

              {isActive && (
                <Link to={`/projects/${project.id}/collect`} className="btn btn-primary">
                  <Camera size={18} /> Καταγραφή Παρατήρησης
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
