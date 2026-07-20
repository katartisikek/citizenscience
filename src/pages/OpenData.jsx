import { useState } from 'react';
import { Map as MapIcon, FileText, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useData } from '../context/DataContext';
import ObservationMap from '../components/ObservationMap';

const OpenData = () => {
  const { t } = useTranslation();
  const { projects, observations } = useData();
  const [selectedProject, setSelectedProject] = useState('all');

  const filtered = selectedProject === 'all'
    ? observations.filter(o => o.status === 'approved')
    : observations.filter(o => o.status === 'approved' && String(o.project_id) === selectedProject);

  const exportCSV = () => {
    const headers = ['id', 'project_id', 'lat', 'lng', 'status', 'created_at'];
    const rows = filtered.map(o => [o.id, o.project_id, o.lat, o.lng, o.status, o.created_at]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'observations.csv';
    a.click();
  };

  const exportGeoJSON = () => {
    const features = filtered.filter(o => o.lat && o.lng).map(o => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [o.lng, o.lat] },
      properties: { id: o.id, project_id: o.project_id, data: o.data, created_at: o.created_at },
    }));
    const geojson = { type: 'FeatureCollection', features };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'observations.geojson';
    a.click();
  };

  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-primary-light)', color: 'white', padding: 'clamp(2rem, 5vw, 4rem) 1rem' }}>
        <div className="container text-center">
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>{t('opendata.title', 'Ανοικτά Δεδομένα')}</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', opacity: 0.9 }}>
            {t('opendata.desc', 'Η διαφάνεια είναι βασική αρχή του Citizen Science.')}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card mb-4" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapIcon color="var(--color-primary)" /> {t('opendata.dashboards', 'Διαδραστικοί Χάρτες')}
              </h2>
              <select className="form-control" style={{ width: 'auto' }} value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}>
                <option value="all">Όλα τα Projects</option>
                {projects.map(p => <option key={p.id} value={String(p.id)}>{p.title}</option>)}
              </select>
            </div>

            <div style={{ width: '100%', height: 'clamp(280px, 45vw, 450px)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {filtered.length > 0 ? (
                <ObservationMap observations={filtered} projects={projects} />
              ) : (
                <div style={{
                  height: '100%', background: '#e2e8f0', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)',
                }}>
                  <MapIcon size={48} opacity={0.4} />
                  <p style={{ marginTop: '1rem' }}>Δεν υπάρχουν εγκεκριμένες παρατηρήσεις ακόμα.</p>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.75rem' }}>
              {filtered.length} εγκεκριμένες παρατηρήσεις
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="var(--color-secondary)" /> Export Δεδομένων
              </h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Κατεβάστε τα εγκεκριμένα δεδομένα για δική σας ανάλυση.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={exportCSV} className="btn btn-outline">
                  <Download size={16} /> CSV
                </button>
                <button onClick={exportGeoJSON} className="btn btn-primary">
                  <Download size={16} /> GeoJSON
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 className="mb-3">Στατιστικά</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  Σύνολο παρατηρήσεων: <strong>{observations.length}</strong>
                </li>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  Εγκεκριμένες: <strong>{observations.filter(o => o.status === 'approved').length}</strong>
                </li>
                <li style={{ padding: '0.75rem 0' }}>
                  Ενεργά projects: <strong>{projects.filter(p => p.status === 'Ενεργό').length}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OpenData;
