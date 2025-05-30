
import { useState, useCallback } from 'react';
import useKanbanStore from '@/store/useKanbanStore';
import { Subtask } from '@/types/kanban';
import { toast } from '@/hooks/use-toast';

export const useSubtaskActions = () => {
  const { 
    updateTask, 
    tasks, 
    toggleSubtaskCompletion, 
    addSubtask, 
    addNestedSubtask, 
    deleteSubtask: storeDeleteSubtask,
    updateSubtask: storeUpdateSubtask,
  } = useKanbanStore();
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    setIsUpdating(true);
    
    try {
      await toggleSubtaskCompletion(taskId, subtaskId);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle subtask completion',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [toggleSubtaskCompletion]);
  
  const addNewSubtask = useCallback(async (taskId: string, title: string) => {
    if (!taskId) {
      toast({
        title: 'Error',
        description: 'Cannot add subtask: No task ID provided',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await addSubtask(taskId, title);
      toast({
        title: 'Success',
        description: 'Subtask added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add subtask',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [addSubtask]);
  
  const addNestedSubtaskToTask = useCallback(async (taskId: string, parentSubtaskId: string | null, title: string) => {
    if (!taskId) {
      toast({
        title: 'Error',
        description: 'Cannot add nested subtask: No task ID provided',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      if (parentSubtaskId) {
        await addNestedSubtask(taskId, parentSubtaskId, title);
      } else {
        await addSubtask(taskId, title);
      }
      toast({
        title: 'Success',
        description: 'Subtask added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add nested subtask',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [addSubtask, addNestedSubtask]);

  const deleteSubtaskFromTask = useCallback(async (taskId: string, subtaskId: string): Promise<boolean> => {
    if (!taskId || !subtaskId) {
      toast({
        title: 'Error',
        description: 'Cannot delete subtask: Missing required information',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      if (typeof storeDeleteSubtask !== 'function') {
        throw new Error('Store deleteSubtask is not a function!');
      }
      
      await storeDeleteSubtask(taskId, subtaskId);
      
      toast({
        title: 'Success',
        description: 'Subtask deleted successfully',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subtask. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [storeDeleteSubtask]);
  
  const updateSubtask = useCallback(async (taskId: string, subtaskId: string, updates: Partial<Subtask>): Promise<boolean> => {
    if (!taskId || !subtaskId) {
      toast({
        title: 'Error',
        description: 'Cannot update subtask: Missing required information',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      if (typeof storeUpdateSubtask !== 'function') {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.subtasks) {
          throw new Error(`Task not found or has no subtasks: ${taskId}`);
        }
        
        let subtaskFound = false;
        const updatedSubtasks = task.subtasks.map(st => {
          if (st.id === subtaskId) {
            subtaskFound = true;
            return { 
              ...st, 
              ...updates,
              id: subtaskId,
              title: updates.title || st.title,
              completed: 'completed' in updates ? updates.completed : st.completed
            };
          }
          return st;
        });
        
        if (!subtaskFound) {
          throw new Error(`Subtask not found: ${subtaskId}`);
        }
        
        await updateTask({ 
          ...task, 
          id: taskId, 
          subtasks: updatedSubtasks 
        });
      } else {
        await storeUpdateSubtask(taskId, subtaskId, updates);
      }
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update subtask. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [tasks, storeUpdateSubtask, updateTask]);
  
  return {
    toggleSubtask,
    addSubtask: addNewSubtask,
    addNestedSubtask: addNestedSubtaskToTask,
    deleteSubtask: deleteSubtaskFromTask,
    updateSubtask,
    isUpdating
  };
};
