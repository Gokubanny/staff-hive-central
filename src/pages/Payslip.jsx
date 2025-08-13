import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useData } from "@/contexts/DataContext"
import { 
  ArrowLeft,
  Download,
  Calendar,
  DollarSign,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText
} from "lucide-react"

export default function Payslip() {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const { employees } = useData()
  
  const employee = employees.find(emp => emp.id === employeeId)
  
  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Employee Not Found</h2>
          <Button onClick={() => navigate('/dashboard/payroll')}>
            Back to Payroll
          </Button>
        </Card>
      </div>
    )
  }

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

  const details = calculatePayslipDetails(employee)
  const currentDate = new Date()
  const period = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/payroll')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Payroll
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Payslip Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Staff Hive Central</CardTitle>
                <p className="text-blue-100 mt-1">Employee Payslip</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100">Pay Period</p>
                <p className="text-xl font-semibold">{period}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Employee Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Company:</strong> Staff Hive Central</p>
                  <p><strong>Address:</strong> Lagos, Nigeria</p>
                  <p><strong>Phone:</strong> +234 800 123 4567</p>
                  <p><strong>Email:</strong> hr@staffhivecentral.com</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Employee Information</h3>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={employee.avatar || ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium text-lg">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Employee ID:</strong> EMP-{employee.id}</p>
                    <p><strong>Position:</strong> {employee.position}</p>
                    <p><strong>Department:</strong> {employee.department || 'General'}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    {employee.phone && <p><strong>Phone:</strong> {employee.phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Breakdown
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Earnings */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-4 text-lg">Earnings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Base Salary</span>
                      <span className="font-medium">{formatCurrency(details.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Overtime</span>
                      <span className="font-medium">{formatCurrency(details.overtime)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Bonuses & Allowances</span>
                      <span className="font-medium text-green-600">{formatCurrency(details.bonuses)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-green-200 bg-green-50 px-4 rounded-lg">
                      <span className="font-semibold">Total Earnings</span>
                      <span className="font-bold text-green-700">{formatCurrency(details.baseSalary + details.overtime + details.bonuses)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-semibold text-red-700 mb-4 text-lg">Deductions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Income Tax (7.5%)</span>
                      <span className="font-medium text-red-600">-{formatCurrency(details.taxDeduction)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Pension (8%)</span>
                      <span className="font-medium text-red-600">-{formatCurrency(details.pensionDeduction)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Other Deductions</span>
                      <span className="font-medium text-red-600">-{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-red-200 bg-red-50 px-4 rounded-lg">
                      <span className="font-semibold">Total Deductions</span>
                      <span className="font-bold text-red-700">-{formatCurrency(details.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900">Net Pay</h3>
                    <p className="text-blue-700">Amount to be paid</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-900">{formatCurrency(details.netPay)}</p>
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {currentDate.toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
              <p>This is a computer-generated payslip and does not require a signature.</p>
              <p className="mt-2">For any queries, please contact HR at hr@staffhivecentral.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}