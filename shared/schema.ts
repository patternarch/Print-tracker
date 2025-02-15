import { pgTable, text, serial, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  clientName: text("client_name"),
  status: text("status").notNull().default("active"),
});

export const printJobs = pgTable("print_jobs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  filename: text("filename").notNull(),
  size: text("size").notNull(),
  copies: integer("copies").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  completed: boolean("completed").default(false),
  paperType: text("paper_type").notNull().default("standard"),
  costPerCopy: decimal("cost_per_copy", { precision: 10, scale: 2 }).notNull().default("1.00"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  completedAt: timestamp("completed_at"),
});

export const printLogs = pgTable("print_logs", {
  id: serial("id").primaryKey(),
  printJobId: integer("print_job_id").notNull().references(() => printJobs.id),
  timestamp: timestamp("timestamp").notNull(),
  computerName: text("computer_name").notNull(),
  paperSize: text("paper_size").notNull(),
  paperType: text("paper_type").notNull(),
  copies: integer("copies").notNull(),
  highQuality: boolean("high_quality").default(false),
  versionNotes: text("version_notes"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertPrintJobSchema = createInsertSchema(printJobs)
  .omit({ 
    id: true, 
    createdAt: true,
    totalCost: true,
    completedAt: true 
  })
  .extend({
    projectId: z.number({
      required_error: "Project selection is required",
      invalid_type_error: "Please select a valid project"
    })
  });

export const insertPrintLogSchema = createInsertSchema(printLogs).omit({ 
  id: true,
  createdAt: true 
});

export type Project = typeof projects.$inferSelect;
export type PrintJob = typeof printJobs.$inferSelect;
export type PrintLog = typeof printLogs.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertPrintJob = z.infer<typeof insertPrintJobSchema>;
export type InsertPrintLog = z.infer<typeof insertPrintLogSchema>;