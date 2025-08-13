import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useData } from "@/contexts/DataContext"
import { useAuth } from "@/contexts/AuthContext"
import { 
  User,
  Clock,
  CalendarDays,
  Wallet,
  FileText,
  Bell,
  ArrowUpRight,
  Loader2,
  ChevronRight,
  Briefcase,
  Send,
  RefreshCw
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Components
const EmptyState = ({ message, icon: Icon, action }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
    <Icon className="h-8 w-8 mb-4" />
    <p>{message}</p>
    {action && <Button variant="outline" className="mt-4">{action}</Button>}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function UserDashboard() {
  const { userData, isLoading, refreshData } = useData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [openJobs, setOpenJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationText, setApplicationText] = useState('');

  // Sample data - replace with actual API calls
  useEffect(() => {
    if (userData) {
      setUpcomingItems([
        {
          type: "leave",
          title: "Pending Leave Request",
          date: "Starts tomorrow",
          status: "pending",
          action: "View"
        },
        {
          type: "payroll",
          title: "Payslip Available",
          date: "March 2024",
          status: "completed",
          action: "Download"
        },
        {
          type: "training",
          title: "Mandatory Training",
          date: "Due in 3 days",
          status: "upcoming",
          action: "Start"
        }
      ]);

      // Fetch open positions
      fetchOpenJobs();
    }
  }, [userData]);

  const fetchOpenJobs = async () => {
    // Replace with actual API call
    const jobs = [
      { id: 1, title: "Frontend Developer", department: "Engineering" },
      { id: 2, title: "HR Specialist", department: "Human Resources" },
      { id: 3, title: "Sales Executive", department: "Business Development" }
    ];
    setOpenJobs(jobs);
  };

  const handleApplicationSubmit = async () => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Application Submitted!",
        description: `Your application for ${selectedJob.title} has been sent to HR.`,
      });
      setSelectedJob(null);
      setApplicationText('');
      fetchOpenJobs(); // Refresh job list
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Error submitting application. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.firstName}! Here's your personal overview.
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Leave Balance</CardDescription>
            <CardTitle className="text-2xl">18 days</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/leave-request')}>
              Request Leave <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Next Payday</CardDescription>
            <CardTitle className="text-2xl">May 28, 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/payroll')}>
              View Payslips <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Performance</CardDescription>
            <CardTitle className="text-2xl">4.8/5.0</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/performance')}>
              View Details <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Open Positions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Open Positions
          </CardTitle>
          <CardDescription>Apply for internal opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {openJobs.length > 0 ? (
            openJobs.map(job => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedJob(job)}
                    >
                      Apply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for {job?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Why are you interested in this position? Mention relevant skills and experience..."
                        value={applicationText}
                        onChange={(e) => setApplicationText(e.target.value)}
                        rows={6}
                      />
                      <Button 
                        onClick={handleApplicationSubmit}
                        disabled={!applicationText.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Application
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))
          ) : (
            <EmptyState 
              message="No open positions currently" 
              icon={Briefcase}
              action="Check Back Later"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <CardTitle>Upcoming & Actions</CardTitle>
            </div>
            <CardDescription>Your pending items and deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingItems.length > 0 ? (
              upcomingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'leave' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'payroll' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {item.type === 'leave' ? <Clock className="h-5 w-5" /> :
                       item.type === 'payroll' ? <Wallet className="h-5 w-5" /> :
                       <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      item.status === 'pending' ? 'secondary' :
                      item.status === 'completed' ? 'default' : 'outline'
                    }>
                      {item.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      {item.action}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState 
                message="Nothing upcoming right now" 
                icon={CalendarDays}
              />
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Bell className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-medium">System Maintenance</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 2:00 AM - 4:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Bell className="h-4 w-4 mt-0.5 text-green-600" />
                <div>
                  <p className="font-medium">New Policy Update</p>
                  <p className="text-sm text-muted-foreground">HR Handbook v2.3 released</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate('/documents')}
            >
              <FileText className="h-6 w-6" />
              <span>Documents</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate('/benefits')}
            >
              <Wallet className="h-6 w-6" />
              <span>Benefits</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate('/training')}
            >
              <FileText className="h-6 w-6" />
              <span>Training</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2"
              onClick={() => navigate('/profile')}
            >
              <User className="h-6 w-6" />
              <span>My Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}