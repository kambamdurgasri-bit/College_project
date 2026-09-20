import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, BarChart2 } from "lucide-react";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      <p className="font-bold text-brand-600 dark:text-brand-400">
        Progress: {payload[0].value}%
      </p>
    </div>
  );
}

export default function WeeklyProgressChart({ weeklyData }) {
  const hasData = weeklyData && weeklyData.length > 0 && weeklyData.some(d => d.progress > 0);

  const fallbackDays = [
    { day: "Mon", progress: 0 },
    { day: "Tue", progress: 0 },
    { day: "Wed", progress: 0 },
    { day: "Thu", progress: 0 },
    { day: "Fri", progress: 0 },
    { day: "Sat", progress: 0 },
    { day: "Sun", progress: 0 },
  ];

  const chartData = hasData ? weeklyData : fallbackDays;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Weekly Learning Progress
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track your daily performance and completion rates
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-white/5 dark:text-slate-300">
          <span>This Week</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      <div className="relative h-72 w-full">
        {!hasData && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-[1px] dark:bg-slate-900/70">
            <BarChart2 className="mb-2 h-8 w-8 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              No weekly data available yet
            </p>
            <p className="text-xs text-slate-400">
              Complete quizzes or study sessions to view daily progress trends.
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-100 dark:stroke-white/5"
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#7C3AED"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#purpleGradient)"
              dot={{ r: 4, fill: "#7C3AED", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#7C3AED" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
