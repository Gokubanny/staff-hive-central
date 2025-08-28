import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const AttendanceContext = createContext();

// Provider component
export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const addOrUpdateAttendance = useCallback((attendanceData) => {
    setAttendanceRecords(prev => {
      const existingIndex = prev.findIndex(record => record.employeeId === attendanceData.employeeId);
      
      if (existingIndex >= 0) {
        // Update existing record
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...attendanceData };
        return updated;
      } else {
        // Add new record
        return [...prev, { ...attendanceData, id: Date.now(), date: new Date().toISOString().split('T')[0] }];
      }
    });
  }, []);

  const getAttendanceForDate = useCallback((date) => {
    return attendanceRecords.filter(record => record.date === date);
  }, [attendanceRecords]);

  const value = {
    attendanceRecords,
    addOrUpdateAttendance,
    getAttendanceForDate
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

// Custom hook to use the context
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

// Example of how to wrap your app
export const App = () => {
  return (
    <AttendanceProvider>
      {/* Your app components here */}
      <UserAttendance />
      <AdminAttendance />
    </AttendanceProvider>
  );
};