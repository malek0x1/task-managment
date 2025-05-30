import { StoreState } from '../../types';
import { updateTask, fetchTaskById } from '@/lib/supabase';
import { Task, Subtask } from '@/types/kanban';
import { toast } from '@/hooks/use-toast';

export interface SubtaskActions {
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => Promise<void>;
  addSubtask: (taskId: string, subtaskTitle: string) => Promise<void>;
  addNestedSubtask: (taskId: string, parentSubtaskId: string, subtaskTitle: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<boolean>;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => Promise<boolean>;
}

export const createSubtaskActions = (
  set: (state: Partial<StoreState>) => void,
  get: () => StoreState
): SubtaskActions => {

  const DEFAULT_EXCALIDRAW_DATA = {
    appState: {},
    elements: [],
    lastSaved: new Date().toISOString()
  };
  

  const findSubtask = (task: Task, subtaskId: string): Subtask | undefined => {
    if (!task.subtasks) return undefined;
    

    const findInSubtasks = (subtasks: Subtask[], id: string): Subtask | undefined => {
      for (const subtask of subtasks) {
        if (subtask.id === id) return subtask;
        

        if (subtask.children && subtask.children.length > 0) {
          const found = findInSubtasks(subtask.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return findInSubtasks(task.subtasks, subtaskId);
  };
  

  const findSubtaskInAllTasks = (subtaskId: string): { task: Task, subtask: Subtask } | undefined => {
    const { tasks } = get();
    
    for (const task of tasks) {
      const subtask = findSubtask(task, subtaskId);
      if (subtask) {
        return { task, subtask };
      }
    }
    
    return undefined;
  };
  

  const actions: SubtaskActions = {

    toggleSubtaskCompletion: async (taskId: string, subtaskId: string) => {
      
      const { tasks } = get();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task || !task.subtasks) {
        console.error('Task not found or has no subtasks:', taskId);
        

        const result = findSubtaskInAllTasks(subtaskId);
        if (result) {

          return actions.toggleSubtaskCompletion(result.task.id, subtaskId);
        }
        
        toast({
          title: 'Error',
          description: 'Could not find the task or subtask',
          variant: 'destructive',
        });
        return;
      }
      
      const subtask = findSubtask(task, subtaskId);
      if (!subtask) {
        console.error('Subtask not found:', subtaskId);
        toast({
          title: 'Error',
          description: 'Could not find the subtask',
          variant: 'destructive',
        });
        return;
      }
      
      

      const updatedSubtasks = task.subtasks.map(st => 
        st.id === subtaskId ? { 
          ...st, 
          completed: !st.completed,

          title: st.title || "",
          parentSubtaskId: st.parentSubtaskId || null,
          excalidraw_data: st.excalidraw_data || { ...DEFAULT_EXCALIDRAW_DATA }
        } : st
      );
      

      const updatedTask = { ...task, subtasks: updatedSubtasks };
      

      set({ 
        tasks: tasks.map(t => t.id === taskId ? updatedTask : t) 
      });
      

      if (get().activeTask?.id === taskId) {
        set({ 
          activeTask: { ...get().activeTask!, subtasks: updatedSubtasks } 
        });
      }
      

      try {

        const latestTask = await fetchTaskById(taskId);
        
        if (!latestTask) {
          throw new Error(`Failed to fetch latest task ${taskId} for full-payload subtask update`);
        }
        

        const latestSubtask = findSubtask(latestTask, subtaskId);
        if (!latestSubtask) {
          throw new Error(`Failed to find subtask ${subtaskId} in latest task data`);
        }
        

        latestSubtask.completed = !latestSubtask.completed;
        

        const fullUpdatePayload = {
          ...latestTask,
          subtasks: latestTask.subtasks?.map(st => 
            st.id === subtaskId ? {
              ...st,
              completed: latestSubtask.completed,

              title: st.title || "",
              parentSubtaskId: st.parentSubtaskId || null,
              excalidraw_data: st.excalidraw_data || { ...DEFAULT_EXCALIDRAW_DATA }
            } : st
          )
        };
        

        await updateTask(fullUpdatePayload);
        
      } catch (error) {
        console.error('Error toggling subtask completion:', error);
        

        set({ tasks });
        

        toast({
          title: 'Error',
          description: 'Failed to update subtask. Changes are not saved.',
          variant: 'destructive',
        });
      }
    },


    addSubtask: async (taskId: string, subtaskTitle: string) => {
      
      const { tasks } = get();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        console.error('Task not found for adding subtask:', taskId);
        toast({
          title: 'Error adding subtask',
          description: 'Task not found',
          variant: 'destructive',
        });
        return;
      }
      

      const newSubtask: Subtask = {
        id: crypto.randomUUID(),
        title: subtaskTitle,
        completed: false,
        parentSubtaskId: null,
        excalidraw_data: { ...DEFAULT_EXCALIDRAW_DATA }
      };
      
      

      const subtasks = [...(task.subtasks || []), newSubtask];
      
      

      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, subtasks } : t
      );
      
      set({ tasks: updatedTasks });
      

      if (get().activeTask?.id === taskId) {
        set({ 
          activeTask: { ...get().activeTask!, subtasks } as Task 
        });
      }
      

      try {

        const latestTask = await fetchTaskById(taskId);
        
        if (!latestTask) {
          throw new Error(`Failed to fetch latest task ${taskId} for full-payload subtask creation`);
        }
        

        const fullUpdatePayload = {
          ...latestTask,
          subtasks: [...(latestTask.subtasks || []), newSubtask]
        };
        
        await updateTask(fullUpdatePayload);
        
        
        toast({
          title: 'Success',
          description: 'Subtask added successfully',
          duration: 2000,
        });
      } catch (error) {
        console.error('Error adding subtask:', error);
        
        set({ tasks });
        
        toast({
          title: 'Failed to add subtask',
          description: 'An error occurred while adding the subtask.',
          variant: 'destructive',
        });
      }
    },

    addNestedSubtask: async (taskId: string, parentSubtaskId: string, subtaskTitle: string) => {
      
      const { tasks } = get();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        console.error('Task not found for adding nested subtask:', taskId);
        toast({
          title: 'Error adding nested subtask',
          description: 'Task not found',
          variant: 'destructive',
        });
        return;
      }
      
      if (!task.subtasks) {
        console.error('Task has no subtasks array:', taskId);
        task.subtasks = [];
      }
      
      const newSubtask: Subtask = {
        id: crypto.randomUUID(),
        title: subtaskTitle,
        completed: false,
        parentSubtaskId: parentSubtaskId,
        excalidraw_data: { ...DEFAULT_EXCALIDRAW_DATA }
      };
      
      
      const subtasks = [...task.subtasks, newSubtask];
      
      
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, subtasks, has_deep_subtasks: true } : t
      );
      
