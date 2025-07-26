import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Filter, MoreVertical, Trash2, Mail, Download, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CandidateTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matches = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/matches"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ matchId, status }: { matchId: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/matches/${matchId}/status`, { status });
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

  const deleteMatchMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const response = await apiRequest('DELETE', `/api/matches/${matchId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Candidate removed",
        description: "Candidate has been removed from pipeline",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to remove candidate",
        variant: "destructive",
      });
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: async ({ matchId, action }: { matchId: string; action: 'qualified' | 'not_qualified' }) => {
      const response = await apiRequest('POST', `/api/matches/${matchId}/email`, { action });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email sent",
        description: "Notification email has been sent to the candidate",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Email failed", 
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
    },
  });

  const exportReportMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const response = await apiRequest('GET', `/api/matches/${matchId}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `candidate-report-${matchId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Report exported",
        description: "Candidate report has been downloaded",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export report",
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

  const getAvatarColor = (name: string) => {
    const colors = ['bg-primary', 'bg-purple-500', 'bg-green-500', 'bg-blue-500', 'bg-orange-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Candidate Pipeline
            </h3>
          </div>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload a resume and create a job posting to start matching candidates.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Candidate Pipeline
          </h3>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="backend">Backend Developer</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Candidates Table */}
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(match.resume.candidateName || 'Unknown Candidate')}`}>
                        {getInitials(match.resume.candidateName || 'Unknown Candidate')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {match.resume.candidateName || 'Unknown Candidate'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {match.resume.candidateEmail || 'hello@reallygreatsite.com'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{match.job.title}</div>
                    <div className="text-sm text-gray-500">{match.job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 mr-2">
                        <Progress value={match.overallScore} className="h-2" />
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(match.overallScore)}`}>
                        {match.overallScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select 
                      value={match.status} 
                      onValueChange={(status) => updateStatusMutation.mutate({ matchId: match.id, status })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <Badge className={getStatusColor(match.status)}>
                            {match.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qualified">
                          <Badge className="bg-green-100 text-green-800">QUALIFIED</Badge>
                        </SelectItem>
                        <SelectItem value="under_review">
                          <Badge className="bg-yellow-100 text-yellow-800">UNDER REVIEW</Badge>
                        </SelectItem>
                        <SelectItem value="not_qualified">
                          <Badge className="bg-red-100 text-red-800">NOT QUALIFIED</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => sendEmailMutation.mutate({ matchId: match.id, action: 'qualified' })}
                          disabled={sendEmailMutation.isPending}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => exportReportMutation.mutate(match.id)}
                          disabled={exportReportMutation.isPending}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Report
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteMatchMutation.mutate(match.id)}
                          disabled={deleteMatchMutation.isPending}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{matches.length}</span> of{' '}
            <span className="font-medium">{matches.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
