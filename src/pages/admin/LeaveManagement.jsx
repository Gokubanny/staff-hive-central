import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, FileText, Filter, Search, Bell } from 'lucide-react';

const AdminLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    setLeaveRequests(storedRequests);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
      setLeaveRequests(storedRequests);

      const newPendingCount = storedRequests.filter(r => r.status === 'pending').length;
      const oldPendingCount = leaveRequests.filter(r => r.status === 'pending').length;

      if (newPendingCount > oldPendingCount) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('leaveRequestSubmitted', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leaveRequestSubmitted', handleStorageChange);
    };
  }, [leaveRequests]);

  const handleApprove = (id) => {
    const updatedRequests = leaveRequests.map(req =>
      req.id === id 
        ? { 
            ...req, 
            status: 'approved',
            approvedBy: 'Admin',
            approvedDate: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString()
          } 
        : req
    );
    
    setLeaveRequests(updatedRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('leaveRequestUpdated', {
      detail: { 
        requestId: id, 
        status: 'approved',
        approvedBy: 'Admin',
        approvedDate: new Date().toISOString().split('T')[0]
      }
    }));

    alert('Leave request approved successfully!');
  };

  const handleReject = (id) => {
    // Show prompt for rejection reason
    const reason = prompt('Please enter the reason for rejection:');
    
    if (reason !== null && reason.trim() !== '') {
      const updatedRequests = leaveRequests.map(req =>
        req.id === id 
          ? { 
              ...req, 
              status: 'rejected',
              rejectedBy: 'Admin',
              rejectedDate: new Date().toISOString().split('T')[0],
              rejectionReason: reason.trim(),
              lastUpdated: new Date().toISOString()
            } 
          : req
      );
      
      setLeaveRequests(updatedRequests);
      localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('leaveRequestUpdated', {
        detail: { 
          requestId: id, 
          status: 'rejected',
          rejectedBy: 'Admin',
          rejectedDate: new Date().toISOString().split('T')[0],
          rejectionReason: reason.trim()
        }
      }));
      
      alert('Leave request rejected successfully!');
    } else if (reason !== null) {
      alert('Please provide a reason for rejection.');
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = 
      (request.employeeName || request.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || request.leaveType === filterType;

    return matchesTab && matchesSearch && matchesType;
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return `px-3 py-1 rounded-full text-sm border ${colors[status] || colors.pending}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
  const approvedRequests = leaveRequests.filter(r => r.status === 'approved');
  const rejectedRequests = leaveRequests.filter(r => r.status === 'rejected');

  return (
    <div className="p-6 bg-gray-50 min-h-screen ml-64">
      <div className="max-w-7xl mx-auto">
        {showNotification && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-blue-700 font-medium">New Leave Request</p>
                <p className="text-blue-600 text-sm">A new leave request has been submitted and is pending your review.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Management</h1>
          <p className="text-gray-600">Manage employee leave requests and approvals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
              </div>
              <div className="relative">
                <Clock className="w-8 h-8 text-yellow-600" />
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Days</p>
                <p className="text-2xl font-bold text-blue-600">
                  {leaveRequests.reduce((sum, r) => sum + (r.days || 0), 0)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="search-employees"
                  name="searchEmployees"
                  type="text"
                  placeholder="Search by employee name, ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                id="filter-leave-type"
                name="filterLeaveType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Leave Types</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'pending', label: 'Pending', count: pendingRequests.length },
                { key: 'approved', label: 'Approved', count: approvedRequests.length },
                { key: 'rejected', label: 'Rejected', count: rejectedRequests.length },
                { key: 'all', label: 'All Requests', count: leaveRequests.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                  {tab.key === 'pending' && tab.count > 0 && (
                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Leave Requests */}
          <div className="p-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {leaveRequests.length === 0 ? 'No Leave Requests Yet' : 'No Matching Requests'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {leaveRequests.length === 0 
                    ? "Employees haven't submitted any leave requests yet" 
                    : 'No requests match your current filters'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {request.employeeName || request.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {request.employeeId && `${request.employeeId} • `}
                            {request.department}
                          </p>
                          {request.email && (
                            <p className="text-sm text-gray-400">{request.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={getStatusBadge(request.status)}>
                          {(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Leave Type</p>
                        <p className="font-medium">{request.leaveType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">
                          {request.startDate || request.from} to {request.endDate || request.to}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Days</p>
                        <p className="font-medium">{request.days || 'N/A'} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Applied Date</p>
                        <p className="font-medium">{request.appliedDate || new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    {request.reason && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Reason</p>
                        <p className="text-gray-900">{request.reason}</p>
                      </div>
                    )}

                    {request.emergencyContact && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Emergency Contact</p>
                        <p className="text-gray-900">{request.emergencyContact}</p>
                      </div>
                    )}

                    {request.status === 'rejected' && request.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">
                          <strong>Rejection Reason:</strong> {request.rejectionReason}
                        </p>
                      </div>
                    )}

                    {(request.status === 'pending' || !request.status) && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {(request.status === 'approved' || request.status === 'rejected') && (
                      <div className="text-sm text-gray-500">
                        {(request.status || '').charAt(0).toUpperCase() + (request.status || '').slice(1)} by {request[`${request.status}By`] || 'Admin'} on {request[`${request.status}Date`] || new Date().toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveManagement;