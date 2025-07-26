import { ExtractedSkills } from './nlp-processor.js';
import { type JobPostingType } from '@shared/schema.js';

export interface MatchResult {
  overallScore: number;
  technicalScore: number;
  experienceScore: number;
  culturalScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  concerns: string[];
  status: "qualified" | "under_review" | "not_qualified";
}

export class JobMatcher {
  static analyzeMatch(
    extractedSkills: ExtractedSkills,
    jobPosting: JobPostingType,
    experience: string,
    education: string
  ): MatchResult {
    const jobSkills = jobPosting.requiredSkills || [];
    const allCandidateSkills = [
      ...extractedSkills.technical.map(s => s.skill.toLowerCase()),
      ...extractedSkills.soft.map(s => s.skill.toLowerCase()),
      ...extractedSkills.tools.map(s => s.skill.toLowerCase())
    ];

    // Calculate technical skills match
    const technicalScore = this.calculateTechnicalMatch(extractedSkills, jobSkills);
    
    // Calculate experience level match
    const experienceScore = this.calculateExperienceMatch(experience, jobPosting.description);
    
    // Calculate cultural fit (soft skills + communication indicators)
    const culturalScore = this.calculateCulturalFit(extractedSkills.soft, jobPosting.description);
    
    // Calculate overall score
    const overallScore = Math.round(
      (technicalScore * 0.5) + (experienceScore * 0.3) + (culturalScore * 0.2)
    );
    
    // Find matched and missing skills
    const matchedSkills = jobSkills.filter(skill => 
      allCandidateSkills.includes(skill.toLowerCase())
    );
    
    const missingSkills = jobSkills.filter(skill => 
      !allCandidateSkills.includes(skill.toLowerCase())
    );
    
    // Generate strengths and concerns
    const strengths = this.generateStrengths(extractedSkills, matchedSkills, experience);
    const concerns = this.generateConcerns(missingSkills, experienceScore);
    
    // Determine status
    const status = this.determineStatus(overallScore);
    
    return {
      overallScore,
      technicalScore,
      experienceScore,
      culturalScore,
      matchedSkills,
      missingSkills,
      strengths,
      concerns,
      status
    };
  }

  private static calculateTechnicalMatch(skills: ExtractedSkills, requiredSkills: string[]): number {
    if (requiredSkills.length === 0) return 85; // Default if no specific requirements
    
    const candidateSkills = skills.technical.map(s => s.skill.toLowerCase());
    const matchedCount = requiredSkills.filter(skill => 
      candidateSkills.includes(skill.toLowerCase())
    ).length;
    
    const matchPercentage = (matchedCount / requiredSkills.length) * 100;
    
    // Boost score based on skill confidence levels
    const avgConfidence = skills.technical.length > 0 
      ? skills.technical.reduce((sum, skill) => sum + skill.confidence, 0) / skills.technical.length
      : 0;
    
    const confidenceBoost = (avgConfidence - 60) * 0.3; // Boost based on confidence above 60%
    
    return Math.min(95, Math.round(matchPercentage + confidenceBoost));
  }

  private static calculateExperienceMatch(experience: string, jobDescription: string): number {
    const experienceText = experience.toLowerCase();
    const jobText = jobDescription.toLowerCase();
    
    // Extract years of experience mentioned
    const candidateYears = this.extractYearsOfExperience(experienceText);
    const requiredYears = this.extractYearsOfExperience(jobText);
    
    let experienceScore = 75; // Base score
    
    // Adjust based on years of experience
    if (requiredYears > 0 && candidateYears > 0) {
      if (candidateYears >= requiredYears) {
        experienceScore += 20;
      } else if (candidateYears >= requiredYears * 0.8) {
        experienceScore += 10;
      } else {
        experienceScore -= 15;
      }
    }
    
    // Look for senior/lead indicators
    if (jobText.includes('senior') || jobText.includes('lead')) {
      if (experienceText.includes('senior') || experienceText.includes('lead') || 
          experienceText.includes('architect') || experienceText.includes('principal')) {
        experienceScore += 15;
      } else {
        experienceScore -= 10;
      }
    }
    
    return Math.max(40, Math.min(95, experienceScore));
  }

  private static calculateCulturalFit(softSkills: Array<{ skill: string; confidence: number }>, jobDescription: string): number {
    const jobText = jobDescription.toLowerCase();
    let culturalScore = 70; // Base score
    
    // Look for specific soft skill mentions in job description
    const importantSoftSkills = ['leadership', 'communication', 'teamwork', 'collaboration'];
    
    importantSoftSkills.forEach(skill => {
      if (jobText.includes(skill)) {
        const candidateHasSkill = softSkills.some(s => 
          s.skill.toLowerCase().includes(skill) && s.confidence > 70
        );
        if (candidateHasSkill) {
          culturalScore += 8;
        } else {
          culturalScore -= 5;
        }
      }
    });
    
    // Boost for having any soft skills
    if (softSkills.length > 0) {
      culturalScore += Math.min(15, softSkills.length * 3);
    }
    
    return Math.max(50, Math.min(95, culturalScore));
  }

  private static extractYearsOfExperience(text: string): number {
    const yearPatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/,
      /(\d+)\+?\s*years?\s*in/,
      /(\d+)\+?\s*years?\s*with/,
      /experience\s*of\s*(\d+)\+?\s*years?/
    ];
    
    for (const pattern of yearPatterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    
    return 0;
  }

  private static generateStrengths(
    skills: ExtractedSkills, 
    matchedSkills: string[], 
    experience: string
  ): string[] {
    const strengths: string[] = [];
    
    // Top technical skills
    const topTechnicalSkills = skills.technical
      .filter(s => s.confidence > 85)
      .slice(0, 3);
    
    if (topTechnicalSkills.length > 0) {
      strengths.push(`Strong ${topTechnicalSkills.map(s => s.skill).join(', ')} experience`);
    }
    
    // Matched required skills
    if (matchedSkills.length > 0) {
      strengths.push(`Meets ${matchedSkills.length} key requirements: ${matchedSkills.slice(0, 3).join(', ')}`);
    }
    
    // Experience indicators
    const experienceText = experience.toLowerCase();
    if (experienceText.includes('senior') || experienceText.includes('lead')) {
      strengths.push('Demonstrates senior-level experience and leadership');
    }
    
    // Testing and best practices
    const testingSkills = skills.technical.filter(s => 
      ['jest', 'testing', 'cypress', 'selenium'].includes(s.skill.toLowerCase())
    );
    if (testingSkills.length > 0) {
      strengths.push('Strong testing and quality assurance background');
    }
    
    return strengths.slice(0, 4);
  }

  private static generateConcerns(missingSkills: string[], experienceScore: number): string[] {
    const concerns: string[] = [];
    
    // Missing critical skills
    if (missingSkills.length > 0) {
      concerns.push(`Missing experience with: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    // Experience level concerns
    if (experienceScore < 70) {
      concerns.push('May not meet the required experience level for this role');
    }
    
    // Common concerns based on missing skills
    const criticalSkills = ['react', 'typescript', 'javascript'];
    const missingCritical = missingSkills.filter(skill => 
      criticalSkills.includes(skill.toLowerCase())
    );
    
    if (missingCritical.length > 0) {
      concerns.push('Lacks core frontend development skills');
    }
    
    return concerns.slice(0, 3);
  }

  private static determineStatus(overallScore: number): "qualified" | "under_review" | "not_qualified" {
    if (overallScore >= 80) return "qualified";
    if (overallScore >= 60) return "under_review";
    return "not_qualified";
  }
}
