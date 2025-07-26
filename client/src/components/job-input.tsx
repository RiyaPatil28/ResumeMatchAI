import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface JobInputProps {
  onJobCreated: (job: any) => void;
  selectedResume: any;
  onMatchCreated: (match: any) => void;
}

export default function JobInput({ onJobCreated, selectedResume, onMatchCreated }: JobInputProps) {
  const [formData, setFormData] = useState({
    title: "Senior Frontend Developer",
    company: "Tech Corp Inc.",
    description: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: async (jobData: typeof formData) => {
      const response = await apiRequest('POST', '/api/jobs', jobData);
      return response.json();
    },
    onSuccess: (job) => {
      onJobCreated(job);
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Job posting created",
        description: `Created job posting for ${job.title}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create job",
        description: error.message || "Failed to create job posting",
        variant: "destructive",
      });
    },
  });

  const createMatchMutation = useMutation({
    mutationFn: async ({ resumeId, jobId }: { resumeId: string; jobId: string }) => {
      const response = await apiRequest('POST', '/api/matches', { resumeId, jobId });
      return response.json();
    },
    onSuccess: (match) => {
      onMatchCreated(match);
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: "Match analysis complete",
        description: `Overall match score: ${match.overallScore}%`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Matching failed",
        description: error.message || "Failed to perform match analysis",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyzeAndMatch = async () => {
    if (!selectedResume) {
      toast({
        title: "No resume selected",
        description: "Please upload a resume first",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create the job posting
      const job = await createJobMutation.mutateAsync(formData);
      
      // Then create the match
      await createMatchMutation.mutateAsync({
        resumeId: selectedResume.id,
        jobId: job.id
      });
    } catch (error) {
      // Error handling is done in mutation onError callbacks
    }
  };

  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
          <Briefcase className="mr-2 h-5 w-5 text-primary" />
          Job Description
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </Label>
            <Input
              id="job-title"
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="e.g. Tech Corp Inc."
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Describe the role requirements, required skills, experience level, and specific technologies needed for this frontend developer position..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleAnalyzeAndMatch}
            disabled={createJobMutation.isPending || createMatchMutation.isPending || !selectedResume}
            className="w-full"
          >
            <Search className="mr-2 h-4 w-4" />
            {createJobMutation.isPending || createMatchMutation.isPending ? 'Analyzing...' : 'Analyze & Match'}
          </Button>
          
          {!selectedResume && (
            <p className="text-sm text-gray-500 text-center">
              Upload a resume first to enable matching analysis
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
