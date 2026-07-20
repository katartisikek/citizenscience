import { useData } from '../../context/DataContext';
import { Users, FolderKanban, FileText, Activity, ClipboardList, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { projects, news, registrations, proposals, observations } = useData();

  const stats = [
    { title: 'Συνολικά Projects', value: projects.length, icon: <FolderKanban size={24} color="var(--color-primary)" /> },
    { title: 'Ενεργά Projects', value: projects.filter(p => p.status === 'Ενεργό').length, icon: <Activity size={24} color="var(--color-accent)" /> },
    { title: 'Άρθρα & Νέα', value: news.length, icon: <FileText size={24} color="var(--color-secondary)" /> },
    { title: 'Εγγραφές Πολιτών', value: registrations.length, icon: <Users size={24} color="var(--color-primary-light)" /> },
    { title: 'Προτάσεις', value: proposals.filter(p => p.status === 'pending').length, icon: <Send size={24} color="var(--color-accent)" /> },
    { title: 'Παρατηρήσεις', value: observations.filter(o => o.status === 'pending').length, icon: <ClipboardList size={24} color="var(--color-secondary)" /> },
  ];

  const recentItems = [
    ...registrations.slice(0, 3).map(r => ({
      text: `Νέα εγγραφή: ${r.name} (${r.area || '—'})`,
      date: r.created_at,
    })),
    ...proposals.filter(p => p.status === 'pending').slice(0, 2).map(p => ({
      text: `Νέα πρόταση: "${p.title}" από ${p.name}`,
      date: p.created_at,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="animate-fade-in">
      <h1 className="mb-4" style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>Καλώς ήρθατε στο Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
              {stat.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', margin: 0, lineHeight: 1 }}>{stat.value}</h3>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', margin: 0 }}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 className="mb-3" style={{ fontSize: '1.2rem' }}>Πρόσφατες Ενέργειες</h2>
        {recentItems.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)' }}>Δεν υπάρχουν πρόσφατες ενέργειες.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recentItems.map((item, i) => (
              <li key={i} style={{ padding: '1rem 0', borderBottom: i < recentItems.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <p style={{ margin: 0 }}>{item.text}</p>
                <small style={{ color: 'var(--color-text-light)' }}>
                  {item.date ? new Date(item.date).toLocaleString('el-GR') : '—'}
                </small>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin/proposals" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Προτάσεις</Link>
          <Link to="/admin/observations" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Παρατηρήσεις</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
