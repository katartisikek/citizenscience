import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CollectObservation from './pages/CollectObservation';
import Participate from './pages/Participate';
import Entities from './pages/Entities';
import OpenData from './pages/OpenData';
import Propose from './pages/Propose';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import Profile from './pages/Profile';

import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminNews from './pages/admin/AdminNews';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProposals from './pages/admin/AdminProposals';
import AdminObservations from './pages/admin/AdminObservations';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInbox from './pages/admin/AdminInbox';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="projects/:id/collect" element={<CollectObservation />} />
              <Route path="participate" element={<Participate />} />
              <Route path="entities" element={<Entities />} />
              <Route path="open-data" element={<OpenData />} />
              <Route path="propose" element={<Propose />} />
              <Route path="news" element={<News />} />
              <Route path="news/:id" element={<NewsDetail />} />
              <Route path="privacy" element={<LegalPage type="privacy" />} />
              <Route path="terms" element={<LegalPage type="terms" />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="proposals" element={<AdminProposals />} />
              <Route path="observations" element={<AdminObservations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="inbox" element={<AdminInbox />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
