import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useData } from '../context/DataContext';

const Layout = () => {
  const { loadError, usingLocal } = useData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {loadError && !usingLocal && (
        <div
          role="alert"
          style={{
            padding: '0.8rem 1rem',
            background: '#fff3cd',
            color: '#664d03',
            borderBottom: '1px solid #ffecb5',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}
        >
          Δεν ήταν δυνατή η φόρτωση των δεδομένων από τον server. Δοκιμάστε ξανά αργότερα.
        </div>
      )}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
