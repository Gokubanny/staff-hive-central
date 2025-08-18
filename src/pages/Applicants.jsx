import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Eye, 
  UserCheck, 
  UserX, 
  Clock, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Star,
  X,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp
} from "lucide-react";

export default function AdminApplicantManagement() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notes, setNotes] = useState('');

  // Load applications from localStorage
  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Add some mock applications if none exist
    if (savedApplications.length === 0) {
      const mockApplications = [
        {
          id: 1,
          jobId: 1,
          jobTitle: 'Senior Software Engineer',
          company: 'Tech Solutions Ltd',
          applicantData: {
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+234 803 123 4567',
            experience: '5 years',
            skills: 'React, Node.js, JavaScript, Python',
            coverLetter: 'I am excited to apply for the Senior Software Engineer position. With over 5 years of experience in full-stack development, I have worked extensively with React, Node.js, and cloud technologies. I believe my skills and passion for technology make me an ideal candidate for this role.'
          },
          appliedDate: '2025-08-15',
          status: 'pending',
          rating: 0,
          notes: ''
        },
        {
          id: 2,
          jobId: 2,
          jobTitle: 'Marketing Manager',
          company: 'Digital Marketing Pro',
          applicantData: {
            fullName: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+234 806 987 6543',
            experience: '4 years',
            skills: 'Digital Marketing, SEO, Social Media, Analytics',
            coverLetter: 'I am writing to express my interest in the Marketing Manager position. My 4 years of experience in digital marketing, combined with my analytical skills and creativity, would be valuable assets to your team.'
          },
          appliedDate: '2025-08-14',
          status: 'reviewed',
          rating: 4,
          notes: 'Strong candidate with good marketing background'
        },
        {
          id: 3,
          jobId: 3,
          jobTitle: 'UX/UI Designer',
          company: 'Creative Studio Inc',
          applicantData: {
            fullName: 'Mike Chen',
            email: 'mike.chen@email.com',
            phone: '+234 701 234 5678',
            experience: '3 years',
            skills: 'Figma, Sketch, Adobe XD, Prototyping, User Research',
            coverLetter: 'As a passionate UX/UI designer with 3 years of experience, I am excited about the opportunity to contribute to your creative team. I specialize in user-centered design and have a portfolio showcasing successful projects.'
          },
          appliedDate: '2025-08-13',
          status: 'accepted',
          rating: 5,
          notes: 'Excellent portfolio and communication skills. Hired!'
        }
      ];
      
      setApplications(mockApplications);
      localStorage.setItem('applications', JSON.stringify(mockApplications));
    } else {
      setApplications(savedApplications);
    }
  }, []);

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = applications.filter(app => {
      const matchesSearch = 
        app.applicantData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantData.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const updateApplicationStatus = (applicationId, newStatus) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const updateApplicationRating = (applicationId, rating) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, rating } : app
    );
    
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const updateApplicationNotes = (applicationId, notes) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, notes } : app
    );
    
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setNotes(application.notes || '');
    setShowDetailModal(true);
  };

  const saveNotes = () => {
    if (selectedApplication) {
      updateApplicationNotes(selectedApplication.id, notes);
      setSelectedApplication({ ...selectedApplication, notes });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewed':
        return <Eye className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderStarRating = (rating, onRatingChange = null, applicationId = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${onRatingChange ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => onRatingChange && onRatingChange(applicationId, star)}
          />
        ))}
      </div>
    );
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="space-y-6 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicant Management</h1>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications by name, job title, or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {application.applicantData.fullName}
                    </h3>
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status}
                      </div>
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Position Applied For:</p>
                      <p className="font-medium">{application.jobTitle}</p>
                      <p className="text-sm text-gray-600">{application.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Information:</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{application.applicantData.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{application.applicantData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Experience: {application.applicantData.experience}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">Skills:</p>
                    <p className="text-sm text-gray-700">{application.applicantData.skills}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Rating:</span>
                    {renderStarRating(application.rating, updateApplicationRating, application.id)}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewApplicationDetails(application)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {application.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Mark Reviewed
                      </Button>
                    </>
                  )}
                  
                  {(application.status === 'pending' || application.status === 'reviewed') && (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'accepted')}
                        className="text-green-600 hover:text-green-700 flex-1"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        className="text-red-600 hover:text-red-700 flex-1"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Application Details
                  </h2>
                  <p className="text-gray-600">
                    {selectedApplication.applicantData.fullName} - {selectedApplication.jobTitle}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                      <p className="font-medium">{selectedApplication.applicantData.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p>{selectedApplication.applicantData.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Phone</Label>
                      <p>{selectedApplication.applicantData.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Experience</Label>
                      <p>{selectedApplication.applicantData.experience}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Application Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(selectedApplication.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(selectedApplication.status)}
                            {selectedApplication.status}
                          </div>
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Applied Date</Label>
                      <p>{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Rating</Label>
                      <div className="mt-1">
                        {renderStarRating(selectedApplication.rating, updateApplicationRating, selectedApplication.id)}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'accepted')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Skills & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-600">Technical Skills</Label>
                    <p className="mt-1">{selectedApplication.applicantData.skills}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">
                    {selectedApplication.applicantData.coverLetter}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Internal Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this candidate..."
                    />
                    <Button onClick={saveNotes} size="sm">
                      Save Notes
                    </Button>
                  </div>
                  {selectedApplication.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm font-medium text-gray-600">Previous Notes:</Label>
                      <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedApplication.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No applications found' : 'No applications yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Applications will appear here when candidates apply for your job postings.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}