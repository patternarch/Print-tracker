import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
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
  projectId: integer("project_id").references(() => projects.id),
  filename: text("filename").notNull(),
  size: text("size").notNull(),
  copies: integer("copies").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  completed: boolean("completed").default(false),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertPrintJobSchema = createInsertSchema(printJobs).omit({ id: true, createdAt: true });

export type Project = typeof projects.$inferSelect;
export type PrintJob = typeof printJobs.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertPrintJob = z.infer<typeof insertPrintJobSchema>;
