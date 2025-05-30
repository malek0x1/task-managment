
import { toast as toastFn } from '@/hooks/use-toast';

export const handleError = (error: Error, toast: typeof toastFn) => {
  console.error("Caught error in dependency mindmap:", error);
  

  if (error.message.includes('Maximum update depth exceeded')) {
    toast({
      title: "Rendering issue detected",
      description: "There was a problem with component updates. The page will reload automatically.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } else if (error.message.includes('zustand provider')) {
    toast({
      title: "React Flow provider issue",
      description: "There was a problem with the graph visualization. The page will reload automatically.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } else {
    toast({
      title: "Error in dependency mindmap",
      description: "There was a problem loading the dependency view. Details have been logged.",
      variant: "destructive",
    });
  }
};
