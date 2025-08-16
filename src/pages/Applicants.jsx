import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  User,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  FileText
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useJobs } from '@/contexts/JobContext';

const ApplicantManagement = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const { toast } = useToast();
  const { jobs, applications } = useJobs(); // Get applications from context

  // Fetch applicants data
  useEffect(() => {
    if (applications && applications.length > 0) {
      setApplicants(applications);
    } else {
      // Mock data for development/testing
      const mockApplicants = [
        {
          id: 1,
          fullName: "Alex Johnson",
          email: "alex.j@example.com",
          phone: "+1 (555) 123-4567",
          jobTitle: "Frontend Developer",
          jobId: "job1",
          appliedDate: "2024-05-15",
          status: "review",
          currentPosition: "Junior Developer at TechCorp",
          experience: "2-3",
          expectedSalary: "$70,000 - $85,000",
          noticePeriod: "2-weeks",
          coverLetter: "I'm excited to apply for the Frontend Developer position. With my 3 years of React experience and passion for creating user-friendly interfaces, I believe I would be a valuable addition to your team. I have worked on several projects involving modern JavaScript frameworks and have a strong understanding of responsive design principles.",
          linkedinProfile: "https://linkedin.com/in/alexjohnson",
          portfolioWebsite: "https://alexjohnson.dev",
          availability: "2024-06-01",
          relocate: "yes",
          additionalInfo: "I am particularly interested in working with React and TypeScript.",
          resumeUrl: "#",
          portfolioUrl: "#"
        },
        {
          id: 2,
          fullName: "Sarah Chen",
          email: "sarah.chen@example.com",
          phone: "+1 (555) 987-6543",
          jobTitle: "UX Designer",
          jobId: "job2",
          appliedDate: "2024-05-18",
          status: "interview",
          currentPosition: "UI/UX Designer at DesignStudio",
          experience: "4-5",
          expectedSalary: "$80,000 - $95,000",
          noticePeriod: "1-month",
          coverLetter: "As a seasoned UX Designer with over 4 years of experience, I am thrilled to apply for the UX Designer position. I have led design projects for mobile and web applications, conducted user research, and collaborated closely with development teams to deliver exceptional user experiences.",
          linkedinProfile: "https://linkedin.com/in/sarahchen",
          portfolioWebsite: "https://sarahchen.design",
          availability: "2024-07-01",
          relocate: "no",
          additionalInfo: "I specialize in user research and prototyping with Figma.",
          resumeUrl: "#",
          portfolioUrl: "#"
        }
      ];
      setApplicants(mockApplicants);
    }
  }, [applications]);

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    const matchesJob = jobFilter === 'all' || applicant.jobId === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setApplicants(applicants.map(app => 
        app.id === applicantId ? { ...app, status: newStatus } : app
      ));
      toast({
        title: "Status Updated",
        description: `Applicant status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Error updating applicant status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'interview':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const uniqueJobs = [...new Set(applicants.map(app => app.jobTitle))];

  return (
    <div className="space-y-6 ml-64">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Applicant Management</h1>
          <p className="text-muted-foreground">
            Review and manage job applications ({filteredApplicants.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Applications
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
            <SelectItem value="interview">Interview Stage</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-[200px]">
            <Briefcase className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {uniqueJobs.map(job => (
              <SelectItem key={job} value={job}>{job}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applicants List */}
      <Card>
        <CardContent className="p-0">
          {filteredApplicants.length > 0 ? (
            <div className="divide-y">
              {filteredApplicants.map(applicant => (
                <div key={applicant.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted p-3 rounded-full">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{applicant.fullName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Briefcase className="h-3 w-3" />
                          Applied for {applicant.jobTitle}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(applicant.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={getStatusColor(applicant.status)}>
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setExpandedId(expandedId === applicant.id ? null : applicant.id)}
                      >
                        {expandedId === applicant.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {expandedId === applicant.id && (
                    <div className="mt-6 pl-16 space-y-6">
                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </p>
                          <p className="break-all">{applicant.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone
                          </p>
                          <p>{applicant.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Applied Date
                          </p>
                          <p>{new Date(applicant.appliedDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="font-medium flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Current Position
                            </p>
                            <p className="text-sm text-muted-foreground">{applicant.currentPosition}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="font-medium flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Experience
                            </p>
                            <p className="text-sm text-muted-foreground">{applicant.experience} years</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="font-medium flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Expected Salary
                            </p>
                            <p className="text-sm text-muted-foreground">{applicant.expectedSalary || 'Not specified'}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="font-medium">Notice Period</p>
                            <p className="text-sm text-muted-foreground">{applicant.noticePeriod || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <div className="space-y-2">
                        <p className="font-medium">Cover Letter</p>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{applicant.coverLetter}</p>
                        </div>
                      </div>

                      {/* Additional Information */}
                      {(applicant.linkedinProfile || applicant.portfolioWebsite || applicant.availability || applicant.relocate) && (
                        <div className="space-y-4">
                          <p className="font-medium">Additional Information</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {applicant.linkedinProfile && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">LinkedIn Profile</p>
                                <a 
                                  href={applicant.linkedinProfile} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  View Profile <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                            {applicant.portfolioWebsite && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Portfolio Website</p>
                                <a 
                                  href={applicant.portfolioWebsite} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  View Portfolio <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                            {applicant.availability && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Availability</p>
                                <p className="text-sm">{new Date(applicant.availability).toLocaleDateString()}</p>
                              </div>
                            )}
                            {applicant.relocate && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Willing to Relocate</p>
                                <p className="text-sm capitalize">{applicant.relocate}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {applicant.additionalInfo && (
                        <div className="space-y-2">
                          <p className="font-medium">Additional Notes</p>
                          <p className="text-sm text-muted-foreground">{applicant.additionalInfo}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Button variant="outline" asChild>
                          <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            View Resume
                          </a>
                        </Button>
                        
                        {applicant.portfolioUrl && (
                          <Button variant="outline" asChild>
                            <a href={applicant.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              View Portfolio
                            </a>
                          </Button>
                        )}
                        
                        <Select 
                          value={applicant.status} 
                          onValueChange={(value) => handleStatusChange(applicant.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="review">Under Review</SelectItem>
                            <SelectItem value="interview">Move to Interview</SelectItem>
                            <SelectItem value="hired">Hire Candidate</SelectItem>
                            <SelectItem value="rejected">Reject Application</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No applicants found</h3>
              <p>No applications match your current search and filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantManagement;