import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { PrintJob } from "@shared/schema";

interface PrintJobCardProps {
  job: PrintJob;
}

export default function PrintJobCard({ job }: PrintJobCardProps) {
  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      await apiRequest("PATCH", `/api/print-jobs/${job.id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/print-jobs"] });
    },
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown date";
    return format(new Date(date), "PPp");
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-medium">{job.filename}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(job.createdAt)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={job.status === "completed" ? "default" : "secondary"}>
              {job.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {job.copies} copies • {job.size}
            </span>
          </div>
        </div>

        {job.status === "pending" && (
          <Button
            size="sm"
            onClick={() => updateStatus.mutate("completed")}
            disabled={updateStatus.isPending}
          >
            Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
}