import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useData } from "@/contexts/DataContext"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Users, 
  Building2, 
  DollarSign, 
  UserCheck, 
  TrendingUp,
  AlertCircle,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
  Plus,
  Loader2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Empty State Component
const EmptyState = ({ message, action }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-muted-foreground mb-4">{message}</p>
    {action && <Button variant="outline">{action}</Button>}
  </div>
);

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Calculate growth percentage between current and previous period
const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export default function Dashboard() {
  const { employees, companies, applicants, payroll, isLoading, refreshData } = useData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);

  // Sample data - replace with your actual data
  const recentActivities = [
    {
      type: "payroll",
      title: "Payroll processed for TechCorp Ltd",
      description: "142 employees • ₦12.4M total",
      time: "2 hours ago",
      status: "completed"
    },
    // ... other activities
  ];

  const alerts = [
    {
      title: "Payroll Due Tomorrow",
      description: "3 companies have payroll due for processing",
      priority: "high",
      action: "Review Payroll"
    },
    // ... other alerts
  ];

  // Verify admin role
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  // Filter activities and alerts based on search
  useEffect(() => {
    setFilteredActivities(
      recentActivities.filter(activity => 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredAlerts(
      alerts.filter(alert => 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  // Calculate dynamic metrics with growth
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const pendingApplicants = applicants.filter(app => ['applied', 'screening', 'interview'].includes(app.stage)).length;
  
  const currentMonthPayroll = payroll
    .filter(pay => {
      const payDate = new Date(pay.processedDate);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear;
    })
    .reduce((total, pay) => total + pay.totalAmount, 0);

  const previousMonthPayroll = payroll
    .filter(pay => {
      const payDate = new Date(pay.processedDate);
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return payDate.getMonth() === date.getMonth() && payDate.getFullYear() === date.getFullYear();
    })
    .reduce((total, pay) => total + pay.totalAmount, 0);

  const payrollGrowth = calculateGrowth(currentMonthPayroll, previousMonthPayroll);
  const employeeGrowth = calculateGrowth(employees.length, employees.length - 10); // Sample previous value

  const metrics = [
    {
      title: "Total Companies",
      value: companies.length.toString(),
      change: `${companies.length} registered`,
      icon: Building2,
      trend: "neutral",
      color: "text-primary",
      growth: 0
    },
    {
      title: "Total Employees",
      value: employees.length.toString(),
      change: `${activeEmployees} active`,
      icon: Users,
      trend: employeeGrowth > 0 ? "up" : employeeGrowth < 0 ? "down" : "neutral",
      color: "text-success",
      growth: employeeGrowth
    },
    {
      title: "Monthly Payroll",
      value: `₦${(currentMonthPayroll / 1000000).toFixed(1)}M`,
      change: `${payroll.length} entries processed`,
      icon: DollarSign,
      trend: payrollGrowth > 0 ? "up" : payrollGrowth < 0 ? "down" : "neutral",
      color: "text-warning",
      growth: payrollGrowth
    },
    {
      title: "Pending Applicants",
      value: pendingApplicants.toString(),
      change: `${applicants.length} total applicants`,
      icon: UserCheck,
      trend: "neutral",
      color: "text-blue-600",
      growth: 0
    }
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 ml-64">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.firstName}! Here's what's happening with your HR operations.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={refreshData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card 
            key={index} 
            className="bg-gradient-card shadow-card border-0 hover:shadow-elevated transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/${metric.title.toLowerCase().replace(' ', '-')}`)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                {metric.trend === "up" ? (
                  <ArrowUp className="h-3 w-3 text-success" />
                ) : metric.trend === "down" ? (
                  <ArrowDown className="h-3 w-3 text-destructive" />
                ) : null}
                <span>
                  {metric.growth !== 0 && `${Math.abs(metric.growth).toFixed(1)}% ${metric.trend === "up" ? 'increase' : 'decrease'}`}
                  {metric.growth === 0 && metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-card border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>
              Latest updates from your HR operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-accent">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState 
                message="No activities found" 
                action={searchQuery ? "Clear search" : "Refresh data"}
              />
            )}
          </CardContent>
        </Card>

        {/* Alerts & Actions */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Alerts & Actions
            </CardTitle>
            <CardDescription>
              Items requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <div key={index} className="space-y-3 p-3 rounded-lg border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    </div>
                    <Badge 
                      variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    {alert.action}
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState message="No alerts found" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-16 flex flex-col gap-2" 
              variant="outline"
              onClick={() => navigate('/employees/new')}
            >
              <Users className="h-5 w-5" />
              <span className="text-sm">Add Employee</span>
            </Button>
            <Button 
              className="h-16 flex flex-col gap-2" 
              variant="outline"
              onClick={() => navigate('/companies/new')}
            >
              <Building2 className="h-5 w-5" />
              <span className="text-sm">Register Company</span>
            </Button>
            <Button 
              className="h-16 flex flex-col gap-2" 
              variant="outline"
              onClick={() => navigate('/payroll/process')}
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">Process Payroll</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { useData } from "@/contexts/DataContext"
// import { useAuth } from "@/contexts/AuthContext"
// import heroImage from "@/assets/hr-hero.jpg"
// import { 
//   Users, 
//   Building2, 
//   DollarSign, 
//   UserCheck, 
//   TrendingUp,
//   AlertCircle,
//   Calendar,
//   Clock
// } from "lucide-react"


// const recentActivities = [
//   {
//     type: "payroll",
//     title: "Payroll processed for TechCorp Ltd",
//     description: "142 employees • ₦12.4M total",
//     time: "2 hours ago",
//     status: "completed"
//   },
//   {
//     type: "employee",
//     title: "New employee onboarded",
//     description: "Sarah Johnson joined as HR Manager",
//     time: "4 hours ago",
//     status: "completed"
//   },
//   {
//     type: "applicant",
//     title: "Interview scheduled",
//     description: "John Doe - Software Engineer position",
//     time: "6 hours ago",
//     status: "pending"
//   },
//   {
//     type: "company",
//     title: "New company registered",
//     description: "Green Energy Solutions Ltd",
//     time: "1 day ago",
//     status: "completed"
//   }
// ]

// const alerts = [
//   {
//     title: "Payroll Due Tomorrow",
//     description: "3 companies have payroll due for processing",
//     priority: "high",
//     action: "Review Payroll"
//   },
//   {
//     title: "Contract Renewals",
//     description: "8 employee contracts expire this month",
//     priority: "medium",
//     action: "View Contracts"
//   },
//   {
//     title: "System Backup",
//     description: "Weekly backup completed successfully",
//     priority: "low",
//     action: "View Report"
//   }
// ]

// export default function Dashboard() {
//   const { employees, companies, applicants, payroll } = useData();
//   const { user } = useAuth();

//   // Calculate dynamic metrics
//   const activeEmployees = employees.filter(emp => emp.status === 'active').length;
//   const pendingApplicants = applicants.filter(app => ['applied', 'screening', 'interview'].includes(app.stage)).length;
//   const currentMonthPayroll = payroll
//     .filter(pay => {
//       const payDate = new Date(pay.processedDate);
//       const currentMonth = new Date().getMonth();
//       const currentYear = new Date().getFullYear();
//       return payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear;
//     })
//     .reduce((total, pay) => total + pay.totalAmount, 0);

//   const metrics = [
//     {
//       title: "Total Companies",
//       value: companies.length.toString(),
//       change: `${companies.length} registered`,
//       icon: Building2,
//       trend: "neutral",
//       color: "text-primary"
//     },
//     {
//       title: "Total Employees",
//       value: employees.length.toString(),
//       change: `${activeEmployees} active`,
//       icon: Users,
//       trend: employees.length > 0 ? "up" : "neutral",
//       color: "text-success"
//     },
//     {
//       title: "Monthly Payroll",
//       value: `₦${(currentMonthPayroll / 1000000).toFixed(1)}M`,
//       change: `${payroll.length} entries processed`,
//       icon: DollarSign,
//       trend: currentMonthPayroll > 0 ? "up" : "neutral",
//       color: "text-warning"
//     },
//     {
//       title: "Pending Applicants",
//       value: pendingApplicants.toString(),
//       change: `${applicants.length} total applicants`,
//       icon: UserCheck,
//       trend: "neutral",
//       color: "text-blue-600"
//     }
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
//         <p className="text-muted-foreground mt-2">
//           Welcome back, {user?.firstName}! Here's what's happening with your HR operations.
//         </p>
//       </div>

//       {/* Metrics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {metrics.map((metric, index) => (
//           <Card key={index} className="bg-gradient-card shadow-card border-0 hover:shadow-elevated transition-all duration-300">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 {metric.title}
//               </CardTitle>
//               <metric.icon className={`h-4 w-4 ${metric.color}`} />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">{metric.value}</div>
//               <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
//                 {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
//                 <span>{metric.change}</span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Activity */}
//         <Card className="lg:col-span-2 shadow-card border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="h-5 w-5 text-primary" />
//               Recent Activity
//             </CardTitle>
//             <CardDescription>
//               Latest updates from your HR operations
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {recentActivities.map((activity, index) => (
//               <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-accent">
//                 <div className={`w-2 h-2 rounded-full mt-2 ${
//                   activity.status === 'completed' ? 'bg-success' : 'bg-warning'
//                 }`} />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-foreground">{activity.title}</p>
//                   <p className="text-xs text-muted-foreground">{activity.description}</p>
//                   <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
//                 </div>
//                 <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
//                   {activity.status}
//                 </Badge>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Alerts & Actions */}
//         <Card className="shadow-card border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-warning" />
//               Alerts & Actions
//             </CardTitle>
//             <CardDescription>
//               Items requiring your attention
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {alerts.map((alert, index) => (
//               <div key={index} className="space-y-3 p-3 rounded-lg border border-border">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
//                     <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
//                   </div>
//                   <Badge 
//                     variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}
//                     className="text-xs"
//                   >
//                     {alert.priority}
//                   </Badge>
//                 </div>
//                 <Button size="sm" variant="outline" className="w-full text-xs">
//                   {alert.action}
//                 </Button>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <Card className="shadow-card border-0">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Calendar className="h-5 w-5 text-primary" />
//             Quick Actions
//           </CardTitle>
//           <CardDescription>
//             Common tasks to get you started
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Button className="h-16 flex flex-col gap-2" variant="outline">
//               <Users className="h-5 w-5" />
//               <span className="text-sm">Add Employee</span>
//             </Button>
//             <Button className="h-16 flex flex-col gap-2" variant="outline">
//               <Building2 className="h-5 w-5" />
//               <span className="text-sm">Register Company</span>
//             </Button>
//             <Button className="h-16 flex flex-col gap-2" variant="outline">
//               <DollarSign className="h-5 w-5" />
//               <span className="text-sm">Process Payroll</span>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }