import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminViewJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch job data based on id (replace with your API call)
  const job = {
    id: id,
    title: 'Sample Job',
    type: 'full-time',
    location: 'Remote',
    salary: '$80,000 - $100,000',
    description: 'Job description here...',
    requirements: 'Requirements here...'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {job.type}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {job.location}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {job.salary}
          </span>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{job.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <p className="text-gray-700">{job.requirements}</p>
          </div>
        </div>
      </div>
    </div>
  );
}