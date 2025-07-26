import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  HelpCircle, 
  Send, 
  Book, 
  Mail, 
  Phone, 
  MessageCircle,
  FileText,
  Shield,
  Zap,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const supportSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Please select a category"),
  priority: z.string().min(1, "Please select priority level"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachments: z.any().optional(),
});

type SupportFormData = z.infer<typeof supportSchema>;

const faqs = [
  {
    question: "How do I upload a resume?",
    answer: "To upload a resume, go to the Dashboard page and click on the 'Upload Resume' button. You can drag and drop PDF or DOCX files, or click to browse and select a file from your computer. The system will automatically extract and analyze the content."
  },
  {
    question: "How does the matching algorithm work?",
    answer: "Our AI-powered matching algorithm analyzes resumes and job postings to calculate compatibility scores based on technical skills (50%), experience level (30%), and cultural fit (20%). The system identifies matched skills, missing requirements, and provides detailed insights for each candidate."
  },
  {
    question: "Can I edit job postings after creating them?",
    answer: "Yes, you can edit job postings from the Job Postings page. Click on the three-dot menu next to any job posting and select 'Edit' to modify the title, description, requirements, or other details."
  },
  {
    question: "How do I export candidate data?",
    answer: "You can export candidate data in several ways: use the 'Export Report' option in the candidate table for individual reports, or use the 'Export Results' button on the Dashboard for bulk exports. Data is available in PDF and CSV formats."
  },
  {
    question: "What file formats are supported for resumes?",
    answer: "We support PDF and DOCX (Microsoft Word) file formats. Files should be under 10MB in size for optimal processing. Make sure the resume text is selectable (not scanned images) for best results."
  },
  {
    question: "How can I improve matching accuracy?",
    answer: "To improve matching accuracy: 1) Ensure job descriptions include specific technical requirements, 2) Use detailed skill lists, 3) Upload high-quality resumes with clear formatting, and 4) Review and refine job requirements based on matching results."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All data is encrypted in transit and at rest, we follow industry best practices for data protection, and we never share your data with third parties without explicit consent."
  },
  {
    question: "How do I manage notifications?",
    answer: "You can manage all notification preferences in Account Settings. Choose which types of notifications you want to receive via email, push notifications, or SMS, and customize the frequency of updates."
  }
];

export default function Support() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      subject: "",
      category: "",
      priority: "",
      message: "",
    },
  });

  const onSubmit = async (data: SupportFormData) => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Support ticket created",
        description: "We've received your message and will respond within 24 hours",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Failed to submit support request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Get help with ResumeMatch AI or contact our support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Methods */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Email Support</p>
                  <p className="text-xs text-gray-600">support@resumematch.ai</p>
                  <p className="text-xs text-gray-500">Response in 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Live Chat</p>
                  <p className="text-xs text-gray-600">Available 9 AM - 6 PM EST</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Online
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Phone Support</p>
                  <p className="text-xs text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-500">Business hours only</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Zap className="mr-2 h-4 w-4" />
                API Reference
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Community Forum
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Privacy Policy
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Request</CardTitle>
              <p className="text-sm text-gray-600">Describe your issue and we'll get back to you soon</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of your issue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="account">Account & Billing</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                              <SelectItem value="bug">Bug Report</SelectItem>
                              <SelectItem value="general">General Question</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your issue in detail..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}