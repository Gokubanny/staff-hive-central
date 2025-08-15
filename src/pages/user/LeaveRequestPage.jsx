import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { 
  Calendar,
  Clock,
  AlertCircle,
  Send,
  RotateCcw,
  Menu,
  FileText,
  User,
  CheckCircle,
  Info,
  Calculator
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const leaveTypes = [
  { 
    id: "annual", 
    name: "Annual Leave", 
    description: "Vacation time for rest and relaxation",
    maxDays: 25,
    minNotice: 7
  },
  { 
    id: "sick", 
    name: "Sick Leave", 
    description: "Medical leave for illness or injury",
    maxDays: 15,
    minNotice: 0
  },
  { 
    id: "personal", 
    name: "Personal Leave", 
    description: "Leave for personal matters",
    maxDays: 5,
    minNotice: 3
  },
  { 
    id: "maternity", 
    name: "Maternity Leave", 
    description: "Leave for childbirth and bonding",
    maxDays: 120,
    minNotice: 30
  },
  { 
    id: "paternity", 
    name: "Paternity Leave", 
    description: "Leave for new fathers",
    maxDays: 14,
    minNotice: 30
  },
  { 
    id: "bereavement", 
    name: "Bereavement Leave", 
    description: "Leave for family loss",
    maxDays: 5,
    minNotice: 0
  },
  { 
    id: "emergency", 
    name: "Emergency Leave", 
    description: "Unforeseen circumstances",
    maxDays: 3,
    minNotice: 0
  },
];

// Mock user data - in real app, this would come from context/API
const mockUser = {
  name: "John Doe",
  employeeId: "EMP001",
  department: "Engineering",
  manager: "Jane Smith",
  leaveBalances: {
    annual: 18,
    sick: 10,
    personal: 5,
    maternity: 120,
    paternity: 14,
    bereavement: 5,
    emergency: 3
  }
};

export default function LeaveRequestPage() {
  const { sidebarOpen, toggleSidebar } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  const form = useForm({
    defaultValues: {
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      emergencyContact: "",
      attachments: null,
      isHalfDay: false,
      workHandover: "",
      managerEmail: ""
    }
  });

  // Calculate leave days when dates change
  useEffect(() => {
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      setCalculatedDays(daysDiff > 0 ? daysDiff : 0);
    } else {
      setCalculatedDays(0);
    }
  }, [form.watch("startDate"), form.watch("endDate")]);

  // Update selected leave type details
  useEffect(() => {
    const leaveType = form.watch("leaveType");
    const type = leaveTypes.find(t => t.id === leaveType);
    setSelectedLeaveType(type);
  }, [form.watch("leaveType")]);

  const handleSubmit = (data) => {
    setIsSubmitting(true);
    
    // Create leave request object
    const leaveRequest = {
      id: Date.now().toString(),
      ...data,
      employeeName: mockUser.name,
      employeeId: mockUser.employeeId,
      department: mockUser.department,
      submissionDate: new Date().toISOString(),
      status: "pending",
      daysRequested: calculatedDays,
      leaveTypeName: leaveTypes.find(t => t.id === data.leaveType)?.name || data.leaveType
    };

    // Save to localStorage (in real app, this would be an API call)
    const existingRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    existingRequests.push(leaveRequest);
    localStorage.setItem('leaveRequests', JSON.stringify(existingRequests));

    setTimeout(() => {
      toast.success("Leave request submitted successfully!", {
        description: `Your ${leaveRequest.leaveTypeName} request for ${calculatedDays} day(s) has been sent for approval.`
      });
      form.reset();
      setIsSubmitting(false);
      setCalculatedDays(0);
      setSelectedLeaveType(null);
    }, 1500);
  };

  const handleReset = () => {
    form.reset();
    setCalculatedDays(0);
    setSelectedLeaveType(null);
    toast.info("Form has been reset");
  };

  const validateLeaveBalance = () => {
    const leaveType = form.watch("leaveType");
    if (leaveType && calculatedDays > 0) {
      const balance = mockUser.leaveBalances[leaveType] || 0;
      return calculatedDays <= balance;
    }
    return true;
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Request Leave</h1>
          <p className="text-muted-foreground mt-2">
            Submit a new leave request for approval
          </p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Information Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="font-medium">{mockUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Employee ID</Label>
                  <p className="font-medium">{mockUser.employeeId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                  <p className="font-medium">{mockUser.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Manager</Label>
                  <p className="font-medium">{mockUser.manager}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Request Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Leave Application Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Leave Type */}
                    <FormField
                      control={form.control}
                      name="leaveType"
                      rules={{ required: "Please select a leave type" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leave Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select leave type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leaveTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  <div>
                                    <div className="font-medium">{type.name}</div>
                                    <div className="text-xs text-muted-foreground">{type.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Manager Email */}
                    <FormField
                      control={form.control}
                      name="managerEmail"
                      rules={{ 
                        required: "Manager email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address"
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager Email *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="manager@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Start Date */}
                    <FormField
                      control={form.control}
                      name="startDate"
                      rules={{ required: "Start date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date *</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* End Date */}
                    <FormField
                      control={form.control}
                      name="endDate"
                      rules={{ required: "End date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date *</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              min={form.watch("startDate") || new Date().toISOString().split('T')[0]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Emergency Contact */}
                    <FormField
                      control={form.control}
                      name="emergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Name and phone number" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Attachments */}
                    <FormField
                      control={form.control}
                      name="attachments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supporting Documents</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              onChange={(e) => field.onChange(e.target.files)}
                              multiple
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Reason */}
                  <FormField
                    control={form.control}
                    name="reason"
                    rules={{ required: "Please provide a reason for your leave" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Leave *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide detailed information about your leave request..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Work Handover */}
                  <FormField
                    control={form.control}
                    name="workHandover"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Handover Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe how your work will be handled during your absence..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Leave Balance Warning */}
                  {!validateLeaveBalance() && calculatedDays > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Insufficient Leave Balance</AlertTitle>
                      <AlertDescription>
                        You are requesting {calculatedDays} day(s) but only have {mockUser.leaveBalances[form.watch("leaveType")] || 0} day(s) remaining for this leave type.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Days Calculation */}
                  {calculatedDays > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <Calculator className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Total Leave Days: {calculatedDays} day{calculatedDays !== 1 ? 's' : ''}
                        </p>
                        {selectedLeaveType && (
                          <p className="text-sm text-blue-700">
                            Remaining balance after this request: {(mockUser.leaveBalances[form.watch("leaveType")] || 0) - calculatedDays} days
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Form
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || (calculatedDays > 0 && !validateLeaveBalance())}
                      className="w-full sm:w-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Leave Balances */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                Leave Balances
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(mockUser.leaveBalances).map(([type, balance]) => {
                const leaveType = leaveTypes.find(t => t.id === type);
                return (
                  <div key={type} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{leaveType?.name || type}</p>
                      <p className="text-xs text-muted-foreground">
                        Max: {leaveType?.maxDays} days
                      </p>
                    </div>
                    <Badge variant={balance > 5 ? "default" : balance > 0 ? "secondary" : "destructive"}>
                      {balance} days
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Selected Leave Type Info */}
          {selectedLeaveType && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Info className="h-5 w-5 mr-2" />
                  Leave Type Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm">{selectedLeaveType.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedLeaveType.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Maximum Days</Label>
                  <p className="text-sm">{selectedLeaveType.maxDays} days per year</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Minimum Notice</Label>
                  <p className="text-sm">
                    {selectedLeaveType.minNotice === 0 ? 'No advance notice required' : `${selectedLeaveType.minNotice} days in advance`}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leave Policy Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2" />
                Policy Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Notes</AlertTitle>
                <AlertDescription className="text-xs space-y-2">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Annual leave requires 7+ days advance notice</li>
                    <li>Medical certificate needed for 3+ consecutive sick days</li>
                    <li>Emergency leave may be approved retroactively</li>
                    <li>Requests processed within 2 business days</li>
                    <li>Unused annual leave expires at year end</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="text-xs text-muted-foreground">
                <p><strong>Need help?</strong></p>
                <p>Contact HR at hr@company.com or ext. 1234</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}