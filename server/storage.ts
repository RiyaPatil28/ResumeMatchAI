import { type Resume, type InsertResume, type JobPosting, type InsertJobPosting, type Match, type InsertMatch } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getAllResumes(): Promise<Resume[]>;
  
  // Job posting operations
  createJobPosting(job: InsertJobPosting): Promise<JobPosting>;
  getJobPosting(id: string): Promise<JobPosting | undefined>;
  getAllJobPostings(): Promise<JobPosting[]>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatch(id: string): Promise<Match | undefined>;
  getMatchesByResumeId(resumeId: string): Promise<Match[]>;
  getMatchesByJobId(jobId: string): Promise<Match[]>;
  getAllMatches(): Promise<Match[]>;
  updateMatchStatus(id: string, status: "qualified" | "under_review" | "not_qualified"): Promise<Match | undefined>;
  
  // Analytics
  getStats(): Promise<{
    totalResumes: number;
    activeJobs: number;
    avgMatchScore: number;
    processingTime: string;
  }>;
}

export class MemStorage implements IStorage {
  private resumes: Map<string, Resume>;
  private jobPostings: Map<string, JobPosting>;
  private matches: Map<string, Match>;

  constructor() {
    this.resumes = new Map();
    this.jobPostings = new Map();
    this.matches = new Map();
    
    // Add sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample job posting
    const sampleJob = await this.createJobPosting({
      title: "Senior Frontend Developer",
      company: "Tech Corp Inc.",
      description: "We are looking for a Senior Frontend Developer with 5+ years of experience in React, TypeScript, and modern web development. The ideal candidate should have strong skills in JavaScript, CSS, HTML, and experience with state management libraries like Redux. Knowledge of testing frameworks, CI/CD, and agile methodologies is preferred.",
      requiredSkills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Redux", "Jest", "Git"]
    });
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = {
      ...insertResume,
      id,
      uploadedAt: new Date(),
      candidateName: insertResume.candidateName || null,
      candidateEmail: insertResume.candidateEmail || null,
      extractedSkills: insertResume.extractedSkills || null,
      experience: insertResume.experience || null,
      education: insertResume.education || null,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getAllResumes(): Promise<Resume[]> {
    return Array.from(this.resumes.values()).sort((a, b) => 
      new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime()
    );
  }

  async createJobPosting(insertJob: InsertJobPosting): Promise<JobPosting> {
    const id = randomUUID();
    const job: JobPosting = {
      ...insertJob,
      id,
      createdAt: new Date(),
      requiredSkills: insertJob.requiredSkills || null,
    };
    this.jobPostings.set(id, job);
    return job;
  }

  async getJobPosting(id: string): Promise<JobPosting | undefined> {
    return this.jobPostings.get(id);
  }

  async getAllJobPostings(): Promise<JobPosting[]> {
    return Array.from(this.jobPostings.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = {
      ...insertMatch,
      id,
      createdAt: new Date(),
      status: insertMatch.status || "under_review",
      matchedSkills: insertMatch.matchedSkills || null,
      missingSkills: insertMatch.missingSkills || null,
      strengths: insertMatch.strengths || null,
      concerns: insertMatch.concerns || null,
    };
    this.matches.set(id, match);
    return match;
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchesByResumeId(resumeId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => match.resumeId === resumeId);
  }

  async getMatchesByJobId(jobId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => match.jobId === jobId);
  }

  async getAllMatches(): Promise<Match[]> {
    return Array.from(this.matches.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async updateMatchStatus(id: string, status: "qualified" | "under_review" | "not_qualified"): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (match) {
      match.status = status;
      this.matches.set(id, match);
      return match;
    }
    return undefined;
  }

  async getStats(): Promise<{
    totalResumes: number;
    activeJobs: number;
    avgMatchScore: number;
    processingTime: string;
  }> {
    const matches = Array.from(this.matches.values());
    const avgScore = matches.length > 0 
      ? Math.round(matches.reduce((sum, match) => sum + match.overallScore, 0) / matches.length)
      : 0;

    return {
      totalResumes: this.resumes.size,
      activeJobs: this.jobPostings.size,
      avgMatchScore: avgScore,
      processingTime: "2.3s"
    };
  }
}

export const storage = new MemStorage();
