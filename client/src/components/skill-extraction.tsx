import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Wrench } from "lucide-react";

interface SkillExtractionProps {
  resume: any;
}

export default function SkillExtraction({ resume }: SkillExtractionProps) {
  const skills = resume.extractedSkills;
  
  if (!skills) {
    return null;
  }

  const totalSkills = skills.technical.length + skills.soft.length + skills.tools.length;

  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            Extracted Skills
          </h3>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {totalSkills} skills found
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Settings className="h-4 w-4 text-blue-500 mr-2" />
              Technical Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.technical.map((skill: any, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {skill.skill}
                  <span className="ml-1 text-blue-600 font-semibold">{skill.confidence}%</span>
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Users className="h-4 w-4 text-green-500 mr-2" />
              Soft Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.soft.map((skill: any, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  {skill.skill}
                  <span className="ml-1 text-green-600 font-semibold">{skill.confidence}%</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Wrench className="h-4 w-4 text-purple-500 mr-2" />
            Tools & Frameworks
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.tools.map((tool: any, index: number) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-purple-100 text-purple-800 hover:bg-purple-200"
              >
                {tool.skill}
                <span className="ml-1 text-purple-600 font-semibold">{tool.confidence}%</span>
              </Badge>
            ))}
          </div>
        </div>
        
        {resume.candidateName && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Candidate:</span>
                <span className="ml-2 text-gray-900">{resume.candidateName}</span>
              </div>
              {resume.candidateEmail && (
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{resume.candidateEmail}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
