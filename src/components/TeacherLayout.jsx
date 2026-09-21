import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { School, Users, ClipboardCheck, LogOut } from 'lucide-react';
import { useKidsData } from '../context/KidsDataContext';

const TeacherLayout = () => {
  const navigate = useNavigate();
  const { teacherUser, teacherLogout } = useKidsData();

  useEffect(() => {
    if (!teacherUser) {
      navigate('/teacher/login');
    }
  }, [teacherUser, navigate]);

  if (!teacherUser) return null;

  const handleLogout = () => {
    teacherLogout();
    navigate('/teacher/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#1E293B',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        inset: '0 auto 0 0',
        zIndex: 40,
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>Πύλη Εκπαιδευτικών</div>
          <h2 style={{ fontSize: '1.1rem', color: 'white', margin: '0.25rem 0 0 0', fontWeight: 800 }}>
            {teacherUser.name || 'Εκπαιδευτικός'}
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
            🏫 {teacherUser.school_name || 'Σχολείο'}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink
            to="/teacher"
            end
            className={({ isActive }) => `teacher-nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#CBD5E1', textDecoration: 'none', fontWeight: 600 }}
          >
            <School size={20} />
            <span>Επισκόπηση</span>
          </NavLink>

          <NavLink
            to="/teacher/classes"
            className={({ isActive }) => `teacher-nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#CBD5E1', textDecoration: 'none', fontWeight: 600 }}
          >
            <Users size={20} />
            <span>Διαχείριση Τάξεων & PINs</span>
          </NavLink>

          <NavLink
            to="/teacher/observations"
            className={({ isActive }) => `teacher-nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#CBD5E1', textDecoration: 'none', fontWeight: 600 }}
          >
            <ClipboardCheck size={20} />
            <span>Έλεγχος Παρατηρήσεων</span>
          </NavLink>
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', background: 'none', border: 'none', color: '#FCA5A5', cursor: 'pointer', borderRadius: '8px', fontWeight: 600 }}
          >
            <LogOut size={20} />
            <span>Αποσύνδεση</span>
          </button>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <NavLink to="/kids" style={{ color: '#38BDF8', fontSize: '0.85rem', textDecoration: 'none' }}>
              &larr; Προβολή Kids UI
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '2rem 2rem 4rem 2rem' }}>
        <Outlet />
      </main>

      <style>{`
        .teacher-nav-link:hover { background-color: rgba(255,255,255,0.08); color: white !important; }
        .teacher-nav-link.active { background-color: #0EA5E9; color: white !important; }
      `}</style>
    </div>
  );
};

export default TeacherLayout;
