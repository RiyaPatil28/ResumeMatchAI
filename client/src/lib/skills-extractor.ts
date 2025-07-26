// Client-side skill extraction utilities for real-time feedback
// This complements the server-side NLP processing
import { useState, useEffect } from 'react';

export interface SkillCategory {
  name: string;
  skills: string[];
  color: string;
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    color: "blue",
    skills: [
      "React", "Vue", "Angular", "JavaScript", "TypeScript", "HTML", "CSS", "SCSS", "SASS",
      "Bootstrap", "Tailwind", "Material-UI", "Styled Components", "Emotion", "NextJS", "NuxtJS",
      "Webpack", "Vite", "Rollup", "Parcel", "ESLint", "Prettier", "Jest", "Cypress", "Testing Library"
    ]
  },
  {
    name: "Backend",
    color: "green",
    skills: [
      "Node.js", "Express", "Koa", "Fastify", "Django", "Flask", "FastAPI", "Spring", "ASP.NET",
      "Laravel", "Ruby on Rails", "Phoenix", "Golang", "Rust", "Python", "Java", "C#", "PHP", "Ruby"
    ]
  },
  {
    name: "Database",
    color: "purple",
    skills: [
      "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Elasticsearch", "DynamoDB",
      "Cassandra", "Neo4j", "InfluxDB", "Prisma", "Mongoose", "Sequelize", "TypeORM", "Drizzle"
    ]
  },
  {
    name: "DevOps",
    color: "orange",
    skills: [
      "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Jenkins", "CircleCI", "GitHub Actions",
      "GitLab CI", "Terraform", "Ansible", "Chef", "Puppet", "Nginx", "Apache", "Linux", "Bash"
    ]
  },
  {
    name: "Mobile",
    color: "pink",
    skills: [
      "React Native", "Flutter", "Swift", "Kotlin", "Java", "Objective-C", "Xamarin",
      "Ionic", "Cordova", "Unity", "Unreal Engine"
    ]
  },
  {
    name: "Data Science",
    color: "indigo",
    skills: [
      "Python", "R", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Keras",
      "Jupyter", "Matplotlib", "Seaborn", "Plotly", "Apache Spark", "Hadoop", "Tableau"
    ]
  }
];

export interface ExtractedSkill {
  skill: string;
  category: string;
  confidence: number;
  context?: string;
}

export class ClientSkillExtractor {
  private static allSkills: Map<string, SkillCategory> = new Map();

  static {
    // Build skill lookup map
    skillCategories.forEach(category => {
      category.skills.forEach(skill => {
        this.allSkills.set(skill.toLowerCase(), category);
      });
    });
  }

  /**
   * Quick client-side skill extraction for immediate feedback
   * This is lighter than server-side processing but less accurate
   */
  static extractSkills(text: string): ExtractedSkill[] {
    if (!text || text.trim().length === 0) {
      return [];
    }

    const normalizedText = text.toLowerCase();
    const found: ExtractedSkill[] = [];
    const skillCounts = new Map<string, number>();

    // Count skill mentions
    this.allSkills.forEach((category, skillKey) => {
      const skill = skillCategories
        .find(cat => cat.name === category.name)
        ?.skills.find(s => s.toLowerCase() === skillKey);
      
      if (!skill) return;

      const regex = new RegExp(`\\b${this.escapeRegExp(skillKey)}\\b`, 'gi');
      const matches = normalizedText.match(regex);
      
      if (matches) {
        skillCounts.set(skill, matches.length);
      }
    });

    // Convert to ExtractedSkill objects with confidence scores
    skillCounts.forEach((count, skill) => {
      const category = this.allSkills.get(skill.toLowerCase());
      if (category) {
        const confidence = Math.min(95, 60 + (count * 15)); // Base 60% + 15% per mention
        found.push({
          skill,
          category: category.name,
          confidence: Math.round(confidence),
          context: this.extractContext(text, skill)
        });
      }
    });

    return found.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get skills by category for display purposes
   */
  static getSkillsByCategory(extractedSkills: ExtractedSkill[]): Record<string, ExtractedSkill[]> {
    const byCategory: Record<string, ExtractedSkill[]> = {};
    
    extractedSkills.forEach(skill => {
      if (!byCategory[skill.category]) {
        byCategory[skill.category] = [];
      }
      byCategory[skill.category].push(skill);
    });

    return byCategory;
  }

  /**
   * Get suggested skills based on existing skills
   */
  static getSuggestedSkills(extractedSkills: ExtractedSkill[]): string[] {
    const suggestions = new Set<string>();
    const foundSkills = new Set(extractedSkills.map(s => s.skill.toLowerCase()));

    // Suggest complementary skills based on found skills
    extractedSkills.forEach(skill => {
      const category = skillCategories.find(cat => cat.name === skill.category);
      if (category) {
        // Add 2-3 related skills from the same category
        category.skills
          .filter(s => !foundSkills.has(s.toLowerCase()))
          .slice(0, 3)
          .forEach(s => suggestions.add(s));
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }

  /**
   * Calculate match percentage between two skill sets
   */
  static calculateSkillMatch(
    candidateSkills: ExtractedSkill[],
    requiredSkills: string[]
  ): number {
    if (requiredSkills.length === 0) return 100;

    const candidateSkillNames = new Set(
      candidateSkills.map(s => s.skill.toLowerCase())
    );

    const matchedCount = requiredSkills.filter(skill =>
      candidateSkillNames.has(skill.toLowerCase())
    ).length;

    return Math.round((matchedCount / requiredSkills.length) * 100);
  }

  /**
   * Validate if a text contains enough content for skill extraction
   */
  static isValidForExtraction(text: string): { valid: boolean; reason?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, reason: "No content provided" };
    }

    if (text.trim().length < 100) {
      return { valid: false, reason: "Content too short for meaningful analysis" };
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 50) {
      return { valid: false, reason: "Content should contain at least 50 words" };
    }

    return { valid: true };
  }

  private static extractContext(text: string, skill: string): string {
    const sentences = text.split(/[.!?]+/);
    const skillLower = skill.toLowerCase();
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(skillLower)) {
        return sentence.trim().slice(0, 100) + "...";
      }
    }
    
    return "";
  }

  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

/**
 * Hook for real-time skill extraction
 */
export function useSkillExtraction(text: string) {
  const [skills, setSkills] = useState<ExtractedSkill[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text && text.length > 50) {
        setIsExtracting(true);
        // Simulate processing delay for better UX
        setTimeout(() => {
          const extracted = ClientSkillExtractor.extractSkills(text);
          setSkills(extracted);
          setIsExtracting(false);
        }, 300);
      } else {
        setSkills([]);
        setIsExtracting(false);
      }
    }, 500); // Debounce

    return () => clearTimeout(timeoutId);
  }, [text]);

  return { skills, isExtracting };
}
