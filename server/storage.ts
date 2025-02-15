import { Project, PrintJob, InsertProject, InsertPrintJob } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private printJobs: Map<number, PrintJob>;
  private projectId: number;
  private printJobId: number;

  constructor() {
    this.projects = new Map();
    this.printJobs = new Map();
    this.projectId = 1;
    this.printJobId = 1;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const newProject = { ...project, id };
    this.projects.set(id, newProject);
    return newProject;
  }

  async getPrintJobs(projectId?: number): Promise<PrintJob[]> {
    const jobs = Array.from(this.printJobs.values());
    return projectId ? jobs.filter(job => job.projectId === projectId) : jobs;
  }

  async getPrintJob(id: number): Promise<PrintJob | undefined> {
    return this.printJobs.get(id);
  }

  async createPrintJob(job: InsertPrintJob): Promise<PrintJob> {
    const id = this.printJobId++;
    const newJob: PrintJob = {
      ...job,
      id,
      createdAt: new Date(),
      completed: false,
    };
    this.printJobs.set(id, newJob);
    return newJob;
  }

  async updatePrintJobStatus(id: number, status: string): Promise<PrintJob> {
    const job = await this.getPrintJob(id);
    if (!job) throw new Error("Print job not found");
    
    const updatedJob = { ...job, status, completed: status === "completed" };
    this.printJobs.set(id, updatedJob);
    return updatedJob;
  }
}

export const storage = new MemStorage();
