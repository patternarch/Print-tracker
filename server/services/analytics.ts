import { db } from "../db";
import { printJobs, projects } from "@shared/schema";
import { sql } from "drizzle-orm";
import { startOfMonth, endOfMonth, format } from "date-fns";

export interface PrintVolume {
  date: string;
  count: number;
  totalCost: string;
}

export interface ProjectStats {
  projectId: number;
  projectName: string;
  totalPrints: number;
  totalCost: string;
  averageCostPerPrint: string;
}

export class AnalyticsService {
  async getMonthlyPrintVolume(months: number = 12): Promise<PrintVolume[]> {
    const result = await db
      .select({
        date: sql<string>`date_trunc('month', created_at)`,
        count: sql<number>`count(*)`,
        totalCost: sql<string>`sum(total_cost)`,
      })
      .from(printJobs)
      .groupBy(sql`date_trunc('month', created_at)`)
      .orderBy(sql`date_trunc('month', created_at)`);

    return result.map(row => ({
      date: format(new Date(row.date), 'MMM yyyy'),
      count: row.count,
      totalCost: row.totalCost || '0'
    }));
  }

  async getProjectStats(): Promise<ProjectStats[]> {
    return await db
      .select({
        projectId: projects.id,
        projectName: projects.name,
        totalPrints: sql<number>`count(${printJobs.id})`,
        totalCost: sql<string>`sum(${printJobs.totalCost})`,
        averageCostPerPrint: sql<string>`avg(${printJobs.costPerCopy})`
      })
      .from(projects)
      .leftJoin(printJobs, sql`${projects.id} = ${printJobs.projectId}`)
      .groupBy(projects.id, projects.name)
      .orderBy(sql`sum(${printJobs.totalCost}) desc nulls last`);
  }

  async getPaperTypeDistribution() {
    return await db
      .select({
        paperType: printJobs.paperType,
        count: sql<number>`count(*)`,
        totalCost: sql<string>`sum(${printJobs.totalCost})`
      })
      .from(printJobs)
      .groupBy(printJobs.paperType)
      .orderBy(sql<number>`count(*) desc`);
  }

  async getAverageTurnaroundTime() {
    return await db
      .select({
        averageHours: sql<number>`
          avg(
            extract(epoch from (${printJobs.completedAt} - ${printJobs.createdAt})) / 3600
          )
        `
      })
      .from(printJobs)
      .where(sql`${printJobs.completedAt} is not null`);
  }
}

export const analyticsService = new AnalyticsService();
