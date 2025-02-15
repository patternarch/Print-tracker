import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AnalyticsChart from "@/components/analytics-chart";
import PrintJobCard from "@/components/print-job-card";
import type { PrintJob } from "@shared/schema";

export default function Dashboard() {
  const { data: printJobs, isLoading } = useQuery<PrintJob[]>({
    queryKey: ["/api/print-jobs"],
  });

  const recentJobs = printJobs?.slice(0, 5) || [];
  const pendingCount = printJobs?.filter(job => job.status === "pending").length || 0;
  const completedCount = printJobs?.filter(job => job.status === "completed").length || 0;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Print Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-9 w-16" /> : printJobs?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500">
              {isLoading ? <Skeleton className="h-9 w-16" /> : pendingCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {isLoading ? <Skeleton className="h-9 w-16" /> : completedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Print Job Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={printJobs || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Print Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map(job => (
                  <PrintJobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
