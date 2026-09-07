import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LearningSpacesPage from "../pages/LearningSpaces/LearningSpacesPage";
import CreateLearningSpacePage from "../pages/LearningSpaces/CreateLearningSpacePage";
import EditLearningSpacePage from "../pages/LearningSpaces/EditLearningSpacePage";
import LearningSpaceDetailsPage from "../pages/LearningSpaces/LearningSpaceDetailsPage";
import TimetablePage from "../pages/Timetable/TimetablePage";
import ComingSoonPage from "../pages/ComingSoonPage";

const QuizPage = lazy(() => import("../pages/Quiz/QuizPage"));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-slate-500 dark:bg-surface-dark dark:text-slate-400">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/learning-spaces" replace />} />

          {/* Module 3: Learning Spaces */}
          <Route path="/learning-spaces" element={<LearningSpacesPage />} />
          <Route path="/learning-spaces/new" element={<CreateLearningSpacePage />} />
          <Route path="/learning-spaces/:id" element={<LearningSpaceDetailsPage />} />
          <Route path="/learning-spaces/:id/edit" element={<EditLearningSpacePage />} />

          {/* Module 3: Timetable */}
          <Route path="/timetable" element={<TimetablePage />} />

          {/* Module 4: Quiz and Assessment */}
          <Route path="/topic-quiz" element={<QuizPage key="topic-quiz" />} />
          <Route
            path="/quiz-history"
            element={<QuizPage key="quiz-history" initialScreen="history" />}
          />

          {/* Out-of-scope routes kept as placeholders so sidebar nav never 404s */}
          <Route path="/dashboard" element={<ComingSoonPage title="Dashboard" />} />
          <Route path="/analytics" element={<ComingSoonPage title="Analytics" />} />
          <Route
            path="/ai-recommendations"
            element={<ComingSoonPage title="AI Recommendations" />}
          />
          <Route path="/profile" element={<ComingSoonPage title="Profile" />} />
          <Route path="/settings" element={<ComingSoonPage title="Settings" />} />

          <Route path="*" element={<Navigate to="/learning-spaces" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
