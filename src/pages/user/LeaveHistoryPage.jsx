import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  History,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  FileText,
  BarChart3
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

// Mock leave history data for the current user
const userLeaveHistory = [
  {
    id: "LR001",
    type: "Annual Leave",
    startDate: "2024-02-15",
    endDate: "2024-02-19",
    days: 5,
    reason: "Family vacation",
    status: "approved",
    appliedDate: "2024-01-15",
    approvedDate: "2024-01-20",
    approver: "John Smith",
    balance: { before: 18, after: 13 }
  },
  {
    id: "LR002", 
    type: "Sick Leave",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    days: 3,
    reason: "Medical treatment",
    status: "approved",
    appliedDate: "2024-01-18",
    approvedDate: "2024-01-19",
    approver: "John Smith",
    balance: { before: 8, after: 5 }
  },
  {
    id: "LR003",
    type: "Personal Leave",
    startDate: "2023-12-28",
    endDate: "2023-12-29", 
    days: 2,
    reason: "Personal matters",
    status: "rejected",
    appliedDate: "2023-12-15",
    rejectedDate: "2023-12-16",
    approver: "John Smith",
    rejectionReason: "Insufficient notice period",
    balance: { before: 5, after: 5 }
  },
  {
    id: "LR004",
    type: "Annual Leave",
    startDate: "2023-11-10",
    endDate: "2023-11-12",
    days: 3,
    reason: "Long weekend break",
    status: "approved",
    appliedDate: "2023-10-15",
    approvedDate: "2023-10-20",
    approver: "John Smith",
    balance: { before: 21, after: 18 }
  },
  {
    id: "LR005",
    type: "Emergency Leave",
    startDate: "2023-09-05",
    endDate: "2023-09-05",
    days: 1,
    reason: "Family emergency",
    status: "pending",
    appliedDate: "2023-09-04",
    approver: "John Smith",
    balance: { before: 3, after: 2 }
  }
]

// Mock user statistics
const userStats = {
  totalRequests: userLeaveHistory.length,
  approvedRequests: userLeaveHistory.filter(req => req.status === 'approved').length,
  rejectedRequests: userLeaveHistory.filter(req => req.status === 'rejected').length,
  pendingRequests: userLeaveHistory.filter(req => req.status === 'pending').length,
  totalDaysApproved: userLeaveHistory.filter(req => req.status === 'approved').reduce((sum, req) => sum + req.days, 0),
  avgProcessingTime: 2.1
}

export default function UserLeaveHistoryPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredHistory = userLeaveHistory.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200"
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved": return CheckCircle
      case "pending": return Clock
      case "rejected": return XCircle
      default: return AlertCircle
    }
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setIsDetailsOpen(true)
  }

  const handleExport = () => {
    toast.success("Your leave history exported successfully!")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Leave History</h1>
          <p className="text-muted-foreground mt-2">
            View all your leave requests and their current status
          </p>
        </div>
        <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export My Records
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-xl font-bold text-foreground">{userStats.totalRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-xl font-bold text-foreground">{userStats.approvedRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 shadow-lg border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold text-foreground">{userStats.rejectedRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-foreground">{userStats.pendingRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Days Taken</p>
                <p className="text-xl font-bold text-foreground">{userStats.totalDaysApproved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Avg. Processing</p>
                <p className="text-xl font-bold text-foreground">{userStats.avgProcessingTime}d</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            My Leave Request History
          </CardTitle>
          <CardDescription>
            All your leave requests with detailed status and approval information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by request ID, type, or reason..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* History Table */}
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Request ID</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((request) => {
                  const StatusIcon = getStatusIcon(request.status)
                  return (
                    <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="font-medium">{request.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.days} day{request.days > 1 ? 's' : ''}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(request.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          to {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(request.status)} flex items-center space-x-1 w-fit`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{request.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(request.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No leave requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your search criteria" 
                  : "You haven't submitted any leave requests yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              Complete information about your leave request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge className={`${getStatusColor(selectedRequest.status)} text-lg px-4 py-2`}>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedRequest.status)
                      return <StatusIcon className="h-5 w-5" />
                    })()}
                    <span className="capitalize">{selectedRequest.status}</span>
                  </div>
                </Badge>
              </div>
              
              {/* Request Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Request ID</Label>
                    <p className="font-medium">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Leave Type</Label>
                    <p className="font-medium">{selectedRequest.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                    <p className="font-medium">{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Applied Date</Label>
                    <p className="font-medium">{new Date(selectedRequest.appliedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                    <p className="font-medium">{new Date(selectedRequest.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                    <p className="font-medium">{new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Approver</Label>
                    <p className="font-medium">{selectedRequest.approver}</p>
                  </div>
                  {selectedRequest.approvedDate && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Approved Date</Label>
                      <p className="font-medium">{new Date(selectedRequest.approvedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedRequest.rejectedDate && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Rejected Date</Label>
                      <p className="font-medium">{new Date(selectedRequest.rejectedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Reason</Label>
                <p className="mt-1 p-3 bg-muted/50 rounded-lg">{selectedRequest.reason}</p>
              </div>

              {/* Rejection Reason */}
              {selectedRequest.rejectionReason && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rejection Reason</Label>
                  <p className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}

              {/* Leave Balance */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <Label className="text-sm font-medium text-muted-foreground">Leave Balance Impact</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Before</p>
                    <p className="text-lg font-bold">{selectedRequest.balance.before}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">→</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">After</p>
                    <p className="text-lg font-bold">{selectedRequest.balance.after}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}