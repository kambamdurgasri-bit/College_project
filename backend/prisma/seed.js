import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
    console.log("🌱 Starting LearnTrack AI comprehensive seed...");

    const mockEmail = "tyone@learntrack.ai";

    const existingUser = await prisma.users.findUnique({
        where: { email: mockEmail },
    });

    // We should also delete 'mockuser@learntrack.ai' if it exists to be safe
    const oldUser = await prisma.users.findUnique({
        where: { email: "mockuser@learntrack.ai" },
    });

    for (const u of [existingUser, oldUser].filter(Boolean)) {
        await prisma.attemptAnswers.deleteMany({ where: { quizAttempt: { userId: u.id } } });
        await prisma.quizAttempts.deleteMany({ where: { userId: u.id } });
        await prisma.progress.deleteMany({ where: { userId: u.id } });
        await prisma.recommendations.deleteMany({ where: { userId: u.id } });
        await prisma.questions.deleteMany({ where: { quiz: { learningSpace: { userId: u.id } } } });
        await prisma.quizzes.deleteMany({ where: { learningSpace: { userId: u.id } } });
        await prisma.timetables.deleteMany({ where: { userId: u.id } });
        await prisma.resources.deleteMany({ where: { userId: u.id } });
        await prisma.topics.deleteMany({ where: { learningSpace: { userId: u.id } } });
        await prisma.learningSpaces.deleteMany({ where: { userId: u.id } });
        await prisma.users.delete({ where: { id: u.id } });
    }

    // ------------------------------------------------------------
    // USER
    // ------------------------------------------------------------
    const passwordHash = await bcrypt.hash("MockPassword123!", 10);
    const user = await prisma.users.create({
        data: {
            name: "Tyone",
            email: mockEmail,
            passwordHash,
            phoneNumber: "555-019-8372",
            dob: "2001-05-22",
            gender: "Male",
            university: "Stanford University",
            branch: "Computer Science",
            department: "Senior Year, Undergrad",
            about: "I'm a senior CS major passionate about Artificial Intelligence and Full-Stack Engineering. Currently building scalable web applications and researching neural network optimizations.",
        },
    });
    console.log(`👤 Created user: Tyone with ID: ${user.id}`);

    // ------------------------------------------------------------
    // LEARNING SPACES
    // ------------------------------------------------------------
    const webDevSpace = await prisma.learningSpaces.create({
        data: { userId: user.id, name: "Advanced Web Engineering", colorId: "blue", icon: "code" },
    });
    
    const dsaSpace = await prisma.learningSpaces.create({
        data: { userId: user.id, name: "Data Structures & Algorithms", colorId: "rose", icon: "network" },
    });

    const aiSpace = await prisma.learningSpaces.create({
        data: { userId: user.id, name: "Artificial Intelligence", colorId: "purple", icon: "cpu" },
    });

    // ------------------------------------------------------------
    // TOPICS
    // ------------------------------------------------------------
    const nextjsTopic = await prisma.topics.create({
        data: { learningSpaceId: webDevSpace.id, name: "Next.js App Router", description: "Server components, fetching, and caching." }
    });
    const graphTopic = await prisma.topics.create({
        data: { learningSpaceId: dsaSpace.id, name: "Graph Algorithms", description: "BFS, DFS, Dijkstra, and A* search." }
    });
    const nnTopic = await prisma.topics.create({
        data: { learningSpaceId: aiSpace.id, name: "Neural Networks", description: "Backpropagation, activation functions, and gradient descent." }
    });
    const cloudTopic = await prisma.topics.create({
        data: { learningSpaceId: webDevSpace.id, name: "Cloud Deployment", description: "Docker, Kubernetes, and CI/CD pipelines." }
    });
    
    // ------------------------------------------------------------
    // TIMETABLE
    // ------------------------------------------------------------
    await prisma.timetables.createMany({
        data: [
            { userId: user.id, day: "Monday", subject: "Next.js Architecture", startTime: "09:00", endTime: "11:00", learningSpaceId: webDevSpace.id },
            { userId: user.id, day: "Monday", subject: "Graph Theory", startTime: "13:00", endTime: "14:30", learningSpaceId: dsaSpace.id },
            { userId: user.id, day: "Tuesday", subject: "Deep Learning Seminar", startTime: "10:00", endTime: "12:00", learningSpaceId: aiSpace.id },
            { userId: user.id, day: "Wednesday", subject: "System Design Prep", startTime: "09:00", endTime: "11:00", learningSpaceId: webDevSpace.id },
            { userId: user.id, day: "Thursday", subject: "Algorithm Practice", startTime: "15:00", endTime: "17:00", learningSpaceId: dsaSpace.id },
            { userId: user.id, day: "Friday", subject: "AI Project Work", startTime: "14:00", endTime: "16:00", learningSpaceId: aiSpace.id },
        ]
    });

    // ------------------------------------------------------------
    // RESOURCES
    // ------------------------------------------------------------
    await prisma.resources.createMany({
        data: [
            { userId: user.id, learningSpaceId: webDevSpace.id, topicId: nextjsTopic.id, title: "Next.js Documentation", type: "LINK", url: "https://nextjs.org/docs" },
            { userId: user.id, learningSpaceId: dsaSpace.id, topicId: graphTopic.id, title: "Introduction to Algorithms (Cormen)", type: "BOOK", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
            { userId: user.id, learningSpaceId: aiSpace.id, topicId: nnTopic.id, title: "Neural Networks and Deep Learning", type: "LINK", url: "http://neuralnetworksanddeeplearning.com/" }
        ]
    });

    // ------------------------------------------------------------
    // QUIZZES
    // ------------------------------------------------------------
    const graphQuiz = await prisma.quizzes.create({
        data: { learningSpaceId: dsaSpace.id, topicId: graphTopic.id, topic: graphTopic.name, difficulty: "HARD", quizType: "TOPIC" },
    });

    const gq1 = await prisma.questions.create({
        data: {
            quizId: graphQuiz.id,
            questionText: "What is the time complexity of Dijkstra's algorithm using a min-heap?",
            correctAnswer: "O((V + E) log V)",
            options: ["O(V^2)", "O((V + E) log V)", "O(E log E)", "O(V + E)"],
        },
    });
    const gq2 = await prisma.questions.create({
        data: {
            quizId: graphQuiz.id,
            questionText: "Which data structure is typically used for Breadth-First Search (BFS)?",
            correctAnswer: "Queue",
            options: ["Stack", "Queue", "Priority Queue", "Hash Table"],
        },
    });
    const gq3 = await prisma.questions.create({
        data: {
            quizId: graphQuiz.id,
            questionText: "Which algorithm finds the Minimum Spanning Tree of a graph?",
            correctAnswer: "Kruskal's Algorithm",
            options: ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Kruskal's Algorithm", "Floyd-Warshall Algorithm"],
        },
    });

    const nnQuiz = await prisma.quizzes.create({
        data: { learningSpaceId: aiSpace.id, topicId: nnTopic.id, topic: nnTopic.name, difficulty: "MEDIUM", quizType: "TOPIC" },
    });

    const nq1 = await prisma.questions.create({
        data: {
            quizId: nnQuiz.id,
            questionText: "What is the purpose of an activation function?",
            correctAnswer: "To introduce non-linearity",
            options: ["To speed up training", "To introduce non-linearity", "To calculate the loss", "To normalize the input data"],
        },
    });
    const nq2 = await prisma.questions.create({
        data: {
            quizId: nnQuiz.id,
            questionText: "Which problem does the ReLU activation function suffer from?",
            correctAnswer: "Dying ReLU problem",
            options: ["Vanishing gradients", "Exploding gradients", "Dying ReLU problem", "Overfitting"],
        },
    });
    const nq3 = await prisma.questions.create({
        data: {
            quizId: nnQuiz.id,
            questionText: "What algorithm is primarily used to train neural networks?",
            correctAnswer: "Backpropagation",
            options: ["Q-Learning", "Backpropagation", "K-Means Clustering", "Random Forest"],
        },
    });

    // ------------------------------------------------------------
    // QUIZ ATTEMPTS
    // ------------------------------------------------------------
    const now = new Date();
    
    // Graph Quiz Attempts (Improving)
    const att1 = await prisma.quizAttempts.create({
        data: { quizId: graphQuiz.id, userId: user.id, attemptedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), score: 1 },
    });
    await prisma.attemptAnswers.createMany({
        data: [
            { quizAttemptId: att1.quizAttemptId, questionId: gq1.questionId, selectedAnswer: "O(V^2)" }, // wrong
            { quizAttemptId: att1.quizAttemptId, questionId: gq2.questionId, selectedAnswer: "Queue" },
            { quizAttemptId: att1.quizAttemptId, questionId: gq3.questionId, selectedAnswer: "Dijkstra's Algorithm" }, // wrong
        ],
    });

    const att2 = await prisma.quizAttempts.create({
        data: { quizId: graphQuiz.id, userId: user.id, attemptedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), score: 3 },
    });
    await prisma.attemptAnswers.createMany({
        data: [
            { quizAttemptId: att2.quizAttemptId, questionId: gq1.questionId, selectedAnswer: "O((V + E) log V)" },
            { quizAttemptId: att2.quizAttemptId, questionId: gq2.questionId, selectedAnswer: "Queue" },
            { quizAttemptId: att2.quizAttemptId, questionId: gq3.questionId, selectedAnswer: "Kruskal's Algorithm" },
        ],
    });

    // Neural Networks Quiz Attempt
    const att3 = await prisma.quizAttempts.create({
        data: { quizId: nnQuiz.id, userId: user.id, attemptedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), score: 2 },
    });
    await prisma.attemptAnswers.createMany({
        data: [
            { quizAttemptId: att3.quizAttemptId, questionId: nq1.questionId, selectedAnswer: "To introduce non-linearity" },
            { quizAttemptId: att3.quizAttemptId, questionId: nq2.questionId, selectedAnswer: "Vanishing gradients" }, // wrong
            { quizAttemptId: att3.quizAttemptId, questionId: nq3.questionId, selectedAnswer: "Backpropagation" },
        ],
    });

    // ------------------------------------------------------------
    // RECOMMENDATIONS
    // ------------------------------------------------------------
    await prisma.recommendations.createMany({
        data: [
            { userId: user.id, recommendationType: "STUDY", recommendation: "Incredible improvement on Graph Algorithms! You went from 33% to 100% accuracy. Next, try tackling dynamic programming problems." },
            { userId: user.id, recommendationType: "FOCUS", recommendation: "You missed a question about ReLU in the Neural Networks quiz. Spend 15 minutes reviewing the differences between Vanishing Gradients and the Dying ReLU problem." },
            { userId: user.id, recommendationType: "TIMETABLE", recommendation: "You have your 'Deep Learning Seminar' coming up tomorrow morning. Don't forget to read the assigned research paper!" },
        ]
    });

    console.log("✅ Comprehensive seed completed successfully.");
    console.log("");
    console.log("Development login:");
    console.log(`   Email: ${mockEmail}`);
    console.log("   Password: MockPassword123!");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });