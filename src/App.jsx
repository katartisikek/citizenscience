import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Participate from './pages/Participate';
import Entities from './pages/Entities';
import OpenData from './pages/OpenData';
import Propose from './pages/Propose';
import News from './pages/News';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminNews from './pages/admin/AdminNews';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="participate" element={<Participate />} />
            <Route path="entities" element={<Entities />} />
            <Route path="open-data" element={<OpenData />} />
            <Route path="propose" element={<Propose />} />
            <Route path="news" element={<News />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
