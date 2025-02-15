import { Project, PrintJob, InsertProject, InsertPrintJob } from "@shared/schema";
import { db } from "./db";
import { projects, printJobs, printLogs, type PrintLog, type InsertPrintLog } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;

  // Print Jobs
  getPrintJobs(projectId?: number): Promise<PrintJob[]>;
  getPrintJob(id: number): Promise<PrintJob | undefined>;
  createPrintJob(job: InsertPrintJob): Promise<PrintJob>;
  updatePrintJobStatus(id: number, status: string): Promise<PrintJob>;

  // Print Logs
  logPrintExecution(log: InsertPrintLog): Promise<PrintLog>;
  getPrintLogs(printJobId?: number): Promise<PrintLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getPrintJobs(projectId?: number): Promise<PrintJob[]> {
    const query = db.select().from(printJobs);
    if (projectId) {
      query.where(eq(printJobs.projectId, projectId));
    }
    return await query;
  }

  async getPrintJob(id: number): Promise<PrintJob | undefined> {
    const [job] = await db.select().from(printJobs).where(eq(printJobs.id, id));
    return job;
  }

  async createPrintJob(job: InsertPrintJob): Promise<PrintJob> {
    const [newJob] = await db.insert(printJobs).values(job).returning();
    return newJob;
  }

  async updatePrintJobStatus(id: number, status: string): Promise<PrintJob> {
    const [updatedJob] = await db
      .update(printJobs)
      .set({ status, completed: status === "completed" })
      .where(eq(printJobs.id, id))
      .returning();

    if (!updatedJob) {
      throw new Error("Print job not found");
    }

    return updatedJob;
  }

  async logPrintExecution(log: InsertPrintLog): Promise<PrintLog> {
    const [newLog] = await db.insert(printLogs).values(log).returning();
    return newLog;
  }

  async getPrintLogs(printJobId?: number): Promise<PrintLog[]> {
    const query = db.select().from(printLogs);
    if (printJobId) {
      query.where(eq(printLogs.printJobId, printJobId));
    }
    return await query;
  }
}

export const storage = new DatabaseStorage();