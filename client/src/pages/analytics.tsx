import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SEOHead from "@/components/seo-head";
import type { PrintVolume, ProjectStats } from "@shared/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Analytics() {
  const { data: printVolume, isLoading: volumeLoading } = useQuery<PrintVolume[]>({
    queryKey: ["/api/analytics/print-volume"],
  });

  const { data: projectStats, isLoading: statsLoading } = useQuery<ProjectStats[]>({
    queryKey: ["/api/analytics/project-stats"],
  });

  const { data: paperTypes } = useQuery<{ paperType: string; count: number }[]>({
    queryKey: ["/api/analytics/paper-types"],
  });

  const { data: turnaroundTime } = useQuery<{ averageHours: number }>({
    queryKey: ["/api/analytics/turnaround-time"],
  });

  return (
    <>
      <SEOHead
        title="Print Analytics - PrintTrack"
        description="Comprehensive analytics and reporting for your architectural print jobs."
      />

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Print Analytics</h1>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Average Turnaround Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {turnaroundTime ? (
                  `${turnaroundTime.averageHours.toFixed(1)} hours`
                ) : (
                  <Skeleton className="h-9 w-24" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Project Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {projectStats ? (
                  `$${projectStats
                    .reduce((acc, curr) => acc + Number(curr.totalCost), 0)
                    .toFixed(2)}`
                ) : (
                  <Skeleton className="h-9 w-24" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Print Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {volumeLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={printVolume}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paper Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {!paperTypes ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paperTypes}
                        dataKey="count"
                        nameKey="paperType"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {paperTypes.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Project</th>
                        <th className="p-2 text-left">Total Prints</th>
                        <th className="p-2 text-left">Total Cost</th>
                        <th className="p-2 text-left">Avg. Cost/Print</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectStats?.map((stat) => (
                        <tr key={stat.projectId} className="border-b">
                          <td className="p-2">{stat.projectName}</td>
                          <td className="p-2">{stat.totalPrints}</td>
                          <td className="p-2">${Number(stat.totalCost).toFixed(2)}</td>
                          <td className="p-2">
                            ${Number(stat.averageCostPerPrint).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
