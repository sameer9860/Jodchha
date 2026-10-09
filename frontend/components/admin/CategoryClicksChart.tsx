"use client";

import {
Bar,
BarChart,
CartesianGrid,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from "recharts";

import type { TopCategory } from "@/lib/types";

type CategoryClicksChartProps = {
categories: TopCategory[];
};

export default function CategoryClicksChart({
categories,
}: CategoryClicksChartProps) {
const chartData = categories.map((category) => ({
category: category.website__category__name,
clicks: category.clicks,
}));

return ( <section className="rounded-xl border border-[var(--border)] bg-white p-6"> <div className="mb-6"> <h2 className="text-lg font-semibold text-[var(--foreground)]">
Traffic by Category </h2> <p className="mt-1 text-sm text-[var(--muted)]">
Compare clicks across website categories. </p> </div>

  {chartData.length === 0 ? (
    <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
      No category click data available yet.
    </div>
  ) : (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 12, left: -16, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [value, "Clicks"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 13,
            }}
          />
          <Bar
            dataKey="clicks"
            name="Clicks"
            fill="#14b8a6"
            radius={[6, 6, 0, 0]}
            maxBarSize={56}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )}
</section>

);
}
