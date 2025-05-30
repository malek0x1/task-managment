
import { useState, useEffect } from 'react';
import useKanbanStore from '@/store/useKanbanStore';
import { useProjectStore } from '@/store/useProjectStore';
import { toast } from '@/hooks/use-toast';


const DEFAULT_COLUMNS = [
  { title: 'To Do', order: 0 },
  { title: 'In Progress', order: 1 },
  { title: 'Done', order: 2 },
];

export function useSeedData() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [seedAttempted, setSeedAttempted] = useState(false);
  const [seedingInProgress, setSeedingInProgress] = useState(false);
  const { addColumn, columns } = useKanbanStore();
  const { currentProjectId, updateProject, projects } = useProjectStore();
  

  useEffect(() => {
    if (currentProjectId && !seedAttempted) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject?.has_completed_onboarding) {
        setIsSeeded(true);
      }
      setSeedAttempted(true);
    }
  }, [currentProjectId, projects, seedAttempted]);


  useEffect(() => {
    if (currentProjectId && columns.length > 0) {

      setIsSeeded(true);
    }
  }, [columns, currentProjectId]);


  const seedData = async () => {
    if (!currentProjectId) {
      toast({
        title: 'No project selected',
        description: 'Please select a project before seeding data.',
        variant: 'destructive',
      });
      return false;
    }
    

    if (isSeeded || seedingInProgress) {
      return true;
    }


    setIsSeeding(true);
    setSeedingInProgress(true);

    try {
      

      const existingColumns = columns.filter(col => col.project_id === currentProjectId);
      if (existingColumns.length > 0) {
        await updateProject(currentProjectId, { has_completed_onboarding: true });
        setIsSeeded(true);
        return true;
      }
      

      for (const column of DEFAULT_COLUMNS) {
        await addColumn({
          title: column.title,
          project_id: currentProjectId,
          order: column.order
        });
      }
      

      await updateProject(currentProjectId, { has_completed_onboarding: true });
      
      toast({
        title: 'Board created',
        description: 'Your board has been set up with default columns.',
      });
      
      setIsSeeded(true);
      return true;
    } catch (error) {
      console.error('Error in seedData:', error);
      toast({
        title: 'Failed to create board',
        description: 'An error occurred while setting up your board. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSeeding(false);
      setSeedingInProgress(false);
    }
  };


  const needsSeeding = !isSeeded;

  return {
    isSeeding,
    isSeeded,
    needsSeeding,
    seedData
  };
}
