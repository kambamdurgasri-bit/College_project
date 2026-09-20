import prisma from "../../lib/prisma.js";

export async function getRecommendations(userId) {
  // Fetch user attempts with quiz and learning space details
  const [attempts, timetables, storedRecs, spaces] = await Promise.all([
    prisma.quizAttempts.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            learningSpace: true,
          },
        },
      },
      orderBy: { attemptedAt: "desc" },
      take: 20,
    }),
    prisma.timetables.findMany({
      where: { userId },
    }),
    prisma.recommendations.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.learningSpaces.findMany({
      where: { userId },
      select: { id: true, name: true },
    }),
  ]);

  // Aggregate scores by topic
  const topicStats = {};
  attempts.forEach((attempt) => {
    const topic = attempt.quiz?.topic || "General";
    if (!topicStats[topic]) {
      topicStats[topic] = { totalScore: 0, count: 0, spaceName: attempt.quiz?.learningSpace?.name || "General" };
    }
    topicStats[topic].totalScore += attempt.score;
    topicStats[topic].count += 1;
  });

  const weakTopics = [];
  const strongTopics = [];

  Object.entries(topicStats).forEach(([topic, stat]) => {
    const avgScore = Math.round(stat.totalScore / stat.count);
    if (avgScore < 70) {
      weakTopics.push({ topic, avgScore, spaceName: stat.spaceName, attemptsCount: stat.count });
    } else {
      strongTopics.push({ topic, avgScore, spaceName: stat.spaceName, attemptsCount: stat.count });
    }
  });

  // Generate dynamic actionable suggestions
  const suggestions = [];

  if (weakTopics.length > 0) {
    weakTopics.forEach((wt) => {
      suggestions.push({
        type: "REVISION",
        title: `Focus on ${wt.topic}`,
        description: `Your average score in ${wt.topic} is ${wt.avgScore}%. We recommend retaking quizzes or reviewing study material in ${wt.spaceName}.`,
        priority: "HIGH",
      });
    });
  } else if (attempts.length > 0) {
    suggestions.push({
      type: "MAINTAIN",
      title: "Great Consistency!",
      description: "You are maintaining high scores across your topics. Keep up the regular quiz practice!",
      priority: "LOW",
    });
  } else {
    suggestions.push({
      type: "GET_STARTED",
      title: "Take Your First Quiz",
      description: "Create a Learning Space and generate your first quiz to receive personalized AI recommendations.",
      priority: "HIGH",
    });
  }

  // Include timetable-based recommendations
  if (timetables.length > 0) {
    const subjects = Array.from(new Set(timetables.map((t) => t.subject)));
    suggestions.push({
      type: "TIMETABLE_SYNC",
      title: `Upcoming Study Sessions: ${subjects.slice(0, 3).join(", ")}`,
      description: `You have study slots configured for ${subjects.length} subject(s). Generate practice quizzes before your study sessions.`,
      priority: "MEDIUM",
    });
  }

  // Stored custom recommendations from DB
  const customRecs = storedRecs.map((rec) => ({
    id: rec.id,
    type: rec.recommendationType,
    text: rec.recommendation,
    createdAt: rec.createdAt,
  }));

  return {
    weakTopics,
    strongTopics,
    suggestions,
    customRecommendations: customRecs,
    learningSpacesCount: spaces.length,
    totalAttempts: attempts.length,
  };
}
