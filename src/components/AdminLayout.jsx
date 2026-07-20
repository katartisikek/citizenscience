import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FileText, Settings, LogOut, Menu, X, ClipboardList, Send, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true, icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/admin/projects', end: false, icon: <FolderKanban size={20} /> },
    { name: 'Χρήστες', path: '/admin/users', end: false, icon: <Users size={20} /> },
    { name: 'Νέα & Εκδηλώσεις', path: '/admin/news', end: false, icon: <FileText size={20} /> },
    { name: 'Προτάσεις', path: '/admin/proposals', end: false, icon: <Send size={20} /> },
    { name: 'Παρατηρήσεις', path: '/admin/observations', end: false, icon: <ClipboardList size={20} /> },
    { name: 'Ρυθμίσεις', path: '/admin/settings', end: false, icon: <Settings size={20} /> },
  ];

  if (loading) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {isMobileOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setIsMobileOpen(false)} />
      )}

      <aside style={{
        position: 'fixed', inset: '0 auto 0 0', width: '260px',
        backgroundColor: 'var(--color-secondary)', color: 'white',
        transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform var(--transition-fast)', zIndex: 50,
        display: 'flex', flexDirection: 'column',
      }} className="admin-sidebar">
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'white', margin: 0 }}>Hub Admin</h2>
          <button className="mobile-only" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.end} onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
              {item.icon}<span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} className="admin-logout-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}>
            <LogOut size={20} /><span>Αποσύνδεση</span>
          </button>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <NavLink to="/" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>&larr; Πίσω στο Site</NavLink>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column', width: '100%' }} className="admin-main">
        <header style={{ backgroundColor: 'white', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setIsMobileOpen(true)} className="mobile-only-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', marginRight: '1rem' }}>
            <Menu size={24} />
          </button>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Διαχειριστικό Σύστημα</h2>
        </header>
        <div style={{ padding: '2rem 1.5rem', flex: 1, overflowX: 'hidden' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-nav-link:hover { background-color: rgba(255,255,255,0.1); color: white !important; }
        .admin-nav-link.active { background-color: var(--color-primary); color: white !important; }
        .admin-logout-btn:hover { background-color: rgba(220, 38, 38, 0.2); color: #fca5a5 !important; }
        @media (min-width: 768px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .admin-main { margin-left: 260px !important; }
          .mobile-only, .mobile-only-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
