import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";

import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import learningSpaceRoutes from "./modules/learning-spaces/learningSpaces.routes.js";
import timetableRoutes from "./modules/timetable/timetable.routes.js";
import quizRoutes from "./modules/quiz/quiz.routes.js";

// Teammates' modules — these import placeholder routers until Pravalika /
// Madhavi push their real ones. Nobody needs to touch app.js when that
// happens; just replace the file the import points to.
import authRoutes from "./modules/auth/auth.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import recommendationRoutes from "./modules/recommendations/recommendations.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/learning-spaces", learningSpaceRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/profile", profileRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

export default app;
