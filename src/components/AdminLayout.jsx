import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FileText, Settings, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Basic auth check
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('admin_auth') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true, icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/admin/projects', end: false, icon: <FolderKanban size={20} /> },
    { name: 'Νέα & Εκδηλώσεις', path: '/admin/news', end: false, icon: <FileText size={20} /> },
    { name: 'Ρυθμίσεις', path: '/admin/settings', end: false, icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        inset: '0 auto 0 0',
        width: '260px',
        backgroundColor: 'var(--color-secondary)',
        color: 'white',
        transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform var(--transition-fast)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column'
      }} className="admin-sidebar">
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'white', margin: 0 }}>Hub Admin</h2>
          <button className="mobile-only" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
              width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', 
              cursor: 'pointer', textAlign: 'left', borderRadius: 'var(--radius-sm)'
            }}
            className="admin-logout-btn"
          >
            <LogOut size={20} />
            <span>Αποσύνδεση</span>
          </button>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <NavLink to="/" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>
              &larr; Πίσω στο Site
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column', width: '100%' }} className="admin-main">
        {/* Top Header */}
        <header style={{ 
          backgroundColor: 'white', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', 
          borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 30
        }}>
          <button 
            onClick={() => setIsMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', marginRight: '1rem' }}
            className="mobile-only-btn"
          >
            <Menu size={24} />
          </button>
          <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-text)' }}>Διαχειριστικό Σύστημα</h2>
        </header>

        {/* Dynamic Content */}
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
