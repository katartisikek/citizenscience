import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminProjects = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', status: 'Ενεργό', description: '', goal: '', participants: '', area: '', timeline: '', image: ''
  });

  const handleOpenModal = (project = null) => {
    if (project) {
      setFormData(project);
      setEditingId(project.id);
    } else {
      setFormData({ title: '', status: 'Ενεργό', description: '', goal: '', participants: '', area: '', timeline: '', image: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateProject(editingId, formData);
    } else {
      addProject({ ...formData, image: formData.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>Διαχείριση Projects</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Νέο Project
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Τίτλος</th>
              <th style={{ padding: '1rem' }}>Κατάσταση</th>
              <th style={{ padding: '1rem' }}>Περιοχή</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem' }}><strong>{project.title}</strong></td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.85rem',
                    backgroundColor: project.status === 'Ενεργό' ? 'var(--color-primary-light)' : 'var(--color-border)',
                    color: project.status === 'Ενεργό' ? 'white' : 'var(--color-text)'
                  }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{project.area}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleOpenModal(project)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', marginRight: '1rem' }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => { if(window.confirm('Σίγουρα θέλετε να διαγράψετε αυτό το project;')) deleteProject(project.id) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Δεν βρέθηκαν projects.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Full Screen Form */}
      {isModalOpen && createPortal(
        <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-background)', zIndex: 100, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--color-surface)', minHeight: '100vh', margin: '0 auto', padding: '3rem 2rem', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2>{editingId ? 'Επεξεργασία Project' : 'Νέο Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Τίτλος</label>
                <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Κατάσταση</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option>Ενεργό</option>
                    <option>Ολοκληρωμένο</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Περιοχή</label>
                  <input type="text" className="form-control" required value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Χρονοδιάγραμμα</label>
                  <input type="text" className="form-control" required value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Συμμετέχοντες</label>
                  <input type="text" className="form-control" required value={formData.participants} onChange={e => setFormData({...formData, participants: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Στόχος</label>
                <input type="text" className="form-control" required value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Περιγραφή</label>
                <textarea className="form-control" required style={{ minHeight: '100px' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Εικόνα (URL)</label>
                <input type="url" className="form-control" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Ακύρωση</button>
                <button type="submit" className="btn btn-primary">Αποθήκευση</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminProjects;
