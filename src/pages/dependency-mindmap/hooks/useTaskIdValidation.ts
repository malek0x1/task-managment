
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useTaskIdValidation = (taskId: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!taskId) {
      toast({
        title: "Missing Task ID",
        description: "Please select a task to view its dependencies",
        variant: "destructive",
      });
      

      const timer = setTimeout(() => {
        navigate(-1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [taskId, toast, navigate]);
};
