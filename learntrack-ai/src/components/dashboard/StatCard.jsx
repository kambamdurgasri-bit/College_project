export default function StatCard({ icon, value, label, sublabel, change, changeColor = 'gray' }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-xs text-gray-500 mt-1">{sublabel}</div>
      {change && <div className={`text-xs font-semibold mt-2 text-${changeColor}-600`}>{change}</div>}
    </div>
  );
}
