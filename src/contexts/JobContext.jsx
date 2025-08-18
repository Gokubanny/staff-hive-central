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
  const [company, setCompany] = useState({
    name: '',
    contactEmail: '',
    phone: '',
    about: '',
    businessHours: {
      start: '09:00',
      end: '17:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    holidays: []
  });

  // Mock initial jobs data
  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        _id: 'job1',
        title: 'Frontend Developer',
        description: 'We are looking for a skilled Frontend Developer to join our dynamic team.',
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
      // ... other mock jobs
    ];
    setJobs(mockJobs);
  }, []);

  // Add this new method to update company info
  const updateCompany = (newData) => {
    setCompany(prev => ({ ...prev, ...newData }));
  };

  // ... keep all your existing methods (addJob, updateJob, etc.) ...

  const contextValue = {
    // State
    jobs,
    applications,
    isLoading,
    error,
    company, // Make sure company is included
    
    // Methods
    addJob,
    updateJob,
    removeJob,
    getJob,
    searchJobs,
    addApplication,
    updateApplicationStatus,
    getJobApplications,
    getUserApplications,
    updateCompany // Make sure to include this
  };

  return (
    <JobContext.Provider value={contextValue}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;