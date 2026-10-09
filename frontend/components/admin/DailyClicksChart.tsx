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
    range: DateRange;
    onRangeChange: (range: DateRange) => void;
};



export default function DailyClicksChart({
    dailyClicks,
    range,
    onRangeChange,
}: DailyClicksChartProps) {


    const chartData = Array.from({ length: range }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (range - 1 - index));

        const dateKey = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");

        const existingDay = dailyClicks.find((item) => item.date === dateKey);

        return {
            date: dateKey,
            label: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            clicks: existingDay?.clicks ?? 0,
        };
    });


    return (
        <section className="rounded-xl border border-[var(--border)] bg-white p-6">

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Click Activity
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Daily tracked clicks over the last {range} days.
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
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] text-[var(--muted)] hover:bg-slate-50"
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
</section >


);
}
