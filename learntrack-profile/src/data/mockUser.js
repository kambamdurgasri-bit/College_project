export const mockUser = {
  fullName: 'Ananya Rao',
  email: 'ananya.rao@nitw.ac.in',
  phone: '+91 98765 43210',
  dob: '2004-03-18',
  gender: 'Female',
  university: 'National Institute of Technology, Warangal',
  branch: 'Computer Science & Engineering',
  department: 'B.Tech, 3rd Year',
  learningLevel: 'Intermediate',
  about:
    'CS undergrad exploring machine learning and distributed systems. Currently prepping for GATE while juggling coursework — trying to actually understand concepts instead of just clearing quizzes.',
  avatar:
    'https://api.dicebear.com/7.x/notionists/svg?seed=Ananya&backgroundColor=F5F3FF',
  joinedOn: 'August 2024',
};

export const quickStats = [
  { label: 'Learning Spaces', value: '6', icon: 'BookOpen', tint: '#7C3AED' },
  { label: 'Completed Quizzes', value: '142', icon: 'CheckCircle2', tint: '#10B981' },
  { label: 'Average Score', value: '84%', icon: 'Target', tint: '#A78BFA' },
  { label: 'Learning Streak', value: '12 days', icon: 'Flame', tint: '#F59E0B' },
  { label: 'Study Hours', value: '96 hrs', icon: 'Clock', tint: '#7C3AED' },
];

export const achievements = {
  badges: [
    { name: 'Quiz Master', icon: 'Award', tint: '#7C3AED' },
    { name: '7-Day Streak', icon: 'Flame', tint: '#F59E0B' },
    { name: 'Top 10%', icon: 'TrendingUp', tint: '#10B981' },
    { name: 'Early Bird', icon: 'Sunrise', tint: '#A78BFA' },
  ],
  certificates: [
    { name: 'DBMS Fundamentals', date: 'Jun 2025' },
    { name: 'Python for Data Science', date: 'Mar 2025' },
  ],
  milestones: [
    { name: '100 Quizzes Completed', date: 'Jul 2025' },
    { name: '50 Study Hours Logged', date: 'Apr 2025' },
  ],
};

export const activityTimeline = [
  {
    type: 'profile',
    icon: 'UserRound',
    title: 'Updated profile photo',
    time: '2 hours ago',
  },
  {
    type: 'quiz',
    icon: 'FileCheck2',
    title: 'Scored 92% on "Operating Systems — Deadlocks"',
    time: '5 hours ago',
  },
  {
    type: 'login',
    icon: 'LogIn',
    title: 'Logged in from Chrome on Windows',
    time: 'Yesterday, 9:42 PM',
  },
  {
    type: 'summary',
    icon: 'BarChart3',
    title: 'Weekly learning summary: 8.5 hrs studied, 6 quizzes taken',
    time: '2 days ago',
  },
  {
    type: 'quiz',
    icon: 'FileCheck2',
    title: 'Attempted "Machine Learning — Regression Basics"',
    time: '3 days ago',
  },
];
