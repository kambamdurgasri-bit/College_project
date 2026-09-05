// Temporary frontend fallback. Replace this object with authenticated user data
// from the backend when the user/profile API is available.
export const mockUser = {
  fullName: 'Demo User',
  email: 'demo.user@example.invalid',
  phone: '000-000-0000',
  dob: '',
  gender: 'Prefer not to say',
  university: 'Example University',
  branch: 'Example Program',
  department: 'Demo Year',
  learningLevel: 'Intermediate',
  about: 'This is temporary demo profile data. Connect the authenticated profile API to show real user information.',
  avatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Demo%20User&backgroundColor=EDE9FE',
  joinedOn: 'Demo account',
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
    { name: 'Example Course Certificate', date: 'Demo date' },
    { name: 'Sample Learning Certificate', date: 'Demo date' },
  ],
  milestones: [
    { name: 'Demo quiz milestone', date: 'Demo date' },
    { name: 'Demo study milestone', date: 'Demo date' },
  ],
};

export const activityTimeline = [
  {
    type: 'profile',
    icon: 'UserRound',
    title: 'Demo profile activity',
    time: 'Demo time',
  },
  {
    type: 'quiz',
    icon: 'FileCheck2',
    title: 'Completed a sample quiz',
    time: 'Demo time',
  },
  {
    type: 'login',
    icon: 'LogIn',
    title: 'Signed in to the demo account',
    time: 'Demo time',
  },
  {
    type: 'summary',
    icon: 'BarChart3',
    title: 'Sample weekly learning summary',
    time: 'Demo time',
  },
  {
    type: 'quiz',
    icon: 'FileCheck2',
    title: 'Attempted a sample quiz',
    time: 'Demo time',
  },
];
