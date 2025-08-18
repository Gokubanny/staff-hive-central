import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Building,
  Users,
  FileText,
  X,
  Save
} from "lucide-react";

export default function AdminJobPosting() {
  const [jobs, setJobs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    requirements: [],
    benefits: [],
    newRequirement: '',
    newBenefit: ''
  });

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('adminJobs') || '[]');
    if (savedJobs.length === 0) {
      // Initialize with some sample jobs
      const initialJobs = [
        {
          id: 1,
          title: 'Senior Software Engineer',
          company: 'Tech Solutions Ltd',
          location: 'Lagos, Nigeria',
          type: 'Full-time',
          salary: '₦2,500,000 - ₦3,500,000',
          posted: '2025-08-15',
          status: 'active',
          applicants: 12,
          description: 'We are looking for an experienced software engineer to join our dynamic team.',
          requirements: [
            'Bachelor\'s degree in Computer Science',
            '5+ years of software development experience',
            'Proficiency in React, Node.js, JavaScript'
          ],
          benefits: [
            'Competitive salary',
            'Health insurance',
            'Remote work options'
          ]
        }
      ];
      setJobs(initialJobs);
      localStorage.setItem('adminJobs', JSON.stringify(initialJobs));
    } else {
      setJobs(savedJobs);
    }
  }, []);

  const resetJobData = () => {
    setJobData({
      title: '',
      company: '',
      location: '',
      type: 'full-time',
      salary: '',
      description: '',
      requirements: [],
      benefits: [],
      newRequirement: '',
      newBenefit: ''
    });
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    resetJobData();
    setShowCreateModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type.toLowerCase(),
      salary: job.salary,
      description: job.description,
      requirements: [...job.requirements],
      benefits: [...job.benefits],
      newRequirement: '',
      newBenefit: ''
    });
    setShowCreateModal(true);
  };

  const handleSaveJob = () => {
    // Basic validation
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newJob = {
      id: editingJob ? editingJob.id : Date.now(),
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      type: jobData.type.charAt(0).toUpperCase() + jobData.type.slice(1),
      salary: jobData.salary,
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits,
      posted: editingJob ? editingJob.posted : new Date().toISOString().split('T')[0],
      status: 'active',
      applicants: editingJob ? editingJob.applicants : 0
    };

    let updatedJobs;
    if (editingJob) {
      updatedJobs = jobs.map(job => job.id === editingJob.id ? newJob : job);
    } else {
      updatedJobs = [...jobs, newJob];
    }

    setJobs(updatedJobs);
    localStorage.setItem('adminJobs', JSON.stringify(updatedJobs));
    setShowCreateModal(false);
    resetJobData();
  };

  const handleDeleteJob = (jobId) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      setJobs(updatedJobs);
      localStorage.setItem('adminJobs', JSON.stringify(updatedJobs));
    }
  };

  const toggleJobStatus = (jobId) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === 'active' ? 'inactive' : 'active' }
        : job
    );
    setJobs(updatedJobs);
    localStorage.setItem('adminJobs', JSON.stringify(updatedJobs));
  };

  const addRequirement = () => {
    if (jobData.newRequirement.trim()) {
      setJobData(prev => ({
        ...prev,
        requirements: [...prev.requirements, prev.newRequirement.trim()],
        newRequirement: ''
      }));
    }
  };

  const removeRequirement = (index) => {
    setJobData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (jobData.newBenefit.trim()) {
      setJobData(prev => ({
        ...prev,
        benefits: [...prev.benefits, prev.newBenefit.trim()],
        newBenefit: ''
      }));
    }
  };

  const removeBenefit = (index) => {
    setJobData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getJobTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'bg-blue-100 text-blue-800';
      case 'part-time':
        return 'bg-purple-100 text-purple-800';
      case 'contract':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600">Manage and create job postings</p>
        </div>
        <Button onClick={handleCreateJob}>
          <Plus className="h-4 w-4 mr-2" />
          Create Job Posting
        </Button>
      </div>

      {/* Job Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobs.filter(job => job.status === 'active').length}
                </p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-purple-600">
                  {jobs.reduce((sum, job) => sum + job.applicants, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-orange-600">
                  {jobs.filter(job => {
                    const posted = new Date(job.posted);
                    const now = new Date();
                    return posted.getMonth() === now.getMonth() && posted.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <Badge className={getJobTypeColor(job.type)}>
                      {job.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{job.applicants} applicants</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{job.description}</p>
                  <p className="text-sm text-gray-500">Posted: {new Date(job.posted).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleJobStatus(job.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditJob(job)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={jobData.title}
                      onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={jobData.company}
                      onChange={(e) => setJobData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Tech Solutions Ltd"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={jobData.location}
                      onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Lagos, Nigeria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Job Type *</Label>
                    <select
                      id="type"
                      value={jobData.type}
                      onChange={(e) => setJobData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      value={jobData.salary}
                      onChange={(e) => setJobData(prev => ({ ...prev, salary: e.target.value }))}
                      placeholder="e.g. ₦2,500,000 - ₦3,500,000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={jobData.description}
                    onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </div>

                <div>
                  <Label>Requirements</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={jobData.newRequirement}
                        onChange={(e) => setJobData(prev => ({ ...prev, newRequirement: e.target.value }))}
                        placeholder="Add a requirement..."
                        onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                      />
                      <Button type="button" onClick={addRequirement}>Add</Button>
                    </div>
                    <div className="space-y-1">
                      {jobData.requirements.map((req, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{req}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequirement(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Benefits</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={jobData.newBenefit}
                        onChange={(e) => setJobData(prev => ({ ...prev, newBenefit: e.target.value }))}
                        placeholder="Add a benefit..."
                        onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                      />
                      <Button type="button" onClick={addBenefit}>Add</Button>
                    </div>
                    <div className="space-y-1">
                      {jobData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{benefit}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBenefit(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveJob} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {jobs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
            <p className="text-gray-600 mb-4">Create your first job posting to start recruiting candidates.</p>
            <Button onClick={handleCreateJob}>
              <Plus className="h-4 w-4 mr-2" />
              Create Job Posting
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
  );
}

{/* // Lorem ipsum dolor sit amet consectetur adipisicing elit.Quaerat voluptas, doloribus veniam ratione sint laboriosam eaque iste incidunt voluptates, illum consequuntur unde aliquam inventore aut reprehenderit tempore totam dicta recusandae non magni cumque iure ducimus quo omnis.Sint sapiente unde officiis accusantium maiores praesentium atque necessitatibus id aliquam excepturi fuga consectetur a ipsam iure molestias, ut perferendis culpa iste cum ? */}