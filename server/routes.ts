import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage.js";
import { insertResumeSchema, insertJobPostingSchema } from "@shared/schema.js";
import { FileParser } from "./services/file-parser.js";
import { NLPProcessor } from "./services/nlp-processor.js";
import { JobMatcher } from "./services/job-matcher.js";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Upload and analyze resume
  app.post("/api/resumes/upload", upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Parse the uploaded file
      const parsedDoc = await FileParser.parseFile(req.file.buffer, req.file.mimetype);
      
      // Analyze the resume text using NLP
      const analysis = NLPProcessor.analyzeResume(parsedDoc.text);
      
      // Create resume record
      const resumeData = {
        fileName: req.file.originalname,
        candidateName: analysis.candidateName || "Unknown Candidate",
        candidateEmail: analysis.candidateEmail || undefined,
        rawText: parsedDoc.text,
        extractedSkills: analysis.skills,
        experience: analysis.experience,
        education: analysis.education,
      };

      const resume = await storage.createResume(resumeData);
      
      res.json({
        success: true,
        resume,
        analysis
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process resume" 
      });
    }
  });

  // Get all resumes
  app.get("/api/resumes", async (req, res) => {
    try {
      const resumes = await storage.getAllResumes();
      res.json(resumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  // Get specific resume
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  // Create job posting
  app.post("/api/jobs", async (req, res) => {
    try {
      const validatedData = insertJobPostingSchema.parse(req.body);
      
      // Extract skills from job description
      const jobAnalysis = NLPProcessor.analyzeResume(validatedData.description);
      const requiredSkills = [
        ...jobAnalysis.skills.technical.map(s => s.skill),
        ...jobAnalysis.skills.tools.map(s => s.skill)
      ].slice(0, 10); // Limit to top 10 skills

      const jobData = {
        ...validatedData,
        requiredSkills
      };

      const job = await storage.createJobPosting(jobData);
      res.json(job);
    } catch (error) {
      console.error('Job creation error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create job posting" 
      });
    }
  });

  // Get all job postings
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobPostings();
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: "Failed to fetch job postings" });
    }
  });

  // Match resume to job
  app.post("/api/matches", async (req, res) => {
    try {
      const { resumeId, jobId } = req.body;
      
      if (!resumeId || !jobId) {
        return res.status(400).json({ message: "Resume ID and Job ID are required" });
      }

      const resume = await storage.getResume(resumeId);
      const job = await storage.getJobPosting(jobId);
      
      if (!resume || !job) {
        return res.status(404).json({ message: "Resume or job not found" });
      }

      // Perform matching analysis
      const matchResult = JobMatcher.analyzeMatch(
        resume.extractedSkills!,
        job,
        resume.experience || "",
        resume.education || ""
      );

      // Create match record
      const match = await storage.createMatch({
        resumeId,
        jobId,
        ...matchResult
      });

      res.json(match);
    } catch (error) {
      console.error('Matching error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to perform matching" 
      });
    }
  });

  // Get all matches
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await storage.getAllMatches();
      
      // Enrich matches with resume and job data
      const enrichedMatches = await Promise.all(
        matches.map(async (match) => {
          const resume = await storage.getResume(match.resumeId);
          const job = await storage.getJobPosting(match.jobId);
          return {
            ...match,
            resume,
            job
          };
        })
      );
      
      res.json(enrichedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Update match status
  app.patch("/api/matches/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!['qualified', 'under_review', 'not_qualified'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const match = await storage.updateMatchStatus(req.params.id, status);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      res.json(match);
    } catch (error) {
      console.error('Error updating match status:', error);
      res.status(500).json({ message: "Failed to update match status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
