import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AdminEditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Fetch job data based on id (replace with your API call)
  const job = {
    id: id,
    title: 'Sample Job',
    type: 'full-time',
    location: 'Remote',
    salary: '80,000 - 100,000',
    salaryCurrency: 'USD',
    description: 'Job description here...',
    requirements: 'Requirements here...'
  };

  const onSubmit = async (data) => {
    try {
      // Replace with actual API call
      console.log('Updating job:', data);
      toast({
        title: "Success",
        description: "Job updated successfully!",
        variant: "default",
      });
      navigate('/dashboard/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "Failed to update job.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Edit Job Posting</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields same as AdminPostJob.jsx */}
        {/* You can reuse the same form structure from AdminPostJob */}
        {/* Pre-fill the form with the job data */}
        
        <div className="flex justify-end gap-4 pt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/dashboard/jobs')}
          >
            Cancel
          </Button>
          <Button type="submit" className='bg-primary hover:bg-blue-900'>
            Update Job
          </Button>
        </div>
      </form>
    </div>
  );
}