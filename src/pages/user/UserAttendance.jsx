import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Timer,
  AlertCircle,
  User,
  Building2,
  Activity
} from 'lucide-react';

const UserAttendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [location, setLocation] = useState('Loading...');

  // Mock user data - in real app, this would come from authentication
  const [currentUser] = useState({
    employeeId: 'EMP001',
    name: 'John Doe',
    department: 'Engineering'
  });

  // Simulate shared data storage (in real app, use context or API)
  const updateAttendanceRecord = (data) => {
    // Store in localStorage for demo purposes
    const attendanceKey = `attendance_${new Date().toISOString().split('T')[0]}`;
    let records = JSON.parse(localStorage.getItem(attendanceKey) || '[]');
    
    const existingIndex = records.findIndex(record => record.employeeId === currentUser.employeeId);
    
    if (existingIndex >= 0) {
      records[existingIndex] = { ...records[existingIndex], ...data };
    } else {
      records.push({
        id: Date.now(),
        employeeId: currentUser.employeeId,
        name: currentUser.name,
        department: currentUser.department,
        date: new Date().toISOString().split('T')[0],
        location: location,
        ...data
      });
    }
    
    localStorage.setItem(attendanceKey, JSON.stringify(records));
    
    // Trigger a custom event to notify admin page
    window.dispatchEvent(new CustomEvent('attendanceUpdated', { detail: records }));
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation('Office - Lagos, Nigeria');
        },
        (error) => {
          setLocation('Location unavailable');
        }
      );
    } else {
      setLocation('Location not supported');
    }
  }, []);

  // Load existing attendance data on component mount
  useEffect(() => {
    const attendanceKey = `attendance_${new Date().toISOString().split('T')[0]}`;
    const records = JSON.parse(localStorage.getItem(attendanceKey) || '[]');
    const userRecord = records.find(record => record.employeeId === currentUser.employeeId);
    
    if (userRecord) {
      if (userRecord.checkInTime) {
        setCheckInTime(new Date(`${new Date().toDateString()} ${userRecord.checkInTime}`));
        setIsCheckedIn(!userRecord.checkOutTime);
      }
      if (userRecord.checkOutTime) {
        setCheckOutTime(new Date(`${new Date().toDateString()} ${userRecord.checkOutTime}`));
      }
    }
  }, [currentUser.employeeId]);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    
    const checkInData = {
      checkInTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      checkOutTime: null
    };
    
    updateAttendanceRecord(checkInData);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(now);
    setIsCheckedIn(false);
    
    const checkOutData = {
      checkOutTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    updateAttendanceRecord(checkOutData);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = () => {
    if (checkInTime && checkOutTime) {
      const diff = checkOutTime - checkInTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } else if (checkInTime && !checkOutTime) {
      const diff = currentTime - checkInTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m (Working...)`;
    }
    return '--';
  };

  const getCurrentStatus = () => {
    if (checkInTime && !checkOutTime) {
      return 'working';
    } else if (checkInTime && checkOutTime) {
      return 'completed';
    }
    return 'not-started';
  };

  const getStatusBadge = () => {
    const status = getCurrentStatus();
    switch (status) {
      case 'working':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Working
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Day Complete
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Not Started
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600 mt-1">Track your daily attendance and working hours</p>
          <p className="text-sm text-gray-500">Welcome back, {currentUser.name} ({currentUser.employeeId})</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-2xl font-bold text-blue-600">{formatTime(currentTime)}</p>
          <p className="text-sm text-gray-600">{formatDate(currentTime)}</p>
        </div>
      </div>

      {/* Today's Status Card */}
      <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                Today's Status
              </CardTitle>
              <CardDescription>Your current attendance status for today</CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-sm font-medium text-gray-600">Check In Time</p>
              <p className="text-xl font-bold text-green-600">
                {checkInTime ? formatTime(checkInTime) : '--:--:--'}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-sm font-medium text-gray-600">Check Out Time</p>
              <p className="text-xl font-bold text-red-600">
                {checkOutTime ? formatTime(checkOutTime) : '--:--:--'}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-xl font-bold text-blue-600">{calculateDuration()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check In/Out Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-600" />
            Mark Attendance
          </CardTitle>
          <CardDescription>Click to check in when you arrive and check out when you leave</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleCheckIn}
              disabled={isCheckedIn}
              className="flex-1 bg-green-600 hover:bg-green-700 h-12"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {isCheckedIn ? 'Already Checked In' : 'Check In'}
            </Button>
            <Button 
              onClick={handleCheckOut}
              disabled={!isCheckedIn || checkOutTime}
              variant="outline"
              className="flex-1 border-red-600 text-red-600 hover:bg-red-50 h-12"
            >
              <XCircle className="h-5 w-5 mr-2" />
              {checkOutTime ? 'Already Checked Out' : 'Check Out'}
            </Button>
          </div>
          
          {!isCheckedIn && !checkInTime && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800 font-medium">Ready to start your day?</p>
              </div>
              <p className="text-xs text-blue-600 mt-1">Click "Check In" when you arrive at your workplace.</p>
            </div>
          )}

          {isCheckedIn && !checkOutTime && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-800 font-medium">You're currently checked in</p>
              </div>
              <p className="text-xs text-green-600 mt-1">Don't forget to check out when you finish work.</p>
            </div>
          )}

          {checkOutTime && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800 font-medium">Day completed!</p>
              </div>
              <p className="text-xs text-blue-600 mt-1">You worked for {calculateDuration()} today.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Manage your attendance records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Full History
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Monthly Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="h-4 w-4 mr-2" />
              Request Time Off
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <CardDescription>Having issues with attendance tracking?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <User className="h-4 w-4 mr-2" />
              Contact HR
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertCircle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Attendance Policy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAttendance;