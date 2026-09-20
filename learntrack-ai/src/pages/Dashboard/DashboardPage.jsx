import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import StatCard from '../../components/dashboard/StatCard';

const COLORS = ['#7c3aed', '#c4b5fd', '#e9d5ff'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await dashboardService.getSummary();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Couldn't load your dashboard: {error}</div>;
  if (!data) return null;

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Prepare donut chart data
  const progressData = [
    { name: 'Completed', value: 8 },
    { name: 'In Progress', value: 4 },
    { name: 'Not Started', value: 3 },
  ];

  // Prepare weekly chart data
  const weeklyData = [
    { day: 'Mon', progress: 25 },
    { day: 'Tue', progress: 38 },
    { day: 'Wed', progress: 55 },
    { day: 'Thu', progress: 65 },
    { day: 'Fri', progress: 78 },
    { day: 'Sat', progress: 85 },
    { day: 'Sun', progress: 92 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{greeting},</h1>
          <p className="text-xl text-gray-600">Sharukkhapathan226!</p>
          <p className="text-gray-500 mt-2">Continue your learning journey and make progress today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="📚"
            value={data.totalLearningSpaces}
            label="Learning Spaces"
            sublabel="Active study spaces"
          />
          <StatCard
            icon="✅"
            value="12"
            label="Tasks Completed"
            sublabel="This week"
            change="+20%"
            changeColor="green"
          />
          <StatCard
            icon="📊"
            value={data.totalQuizzes}
            label="Quizzes Taken"
            sublabel="This week"
            change="+50%"
            changeColor="green"
          />
          <StatCard
            icon="⭐"
            value={`${data.averageScore}%`}
            label="Average Score"
            sublabel="Across all quizzes"
            change="+12%"
            changeColor="green"
          />
        </div>

        {/* Hero Card & Progress */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Continue Learning Card */}
          <div className="col-span-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-8 text-white relative overflow-hidden">
            <p className="text-sm font-semibold opacity-80 mb-2">CURRENT LEARNING SPACE</p>
            <h2 className="text-3xl font-bold mb-2">Continue: DBMS</h2>
            <p className="text-purple-200 mb-6">Normalization • 10:30 AM – 11:30 AM</p>
            <button className="bg-white text-purple-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
              Continue Learning →
            </button>
          </div>

          {/* Learning Progress Donut */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-4">Learning Progress</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={progressData} dataKey="value" innerRadius={40} outerRadius={70} startAngle={90} endAngle={-270}>
                  {progressData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {progressData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Learning Progress Chart */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold text-gray-900 mb-4">Weekly Learning Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#7c3aed', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
