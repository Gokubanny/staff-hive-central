// src/contexts/LeaveContext.jsx
import React, { createContext, useContext, useState } from 'react';

const LeaveContext = createContext();

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};

export const LeaveProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Function for employees to submit leave requests
  const submitLeaveRequest = (requestData) => {
    const newRequest = {
      ...requestData,
      id: Date.now(),
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
    return newRequest.id; // Return ID for confirmation
  };

  // Function for admin to update leave status
  const updateLeaveStatus = (id, newStatus, reason = '') => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: newStatus,
            [`${newStatus}By`]: 'Admin',
            [`${newStatus}Date`]: new Date().toISOString().split('T')[0],
            ...(newStatus === 'rejected' && reason && { rejectionReason: reason })
          }
        : request
    ));
  };

  // Get requests by status
  const getRequestsByStatus = (status) => {
    if (status === 'all') return leaveRequests;
    return leaveRequests.filter(request => request.status === status);
  };

  // Get requests by employee
  const getEmployeeRequests = (employeeId) => {
    return leaveRequests.filter(request => request.employeeId === employeeId);
  };

  const value = {
    leaveRequests,
    submitLeaveRequest,
    updateLeaveStatus,
    getRequestsByStatus,
    getEmployeeRequests,
  };

  return (
    <LeaveContext.Provider value={value}>
      {children}
    </LeaveContext.Provider>
  );
};