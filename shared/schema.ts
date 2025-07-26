import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  candidateName: text("candidate_name"),
  candidateEmail: text("candidate_email"),
  rawText: text("raw_text").notNull(),
  extractedSkills: jsonb("extracted_skills").$type<{
    technical: Array<{ skill: string; confidence: number }>;
    soft: Array<{ skill: string; confidence: number }>;
    tools: Array<{ skill: string; confidence: number }>;
  }>(),
  experience: text("experience"),
  education: text("education"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const jobPostings = pgTable("job_postings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  requiredSkills: jsonb("required_skills").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").references(() => resumes.id).notNull(),
  jobId: varchar("job_id").references(() => jobPostings.id).notNull(),
  overallScore: integer("overall_score").notNull(),
  technicalScore: integer("technical_score").notNull(),
  experienceScore: integer("experience_score").notNull(),
  culturalScore: integer("cultural_score").notNull(),
  matchedSkills: jsonb("matched_skills").$type<string[]>(),
  missingSkills: jsonb("missing_skills").$type<string[]>(),
  strengths: jsonb("strengths").$type<string[]>(),
  concerns: jsonb("concerns").$type<string[]>(),
  status: text("status").$type<"qualified" | "under_review" | "not_qualified">().default("under_review"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  uploadedAt: true,
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
