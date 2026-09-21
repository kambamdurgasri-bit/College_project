import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import learningSpacesRoutes from './modules/learning-spaces/learningSpaces.routes.js';
import topicsRoutes from './modules/topics/topics.routes.js';
import resourcesRoutes from './modules/resources/resources.routes.js';
import timetableRoutes from './modules/timetable/timetable.routes.js';
import quizRoutes from './modules/quiz/quiz.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import recommendationsRoutes from './modules/recommendations/recommendations.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import progressRoutes from "./routes/progress.routes.js";
import { UPLOAD_DIR } from './lib/storage.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/learning-spaces', learningSpacesRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '1h' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use("/api/progress", progressRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use(errorHandler);

export default app;
