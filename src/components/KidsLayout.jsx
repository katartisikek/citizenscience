import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useKidsAuth } from '../context/KidsAuthContext';
import '../kids.css';

const navItems = [
  { to: '/kids', icon: '🎯', label: 'Αποστολές', end: true },
  { to: '/kids/explore', icon: '🗺️', label: 'Εξερεύνησε' },
  { to: '/kids/discoveries', icon: '🔬', label: 'Ανακαλύψεις' },
  { to: '/kids/progress', icon: '📊', label: 'Πρόοδος' },
  { to: '/kids/badges', icon: '🏅', label: 'Βραβεία' },
  { to: '/kids/leaderboard', icon: '🏆', label: 'Κατάταξη' },
  { to: '/kids/class', icon: '👥', label: 'Τάξη' },
  { to: '/kids/school', icon: '🏫', label: 'Σχολείο' },
];

const mobileNavItems = [
  { to: '/kids', icon: '🎯', label: 'Αποστολές', end: true },
  { to: '/kids/leaderboard', icon: '🏆', label: 'Κατάταξη' },
  { to: '/kids/badges', icon: '🏅', label: 'Βραβεία' },
  { to: '/kids/school', icon: '🏫', label: 'Σχολείο' },
  { to: '/kids/progress', icon: '📊', label: 'Εγώ' },
];

const KidsLayout = () => {
  const { student, logout } = useKidsAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/kids/login');
  };

  if (!student) {
    navigate('/kids/login');
    return null;
  }

  return (
    <div className="kids-app">
      {/* Mobile Header */}
      <header className="kids-header">
        <div className="kids-header-title">🌿 CS Kids</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--kids-text-light)', fontWeight: 600 }}>
            {student.alias}
          </span>
          <div className="kids-header-avatar" onClick={handleLogout} title="Αποσύνδεση">
            {student.alias?.slice(-2) || '??'}
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="kids-sidebar">
        <div className="kids-sidebar-logo">
          <h2>🌿 Citizen Science Kids</h2>
          <p>Εξερεύνησε · Ανακάλυψε · Μάθε</p>
        </div>

        <nav className="kids-sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `kids-sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="kids-sidebar-user">
          <div className="kids-sidebar-user-avatar">
            {student.alias?.slice(-2) || '??'}
          </div>
          <div className="kids-sidebar-user-info">
            <div className="kids-sidebar-user-name">{student.alias}</div>
            <div className="kids-sidebar-user-school">{student.school_name}</div>
          </div>
          <button
            onClick={handleLogout}
            className="kids-btn kids-btn-ghost kids-btn-sm"
            style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '0.75rem' }}
          >
            Έξοδος
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="kids-main">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="kids-bottom-nav">
        {mobileNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `kids-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default KidsLayout;
