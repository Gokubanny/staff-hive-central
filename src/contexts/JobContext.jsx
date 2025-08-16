import { createContext, useState, useContext, useEffect } from 'react';

const JobContext = createContext();
const JOBS_STORAGE_KEY = 'jobs_data';

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load jobs from localStorage on initial render
  useEffect(() => {
    const loadJobs = () => {
      try {
        const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
        if (savedJobs) {
          setJobs(JSON.parse(savedJobs));
        } else {
          // Initial mock data if no saved jobs exist
          const mockJobs = [
            {
              id: '1',
              title: 'Frontend Developer',
              type: 'full-time',
              location: 'Remote',
              salary: '80,000 - 100,000',
              salaryCurrency: 'USD',
              description: 'Develop awesome user interfaces',
              requirements: '3+ years of React experience',
              benefits: 'Health insurance, flexible hours',
              status: 'open',
              postedDate: new Date().toISOString().split('T')[0],
              applications: []
            }
          ];
          setJobs(mockJobs);
          localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(mockJobs));
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJobs();
  }, []);

  // Save to localStorage whenever jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    }
  }, [jobs]);

  const addJob = (newJob) => {
    const jobWithId = {
      ...newJob,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0],
      status: 'open',
      applications: []
    };
    setJobs(prev => {
      const updatedJobs = [jobWithId, ...prev];
      return updatedJobs;
    });
  };

  const removeJob = (id) => {
    setJobs(prev => {
      const updatedJobs = prev.filter(job => job.id !== id);
      return updatedJobs;
    });
  };

  const updateJobs = (jobsData) => {
    setJobs(jobsData);
  };

  return (
    <JobContext.Provider value={{ 
      jobs, 
      isLoading,
      addJob, 
      removeJob, 
      updateJobs 
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};