      set({ tasks: updatedTasks });
      
      if (get().activeTask?.id === taskId) {
        set({ 
          activeTask: { ...get().activeTask!, subtasks, has_deep_subtasks: true } as Task 
        });
      }
      
      try {
        const latestTask = await fetchTaskById(taskId);
        
        if (!latestTask) {
          throw new Error(`Failed to fetch latest task ${taskId} for full-payload nested subtask creation`);
        }
        
        const fullUpdatePayload = {
          ...latestTask,
          subtasks: [...(latestTask.subtasks || []), newSubtask],
          has_deep_subtasks: true
        };
        
        await updateTask(fullUpdatePayload);
        
        
        toast({
          title: 'Success',
          description: 'Subtask added successfully',
          duration: 2000,
        });
      } catch (error) {
        console.error('Error adding nested subtask:', error);
        
        set({ tasks });
        
        toast({
          title: 'Failed to add nested subtask',
          description: 'An error occurred while adding the nested subtask.',
          variant: 'destructive',
        });
      }
    },
    
    deleteSubtask: async (taskId: string, subtaskId: string): Promise<boolean> => {
      

      if (!taskId || !subtaskId) {
        const error = new Error('Missing taskId or subtaskId for subtask deletion');
        console.error(error);
        toast({
          title: 'Error deleting subtask',
          description: 'Missing required information',
          variant: 'destructive',
        });
        throw error;
      }
      
      const { tasks } = get();
      const task = tasks.find(t => t.id === taskId);
      

      if (!task) {
        const error = new Error(`Task ${taskId} not found for subtask deletion`);
        console.error(error);
        toast({
          title: 'Error deleting subtask',
          description: 'Task not found',
          variant: 'destructive',
        });
        throw error;
      }
      

      if (!task.subtasks || !Array.isArray(task.subtasks)) {
        const error = new Error(`Task ${taskId} has no subtasks array`);
        console.error(error);
        toast({
          title: 'Error deleting subtask',
          description: 'No subtasks found',
          variant: 'destructive',
        });
        throw error;
      }
      
      

      const subtaskExists = task.subtasks.some(st => st.id === subtaskId);
      
      if (!subtaskExists) {
        const error = new Error(`Subtask ${subtaskId} not found in task ${taskId}`);
        console.error(error);
        toast({
          title: 'Error deleting subtask',
          description: 'Subtask not found',
          variant: 'destructive',
        });
        throw error;
      }
      
      const originalSubtasks = [...task.subtasks];
      

      const removeSubtaskRecursively = (
        subtasks: Subtask[], 
        subtaskIdToRemove: string
      ): Subtask[] => {

        const childrenIds = subtasks
          .filter(st => st.parentSubtaskId === subtaskIdToRemove)
          .map(st => st.id);
        
        

        let updatedSubtasks = [...subtasks];
        for (const childId of childrenIds) {
          updatedSubtasks = removeSubtaskRecursively(updatedSubtasks, childId);
        }
        

        const filtered = updatedSubtasks.filter(st => st.id !== subtaskIdToRemove);
        return filtered;
      };
      
      const updatedSubtasks = removeSubtaskRecursively(task.subtasks, subtaskId);
      
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t
      );
      
      set({ tasks: updatedTasks });
      
      if (get().activeTask?.id === taskId) {
        set({
          activeTask: { ...get().activeTask!, subtasks: updatedSubtasks }
        });
      }
      
      try {
        

        const latestTask = await fetchTaskById(taskId);
        
        if (!latestTask) {
          throw new Error(`Failed to fetch latest task ${taskId} for full-payload subtask deletion`);
        }
        
        
        let latestSubtasks = latestTask.subtasks || [];
        latestSubtasks = removeSubtaskRecursively(latestSubtasks, subtaskId);
        
        const fullUpdatePayload = {
          ...latestTask,
          subtasks: latestSubtasks
        };
       
        
        await updateTask(fullUpdatePayload);
        
        
        toast({
          title: 'Success',
          description: 'Subtask deleted successfully',
          duration: 2000,
        });
        
        return true;
      } catch (error) {
        console.error('STORE ACTION: Error in deleteSubtask operation:', error);
        
        const revertedTasks = tasks.map(t => 
          t.id === taskId ? { ...t, subtasks: originalSubtasks } : t
        );
        
        set({ tasks: revertedTasks });
        
        if (get().activeTask?.id === taskId) {
          set({
            activeTask: { ...get().activeTask!, subtasks: originalSubtasks }
          });
        }
        
        toast({
          title: 'Error deleting subtask',
          description: 'Failed to remove subtask from database. Please try again.',
          variant: 'destructive',
        });
        
        throw error;
      }
    },
    
    updateSubtask: async (taskId: string, subtaskId: string, updates: Partial<Subtask>): Promise<boolean> => {
      

      if (!taskId || !subtaskId) {
        const error = new Error('Missing taskId or subtaskId for subtask update');
        console.error(error);
        toast({
          title: 'Error updating subtask',
          description: 'Missing required information',
          variant: 'destructive',
        });
        return false;
      }
      
      const { tasks } = get();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        console.error('Task not found for updating subtask:', taskId);
        toast({
          title: 'Error updating subtask',
          description: 'Task not found',
          variant: 'destructive',
        });
        return false;
      }
      
      if (!task.subtasks || !Array.isArray(task.subtasks)) {
        console.error('Task has no subtasks array:', taskId);
        toast({
          title: 'Error updating subtask',
          description: 'No subtasks found',
          variant: 'destructive',
        });
        return false;
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
            completed: 'completed' in updates ? updates.completed : st.completed,
            parentSubtaskId: 'parentSubtaskId' in updates ? updates.parentSubtaskId : st.parentSubtaskId,
            excalidraw_data: updates.excalidraw_data || st.excalidraw_data || DEFAULT_EXCALIDRAW_DATA
          };
        }
        return st;
      });
      
      if (!subtaskFound) {
        console.error('Subtask not found for update:', subtaskId);
        toast({
          title: 'Error updating subtask',
          description: 'Subtask not found',
          variant: 'destructive',
        });
        return false;
      }
      

      const originalSubtasks = [...task.subtasks];
      

      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t
      );
      
      set({ tasks: updatedTasks });
      

      if (get().activeTask?.id === taskId) {
        set({
          activeTask: { ...get().activeTask!, subtasks: updatedSubtasks }
        });
      }
      
      try {

        const latestTask = await fetchTaskById(taskId);
        
        if (!latestTask) {
          throw new Error(`Failed to fetch latest task ${taskId} for full-payload subtask update`);
        }
        

        let latestSubtasksUpdated = false;
        const latestSubtasks = (latestTask.subtasks || []).map(st => {
          if (st.id === subtaskId) {
            latestSubtasksUpdated = true;
            return {
              ...st,
              ...updates,

              id: subtaskId,
              title: updates.title || st.title,
              completed: 'completed' in updates ? updates.completed : st.completed,
              parentSubtaskId: 'parentSubtaskId' in updates ? updates.parentSubtaskId : st.parentSubtaskId,
              excalidraw_data: updates.excalidraw_data || st.excalidraw_data || DEFAULT_EXCALIDRAW_DATA
            };
          }
          return st;
        });
        
        if (!latestSubtasksUpdated) {
          return false;
        }
        

        const fullUpdatePayload = {
          ...latestTask,
          subtasks: latestSubtasks
        };
        

        await updateTask(fullUpdatePayload);
        
        return true;
      } catch (error) {
        console.error('STORE ACTION: Error in updateSubtask operation:', error);
        

        const revertedTasks = tasks.map(t => 
          t.id === taskId ? { ...t, subtasks: originalSubtasks } : t
        );
        
        set({ tasks: revertedTasks });
        

        if (get().activeTask?.id === taskId) {
          set({
            activeTask: { ...get().activeTask!, subtasks: originalSubtasks }
          });
        }
        
        toast({
          title: 'Error updating subtask',
          description: 'Failed to save subtask changes. Please try again.',
          variant: 'destructive',
        });
        
        return false;
      }
    }
  };

  return actions;
};
