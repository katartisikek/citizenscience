import { useData } from '../../context/DataContext';
import { FolderKanban, FileText, Users, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { projects, news } = useData();

  const stats = [
    { title: 'Συνολικά Projects', value: projects.length, icon: <FolderKanban size={24} color="var(--color-primary)" /> },
    { title: 'Ενεργά Projects', value: projects.filter(p => p.status === 'Ενεργό').length, icon: <Activity size={24} color="var(--color-accent)" /> },
    { title: 'Άρθρα & Νέα', value: news.length, icon: <FileText size={24} color="var(--color-secondary)" /> },
    { title: 'Εγγεγραμμένοι Πολίτες', value: 142, icon: <Users size={24} color="var(--color-primary-light)" /> },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="mb-4" style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>Καλώς ήρθατε στο Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
              {stat.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', margin: 0, lineHeight: 1, color: 'var(--color-text)' }}>{stat.value}</h3>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', margin: 0 }}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 className="mb-3" style={{ fontSize: '1.2rem' }}>Πρόσφατες Ενέργειες (Mock)</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <p style={{ margin: 0 }}><strong>Νέα εγγραφή:</strong> Μαρία Παπαδοπούλου (Ηράκλειο)</p>
            <small style={{ color: 'var(--color-text-light)' }}>Πριν 2 ώρες</small>
          </li>
          <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <p style={{ margin: 0 }}><strong>Νέα Πρόταση Project:</strong> "Καταγραφή Αστικής Χλωρίδας" από 2ο ΓΕΛ Χανίων</p>
            <small style={{ color: 'var(--color-text-light)' }}>Χθες, 14:30</small>
          </li>
          <li style={{ padding: '1rem 0' }}>
            <p style={{ margin: 0 }}><strong>Νέα εγγραφή:</strong> Κώστας Νικολάου (Ρέθυμνο)</p>
            <small style={{ color: 'var(--color-text-light)' }}>Χθες, 11:15</small>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
