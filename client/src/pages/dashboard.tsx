import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, TrendingUp, Clock, Plus, Download } from "lucide-react";
import ResumeUpload from "@/components/resume-upload";
import JobInput from "@/components/job-input";
import SkillExtraction from "@/components/skill-extraction";
import MatchResults from "@/components/match-results";
import CandidateTable from "@/components/candidate-table";

interface DashboardStats {
  totalResumes: number;
  activeJobs: number;
  avgMatchScore: number;
  processingTime: string;
}

export default function Dashboard() {
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [currentMatch, setCurrentMatch] = useState<any>(null);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const handleResumeUploaded = (resume: any) => {
    setSelectedResume(resume);
  };

  const handleJobCreated = (job: any) => {
    setSelectedJob(job);
  };

  const handleMatchCreated = (match: any) => {
    setCurrentMatch(match);
  };

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Resume Analysis Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Upload resumes and match them with job descriptions using AI-powered analysis
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button variant="outline" className="mr-3">
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Job Posting
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Resumes</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statsLoading ? "..." : stats?.totalResumes || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statsLoading ? "..." : stats?.activeJobs || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Match Score</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statsLoading ? "..." : `${stats?.avgMatchScore || 0}%`}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Processing Time</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statsLoading ? "..." : stats?.processingTime || "N/A"}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload and Job Input */}
          <div className="lg:col-span-1 space-y-6">
            <ResumeUpload onResumeUploaded={handleResumeUploaded} />
            <JobInput 
              onJobCreated={handleJobCreated}
              selectedResume={selectedResume}
              onMatchCreated={handleMatchCreated}
            />
          </div>

          {/* Right Column: Results and Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {selectedResume && (
              <SkillExtraction resume={selectedResume} />
            )}
            
            {currentMatch && (
              <MatchResults match={currentMatch} />
            )}
            
            <CandidateTable />
          </div>
        </div>
      </div>
    );
}
