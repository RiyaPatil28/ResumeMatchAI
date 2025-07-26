import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, Target, Clock, Download, Filter, Calendar } from "lucide-react";
import { useState } from "react";

interface EnrichedMatch {
  id: string;
  overallScore: number;
  technicalScore: number;
  experienceScore: number;
  culturalScore: number;
  status: "qualified" | "under_review" | "not_qualified";
  createdAt: string;
  resume?: {
    extractedSkills: any;
  };
  job?: {
    title: string;
    company: string;
  };
}

interface DashboardStats {
  totalResumes: number;
  activeJobs: number;
  avgMatchScore: number;
  processingTime: string;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30");

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const { data: matches = [] } = useQuery<EnrichedMatch[]>({
    queryKey: ["/api/matches"],
  });

  // Calculate analytics data
  const statusDistribution = [
    { name: 'Qualified', value: matches.filter(m => m.status === 'qualified').length, color: '#10B981' },
    { name: 'Under Review', value: matches.filter(m => m.status === 'under_review').length, color: '#F59E0B' },
    { name: 'Not Qualified', value: matches.filter(m => m.status === 'not_qualified').length, color: '#EF4444' },
  ];

  const scoreDistribution = [
    { range: '90-100%', count: matches.filter(m => m.overallScore >= 90).length },
    { range: '80-89%', count: matches.filter(m => m.overallScore >= 80 && m.overallScore < 90).length },
    { range: '70-79%', count: matches.filter(m => m.overallScore >= 70 && m.overallScore < 80).length },
    { range: '60-69%', count: matches.filter(m => m.overallScore >= 60 && m.overallScore < 70).length },
    { range: '50-59%', count: matches.filter(m => m.overallScore >= 50 && m.overallScore < 60).length },
    { range: '<50%', count: matches.filter(m => m.overallScore < 50).length },
  ];

  // Extract popular skills from resumes
  const skillsData = matches.reduce((acc: Record<string, number>, match) => {
    if (match.resume?.extractedSkills) {
      const allSkills = [
        ...(match.resume.extractedSkills.technical || []),
        ...(match.resume.extractedSkills.tools || [])
      ];
      allSkills.forEach((skillObj: any) => {
        const skill = skillObj.skill || skillObj;
        acc[skill] = (acc[skill] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const topSkills = Object.entries(skillsData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  // Monthly trends (mock data for now)
  const monthlyTrends = [
    { month: 'Jan', applications: 45, matches: 12, hires: 3 },
    { month: 'Feb', applications: 52, matches: 18, hires: 5 },
    { month: 'Mar', applications: 48, matches: 15, hires: 4 },
    { month: 'Apr', applications: 61, matches: 22, hires: 7 },
    { month: 'May', applications: 55, matches: 19, hires: 6 },
    { month: 'Jun', applications: 67, matches: 25, hires: 8 },
  ];

  const qualifiedRate = matches.length > 0 ? (matches.filter(m => m.status === 'qualified').length / matches.length * 100) : 0;
  const avgScore = matches.length > 0 ? Math.round(matches.reduce((sum, m) => sum + m.overallScore, 0) / matches.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track performance and recruitment insights</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12.5%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualification Rate</p>
                <p className="text-2xl font-bold text-gray-900">{qualifiedRate.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+3.2%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Match Score</p>
                <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">-1.8%</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeJobs || 0}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+5.4%</span>
                </div>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {statusDistribution.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Match Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} name="Applications" />
                  <Line type="monotone" dataKey="matches" stroke="#10B981" strokeWidth={2} name="Matches" />
                  <Line type="monotone" dataKey="hires" stroke="#F59E0B" strokeWidth={2} name="Hires" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Most In-Demand Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSkills.map((skill, index) => (
                <div key={skill.skill} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <Badge variant="secondary">{skill.skill}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(skill.count / Math.max(...topSkills.map(s => s.count))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{skill.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Processing Time</h3>
              <p className="text-2xl font-bold text-blue-600">{stats?.processingTime || '2.3s'}</p>
              <p className="text-sm text-gray-600">Average resume analysis</p>
            </div>
            <div className="text-center">
              <Target className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Best Performing Job</h3>
              <p className="text-lg font-semibold text-green-600">Frontend Developer</p>
              <p className="text-sm text-gray-600">87% average match score</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Improvement</h3>
              <p className="text-2xl font-bold text-purple-600">+23%</p>
              <p className="text-sm text-gray-600">Quality over last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}