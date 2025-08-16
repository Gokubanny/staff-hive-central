import React, { createContext, useContext, useState, useEffect } from 'react';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock initial jobs data
  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        _id: 'job1',
        title: 'Frontend Developer',
        description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for building user-facing web applications using modern JavaScript frameworks.',
        location: 'San Francisco, CA',
        type: 'full-time',
        salary: '80000',
        salaryCurrency: 'USD',
        status: 'open',
        requirements: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript'],
        company: 'TechCorp Inc.',
        postedDate: '2024-05-01',
        createdAt: '2024-05-01T10:00:00Z',
        applications: []
      },
      {
        id: 2,
        _id: 'job2',
        title: 'UX Designer',
        description: 'Join our design team to create exceptional user experiences. You will work closely with product managers and developers to design intuitive interfaces.',
        location: 'New York, NY',
        type: 'full-time',
        salary: '75000',
        salaryCurrency: 'USD',
        status: 'open',
        requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
        company: 'Design Studio',
        postedDate: '2024-05-05',
        createdAt: '2024-05-05T10:00:00Z',
        applications: []
      },
      {
        id: 3,
        _id: 'job3',
        title: 'Backend Developer',
        description: 'We need a Backend Developer to build and maintain our server-side applications. Experience with Node.js and databases required.',
        location: 'Remote',
        type: 'remote',
        salary: '90000',
        salaryCurrency: 'USD',
        status: 'open',
        requirements: ['Node.js', 'MongoDB', 'REST APIs', 'AWS'],
        company: 'CloudTech Solutions',
        postedDate: '2024-05-10',
        createdAt: '2024-05-10T10:00:00Z',
        applications: []
      }
    ];
    setJobs(mockJobs);
  }, []);

  // Add a new job
  const addJob = async (jobData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In real app, make API call here
      const newJob = {
        ...jobData,
        id: Date.now(),
        _id: `job_${Date.now()}`,
        postedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: 'open',
        applications: []
      };
      
      setJobs(prevJobs => [...prevJobs, newJob]);
      return newJob;
    } catch (err) {
      setError('Failed to add job');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a job
  const updateJob = async (jobId, updatedData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In real app, make API call here
      setJobs(prevJobs =>
        prevJobs.map(job =>
          (job.id === jobId || job._id === jobId)
            ? { ...job, ...updatedData }
            : job
        )
      );
    } catch (err) {
      setError('Failed to update job');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a job
  const removeJob = async (jobId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In real app, make API call here
      setJobs(prevJobs =>
        prevJobs.filter(job => job.id !== jobId && job._id !== jobId)
      );
      
      // Also remove related applications
      setApplications(prevApplications =>
        prevApplications.filter(app => app.jobId !== jobId)
      );
    } catch (err) {
      setError('Failed to remove job');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get a specific job
  const getJob = (jobId) => {
    return jobs.find(job => job.id === jobId || job._id === jobId);
  };

  // Add a job application
  const addApplication = async (applicationData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In real app, make API call here
      const newApplication = {
        ...applicationData,
        id: Date.now(),
        _id: `app_${Date.now()}`,
        appliedDate: new Date().toISOString(),
        status: 'review'
      };
      
      setApplications(prevApplications => [...prevApplications, newApplication]);
      
      // Update job with application count
      setJobs(prevJobs =>
        prevJobs.map(job =>
          (job.id === applicationData.jobId || job._id === applicationData.jobId)
            ? { 
                ...job, 
                applications: [...(job.applications || []), newApplication.id]
              }
            : job
        )
      );
      
      return newApplication;
    } catch (err) {
      setError('Failed to submit application');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In real app, make API call here
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId || app._id === applicationId
            ? { ...app, status }
            : app
        )
      );
    } catch (err) {
      setError('Failed to update application status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get applications for a specific job
  const getJobApplications = (jobId) => {
    return applications.filter(app => app.jobId === jobId);
  };

  // Get user applications (for user dashboard)
  const getUserApplications = (userId) => {
    return applications.filter(app => app.userId === userId);
  };

  // Search jobs
  const searchJobs = (query, filters = {}) => {
    let filteredJobs = jobs;
    
    if (query) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (filters.type && filters.type !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }
    
    if (filters.location && filters.location !== 'all') {
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === filters.status);
    }
    
    return filteredJobs;
  };

  const contextValue = {
    // State
    jobs,
    applications,
    isLoading,
    error,
    
    // Job methods
    addJob,
    updateJob,
    removeJob,
    getJob,
    searchJobs,
    
    // Application methods
    addApplication,
    updateApplicationStatus,
    getJobApplications,
    getUserApplications,
  };

  return (
    <JobContext.Provider value={contextValue}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;