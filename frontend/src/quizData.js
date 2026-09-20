export const SUBJECTS = {
  "Machine Learning": ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "Model Evaluation"],
  Python: ["Loops & Iterators", "Data Structures", "OOP Concepts", "Exception Handling"],
  DBMS: ["Normalization", "SQL Queries", "Transactions", "Indexing"],
  "Operating Systems": ["Process Scheduling", "Deadlocks", "Memory Management", "File Systems"],
  "Data Structures": ["Arrays & Strings", "Trees", "Graphs", "Recursion & Backtracking"],
};

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];
export const QUESTION_COUNTS = [5, 10, 15, 20];

export const SAMPLE_QUESTIONS = [
  {
    id: 1,
    text: "Which normal form removes transitive dependency on the primary key?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correct: 2,
    explanation: "3NF requires that non-key attributes depend only on the key, removing transitive dependencies present after 2NF.",
  },
  {
    id: 2,
    text: "In ACID transaction properties, what does the 'I' stand for?",
    options: ["Integrity", "Isolation", "Indexing", "Immutability"],
    correct: 1,
    explanation: "Isolation ensures concurrently executing transactions don't interfere with each other's intermediate state.",
  },
  {
    id: 3,
    text: "Which of these is NOT one of the four necessary conditions for a deadlock?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"],
    correct: 2,
    explanation: "Deadlocks require 'No Preemption' — resources can't be forcibly taken away. 'Preemption' itself is the opposite condition.",
  },
  {
    id: 4,
    text: "What is the time complexity of a balanced binary search tree lookup?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correct: 2,
    explanation: "A balanced BST halves the search space each step, giving logarithmic time complexity.",
  },
  {
    id: 5,
    text: "In Python, which statement is used to handle exceptions?",
    options: ["catch", "try/except", "rescue", "on error"],
    correct: 1,
    explanation: "Python uses try/except blocks to catch and handle exceptions raised during execution.",
  },
];

export const QUIZ_HISTORY = [
  { id: 1, subject: "DBMS", topic: "Normalization", difficulty: "Medium", score: 5, total: 5, accuracy: 100, date: "31 Jul 2026" },
  { id: 2, subject: "Python", topic: "Loops & Iterators", difficulty: "Easy", score: 4, total: 5, accuracy: 80, date: "30 Jul 2026" },
  { id: 3, subject: "Operating Systems", topic: "Deadlocks", difficulty: "Hard", score: 2, total: 5, accuracy: 40, date: "29 Jul 2026" },
  { id: 4, subject: "Machine Learning", topic: "Model Evaluation", difficulty: "Medium", score: 4, total: 5, accuracy: 80, date: "27 Jul 2026" },
];

export const DEMO_QUESTION_COUNT = SAMPLE_QUESTIONS.length;
export const DEMO_TIME_LIMIT_MINUTES = DEMO_QUESTION_COUNT;
