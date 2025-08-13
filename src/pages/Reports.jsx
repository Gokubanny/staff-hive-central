import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"

export default function Reports() {
  return (
    <div className="p-6 space-y-6 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analytics and insights for your HR operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Headcount, turnover, and performance analytics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payroll Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Salary breakdowns and payroll summaries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recruitment Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Hiring metrics and applicant analytics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Custom Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Build your own reports and dashboards</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}