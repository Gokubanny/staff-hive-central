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
  DollarSign, 
  Calendar, 
  ArrowLeft,
  Search,
  Play,
  CheckCircle,
  Users,
  FileText
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GeneratePayroll() {
  const { employees, addPayrollRecord } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployees, setSelectedEmployees] = useState(new Set())
  const [isGenerating, setIsGenerating] = useState(false)

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

  const calculatePayslipDetails = (employee) => {
    const baseSalary = employee.salary || 0
    const overtime = 0
    const bonuses = baseSalary * 0.1 // 10% bonus
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

  const handleSelectEmployee = (employeeId) => {
    const newSelected = new Set(selectedEmployees)
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId)
    } else {
      newSelected.add(employeeId)
    }
    setSelectedEmployees(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set())
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.id)))
    }
  }

  const selectedEmployeesList = filteredEmployees.filter(emp => selectedEmployees.has(emp.id))
  const totalNetPay = selectedEmployeesList.reduce((sum, emp) => {
    const details = calculatePayslipDetails(emp)
    return sum + details.netPay
  }, 0)

  const handleGeneratePayroll = async () => {
    if (selectedEmployees.size === 0) {
      toast({
        title: "No employees selected",
        description: "Please select at least one employee to generate payroll.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const currentDate = new Date()
      const period = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
      
      selectedEmployeesList.forEach(employee => {
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
        title: "Payroll Generated Successfully!",
        description: `Generated payroll for ${selectedEmployees.size} employees.`,
      })
      
      // Navigate back to payroll page
      navigate('/dashboard/payroll')
      
    } catch (error) {
      toast({
        title: "Error generating payroll",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8 ml-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Generate Payroll</h1>
          <p className="text-muted-foreground mt-2">
            Select employees and generate their monthly payroll
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/payroll')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payroll
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Selected Employees</p>
                <p className="text-2xl font-bold text-foreground">{selectedEmployees.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalNetPay)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Period</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Selection */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Select Employees</CardTitle>
          <CardDescription>
            Choose employees to include in this payroll generation
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
            <Button 
              variant="outline" 
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {selectedEmployees.size === filteredEmployees.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead className="w-[250px]">Employee</TableHead>
                  <TableHead className="w-[150px]">Base Salary</TableHead>
                  <TableHead className="w-[150px]">Allowances</TableHead>
                  <TableHead className="w-[150px]">Deductions</TableHead>
                  <TableHead className="w-[150px]">Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const details = calculatePayslipDetails(employee)
                  const initials = getInitials(employee.name)
                  const isSelected = selectedEmployees.has(employee.id)
                  
                  return (
                    <TableRow 
                      key={employee.id} 
                      className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                        isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                      onClick={() => handleSelectEmployee(employee.id)}
                    >
                      <TableCell className="w-[50px]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectEmployee(employee.id)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </TableCell>
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
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleGeneratePayroll}
              disabled={selectedEmployees.size === 0 || isGenerating}
              className="bg-gradient-primary hover:opacity-90 transition-opacity flex"
            >
              <Play className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : `Generate Payroll (${selectedEmployees.size})`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

