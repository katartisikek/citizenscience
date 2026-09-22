import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { KidsAuthProvider } from './context/KidsAuthContext';
import { KidsDataProvider } from './context/KidsDataContext';
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
import AdminKids from './pages/admin/AdminKids';

// Teacher Module
import TeacherLayout from './components/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherClassManagement from './pages/teacher/TeacherClassManagement';
import TeacherObservations from './pages/teacher/TeacherObservations';
import TeacherLogin from './pages/teacher/TeacherLogin';

// Kids Module
import KidsLayout from './components/KidsLayout';
import KidsLogin from './pages/kids/KidsLogin';
import KidsDashboard from './pages/kids/KidsDashboard';
import KidsObservation from './pages/kids/KidsObservation';
import KidsDiscoveries from './pages/kids/KidsDiscoveries';
import KidsProgress from './pages/kids/KidsProgress';
import KidsBadges from './pages/kids/KidsBadges';
import KidsClass from './pages/kids/KidsClass';
import KidsSchool from './pages/kids/KidsSchool';
import KidsExploreCrete from './pages/kids/KidsExploreCrete';
import KidsLeaderboard from './pages/kids/KidsLeaderboard';
import KidsHome from './pages/kids/KidsHome';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* ── Main Citizen Science Hub ──────────────── */}
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
              <Route path="kids-home" element={<KidsHome />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Admin Panel ──────────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="kids" element={
                <KidsAuthProvider>
                  <KidsDataProvider>
                    <AdminKids />
                  </KidsDataProvider>
                </KidsAuthProvider>
              } />
              <Route path="news" element={<AdminNews />} />
              <Route path="proposals" element={<AdminProposals />} />
              <Route path="observations" element={<AdminObservations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="inbox" element={<AdminInbox />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ── Teacher Portal ───────────────────────── */}
            <Route path="/teacher/login" element={
              <KidsAuthProvider>
                <KidsDataProvider>
                  <TeacherLogin />
                </KidsDataProvider>
              </KidsAuthProvider>
            } />
            <Route path="/teacher" element={
              <KidsAuthProvider>
                <KidsDataProvider>
                  <TeacherLayout />
                </KidsDataProvider>
              </KidsAuthProvider>
            }>
              <Route index element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClassManagement />} />
              <Route path="observations" element={<TeacherObservations />} />
            </Route>

            {/* ── Citizen Science Kids ─────────────────── */}
            <Route path="/kids/login" element={
              <KidsAuthProvider>
                <KidsLogin />
              </KidsAuthProvider>
            } />
            <Route path="/kids" element={
              <KidsAuthProvider>
                <KidsDataProvider>
                  <KidsLayout />
                </KidsDataProvider>
              </KidsAuthProvider>
            }>
              <Route index element={<KidsDashboard />} />
              <Route path="missions/:id/observe" element={<KidsObservation />} />
              <Route path="discoveries" element={<KidsDiscoveries />} />
              <Route path="progress" element={<KidsProgress />} />
              <Route path="badges" element={<KidsBadges />} />
              <Route path="leaderboard" element={<KidsLeaderboard />} />
              <Route path="class" element={<KidsClass />} />
              <Route path="school" element={<KidsSchool />} />
              <Route path="explore" element={<KidsExploreCrete />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
