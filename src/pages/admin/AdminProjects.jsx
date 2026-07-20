import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { DATA_TYPES, DEFAULT_DATA_TYPES } from '../../lib/dataTypes';

const emptyForm = () => ({
  title: '', title_en: '', status: 'Ενεργό', status_en: 'Active',
  description: '', description_en: '', goal: '', goal_en: '',
  participants: '', participants_en: '', area: '', area_en: '',
  timeline: '', timeline_en: '', image: '',
  data_types: [...DEFAULT_DATA_TYPES],
  form_schema: [],
});

const AdminProjects = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('el');
  const [formData, setFormData] = useState(emptyForm());
  const [newField, setNewField] = useState({ name: '', label: '', type: 'text', options: '' });

  const handleOpenModal = (project = null) => {
    setActiveTab('el');
    if (project) {
      setFormData({
        ...emptyForm(),
        ...project,
        data_types: project.data_types?.length ? [...project.data_types] : [...DEFAULT_DATA_TYPES],
        form_schema: project.form_schema || [],
      });
      setEditingId(project.id);
    } else {
      setFormData(emptyForm());
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const toggleDataType = (id) => {
    setFormData((prev) => {
      const has = prev.data_types.includes(id);
      return {
        ...prev,
        data_types: has
          ? prev.data_types.filter((t) => t !== id)
          : [...prev.data_types, id],
      };
    });
  };

  const addFormField = () => {
    if (!newField.name.trim() || !newField.label.trim()) return;
    const field = {
      name: newField.name.trim().replace(/\s+/g, '_'),
      label: newField.label.trim(),
      type: newField.type,
    };
    if (newField.type === 'select' && newField.options.trim()) {
      field.options = newField.options.split(',').map((o) => o.trim()).filter(Boolean);
    }
    setFormData((prev) => ({ ...prev, form_schema: [...(prev.form_schema || []), field] }));
    setNewField({ name: '', label: '', type: 'text', options: '' });
  };

  const removeFormField = (name) => {
    setFormData((prev) => ({
      ...prev,
      form_schema: (prev.form_schema || []).filter((f) => f.name !== name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      data_types: formData.data_types?.length ? formData.data_types : [...DEFAULT_DATA_TYPES],
      form_schema: formData.form_schema || [],
      image: formData.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    };
    if (editingId) {
      await updateProject(editingId, payload);
    } else {
      await addProject(payload);
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
              <th style={{ padding: '1rem' }}>Τύποι</th>
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
                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                  {(project.data_types || []).length || DEFAULT_DATA_TYPES.length}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleOpenModal(project)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', marginRight: '1rem' }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => { if (window.confirm('Σίγουρα θέλετε να διαγράψετε αυτό το project;')) deleteProject(project.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Δεν βρέθηκαν projects.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && createPortal(
        <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-background)', zIndex: 100, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--color-surface)', minHeight: '100vh', margin: '0 auto', padding: '3rem 2rem', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2>{editingId ? 'Επεξεργασία Project' : 'Νέο Project'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              <button type="button" onClick={() => setActiveTab('el')}
                style={{ background: 'none', border: 'none', borderBottom: activeTab === 'el' ? '2px solid var(--color-primary)' : 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: activeTab === 'el' ? 600 : 400, color: activeTab === 'el' ? 'var(--color-primary)' : 'var(--color-text)' }}
              >Ελληνικά (EL)</button>
              <button type="button" onClick={() => setActiveTab('en')}
                style={{ background: 'none', border: 'none', borderBottom: activeTab === 'en' ? '2px solid var(--color-primary)' : 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: activeTab === 'en' ? 600 : 400, color: activeTab === 'en' ? 'var(--color-primary)' : 'var(--color-text)' }}
              >English (EN)</button>
              <button type="button" onClick={() => setActiveTab('types')}
                style={{ background: 'none', border: 'none', borderBottom: activeTab === 'types' ? '2px solid var(--color-primary)' : 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: activeTab === 'types' ? 600 : 400, color: activeTab === 'types' ? 'var(--color-primary)' : 'var(--color-text)' }}
              >Τύποι δεδομένων</button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === 'el' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Τίτλος</label>
                    <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Κατάσταση</label>
                      <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option>Ενεργό</option>
                        <option>Ολοκληρωμένο</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Περιοχή</label>
                      <input type="text" className="form-control" required value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Χρονοδιάγραμμα</label>
                      <input type="text" className="form-control" required value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Συμμετέχοντες</label>
                      <input type="text" className="form-control" required value={formData.participants} onChange={e => setFormData({ ...formData, participants: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Στόχος</label>
                    <input type="text" className="form-control" required value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Περιγραφή</label>
                    <textarea className="form-control" required style={{ minHeight: '100px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </>
              )}

              {activeTab === 'en' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={formData.title_en || ''} onChange={e => setFormData({ ...formData, title_en: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-control" value={formData.status_en || 'Active'} onChange={e => setFormData({ ...formData, status_en: e.target.value })}>
                        <option>Active</option>
                        <option>Completed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Area</label>
                      <input type="text" className="form-control" value={formData.area_en || ''} onChange={e => setFormData({ ...formData, area_en: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Timeline</label>
                      <input type="text" className="form-control" value={formData.timeline_en || ''} onChange={e => setFormData({ ...formData, timeline_en: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Participants</label>
                      <input type="text" className="form-control" value={formData.participants_en || ''} onChange={e => setFormData({ ...formData, participants_en: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Goal</label>
                    <input type="text" className="form-control" value={formData.goal_en || ''} onChange={e => setFormData({ ...formData, goal_en: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" style={{ minHeight: '100px' }} value={formData.description_en || ''} onChange={e => setFormData({ ...formData, description_en: e.target.value })} />
                  </div>
                </>
              )}

              {activeTab === 'types' && (
                <>
                  <p style={{ color: 'var(--color-text-light)', marginBottom: '1.25rem' }}>
                    Επιλέξτε ποιοι τύποι δεδομένων θα συλλέγονται σε αυτό το project.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {DATA_TYPES.map((t) => {
                      const checked = formData.data_types.includes(t.id);
                      return (
                        <label key={t.id} style={{
                          display: 'flex', gap: '0.65rem', alignItems: 'flex-start',
                          padding: '0.85rem', borderRadius: 'var(--radius-md)',
                          border: `1px solid ${checked ? 'var(--primary-500)' : 'var(--color-border)'}`,
                          background: checked ? 'var(--primary-100)' : 'var(--color-surface)',
                          cursor: 'pointer', minHeight: 72,
                        }}>
                          <input type="checkbox" checked={checked} onChange={() => toggleDataType(t.id)} style={{ marginTop: 4 }} />
                          <span>
                            <strong style={{ display: 'block', fontSize: '0.92rem' }}>{t.label}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{t.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {formData.data_types.includes('questionnaire') && (
                    <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Ερωτηματολόγιο (form_schema)</h3>
                      {(formData.form_schema || []).length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                          {formData.form_schema.map((f) => (
                            <li key={f.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                              <span><strong>{f.label}</strong> <span style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>({f.type} · {f.name})</span></span>
                              <button type="button" onClick={() => removeFormField(f.name)} style={{ background: 'none', border: 'none', color: '#c05530', cursor: 'pointer' }}>Αφαίρεση</button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input className="form-control" placeholder="Όνομα πεδίου (id)" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} />
                        <input className="form-control" placeholder="Ετικέτα" value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} />
                        <select className="form-control" value={newField.type} onChange={(e) => setNewField({ ...newField, type: e.target.value })}>
                          <option value="text">Κείμενο</option>
                          <option value="number">Αριθμός</option>
                          <option value="textarea">Παράγραφος</option>
                          <option value="select">Επιλογή</option>
                        </select>
                        <input className="form-control" placeholder="Επιλογές (κόμμα) αν select" value={newField.options} onChange={(e) => setNewField({ ...newField, options: e.target.value })} disabled={newField.type !== 'select'} />
                      </div>
                      <button type="button" className="btn btn-outline" style={{ marginTop: '0.75rem' }} onClick={addFormField}>
                        <Plus size={16} /> Προσθήκη πεδίου
                      </button>
                    </div>
                  )}
                </>
              )}

              <div className="form-group mt-3">
                <label className="form-label">Εικόνα (URL) / Image (URL)</label>
                <input type="url" className="form-control" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
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
