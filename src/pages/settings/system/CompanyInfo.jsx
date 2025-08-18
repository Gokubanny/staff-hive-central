import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useJobs } from '@/contexts/JobContext';
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export default function CompanyInfo() {
  const { company, updateCompany } = useJobs();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset(company);
  }, [company, reset]);

  const onSubmit = (data) => {
    updateCompany(data);
    toast({
      title: "Company info updated",
      description: "Your changes have been saved",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Your form fields here */}
    </form>
  );
}