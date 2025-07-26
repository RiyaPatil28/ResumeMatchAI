import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage.js";
import { type InsertUser, type InsertResume, type InsertJobPosting } from "@shared/schema.js";
import { FileParser } from "./services/file-parser.js";
import { NLPProcessor } from "./services/nlp-processor.js";
import { JobMatcher } from "./services/job-matcher.js";
import { hashPassword, comparePassword, generateToken, authMiddleware } from "./auth.js";

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
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, company, role } = req.body as InsertUser;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const user = await storage.createUser({
        email,
        firstName,
        lastName,
        company,
        role,
        password: hashedPassword,
      });
      
      // Generate token
      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
      });
      
      res.json({
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Generate token
      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
      });
      
      res.json({
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Resume routes
  app.post("/api/resumes/upload", authMiddleware, upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Parse the file
      const text = await FileParser.parseFile(req.file);
      
      // Analyze with NLP
      const analysis = NLPProcessor.analyzeResume(text);
      
      // Create resume record
      const resume = await storage.createResume({
        userId: req.user!.id,
        fileName: req.file.originalname,
        candidateName: analysis.candidateName,
        candidateEmail: analysis.candidateEmail,
        rawText: text,
        extractedSkills: analysis.skills,
        experience: analysis.experience,
        education: analysis.education,
      });
      
      res.json({
        id: resume._id.toString(),
        fileName: resume.fileName,
        candidateName: resume.candidateName,
        candidateEmail: resume.candidateEmail,
        extractedSkills: resume.extractedSkills,
        experience: resume.experience,
        education: resume.education,
        uploadedAt: resume.uploadedAt
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      res.status(500).json({ message: "Failed to upload resume" });
    }
  });

  app.get("/api/resumes", authMiddleware, async (req, res) => {
    try {
      const resumes = await storage.getResumes(req.user!.id);
      res.json(resumes.map(resume => ({
        id: resume._id.toString(),
        fileName: resume.fileName,
        candidateName: resume.candidateName,
        candidateEmail: resume.candidateEmail,
        extractedSkills: resume.extractedSkills,
        experience: resume.experience,
        education: resume.education,
        uploadedAt: resume.uploadedAt
      })));
    } catch (error) {
      console.error('Get resumes error:', error);
      res.status(500).json({ message: "Failed to get resumes" });
    }
  });

  // Job routes
  app.post("/api/jobs", authMiddleware, async (req, res) => {
    try {
      const { title, company, description, requirements } = req.body as InsertJobPosting;
      
      const job = await storage.createJob({
        userId: req.user!.id,
        title,
        company,
        description,
        requiredSkills: requirements,
      });
      
      res.json({
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        description: job.description,
        requiredSkills: job.requiredSkills,
        createdAt: job.createdAt
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.get("/api/jobs", authMiddleware, async (req, res) => {
    try {
      const jobs = await storage.getJobs(req.user!.id);
      res.json(jobs.map(job => ({
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        description: job.description,
        requiredSkills: job.requiredSkills,
        createdAt: job.createdAt
      })));
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  // Match routes
  app.post("/api/matches", authMiddleware, async (req, res) => {
    try {
      const { resumeId, jobId } = req.body;
      
      const resume = await storage.getResume(resumeId);
      const job = await storage.getJob(jobId);
      
      if (!resume || !job) {
        return res.status(404).json({ message: "Resume or job not found" });
      }
      
      // Generate match analysis
      const matchResult = JobMatcher.calculateMatch(resume, job);
      
      // Create match record
      const match = await storage.createMatch({
        resumeId,
        jobId,
        overallScore: matchResult.overallScore,
        technicalScore: matchResult.technicalScore,
        experienceScore: matchResult.experienceScore,
        culturalScore: matchResult.culturalScore,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        strengths: matchResult.strengths,
        concerns: matchResult.concerns,
        status: 'under_review'
      });
      
      res.json({
        id: match._id.toString(),
        overallScore: match.overallScore,
        technicalScore: match.technicalScore,
        experienceScore: match.experienceScore,
        culturalScore: match.culturalScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        strengths: match.strengths,
        concerns: match.concerns,
        status: match.status,
        createdAt: match.createdAt
      });
    } catch (error) {
      console.error('Create match error:', error);
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  app.get("/api/matches", authMiddleware, async (req, res) => {
    try {
      const matches = await storage.getMatches(req.user!.id);
      res.json(matches.map(match => ({
        id: match._id.toString(),
        overallScore: match.overallScore,
        technicalScore: match.technicalScore,
        experienceScore: match.experienceScore,
        culturalScore: match.culturalScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        strengths: match.strengths,
        concerns: match.concerns,
        status: match.status,
        createdAt: match.createdAt,
        resume: {
          id: match.resume._id.toString(),
          fileName: match.resume.fileName,
          candidateName: match.resume.candidateName,
          candidateEmail: match.resume.candidateEmail,
          extractedSkills: match.resume.extractedSkills
        },
        job: {
          id: match.job._id.toString(),
          title: match.job.title,
          company: match.job.company,
          description: match.job.description,
          requiredSkills: match.job.requiredSkills
        }
      })));
    } catch (error) {
      console.error('Get matches error:', error);
      res.status(500).json({ message: "Failed to get matches" });
    }
  });

  app.patch("/api/matches/:id/status", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const match = await storage.updateMatchStatus(id, status);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json({
        id: match._id.toString(),
        status: match.status
      });
    } catch (error) {
      console.error('Update match status error:', error);
      res.status(500).json({ message: "Failed to update match status" });
    }
  });

  app.delete("/api/matches/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMatch(id);
      res.json({ message: "Match deleted successfully" });
    } catch (error) {
      console.error('Delete match error:', error);
      res.status(500).json({ message: "Failed to delete match" });
    }
  });

  app.get("/api/matches/:id/export", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const match = await storage.getMatch(id);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      // Generate export data
      const exportData = {
        candidateName: match.candidateName || 'Unknown Candidate',
        matchId: match._id.toString(),
        overallScore: match.overallScore,
        technicalScore: match.technicalScore,
        experienceScore: match.experienceScore,
        culturalScore: match.culturalScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        strengths: match.strengths,
        concerns: match.concerns,
        status: match.status,
        exportedAt: new Date().toISOString()
      };
      
      res.json(exportData);
    } catch (error) {
      console.error('Export match error:', error);
      res.status(500).json({ message: "Failed to export match" });
    }
  });

  // Stats route
  app.get("/api/stats", authMiddleware, async (req, res) => {
    try {
      const stats = await storage.getStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}