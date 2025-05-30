
import { StoreState } from '../../types';
import { createTask, updateTask, fetchTaskById, deleteTask as deleteTaskFromDB } from '@/lib/supabase';
import { Task } from '@/types/kanban';
import { toast } from '@/hooks/use-toast';
import { useProjectStore } from '../../../useProjectStore';

export interface CoreTaskActions {
  addTask: (taskData: Partial<Task>) => Promise<string>;
  moveTask: (taskId: string, toColumnId: string, index?: number) => Promise<void>;
  updateTask: (taskData: Partial<Task> & { id: string }) => Promise<void>;
  deleteTask: (taskId: string) => Promise<boolean>;
}

export const createCoreTaskActions = (
  set: (state: Partial<StoreState>) => void,
  get: () => StoreState
): CoreTaskActions => {
  return {
    addTask: async (taskData: Partial<Task>) => {
      const { currentProjectId } = useProjectStore.getState();
      if (!currentProjectId || !taskData.column_id) {
        toast({
          title: 'Missing required information',
          description: 'Project or column information is missing.',
          variant: 'destructive',
        });
        throw new Error('Missing required information');
      }

      const { tasks } = get();
      
      const tasksInColumn = tasks.filter(t => t.column_id === taskData.column_id);
      
      try {
        const newTaskData = {
          ...taskData,
          project_id: currentProjectId,
          order: tasksInColumn.length
        };
        
        const result = await createTask(newTaskData);
        
        if (result && result.length > 0) {
          set({ tasks: [...tasks, result[0]] });
          return result[0].id;
        }
        
        throw new Error('Failed to create task');
      } catch (error) {
        toast({
          title: 'Failed to create task',
          description: 'An error occurred while creating the task.',
          variant: 'destructive',
        });
        throw error;
      }
    },

    moveTask: async (taskId: string, toColumnId: string, index?: number) => {
      const { tasks } = get();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        toast({
          title: 'Task not found',
          description: 'The task you are trying to move does not exist.',
          variant: 'destructive',
        });
        return;
      }
      
      const fromColumnId = task.column_id;
      
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, column_id: toColumnId } : t
      );
      
      const updatedTasksWithOrder = updatedTasks.map(t => {
        if (t.column_id === toColumnId) {
          if (t.id === taskId && typeof index === 'number') {
            return { ...t, order: index };
          }
        }
        return t;
      });
      
      set({ tasks: updatedTasksWithOrder });
      
      try {
        const latestTask = await fetchTaskById(taskId);
        
        if (!latestTask) {
          throw new Error(`Failed to fetch latest task ${taskId} for move operation`);
        }
        
        const fullUpdatePayload = {
          ...latestTask,
          column_id: toColumnId,
          order: typeof index === 'number' ? index : latestTask.order
        };
        
        await updateTask(fullUpdatePayload);
        
      } catch (error) {
        set({
          tasks: tasks.map(t => 
            t.id === taskId ? { ...t, column_id: fromColumnId } : t
          )
        });
        
        toast({
          title: 'Failed to move task',
          description: 'An error occurred while moving the task.',
          variant: 'destructive',
        });
      }
    },

    updateTask: async (taskData: Partial<Task> & { id: string }) => {
      const { tasks } = get();
      const taskIndex = tasks.findIndex(t => t.id === taskData.id);
      
      if (taskIndex === -1) {
        toast({
          title: 'Task not found',
          description: 'The task you are trying to update does not exist.',
          variant: 'destructive',
        });
        return;
      }
      
      const oldTask = tasks[taskIndex];
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = { ...oldTask, ...taskData };
      
      set({ tasks: updatedTasks });
      
      try {
        const latestTask = await fetchTaskById(taskData.id);
        
        if (!latestTask) {
          throw new Error(`Failed to fetch latest task ${taskData.id} for update operation`);
        }
        
        const fullUpdatePayload = {
          ...latestTask,
          ...taskData,
        };
        
        if (fullUpdatePayload.subtasks) {
          try {
            const { ensureSubtaskFieldsInPlace } = require('@/utils/subtaskFieldUtils');
            const tempArray = [{ ...fullUpdatePayload }] as Task[];
            ensureSubtaskFieldsInPlace(tempArray);
            fullUpdatePayload.subtasks = tempArray[0].subtasks;
          } catch (err) {
            console.error("Error normalizing subtasks:", err);
          }
        }
        
        await updateTask(fullUpdatePayload);
        
        if (get().activeTask?.id === taskData.id) {
          set({ 
            activeTask: { ...get().activeTask, ...taskData } as Task 
          });
        }
      } catch (error) {
        const revertedTasks = [...get().tasks];
        revertedTasks[taskIndex] = oldTask;
        
        set({ tasks: revertedTasks });
        
        toast({
          title: 'Failed to update task',
          description: 'An error occurred while updating the task.',
          variant: 'destructive',
        });
      }
    },

    deleteTask: async (taskId: string): Promise<boolean> => {
      const { tasks } = get();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        toast({
          title: 'Task not found',
          description: 'The task you are trying to delete does not exist.',
          variant: 'destructive',
        });
        return false;
      }
      
      const originalTasks = [...tasks];
      
      set({ 
        tasks: tasks.filter(t => t.id !== taskId),
        activeTask: get().activeTask?.id === taskId ? null : get().activeTask
      });
      
      try {
        const error = await deleteTaskFromDB(taskId);
        
        if (error) {
          throw new Error('Failed to delete task from database');
        }
        
        return true;
      } catch (error) {
        set({ tasks: originalTasks });
        
        toast({
          title: 'Failed to delete task',
          description: 'An error occurred while deleting the task.',
          variant: 'destructive',
        });
        
        return false;
      }
    },
  };
};
