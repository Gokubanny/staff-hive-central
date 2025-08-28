import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Download,
  Search,
  Filter,
  Eye,
  TrendingUp,
  MapPin,
  Timer,
  Activity,
  BarChart3,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminAttendance = () => {
  const navigate = useNavigate(); // ADD THIS HOOK
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Real attendance data - only records from employees who have checked in/out
  const [attendanceData, setAttendanceData] = useState([]);

  // Load attendance data from localStorage and listen for updates
  useEffect(() => {
    const loadAttendanceData = () => {
      const attendanceKey = `attendance_${selectedDate}`;
      const records = JSON.parse(localStorage.getItem(attendanceKey) || '[]');
      setAttendanceData(records);
    };

    // Load data on mount and date change
    loadAttendanceData();

    // Listen for attendance updates
    const handleAttendanceUpdate = (event) => {
      setAttendanceData(event.detail);
    };

    window.addEventListener('attendanceUpdated', handleAttendanceUpdate);

    return () => {
      window.removeEventListener('attendanceUpdated', handleAttendanceUpdate);
    };
  }, [selectedDate]);
  
  // Department list for filtering
  const [departments] = useState([
    'Engineering',
    'Design', 
    'Marketing',
    'HR',
    'Sales',
    'Operations'
  ]);

  // Real-time stats calculated from actual attendance data
  const [dailyStats, setDailyStats] = useState({
    totalEmployees: 0,
    present: 0,
    checkedOut: 0,
    stillWorking: 0
  });

  // Update stats whenever attendance data changes
  useEffect(() => {
    const stats = calculateDailyStats(attendanceData);
    setDailyStats(stats);
  }, [attendanceData]);

  const calculateDailyStats = (data) => {
    const present = data.length;
    const checkedOut = data.filter(record => record.checkOutTime && record.checkOutTime !== '--').length;
    const stillWorking = data.filter(record => record.checkInTime !== '--' && (!record.checkOutTime || record.checkOutTime === '--')).length;
    
    return {
      totalEmployees: present,
      present: present,
      checkedOut: checkedOut,
      stillWorking: stillWorking
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'working':
        return 'bg-blue-100 text-blue-800';  
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4" />;
      case 'working':
        return <Activity className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const determineStatus = (record) => {
    if (record.checkInTime && record.checkInTime !== '--') {
      if (record.checkOutTime && record.checkOutTime !== '--') {
        return 'completed';
      } else {
        return 'working';
      }
    }
    return 'not-started';
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (checkIn === '--' || !checkIn) return '--';
    if (checkOut === '--' || !checkOut) return 'Working...';
    
    try {
      const inTime = new Date(`${selectedDate} ${checkIn}`);
      const outTime = new Date(`${selectedDate} ${checkOut}`);
      const diff = outTime - inTime;
      
      if (diff < 0) return '--';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch (error) {
      return '--';
    }
  };

  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || record.department === filterDepartment;
    
    let matchesStatus = true;
    if (filterStatus !== 'all') {
      const status = determineStatus(record);
      matchesStatus = status === filterStatus;
    }
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const refreshData = async () => {
    setIsLoading(true);
    
    // Load fresh data from localStorage
    const attendanceKey = `attendance_${selectedDate}`;
    const records = JSON.parse(localStorage.getItem(attendanceKey) || '[]');
    setAttendanceData(records);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const exportData = () => {
    if (attendanceData.length === 0) {
      alert('No attendance data to export');
      return;
    }
    
    console.log('Exporting attendance data...', attendanceData);
    // In real app, this would generate and download a file
  };

  // Simulate receiving real-time attendance updates
  const addAttendanceRecord = (employeeData) => {
    setAttendanceData(prev => {
      const existingIndex = prev.findIndex(record => record.employeeId === employeeData.employeeId);
      if (existingIndex >= 0) {
        // Update existing record
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...employeeData };
        return updated;
      } else {
        // Add new record
        return [...prev, { ...employeeData, id: Date.now() }];
      }
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen ml-64">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Monitor real-time employee attendance records</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-[180px]"
          />
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" onClick={exportData} disabled={attendanceData.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Daily Overview Stats - Mobile Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <UserCheck className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-bold text-blue-800">{dailyStats.present}</p>
            <p className="text-xs text-blue-600">Checked In Today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-bold text-green-800">{dailyStats.stillWorking}</p>
            <p className="text-xs text-green-600">Currently Working</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-gray-500 mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-bold text-gray-800">{dailyStats.checkedOut}</p>
            <p className="text-xs text-gray-600">Completed Day</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-bold text-purple-800">
              {dailyStats.present > 0 ? Math.round((dailyStats.checkedOut / dailyStats.present) * 100) : 0}%
            </p>
            <p className="text-xs text-purple-600">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Mobile Responsive */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="working">Currently Working</SelectItem>
                  <SelectItem value="completed">Day Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Attendance List */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Today's Attendance ({filteredData.length})
              </CardTitle>
              <CardDescription>
                Real-time attendance for {new Date(selectedDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredData.length > 0 ? (
            filteredData.map((record) => {
              const status = determineStatus(record);
              const duration = calculateDuration(record.checkInTime, record.checkOutTime);
              
              return (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  {/* Mobile Layout */}
                  <div className="block lg:hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {record.name ? record.name.split(' ').map(n => n[0]).join('') : '??'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{record.name || 'Unknown'}</h4>
                          <p className="text-sm text-gray-600">{record.employeeId || 'N/A'}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                        {getStatusIcon(status)}
                        {status === 'working' ? 'Working' : status === 'completed' ? 'Complete' : 'Present'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-green-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Check In</p>
                        <p className="font-semibold text-green-600">{record.checkInTime || '--'}</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Check Out</p>
                        <p className="font-semibold text-red-600">{record.checkOutTime || '--'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{record.department || 'N/A'}</span>
                        <span>•</span>
                        <span>{duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {record.location || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:flex lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {record.name ? record.name.split(' ').map(n => n[0]).join('') : '??'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{record.name || 'Unknown'}</h4>
                        <p className="text-sm text-gray-600">{record.employeeId || 'N/A'} • {record.department || 'N/A'}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{record.location || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Check In</p>
                        <p className="font-semibold text-green-600">{record.checkInTime || '--'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Check Out</p>
                        <p className="font-semibold text-red-600">{record.checkOutTime || '--'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold">{duration}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                          {getStatusIcon(status)}
                          {status === 'working' ? 'Working' : status === 'completed' ? 'Complete' : 'Present'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Records</h3>
              <p className="text-sm">No employees have checked in yet for {new Date(selectedDate).toLocaleDateString()}.</p>
              <p className="text-sm mt-2">Records will appear here as employees mark their attendance.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            className="justify-start" 
            variant="outline" 
            disabled={attendanceData.length === 0}
            onClick={exportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Daily Report
          </Button>
          <Button 
            className="justify-start" 
            variant="outline"
            onClick={() => navigate('/dashboard/reports')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Historical Data
          </Button>
          <Button 
            className="justify-start" 
            variant="outline"
            onClick={() => navigate('/dashboard/employees')}
          >
            <Users className="h-4 w-4 mr-2" />
            Employee List
          </Button>
          <Button 
            className="justify-start" 
            variant="outline"
            onClick={() => navigate('/dashboard/settings/system')}
          >
            <Timer className="h-4 w-4 mr-2" />
            Attendance Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAttendance;