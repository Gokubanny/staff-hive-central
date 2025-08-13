import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useData } from "@/contexts/DataContext"
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
  TrendingUp,
  Eye
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function Payroll() {
  const { employees, payroll, addPayrollRecord } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isPayslipDialogOpen, setIsPayslipDialogOpen] = useState(false)

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-success text-success-foreground"
      case "pending": return "bg-warning text-warning-foreground"
      case "draft": return "bg-muted text-muted-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const totalNetPay = filteredEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0)

  const calculatePayslipDetails = (employee) => {
    const baseSalary = employee.salary || 0
    const overtime = 0 // You can add overtime calculation logic
    const bonuses = baseSalary * 0.1 // 10% bonus example
    const taxDeduction = baseSalary * 0.075 // 7.5% tax
    const pensionDeduction = baseSalary * 0.08 // 8% pension
    const totalDeductions = taxDeduction + pensionDeduction
    const netPay = baseSalary + overtime + bonuses - totalDeductions

    return {
      baseSalary,
      overtime,
      bonuses,
      taxDeduction,
      pensionDeduction,
      totalDeductions,
      netPay
    }
  }

  const handleGeneratePayroll = () => {
    const currentDate = new Date()
    const period = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    
    filteredEmployees.forEach(employee => {
      const payslipDetails = calculatePayslipDetails(employee)
      const payrollRecord = {
        id: `${employee.id}-${Date.now()}`,
        employeeId: employee.id,
        employeeName: employee.name,
        baseSalary: payslipDetails.baseSalary,
        overtime: payslipDetails.overtime,
        bonuses: payslipDetails.bonuses,
        deductions: payslipDetails.totalDeductions,
        totalAmount: payslipDetails.netPay,
        processedDate: currentDate.toISOString().split('T')[0],
        period: period,
        status: 'completed'
      }
      addPayrollRecord(payrollRecord)
    })

    toast({
      title: "Payroll Generated",
      description: `Successfully generated payroll for ${filteredEmployees.length} employees.`,
    })
    
    setIsGenerateDialogOpen(false)
  }

  const handleViewPayslip = (employee) => {
    setSelectedEmployee(employee)
    setIsPayslipDialogOpen(true)
  }

  return (
    <div className="space-y-8 ml-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage employee payroll and generate salary payments
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/generate-payroll')}
          className="flex bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <Play className="h-4 w-4 mr-2" />
          Generate Payroll
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalNetPay)}</p>
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
                <Button variant="outline" size="default" className="flex">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[250px] text-muted-foreground font-medium">Employee</TableHead>
                      <TableHead className="w-[150px] text-muted-foreground font-medium">Base Salary</TableHead>
                      <TableHead className="w-[150px] text-muted-foreground font-medium">Allowances</TableHead>
                      <TableHead className="w-[150px] text-muted-foreground font-medium">Deductions</TableHead>
                      <TableHead className="w-[150px] text-muted-foreground font-medium">Net Pay</TableHead>
                      <TableHead className="w-[120px] text-muted-foreground font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => {
                      const details = calculatePayslipDetails(employee)
                      const initials = getInitials(employee.name)
                      
                      return (
                        <TableRow key={employee.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="w-[250px]">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-medium text-sm">{initials}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-foreground">{employee.name}</div>
                                <div className="text-sm text-muted-foreground">{employee.position}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-[150px]">
                            <div className="font-medium">{formatCurrency(details.baseSalary)}</div>
                          </TableCell>
                          <TableCell className="w-[150px]">
                            <div className="font-medium text-green-600">+{formatCurrency(details.bonuses)}</div>
                          </TableCell>
                          <TableCell className="w-[150px]">
                            <div className="font-medium text-red-600">-{formatCurrency(details.totalDeductions)}</div>
                          </TableCell>
                          <TableCell className="w-[150px]">
                            <div className="font-bold text-lg">{formatCurrency(details.netPay)}</div>
                          </TableCell>
                          <TableCell className="w-[120px] text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/dashboard/payslip/${employee.id}`)}
                              className="flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              Payslip
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
                      <TableHead className="w-[200px]">Employee</TableHead>
                      <TableHead className="w-[150px]">Period</TableHead>
                      <TableHead className="w-[120px] text-right">Total Amount</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payroll.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="w-[200px]">
                          <div className="font-medium truncate">{record.employeeName}</div>
                        </TableCell>
                        <TableCell className="w-[150px]">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{record.period}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[120px] text-right">
                          <div className="font-medium">{formatCurrency(record.totalAmount)}</div>
                        </TableCell>
                        <TableCell className="w-[100px]">
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </TableCell>
                        <TableCell className="w-[100px] text-right">
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

      {/* Payslip Dialog */}
      <Dialog open={isPayslipDialogOpen} onOpenChange={setIsPayslipDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Payslip</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Employee Info */}
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedEmployee.avatar || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {getInitials(selectedEmployee.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-muted-foreground">{selectedEmployee.position}</p>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.department}</p>
                </div>
              </div>

              {/* Payslip Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Payment Details</h4>
                
                {(() => {
                  const details = calculatePayslipDetails(selectedEmployee)
                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span>Base Salary</span>
                        <span className="font-medium">{formatCurrency(details.baseSalary)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Overtime</span>
                        <span className="font-medium">{formatCurrency(details.overtime)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Bonuses</span>
                        <span className="font-medium text-green-600">{formatCurrency(details.bonuses)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Tax Deduction (7.5%)</span>
                        <span className="font-medium text-red-600">-{formatCurrency(details.taxDeduction)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Pension Deduction (8%)</span>
                        <span className="font-medium text-red-600">-{formatCurrency(details.pensionDeduction)}</span>
                      </div>
                      <div className="flex justify-between py-3 border-t-2 border-primary/20 bg-primary/5 px-4 rounded-lg">
                        <span className="font-semibold text-lg">Net Pay</span>
                        <span className="font-bold text-lg text-primary">{formatCurrency(details.netPay)}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsPayslipDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
