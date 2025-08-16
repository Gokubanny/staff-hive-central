import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '@/contexts/JobContext';
import { useForm, Controller } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AdminEditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobs } = useJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = jobs.find(j => j.id === id || j._id === id);

  const { 
    register, 
    handleSubmit, 
    reset, 
    control,
    formState: { errors } 
  } = useForm({
    defaultValues: job || {
      title: '',
      type: '',
      location: '',
      salary: '',
      salaryCurrency: 'NGN',
      description: '',
      requirements: '',
      benefits: '',
      deadline: ''
    }
  });

  useEffect(() => {
    if (job) {
      reset(job);
    }
  }, [job, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const updatedJob = {
        ...data,
        id: job.id || job._id,
        status: job.status,
        postedDate: job.postedDate,
        applications: job.applications || []
      };

      const updatedJobs = jobs.map(j => 
        (j.id === id || j._id === id) ? updatedJob : j
      );
      updateJobs(updatedJobs);

      toast({
        title: "Success",
        description: "Job updated successfully!",
        variant: "default",
      });
      navigate('/dashboard/job-postings');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Job: {job.title}</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/job-postings')}
        >
          Back to Jobs
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Job Title*</Label>
          <Input
            id="title"
            {...register("title", {
              required: "Job title is required",
              minLength: {
                value: 5,
                message: "Title should be at least 5 characters"
              }
            })}
            placeholder="Senior DevOps Engineer"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Job Type and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Job Type*</Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Job type is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location*</Label>
            <Input
              id="location"
              {...register("location", {
                required: "Location is required",
                minLength: {
                  value: 3,
                  message: "Location should be at least 3 characters"
                }
              })}
              placeholder="e.g. Lagos, Nigeria or Remote"
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* Salary Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salaryCurrency">Currency*</Label>
            <Controller
              name="salaryCurrency"
              control={control}
              rules={{ required: "Currency is required" }}
              defaultValue="NGN"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">₦ (NGN)</SelectItem>
                    <SelectItem value="USD">$ (USD)</SelectItem>
                    <SelectItem value="EUR">€ (EUR)</SelectItem>
                    <SelectItem value="GBP">£ (GBP)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="salary">Salary Range*</Label>
            <Input
              id="salary"
              {...register("salary", {
                required: "Salary is required",
                pattern: {
                  value: /^[\d, -]+$/,
                  message: "Please enter a valid salary range (e.g., 50,000 - 80,000)"
                }
              })}
              placeholder="e.g. 50,000 - 80,000 or Negotiable"
            />
            {errors.salary && (
              <p className="text-sm text-red-500">{errors.salary.message}</p>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Job Description*</Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "Job description is required",
              minLength: {
                value: 50,
                message: "Description should be at least 50 characters"
              }
            })}
            rows={6}
            className="min-h-[120px]"
            placeholder="Describe the job responsibilities, expectations, and day-to-day activities..."
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements*</Label>
          <Textarea
            id="requirements"
            {...register("requirements", {
              required: "Requirements are required",
              minLength: {
                value: 30,
                message: "Requirements should be at least 30 characters"
              }
            })}
            rows={4}
            placeholder="List key requirements (one per line or as bullet points)"
            className="min-h-[80px]"
          />
          {errors.requirements && (
            <p className="text-sm text-red-500">{errors.requirements.message}</p>
          )}
        </div>

        {/* Benefits (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="benefits">Benefits (Optional)</Label>
          <Textarea
            id="benefits"
            {...register("benefits")}
            rows={3}
            placeholder="List any benefits or perks (health insurance, bonuses, etc.)"
            className="min-h-[60px]"
          />
        </div>

        {/* Application Deadline */}
        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline (Optional)</Label>
          <Input
            id="deadline"
            type="date"
            {...register("deadline")}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/job-postings')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className='bg-primary hover:bg-blue-900'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : 'Update Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}