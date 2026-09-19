import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
    console.log("🌱 Starting LearnTrack AI seed...");

    /*
     * This seed is for development/testing only.
     *
     * It removes data belonging to the mock user before recreating it,
     * making the seed repeatable without touching other users.
     */

    const mockEmail = "mockuser@learntrack.ai";

    const existingUser = await prisma.users.findUnique({
        where: {
            email: mockEmail,
        },
    });

    if (existingUser) {
        await prisma.attemptAnswers.deleteMany({
            where: {
                quizAttempt: {
                    userId: existingUser.id,
                },
            },
        });

        await prisma.quizAttempts.deleteMany({
            where: {
                userId: existingUser.id,
            },
        });

        await prisma.progress.deleteMany({
            where: {
                userId: existingUser.id,
            },
        });

        await prisma.recommendations.deleteMany({
            where: {
                userId: existingUser.id,
            },
        });

        await prisma.questions.deleteMany({
            where: {
                quiz: {
                    learningSpace: {
                        userId: existingUser.id,
                    },
                },
            },
        });

        await prisma.quizzes.deleteMany({
            where: {
                learningSpace: {
                    userId: existingUser.id,
                },
            },
        });

        await prisma.learningSpaces.deleteMany({
            where: {
                userId: existingUser.id,
            },
        });

        await prisma.users.delete({
            where: {
                id: existingUser.id,
            },
        });

        console.log("🧹 Existing mock user data removed.");
    }

    // ------------------------------------------------------------
    // USER
    // ------------------------------------------------------------

    const passwordHash = await bcrypt.hash("MockPassword123!", 10);

    const user = await prisma.users.create({
        data: {
            name: "LearnTrack Demo User",
            email: mockEmail,
            passwordHash,
            phoneNumber: "9000000000",
        },
    });

    console.log(`👤 Created user with ID: ${user.id}`);

    if (user.id !== 1) {
        throw new Error(
            `Expected mock user ID to be 1, but received ${user.id}. ` +
            `The current temporary frontend/backend authentication expects user ID 1.`
        );
    }

    // ------------------------------------------------------------
    // LEARNING SPACE 1
    // ------------------------------------------------------------

    const javascriptSpace = await prisma.learningSpaces.create({
        data: {
            userId: user.id,
            name: "JavaScript",
        },
    });

    // ------------------------------------------------------------
    // JAVASCRIPT QUIZ
    // ------------------------------------------------------------

    const javascriptQuiz = await prisma.quizzes.create({
        data: {
            learningSpaceId: javascriptSpace.id,
            topic: "JavaScript Basics",
            difficulty: "MEDIUM",
            quizType: "TOPIC",
        },
    });

    const jsQuestion1 = await prisma.questions.create({
        data: {
            quizId: javascriptQuiz.id,
            questionText: "Which keyword declares a block-scoped variable?",
            correctAnswer: "let",
            options: ["var", "let", "define", "variable"],
        },
    });

    const jsQuestion2 = await prisma.questions.create({
        data: {
            quizId: javascriptQuiz.id,
            questionText: "Which method converts JSON text into a JavaScript object?",
            correctAnswer: "JSON.parse()",
            options: [
                "JSON.stringify()",
                "JSON.parse()",
                "JSON.convert()",
                "JSON.object()",
            ],
        },
    });

    const jsQuestion3 = await prisma.questions.create({
        data: {
            quizId: javascriptQuiz.id,
            questionText: "Which value represents an explicitly empty value?",
            correctAnswer: "null",
            options: ["undefined", "null", "empty", "void"],
        },
    });

    // ------------------------------------------------------------
    // JAVASCRIPT QUIZ ATTEMPTS
    // ------------------------------------------------------------

    const now = new Date();

    const jsAttempt1 = await prisma.quizAttempts.create({
        data: {
            quizId: javascriptQuiz.id,
            userId: user.id,
            attemptedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            score: 70,
        },
    });

    const jsAttempt2 = await prisma.quizAttempts.create({
        data: {
            quizId: javascriptQuiz.id,
            userId: user.id,
            attemptedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            score: 80,
        },
    });

    const jsAttempt3 = await prisma.quizAttempts.create({
        data: {
            quizId: javascriptQuiz.id,
            userId: user.id,
            attemptedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            score: 90,
        },
    });

    // Attempt answers
    await prisma.attemptAnswers.createMany({
        data: [
            {
                quizAttemptId: jsAttempt1.quizAttemptId,
                questionId: jsQuestion1.questionId,
                selectedAnswer: "let",
            },
            {
                quizAttemptId: jsAttempt1.quizAttemptId,
                questionId: jsQuestion2.questionId,
                selectedAnswer: "JSON.stringify()",
            },
            {
                quizAttemptId: jsAttempt1.quizAttemptId,
                questionId: jsQuestion3.questionId,
                selectedAnswer: "null",
            },

            {
                quizAttemptId: jsAttempt2.quizAttemptId,
                questionId: jsQuestion1.questionId,
                selectedAnswer: "let",
            },
            {
                quizAttemptId: jsAttempt2.quizAttemptId,
                questionId: jsQuestion2.questionId,
                selectedAnswer: "JSON.parse()",
            },
            {
                quizAttemptId: jsAttempt2.quizAttemptId,
                questionId: jsQuestion3.questionId,
                selectedAnswer: "undefined",
            },

            {
                quizAttemptId: jsAttempt3.quizAttemptId,
                questionId: jsQuestion1.questionId,
                selectedAnswer: "let",
            },
            {
                quizAttemptId: jsAttempt3.quizAttemptId,
                questionId: jsQuestion2.questionId,
                selectedAnswer: "JSON.parse()",
            },
            {
                quizAttemptId: jsAttempt3.quizAttemptId,
                questionId: jsQuestion3.questionId,
                selectedAnswer: "null",
            },
        ],
    });

    // ------------------------------------------------------------
    // LEARNING SPACE 2
    // ------------------------------------------------------------

    const dbmsSpace = await prisma.learningSpaces.create({
        data: {
            userId: user.id,
            name: "DBMS",
        },
    });

    // ------------------------------------------------------------
    // DBMS QUIZ
    // ------------------------------------------------------------

    const dbmsQuiz = await prisma.quizzes.create({
        data: {
            learningSpaceId: dbmsSpace.id,
            topic: "Database Fundamentals",
            difficulty: "EASY",
            quizType: "TOPIC",
        },
    });

    const dbQuestion1 = await prisma.questions.create({
        data: {
            quizId: dbmsQuiz.id,
            questionText: "What does SQL stand for?",
            correctAnswer: "Structured Query Language",
            options: [
                "Structured Query Language",
                "Simple Query Language",
                "System Query Logic",
                "Sequential Query Language",
            ],
        },
    });

    const dbQuestion2 = await prisma.questions.create({
        data: {
            quizId: dbmsQuiz.id,
            questionText: "Which SQL command is used to retrieve data?",
            correctAnswer: "SELECT",
            options: ["GET", "FETCH", "SELECT", "READ"],
        },
    });

    const dbQuestion3 = await prisma.questions.create({
        data: {
            quizId: dbmsQuiz.id,
            questionText: "Which key uniquely identifies a row?",
            correctAnswer: "Primary Key",
            options: ["Foreign Key", "Primary Key", "Candidate Key", "Index"],
        },
    });

    // ------------------------------------------------------------
    // DBMS ATTEMPTS
    // ------------------------------------------------------------

    const dbAttempt1 = await prisma.quizAttempts.create({
        data: {
            quizId: dbmsQuiz.id,
            userId: user.id,
            attemptedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
            score: 60,
        },
    });

    const dbAttempt2 = await prisma.quizAttempts.create({
        data: {
            quizId: dbmsQuiz.id,
            userId: user.id,
            attemptedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            score: 80,
        },
    });

    await prisma.attemptAnswers.createMany({
        data: [
            {
                quizAttemptId: dbAttempt1.quizAttemptId,
                questionId: dbQuestion1.questionId,
                selectedAnswer: "Structured Query Language",
            },
            {
                quizAttemptId: dbAttempt1.quizAttemptId,
                questionId: dbQuestion2.questionId,
                selectedAnswer: "GET",
            },
            {
                quizAttemptId: dbAttempt1.quizAttemptId,
                questionId: dbQuestion3.questionId,
                selectedAnswer: "Primary Key",
            },

            {
                quizAttemptId: dbAttempt2.quizAttemptId,
                questionId: dbQuestion1.questionId,
                selectedAnswer: "Structured Query Language",
            },
            {
                quizAttemptId: dbAttempt2.quizAttemptId,
                questionId: dbQuestion2.questionId,
                selectedAnswer: "SELECT",
            },
            {
                quizAttemptId: dbAttempt2.quizAttemptId,
                questionId: dbQuestion3.questionId,
                selectedAnswer: "Primary Key",
            },
        ],
    });

    // ------------------------------------------------------------
    // RECOMMENDATION SAMPLE
    // ------------------------------------------------------------

    await prisma.recommendations.create({
        data: {
            userId: user.id,
            recommendationType: "STUDY",
            recommendation:
                "Review JavaScript fundamentals and practice more questions on JSON and variables.",
        },
    });

    console.log("✅ Seed completed successfully.");
    console.log("");
    console.log("Development login:");
    console.log(`   Email: ${mockEmail}`);
    console.log("   Password: MockPassword123!");
    console.log("");
    console.log(`User ID: ${user.id}`);
    console.log(`Learning Spaces: ${javascriptSpace.name}, ${dbmsSpace.name}`);
    console.log("Quizzes: 2");
    console.log("Quiz Attempts: 5");
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