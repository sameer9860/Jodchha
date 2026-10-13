"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyClick } from "@/lib/types";

type DateRange = 7 | 30;

type DailyClicksChartProps = {
  dailyClicks: DailyClick[];
  startDate: string;
  endDate: string;
  range: DateRange | "custom";
  onRangeChange: (range: DateRange) => void;
};

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function buildChartData(
  dailyClicks: DailyClick[],
  startDate: string,
  endDate: string,
) {
  const clicksByDate = new Map(
    dailyClicks.map((item) => [item.date, item.clicks]),
  );
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  const points: {
    date: string;
    label: string;
    clicks: number;
  }[] = [];

  for (
    let cursor = new Date(start);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const dateKey = formatDateKey(cursor);

    points.push({
      date: dateKey,
      label: cursor.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      clicks: clicksByDate.get(dateKey) ?? 0,
    });
  }

  return points;
}

export default function DailyClicksChart({
  dailyClicks,
  startDate,
  endDate,
  range,
  onRangeChange,
}: DailyClicksChartProps) {
  const chartData = buildChartData(dailyClicks, startDate, endDate);
  const dayCount = chartData.length;

  return (
    <section
      id="click-activity"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Click Activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Daily tracked clicks from {startDate} to {endDate}
            {dayCount > 0 ? ` (${dayCount} days)` : ""}.
          </p>
        </div>

        <div className="flex gap-2" aria-label="Chart date range">
          {([7, 30] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRangeChange(option)}
              aria-pressed={range === option}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                range === option
                  ? "bg-cyan-600 text-white"
                  : "border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {option} days
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, left: -16, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.date ?? ""
              }
              formatter={(value) => [value, "Clicks"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              name="Clicks"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
