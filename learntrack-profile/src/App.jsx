import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardShell from './components/layout/DashboardShell';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import { mockUser } from './data/mockUser';

export default function App() {
  return (
    <DashboardShell user={mockUser}>
      <Routes>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </DashboardShell>
  );
}
