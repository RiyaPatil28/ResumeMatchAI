import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, CloudUpload, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ResumeUploadProps {
  onResumeUploaded: (resume: any) => void;
}

export default function ResumeUpload({ onResumeUploaded }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await apiRequest('POST', '/api/resumes/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setUploadProgress(100);
      onResumeUploaded(data.resume);
      setRecentUploads(prev => [
        {
          fileName: data.resume.fileName,
          candidateName: data.resume.candidateName,
          uploadedAt: new Date(),
          status: 'processed'
        },
        ...prev.slice(0, 2)
      ]);
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
      toast({
        title: "Resume uploaded successfully",
        description: `Extracted ${Object.values(data.analysis.skills).flat().length} skills from ${data.resume.fileName}`,
      });
      setTimeout(() => setUploadProgress(0), 2000);
    },
    onError: (error: any) => {
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload resume",
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setUploadProgress(10);
    uploadMutation.mutate(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
          <Upload className="mr-2 h-5 w-5 text-primary" />
          Upload Resume
        </h3>
        
        <div className="mt-2">
          <div
            className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
              dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/40'
            } ${uploadMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className="space-y-1 text-center">
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileInputChange}
                    disabled={uploadMutation.isPending}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
            </div>
          </div>
        </div>
        
        {/* Upload Progress */}
        {(uploadMutation.isPending || uploadProgress > 0) && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">
                {uploadMutation.isPending ? "Analyzing resume..." : "Upload complete"}
              </span>
              <span className="text-sm text-gray-700">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
        
        {/* Recent Uploads */}
        {recentUploads.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Uploads</h4>
            <div className="space-y-2">
              {recentUploads.map((upload, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{upload.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {upload.candidateName} • {new Date(upload.uploadedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Processed
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
