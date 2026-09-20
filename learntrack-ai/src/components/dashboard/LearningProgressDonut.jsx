import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function LearningProgressDonut({ progressPercentage = 0, progressData }) {
  const data = progressData || [
    { name: "Progress", value: Math.max(1, Math.min(100, progressPercentage)) },
    { name: "Remaining", value: Math.max(0, 100 - Math.min(100, progressPercentage)) },
  ];
  const colors = progressData ? ["#7C3AED", "#C4B5FD", "#F3E8FF"] : ["#7C3AED", "#F3E8FF"];

  return (
    <div className="flex h-full min-h-[270px] flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        Learning Progress
      </h3>

      <div className="relative my-2 flex flex-1 items-center justify-center min-h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={58}
              outerRadius={78}
              startAngle={90}
              endAngle={-270}
              paddingAngle={data.length > 1 && data[1].value > 0 ? 2 : 0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {Math.round(progressPercentage)}%
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Overall Progress
          </span>
        </div>
      </div>

      {progressData && (
        <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
          {progressData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
