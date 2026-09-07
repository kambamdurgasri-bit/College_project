import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LearningSpacesPage from "../pages/LearningSpaces/LearningSpacesPage";
import CreateLearningSpacePage from "../pages/LearningSpaces/CreateLearningSpacePage";
import EditLearningSpacePage from "../pages/LearningSpaces/EditLearningSpacePage";
import LearningSpaceDetailsPage from "../pages/LearningSpaces/LearningSpaceDetailsPage";
import TimetablePage from "../pages/Timetable/TimetablePage";
import ComingSoonPage from "../pages/ComingSoonPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import SplashPage from "../pages/Auth/SplashPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Module 1: Authentication (public, outside AppLayout/sidebar) */}
      <Route path="/splash" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/splash" replace />} />

        {/* Module 3: Learning Spaces */}
        <Route path="/learning-spaces" element={<LearningSpacesPage />} />
        <Route path="/learning-spaces/new" element={<CreateLearningSpacePage />} />
        <Route path="/learning-spaces/:id" element={<LearningSpaceDetailsPage />} />
        <Route path="/learning-spaces/:id/edit" element={<EditLearningSpacePage />} />

        {/* Module 3: Timetable */}
        <Route path="/timetable" element={<TimetablePage />} />

        {/* Out-of-scope routes kept as placeholders so sidebar nav never 404s */}
        <Route path="/dashboard" element={<ComingSoonPage title="Dashboard" />} />
        <Route path="/topic-quiz" element={<ComingSoonPage title="Topic Quiz" />} />
        <Route path="/quiz-history" element={<ComingSoonPage title="Quiz History" />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route
          path="/ai-recommendations"
          element={<ComingSoonPage title="AI Recommendations" />}
        />
        <Route path="/profile" element={<ComingSoonPage title="Profile" />} />
        <Route path="/settings" element={<ComingSoonPage title="Settings" />} />

        <Route path="*" element={<Navigate to="/learning-spaces" replace />} />
      </Route>
    </Routes>
  );
}
