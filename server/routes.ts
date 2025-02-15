import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertPrintJobSchema } from "@shared/schema";
import { analyticsService } from "./services/analytics";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.post("/api/projects", async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid project data" });
    }
    const project = await storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  // Print Jobs
  app.get("/api/print-jobs", async (req, res) => {
    const projectId = req.query.projectId ? Number(req.query.projectId) : undefined;
    const jobs = await storage.getPrintJobs(projectId);
    res.json(jobs);
  });

  app.post("/api/print-jobs", async (req, res) => {
    const parsed = insertPrintJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid print job data" });
    }
    const job = await storage.createPrintJob(parsed.data);
    res.status(201).json(job);
  });

  app.patch("/api/print-jobs/:id/status", async (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    try {
      const job = await storage.updatePrintJobStatus(Number(req.params.id), status);
      res.json(job);
    } catch (error) {
      res.status(404).json({ message: "Print job not found" });
    }
  });

  // Analytics Routes
  app.get("/api/analytics/print-volume", async (req, res) => {
    const months = req.query.months ? Number(req.query.months) : 12;
    const data = await analyticsService.getMonthlyPrintVolume(months);
    res.json(data);
  });

  app.get("/api/analytics/project-stats", async (req, res) => {
    const stats = await analyticsService.getProjectStats();
    res.json(stats);
  });

  app.get("/api/analytics/paper-types", async (req, res) => {
    const distribution = await analyticsService.getPaperTypeDistribution();
    res.json(distribution);
  });

  app.get("/api/analytics/turnaround-time", async (req, res) => {
    const time = await analyticsService.getAverageTurnaroundTime();
    res.json(time);
  });

  // Print Monitor Integration
  app.post("/api/print-logs", async (req, res) => {
    const { jobNumber, timestamp, computerName } = req.body;

    try {
      // Validate the print job exists
      const printJob = await storage.getPrintJob(Number(jobNumber));
      if (!printJob) {
        return res.status(404).json({ message: "Print job not found" });
      }

      // Log the print execution
      await storage.logPrintExecution({
        printJobId: printJob.id,
        timestamp: new Date(timestamp),
        computerName,
      });

      res.status(201).json({ message: "Print log recorded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record print log" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}