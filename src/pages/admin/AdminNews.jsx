import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminNews = () => {
  const { news, addNews, updateNews, deleteNews } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('el');
  const [formData, setFormData] = useState({
    title: '', title_en: '', type: 'Ανακοίνωση', type_en: 'Announcement', date: '', date_en: '', content: '', content_en: '', image: ''
  });

  const handleOpenModal = (item = null) => {
    setActiveTab('el');
    if (item) {
      setFormData(item);
      setEditingId(item.id);
    } else {
      setFormData({ title: '', title_en: '', type: 'Ανακοίνωση', type_en: 'Announcement', date: new Date().toLocaleDateString('el-GR'), date_en: new Date().toLocaleDateString('en-US'), content: '', content_en: '', image: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateNews(editingId, formData);
    } else {
      addNews({ ...formData, image: formData.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800' });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>Νέα &amp; Εκδηλώσεις</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Νέο Άρθρο
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Τίτλος</th>
              <th style={{ padding: '1rem' }}>Τύπος</th>
              <th style={{ padding: '1rem' }}>Ημερομηνία</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem' }}><strong>{item.title}</strong></td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', backgroundColor: 'var(--color-background)' }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{item.date}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', marginRight: '1rem' }}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => { if (window.confirm('Διαγραφή αυτού του άρθρου;')) deleteNews(item.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && createPortal(
        <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-background)', zIndex: 100, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--color-surface)', minHeight: '100vh', margin: '0 auto', padding: '3rem 2rem', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2>{editingId ? 'Επεξεργασία Άρθρου' : 'Νέο Άρθρο'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab('el')} 
                style={{ background: 'none', border: 'none', borderBottom: activeTab === 'el' ? '2px solid var(--color-primary)' : 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: activeTab === 'el' ? 600 : 400, color: activeTab === 'el' ? 'var(--color-primary)' : 'var(--color-text)' }}
              >Ελληνικά (EL)</button>
              <button 
                onClick={() => setActiveTab('en')} 
                style={{ background: 'none', border: 'none', borderBottom: activeTab === 'en' ? '2px solid var(--color-primary)' : 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: activeTab === 'en' ? 600 : 400, color: activeTab === 'en' ? 'var(--color-primary)' : 'var(--color-text)' }}
              >English (EN)</button>
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
                      <label className="form-label">Τύπος</label>
                      <select className="form-control" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                        <option>Ανακοίνωση</option>
                        <option>Εκδήλωση</option>
                        <option>Αποτελέσματα</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ημερομηνία</label>
                      <input type="text" className="form-control" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Περιεχόμενο</label>
                    <textarea className="form-control" required style={{ minHeight: '150px' }} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
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
                      <label className="form-label">Type</label>
                      <select className="form-control" value={formData.type_en || 'Announcement'} onChange={e => setFormData({ ...formData, type_en: e.target.value })}>
                        <option value="Announcement">Announcement</option>
                        <option value="Event">Event</option>
                        <option value="Results">Results</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input type="text" className="form-control" value={formData.date_en || ''} onChange={e => setFormData({ ...formData, date_en: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea className="form-control" style={{ minHeight: '150px' }} value={formData.content_en || ''} onChange={e => setFormData({ ...formData, content_en: e.target.value })}></textarea>
                  </div>
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

export default AdminNews;
