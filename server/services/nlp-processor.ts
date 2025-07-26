export interface ExtractedSkills {
  technical: Array<{ skill: string; confidence: number }>;
  soft: Array<{ skill: string; confidence: number }>;
  tools: Array<{ skill: string; confidence: number }>;
}

export interface ResumeAnalysis {
  skills: ExtractedSkills;
  experience: string;
  education: string;
  candidateName?: string;
  candidateEmail?: string;
}

export class NLPProcessor {
  private static technicalSkills = [
    'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP',
    'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'HTML', 'CSS', 'SCSS', 'SASS', 'Bootstrap',
    'Tailwind', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Laravel',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST', 'API', 'AWS', 'Azure',
    'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git', 'GitHub', 'GitLab', 'Jira',
    'Redux', 'MobX', 'Vuex', 'NextJS', 'NuxtJS', 'Webpack', 'Vite', 'Rollup', 'Jest',
    'Cypress', 'Selenium', 'Testing', 'TDD', 'BDD', 'Microservices', 'Machine Learning',
    'AI', 'Data Science', 'Blockchain', 'DevOps', 'Linux', 'Windows', 'macOS'
  ];

  private static softSkills = [
    'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
    'Creativity', 'Adaptability', 'Time Management', 'Project Management', 'Collaboration',
    'Mentoring', 'Training', 'Presentation', 'Public Speaking', 'Negotiation', 'Conflict Resolution',
    'Analytical', 'Detail Oriented', 'Organized', 'Self Motivated', 'Initiative', 'Innovation'
  ];

  private static tools = [
    'Visual Studio Code', 'IntelliJ', 'Eclipse', 'Sublime Text', 'Atom', 'Vim', 'Emacs',
    'Postman', 'Insomnia', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
    'Slack', 'Microsoft Teams', 'Zoom', 'Trello', 'Asana', 'Notion', 'Confluence',
    'Bitbucket', 'SourceTree', 'Terminal', 'Bash', 'PowerShell', 'Chrome DevTools'
  ];

  static analyzeResume(text: string): ResumeAnalysis {
    const normalizedText = text.toLowerCase();
    
    // Extract candidate information
    const candidateName = this.extractName(text);
    const candidateEmail = this.extractEmail(text);
    
    // Extract skills with confidence scores
    const technicalSkills = this.extractSkillsFromCategory(normalizedText, this.technicalSkills);
    const softSkills = this.extractSkillsFromCategory(normalizedText, this.softSkills);
    const tools = this.extractSkillsFromCategory(normalizedText, this.tools);
    
    // Extract experience and education sections
    const experience = this.extractSection(text, ['experience', 'work', 'employment', 'career']);
    const education = this.extractSection(text, ['education', 'academic', 'degree', 'university', 'college']);

    return {
      skills: {
        technical: technicalSkills,
        soft: softSkills,
        tools: tools
      },
      experience,
      education,
      candidateName,
      candidateEmail
    };
  }

  private static extractSkillsFromCategory(text: string, skillsList: string[]): Array<{ skill: string; confidence: number }> {
    const found: Array<{ skill: string; confidence: number }> = [];
    
    skillsList.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const regex = new RegExp(`\\b${this.escapeRegExp(skillLower)}\\b`, 'gi');
      const matches = text.match(regex);
      
      if (matches) {
        // Calculate confidence based on frequency and context
        const frequency = matches.length;
        const contextBoost = this.getContextBoost(text, skillLower);
        const confidence = Math.min(95, 60 + (frequency * 10) + contextBoost);
        
        found.push({
          skill,
          confidence: Math.round(confidence)
        });
      }
    });
    
    return found.sort((a, b) => b.confidence - a.confidence);
  }

  private static getContextBoost(text: string, skill: string): number {
    const skillContexts = [
      'expert in', 'experienced with', 'proficient in', 'skilled in', 'years of',
      'worked with', 'developed using', 'built with', 'specializes in', 'expertise in'
    ];
    
    let boost = 0;
    skillContexts.forEach(context => {
      const contextRegex = new RegExp(`${context}[^.]*${this.escapeRegExp(skill)}`, 'i');
      if (contextRegex.test(text)) {
        boost += 15;
      }
    });
    
    return Math.min(boost, 30);
  }

  private static extractName(text: string): string | undefined {
    // Simple name extraction - look for patterns at the beginning of the document
    const lines = text.split('\n').slice(0, 5);
    for (const line of lines) {
      const trimmed = line.trim();
      // Look for lines that could be names (2-4 words, proper case)
      const nameMatch = trimmed.match(/^[A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$/);
      if (nameMatch && trimmed.length < 50) {
        return trimmed;
      }
    }
    return undefined;
  }

  private static extractEmail(text: string): string | undefined {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : undefined;
  }

  private static extractSection(text: string, keywords: string[]): string {
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = -1;
    
    // Find section start
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (keywords.some(keyword => line.includes(keyword))) {
        sectionStart = i;
        break;
      }
    }
    
    if (sectionStart === -1) return '';
    
    // Find section end (next major section or end of document)
    const sectionHeaders = ['experience', 'education', 'skills', 'projects', 'certifications', 'awards'];
    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (sectionHeaders.some(header => line.startsWith(header)) && !keywords.includes(line)) {
        sectionEnd = i;
        break;
      }
    }
    
    if (sectionEnd === -1) sectionEnd = lines.length;
    
    return lines.slice(sectionStart, sectionEnd).join('\n').trim();
  }

  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
