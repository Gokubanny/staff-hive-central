import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, Search } from "lucide-react";

const LeaveHistoryPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("pending");

  // Mock user
  const currentUser = {
    employeeId: "EMP001",
  };

  useEffect(() => {
    const loadRequests = () => {
      try {
        const allRequests = JSON.parse(
          localStorage.getItem("leaveRequests") || "[]"
        );
        const userRequests = allRequests.filter(
          (request) => request.employeeId === currentUser.employeeId
        );
        setLeaveRequests(userRequests);
      } catch (error) {
        console.error("Error loading leave requests:", error);
      }
    };

    loadRequests();
    window.addEventListener("storage", loadRequests);
    return () => window.removeEventListener("storage", loadRequests);
  }, []);

  const filteredRequests = leaveRequests.filter((req) => {
    const matchesSearch =
      req.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      leaveTypeFilter === "All" || req.leaveType === leaveTypeFilter;
    const matchesTab =
      activeTab === "all" || req.status === activeTab.toLowerCase();
    return matchesSearch && matchesType && matchesTab;
  });

  const summary = {
    pending: leaveRequests.filter((r) => r.status === "pending").length,
    approved: leaveRequests.filter((r) => r.status === "approved").length,
    rejected: leaveRequests.filter((r) => r.status === "rejected").length,
    totalDays: leaveRequests.reduce((sum, r) => sum + (r.days || 0), 0),
  };

  const tabItems = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All Requests" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return `px-3 py-1 rounded-full text-sm border ${colors[status]}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Leave Management
        </h1>
        <p className="text-gray-600 mb-6">
          Manage employee leave requests and approvals
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-xl font-bold text-yellow-600">
                {summary.pending}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="bg-white rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-bold text-green-600">
                {summary.approved}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="bg-white rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-xl font-bold text-red-600">
                {summary.rejected}
              </p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="bg-white rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Days</p>
              <p className="text-xl font-bold text-blue-600">
                {summary.totalDays}
              </p>
            </div>
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-center bg-white border rounded-lg px-3 w-full sm:w-2/3">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by leave type or reason..."
              className="flex-1 py-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={leaveTypeFilter}
            onChange={(e) => setLeaveTypeFilter(e.target.value)}
            className="border rounded-lg py-2 px-3 bg-white w-full sm:w-1/3"
          >
            <option value="All">All Leave Types</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({leaveRequests.filter((r) =>
                tab.key === "all" ? true : r.status === tab.key
              ).length})
            </button>
          ))}
        </div>

        {/* Requests List or Empty State */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Leave Requests Yet
            </h3>
            <p className="text-gray-500">
              Employees haven't submitted any leave requests yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {request.leaveType}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {request.startDate} to {request.endDate} • {request.days}{" "}
                      days
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className={getStatusBadge(request.status)}>
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium">{request.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied Date</p>
                    <p className="font-medium">{request.appliedDate}</p>
                  </div>
                  {request.emergencyContact && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Emergency Contact
                      </p>
                      <p className="font-medium">{request.emergencyContact}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveHistoryPage;
