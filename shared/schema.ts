import mongoose, { Schema, Document } from 'mongoose';

// User schema for MongoDB
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  role: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  company: { type: String },
  role: { type: String, default: 'recruiter' },
  profileImageUrl: { type: String },
}, {
  timestamps: true
});

// Resume schema
export interface IResume extends Document {
  _id: string;
  userId: string;
  fileName: string;
  candidateName?: string;
  candidateEmail?: string;
  rawText: string;
  extractedSkills: {
    technical: Array<{ skill: string; confidence: number }>;
    soft: Array<{ skill: string; confidence: number }>;
    tools: Array<{ skill: string; confidence: number }>;
  };
  experience?: string;
  education?: string;
  uploadedAt: Date;
}

const resumeSchema = new Schema<IResume>({
  userId: { type: String, required: true, index: true },
  fileName: { type: String, required: true },
  candidateName: { type: String },
  candidateEmail: { type: String },
  rawText: { type: String, required: true },
  extractedSkills: {
    technical: [{ skill: String, confidence: Number }],
    soft: [{ skill: String, confidence: Number }],
    tools: [{ skill: String, confidence: Number }]
  },
  experience: { type: String },
  education: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

// Job Posting schema
export interface IJobPosting extends Document {
  _id: string;
  userId: string;
  title: string;
  company: string;
  description: string;
  requiredSkills?: string[];
  createdAt: Date;
}

const jobPostingSchema = new Schema<IJobPosting>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Match schema
export interface IMatch extends Document {
  _id: string;
  resumeId: string;
  jobId: string;
  overallScore: number;
  technicalScore: number;
  experienceScore: number;
  culturalScore: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  strengths?: string[];
  concerns?: string[];
  status: 'qualified' | 'under_review' | 'not_qualified';
  createdAt: Date;
}

const matchSchema = new Schema<IMatch>({
  resumeId: { type: String, required: true },
  jobId: { type: String, required: true },
  overallScore: { type: Number, required: true },
  technicalScore: { type: Number, required: true },
  experienceScore: { type: Number, required: true },
  culturalScore: { type: Number, required: true },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  strengths: [{ type: String }],
  concerns: [{ type: String }],
  status: { 
    type: String, 
    enum: ['qualified', 'under_review', 'not_qualified'], 
    default: 'under_review' 
  },
  createdAt: { type: Date, default: Date.now }
});

// Create models
export const User = mongoose.model<IUser>('User', userSchema);
export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
export const JobPosting = mongoose.model<IJobPosting>('JobPosting', jobPostingSchema);
export const Match = mongoose.model<IMatch>('Match', matchSchema);

// Type exports for compatibility
export type UserType = IUser;
export type ResumeType = IResume;
export type JobPostingType = IJobPosting;
export type MatchType = IMatch;

export type InsertUser = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: string;
  profileImageUrl?: string;
};

export type InsertResume = {
  userId: string;
  fileName: string;
  candidateName?: string;
  candidateEmail?: string;
  rawText: string;
  extractedSkills?: {
    technical: Array<{ skill: string; confidence: number }>;
    soft: Array<{ skill: string; confidence: number }>;
    tools: Array<{ skill: string; confidence: number }>;
  };
  experience?: string;
  education?: string;
};

export type InsertJobPosting = {
  userId: string;
  title: string;
  company: string;
  description: string;
  requiredSkills?: string[];
};

export type InsertMatch = {
  resumeId: string;
  jobId: string;
  overallScore: number;
  technicalScore: number;
  experienceScore: number;
  culturalScore: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  strengths?: string[];
  concerns?: string[];
  status?: 'qualified' | 'under_review' | 'not_qualified';
};