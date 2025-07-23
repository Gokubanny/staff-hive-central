import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Download,
  Search,
  Play,
  CheckCircle,
  Clock,
  Users,
  TrendingUp
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock payroll data
const employees = [
  {
    id: "EMP001",
    name: "Sarah Johnson",
    role: "HR Manager",
    baseSalary: 850000,
    allowances: 150000,
    deductions: 85000,
    netPay: 915000,
    status: "active",
    avatar: null
  },
  {
    id: "EMP002", 
    name: "David Okafor",
    role: "Software Engineer",
    baseSalary: 1200000,
    allowances: 200000,
    deductions: 120000,
    netPay: 1280000,
    status: "active",
    avatar: null
  },
  {
    id: "EMP003",
    name: "Fatimah Abubakar",
    role: "Accountant",
    baseSalary: 750000,
    allowances: 100000,
    deductions: 75000,
    netPay: 775000,
    status: "active",
    avatar: null
  },
  {
    id: "EMP005",
    name: "Adunni Adebayo",
    role: "Business Analyst",
    baseSalary: 900000,
    allowances: 120000,
    deductions: 90000,
    netPay: 930000,
    status: "active",
    avatar: null
  }
]

const payrollHistory = [
  {
    id: "PR001",
    month: "December 2024",
    date: "2024-12-31",
    employees: 4,
    totalAmount: 3900000,
    status: "completed"
  },
  {
    id: "PR002",
    month: "November 2024", 
    date: "2024-11-30",
    employees: 4,
    totalAmount: 3900000,
    status: "completed"
  },
  {
    id: "PR003",
    month: "October 2024",
    date: "2024-10-31", 
    employees: 3,
    totalAmount: 2970000,
    status: "completed"
  }
]

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-success text-success-foreground"
      case "pending": return "bg-warning text-warning-foreground"
      case "draft": return "bg-muted text-muted-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const totalNetPay = filteredEmployees.reduce((sum, emp) => sum + emp.netPay, 0)
  const totalDeductions = filteredEmployees.reduce((sum, emp) => sum + emp.deductions, 0)
  const totalAllowances = filteredEmployees.reduce((sum, emp) => sum + emp.allowances, 0)

  const handleGeneratePayroll = () => {
    console.log("Generating payroll for", filteredEmployees.length, "employees")
    setIsGenerateDialogOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage employee payroll and generate salary payments
          </p>
        </div>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <Play className="h-4 w-4 mr-2" />
              Generate Payroll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Payroll</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will generate payroll for {filteredEmployees.length} active employees for the current month.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Net Pay:</span>
                  <span className="font-medium">{formatCurrency(totalNetPay)}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGeneratePayroll}>
                  Generate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Net Pay</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalNetPay)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Allowances</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAllowances)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Deductions</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalDeductions)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Tabs */}
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Payroll</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Current Month Payroll</CardTitle>
              <CardDescription>
                Review and manage employee salaries for the current period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="default">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Employee</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={employee.avatar || ""} />
                              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {getInitials(employee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(employee.baseSalary)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-success font-medium">+{formatCurrency(employee.allowances)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-destructive font-medium">-{formatCurrency(employee.deductions)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-lg">{formatCurrency(employee.netPay)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Payslip
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>
                View previous payroll runs and download reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Period</TableHead>
                      <TableHead>Date Processed</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollHistory.map((payroll) => (
                      <TableRow key={payroll.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="font-medium">{payroll.month}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(payroll.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{payroll.employees} employees</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(payroll.totalAmount)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payroll.status)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {payroll.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}