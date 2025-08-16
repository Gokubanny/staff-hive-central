import { useParams } from 'react-router-dom';
import { useJobs } from '@/contexts/JobContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, Briefcase } from 'lucide-react';

export default function AdminViewJob() {
  const { id } = useParams();
  const { jobs } = useJobs();
  const navigate = useNavigate();
  
  const job = jobs.find(j => j.id === id || j._id === id);

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Job not found</h1>
          <Button 
            className="mt-4"
            onClick={() => navigate('/dashboard/job-postings')}
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="capitalize">
              {job.type}
            </Badge>
            <Badge variant={job.status === 'open' ? 'success' : 'secondary'}>
              {job.status}
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/job-postings')}
        >
          Back to Jobs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Job Description</h2>
            <div className="prose max-w-none">
              {job.description.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Requirements</h2>
            <ul className="list-disc pl-6 space-y-2">
              {job.requirements.split('\n').map((requirement, i) => (
                <li key={i}>{requirement}</li>
              ))}
            </ul>
          </div>

          {job.benefits && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Benefits</h2>
              <ul className="list-disc pl-6 space-y-2">
                {job.benefits.split('\n').map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-medium">Job Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>Type: {job.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>Location: {job.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Salary: {job.salaryCurrency} {job.salary}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
              {job.deadline && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="w-full"
              onClick={() => navigate(`/dashboard/jobs/edit/${job.id || job._id}`)}
            >
              Edit Job
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/dashboard/job-postings')}
            >
              Back to List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}