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
  Download
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

const ApplicantManagement = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const { toast } = useToast();

  // Fetch applicants data
  useEffect(() => {
    // Replace with actual API call
    const mockApplicants = [
      {
        id: 1,
        name: "Alex Johnson",
        email: "alex.j@example.com",
        phone: "+1 (555) 123-4567",
        position: "Frontend Developer",
        appliedDate: "2024-05-15",
        status: "review",
        resumeUrl: "#",
        coverLetter: "I'm excited to apply for the Frontend Developer position...",
        experience: "3 years React experience"
      },
      // More applicants...
    ];
    setApplicants(mockApplicants);
  }, []);

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  return (
    <div className="space-y-6 ml-64">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Applicant Management</h1>
          <p className="text-muted-foreground">
            Review and manage job applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
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
                        <p className="font-medium">{applicant.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Briefcase className="h-3 w-3" />
                          {applicant.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        applicant.status === 'hired' ? 'default' :
                        applicant.status === 'rejected' ? 'destructive' :
                        applicant.status === 'interview' ? 'secondary' : 'outline'
                      }>
                        {applicant.status}
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
                    <div className="mt-4 pl-16 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </p>
                          <p>{applicant.email}</p>
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
                          <p>{applicant.appliedDate}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium">Cover Letter</p>
                        <p className="text-sm text-muted-foreground">{applicant.coverLetter}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium">Experience</p>
                        <p className="text-sm text-muted-foreground">{applicant.experience}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" asChild>
                          <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                            View Resume
                          </a>
                        </Button>
                        <Select 
                          value={applicant.status} 
                          onValueChange={(value) => handleStatusChange(applicant.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="review">Under Review</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="hired">Hire</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No applicants found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantManagement;