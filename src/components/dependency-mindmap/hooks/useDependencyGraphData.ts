
import { useCallback, useState, useEffect } from 'react';
import useKanbanStore from '@/store/useKanbanStore';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/kanban';
import { useGraphGeneration } from './useGraphGeneration';
import { GraphData } from '../types/nodeTypes';
import useDependencyGraphStore from '@/store/dependencyGraph';
import { ensureSubtaskFields } from '@/utils/subtaskFieldUtils';

interface DependencyGraphDataResult {
  graphData: GraphData;
  updateDependency: (taskId: string, updates: Partial<Task>) => void;
  isLoading: boolean;
  refetchData: () => Promise<void>;
}

export const useDependencyGraphData = (taskId: string | null): DependencyGraphDataResult => {
  const { tasks, updateTask, fetchData } = useKanbanStore();
  const { toast } = useToast();
  const [isInitialDataFetched, setIsInitialDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    toggleNodeCollapse, 
    setSubtaskCompletion, 
    isNodeCollapsed, 
    isSubtaskCompleted 
  } = useDependencyGraphStore();
  
  useEffect(() => {
    if (!taskId) {
      setIsLoading(false);
      return;
    }

    if (!isInitialDataFetched && tasks.length === 0) {
      setIsLoading(true);
      
      fetchData()
        .then(() => {
          setIsInitialDataFetched(true);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching data for dependency graph:", err);
          setIsLoading(false);
          
          toast({
            title: "Error loading tasks",
            description: "Could not load task data for dependencies",
            variant: "destructive",
          });
        });
    } else {
      setIsLoading(false);
    }
  }, [taskId, fetchData, tasks.length, isInitialDataFetched, toast]);
  
  const updateDependency = useCallback((taskId: string, updates: Partial<Task>) => {
    const normalizedUpdates = { ...updates };
    if (updates.subtasks) {
      const tempTask = { id: taskId, subtasks: updates.subtasks } as any;
      const [normalizedTask] = ensureSubtaskFields([tempTask]);
      normalizedUpdates.subtasks = normalizedTask.subtasks;
    }
    
    return updateTask({
      id: taskId,
      ...normalizedUpdates
    });
  }, [updateTask]);

  const refetchData = useCallback(() => {
    setIsLoading(true);
    return fetchData()
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error refetching data:", err);
        setIsLoading(false);
        toast({
          title: "Error refreshing data",
          description: "Could not reload task data",
          variant: "destructive",
        });
      });
  }, [fetchData, toast]);
  
  const graphData = useGraphGeneration(
    taskId,
    tasks
  );
  
  return {
    graphData,
    updateDependency,
    isLoading,
    refetchData
  };
};
