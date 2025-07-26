import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, CheckCircle, AlertTriangle, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MatchResultsProps {
  match: any;
}

export default function MatchResults({ match }: MatchResultsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await apiRequest('PATCH', `/api/matches/${match.id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: "Status updated",
        description: "Candidate status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update candidate status",
        variant: "destructive",
      });
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    return "text-orange-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-blue-600";
    return "bg-orange-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualified":
        return "bg-green-100 text-green-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "not_qualified":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            Match Analysis
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(match.overallScore)}`}>
                {match.overallScore}%
              </div>
              <div className="text-sm text-gray-500">Overall Match</div>
            </div>
            <Badge className={getStatusColor(match.status)}>
              {match.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
        
        {/* Match Breakdown */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Technical Skills Match</span>
              <span className={`text-sm font-semibold ${getScoreColor(match.technicalScore)}`}>
                {match.technicalScore}%
              </span>
            </div>
            <Progress value={match.technicalScore} className="w-full" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Experience Level</span>
              <span className={`text-sm font-semibold ${getScoreColor(match.experienceScore)}`}>
                {match.experienceScore}%
              </span>
            </div>
            <Progress value={match.experienceScore} className="w-full" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Cultural Fit</span>
              <span className={`text-sm font-semibold ${getScoreColor(match.culturalScore)}`}>
                {match.culturalScore}%
              </span>
            </div>
            <Progress value={match.culturalScore} className="w-full" />
          </div>
        </div>
        
        {/* Matched and Missing Skills */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Matched Skills ({match.matchedSkills?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {match.matchedSkills?.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
              Missing Skills ({match.missingSkills?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {match.missingSkills?.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="border-orange-300 text-orange-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Match Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Strengths
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {match.strengths?.map((strength: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-orange-700 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Areas for Review
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {match.concerns?.map((concern: string, index: number) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="h-3 w-3 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => updateStatusMutation.mutate('qualified')}
            disabled={updateStatusMutation.isPending}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add to Pipeline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
