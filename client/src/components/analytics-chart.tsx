import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { PrintJob } from "@shared/schema";

interface AnalyticsChartProps {
  data: PrintJob[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Group print jobs by date
  const groupedData = data.reduce((acc: Record<string, number>, job) => {
    if (!job.createdAt) return acc;
    const date = new Date(job.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(groupedData)
    .map(([date, count]) => ({
      date,
      jobs: count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="jobs"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}