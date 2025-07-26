import { type User, type InsertUser, type Resume, type InsertResume, type JobPosting, type InsertJobPosting, type Match, type InsertMatch } from "@shared/schema";
import { users, resumes, jobPostings, matches } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUser(id: string): Promise<User | undefined>;
  
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getAllResumes(userId?: string): Promise<Resume[]>;
  
  // Job posting operations
  createJobPosting(job: InsertJobPosting): Promise<JobPosting>;
  getJobPosting(id: string): Promise<JobPosting | undefined>;
  getAllJobPostings(userId?: string): Promise<JobPosting[]>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatch(id: string): Promise<Match | undefined>;
  getMatchesByResumeId(resumeId: string): Promise<Match[]>;
  getMatchesByJobId(jobId: string): Promise<Match[]>;
  getAllMatches(userId?: string): Promise<Match[]>;
  updateMatchStatus(id: string, status: "qualified" | "under_review" | "not_qualified"): Promise<Match | undefined>;
  deleteMatch(id: string): Promise<boolean>;
  
  // Analytics
  getStats(userId?: string): Promise<{
    totalResumes: number;
    activeJobs: number;
    avgMatchScore: number;
    processingTime: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  // Resume operations
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values(insertResume)
      .returning();
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async getAllResumes(userId?: string): Promise<Resume[]> {
    if (userId) {
      return await db.select().from(resumes).where(eq(resumes.userId, userId));
    }
    return await db.select().from(resumes);
  }

  // Job posting operations
  async createJobPosting(insertJob: InsertJobPosting): Promise<JobPosting> {
    const [job] = await db
      .insert(jobPostings)
      .values(insertJob)
      .returning();
    return job;
  }

  async getJobPosting(id: string): Promise<JobPosting | undefined> {
    const [job] = await db.select().from(jobPostings).where(eq(jobPostings.id, id));
    return job || undefined;
  }

  async getAllJobPostings(userId?: string): Promise<JobPosting[]> {
    if (userId) {
      return await db.select().from(jobPostings).where(eq(jobPostings.userId, userId));
    }
    return await db.select().from(jobPostings);
  }

  // Match operations
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values(insertMatch)
      .returning();
    return match;
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match || undefined;
  }

  async getMatchesByResumeId(resumeId: string): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.resumeId, resumeId));
  }

  async getMatchesByJobId(jobId: string): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.jobId, jobId));
  }

  async getAllMatches(userId?: string): Promise<Match[]> {
    if (userId) {
      // Get matches for jobs created by this user
      const userMatches = await db
        .select({
          id: matches.id,
          resumeId: matches.resumeId,
          jobId: matches.jobId,
          overallScore: matches.overallScore,
          technicalScore: matches.technicalScore,
          experienceScore: matches.experienceScore,
          culturalScore: matches.culturalScore,
          matchedSkills: matches.matchedSkills,
          missingSkills: matches.missingSkills,
          strengths: matches.strengths,
          concerns: matches.concerns,
          status: matches.status,
          createdAt: matches.createdAt,
        })
        .from(matches)
        .innerJoin(jobPostings, eq(matches.jobId, jobPostings.id))
        .where(eq(jobPostings.userId, userId));
      return userMatches;
    }
    return await db.select().from(matches);
  }

  async updateMatchStatus(id: string, status: "qualified" | "under_review" | "not_qualified"): Promise<Match | undefined> {
    const [match] = await db
      .update(matches)
      .set({ status })
      .where(eq(matches.id, id))
      .returning();
    return match || undefined;
  }

  async deleteMatch(id: string): Promise<boolean> {
    const result = await db.delete(matches).where(eq(matches.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getStats(userId?: string): Promise<{
    totalResumes: number;
    activeJobs: number;
    avgMatchScore: number;
    processingTime: string;
  }> {
    const allResumes = await this.getAllResumes(userId);
    const allJobs = await this.getAllJobPostings(userId);
    const allMatches = await this.getAllMatches(userId);
    
    const avgScore = allMatches.length > 0 
      ? Math.round(allMatches.reduce((sum, match) => sum + match.overallScore, 0) / allMatches.length)
      : 0;

    return {
      totalResumes: allResumes.length,
      activeJobs: allJobs.length,
      avgMatchScore: avgScore,
      processingTime: "2.3s"
    };
  }
}

export const storage = new DatabaseStorage();
