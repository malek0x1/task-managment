import { supabase } from './client';
import { toast } from '@/hooks/use-toast';
import type { Task, Priority, Label, Assignee, Subtask } from '@/types/kanban';
import type { Json } from '@/integrations/supabase/types';

interface DatabaseTask {
  id: string;
  project_id: string;
  column_id: string;
  title: string;
  description?: string;
  priority: string;
  order: number;
  due_date?: string;
  labels: Json;
  assignees: Json;
  subtasks: Json;
  time_estimate?: number;
  has_deep_subtasks?: boolean;
  has_dependencies?: boolean;
  has_automations?: boolean;
  has_ai_assistant?: boolean;
  excalidraw_data?: Json;
  created_at?: string;
  updated_at?: string;
}


export async function fetchTaskById(taskId: string): Promise<Task | null> {
  try {
    if (!taskId) {
      console.error("Task ID is required");
      return null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      return null;
    }

    if (!data) {
      return null;
    }


    const task = data as DatabaseTask;
    

    const validPriority = (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high') 
      ? task.priority as Priority 
      : 'medium' as Priority;
    

    const transformedTask: Task = {
      ...task,
      position: task.order,
      priority: validPriority,
      labels: Array.isArray(task.labels) ? task.labels as unknown as Label[] : [],
      assignees: Array.isArray(task.assignees) ? task.assignees as unknown as Assignee[] : [],
      subtasks: Array.isArray(task.subtasks) ? task.subtasks as unknown as Subtask[] : [],
      excalidraw_data: task.excalidraw_data || null,
    };

    return transformedTask;
  } catch (error) {
    console.error(`Exception in fetchTaskById for task ${taskId}:`, error);
    return null;
  }
}


export async function fetchTasks(projectId: string): Promise<Task[]> {
  try {
    if (!projectId) {
      console.error("Project ID is required to fetch tasks");
      return [];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('order');

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    

    const transformedData = (data as DatabaseTask[]).map(task => {

      const validPriority = (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high') 
        ? task.priority as Priority 
        : 'medium' as Priority;
      
      return {
        ...task,
        position: task.order,
        priority: validPriority,
        labels: Array.isArray(task.labels) ? task.labels as unknown as Label[] : [],
        assignees: Array.isArray(task.assignees) ? task.assignees as unknown as Assignee[] : [],
        subtasks: Array.isArray(task.subtasks) ? task.subtasks as unknown as Subtask[] : [],
        excalidraw_data: task.excalidraw_data || null,
      } as Task;
    });

    return transformedData;
  } catch (error) {
    console.error('Error in fetchTasks:', error);

    return [];
  }
}


export async function createTask(taskData: Partial<Task>): Promise<Task[]> {
  try {
    if (!taskData.project_id || !taskData.column_id) {
      throw new Error("Project ID and Column ID are required to create a task");
    }


    let priority: Priority = 'medium';
    if (taskData.priority && (taskData.priority === 'low' || taskData.priority === 'medium' || taskData.priority === 'high')) {
      priority = taskData.priority;
    }



    const taskToCreate = {
      project_id: taskData.project_id,
      column_id: taskData.column_id,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      priority: priority,
      order: taskData.order || taskData.position || 0,
      due_date: taskData.due_date,

      labels: (taskData.labels || []) as unknown as Json,
      assignees: (taskData.assignees || []) as unknown as Json,
      subtasks: (taskData.subtasks || []) as unknown as Json,

      has_deep_subtasks: taskData.has_deep_subtasks || false,
      has_dependencies: taskData.has_dependencies || taskData.dependencies?.length > 0 || false,
      has_automations: taskData.has_automations || false,
      has_ai_assistant: taskData.has_ai_assistant || false,

      excalidraw_data: taskData.excalidraw_data as unknown as Json || null,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskToCreate)
      .select();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }


    const transformedData = (data as DatabaseTask[]).map(task => {

      const validPriority = (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high') 
        ? task.priority as Priority 
        : 'medium' as Priority;
      
      return {
        ...task,
        position: task.order,
        priority: validPriority,
        labels: Array.isArray(task.labels) ? task.labels as unknown as Label[] : [],
        assignees: Array.isArray(task.assignees) ? task.assignees as unknown as Assignee[] : [],
        subtasks: Array.isArray(task.subtasks) ? task.subtasks as unknown as Subtask[] : [],
        excalidraw_data: task.excalidraw_data || null,
      } as Task;
    });

    return transformedData;
  } catch (error) {
    console.error('Error in createTask:', error);
    toast({
      title: 'Failed to create task',
      description: 'Please try again later.',
      variant: 'destructive',
    });
    throw error;
  }
}


export async function updateTask(taskData: Partial<Task> & { id: string }): Promise<void> {
  try {

    if (!taskData.id) {
      throw new Error("Task ID is required for update");
    }

    

    const existingTask = await fetchTaskById(taskData.id);
    if (!existingTask) {
      throw new Error(`Cannot update task ${taskData.id} - task not found in database`);
    }

    

    let priority: Priority = existingTask.priority || 'medium';
    if (taskData.priority) {
      if (taskData.priority === 'low' || taskData.priority === 'medium' || taskData.priority === 'high') {
        priority = taskData.priority;
      } else {
        console.warn(`Invalid priority value "${taskData.priority}" - using default "${priority}"`);
      }
    }
    

    const mergedTask = {
      ...existingTask,
      ...taskData,

      title: taskData.title || existingTask.title,
      priority: priority,
      column_id: taskData.column_id || existingTask.column_id,
      project_id: taskData.project_id || existingTask.project_id,
      order: taskData.order !== undefined ? taskData.order : existingTask.order,
    };
    


    const dbUpdatePayload = {
      id: mergedTask.id,
      title: mergedTask.title,
      description: mergedTask.description,
      column_id: mergedTask.column_id,
      project_id: mergedTask.project_id,
      priority: mergedTask.priority,
      order: mergedTask.order || mergedTask.position || 0,
      due_date: mergedTask.due_date,

      labels: (mergedTask.labels || []) as unknown as Json,
      assignees: (mergedTask.assignees || []) as unknown as Json,
      subtasks: (mergedTask.subtasks || []) as unknown as Json,
      has_deep_subtasks: mergedTask.has_deep_subtasks || false,
      has_dependencies: mergedTask.has_dependencies || false,
      has_automations: mergedTask.has_automations || false,
      has_ai_assistant: mergedTask.has_ai_assistant || false,
      excalidraw_data: mergedTask.excalidraw_data as unknown as Json || null,
      time_estimate: mergedTask.time_estimate as number,
    };
    
    
    const { error } = await supabase
      .from('tasks')
      .update(dbUpdatePayload)
      .eq('id', taskData.id);

    if (error) {
      console.error(`[SUPABASE] Error updating task ${taskData.id}:`, error);
      console.error(`[SUPABASE] Update payload:`, dbUpdatePayload);
      throw error;
    }

  } catch (error) {
    console.error('[SUPABASE] Error in updateTask:', error);
    console.error('[SUPABASE] Error stack:', error.stack);
    toast({
      title: 'Failed to update task',
      description: 'Please try again later.',
      variant: 'destructive',
    });
    throw error;
  }
}


export async function deleteTask(taskId: string): Promise<Error | null> {
  try {
    if (!taskId) {
      console.error("Task ID is required for deletion");
      return new Error("Task ID is required for deletion");
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error(`[SUPABASE] Error deleting task ${taskId}:`, error);
      return error;
    }

    return null;
  } catch (error) {
    console.error(`[SUPABASE] Exception in deleteTask for task ${taskId}:`, error);
    return error instanceof Error ? error : new Error('Unknown error during task deletion');
  }
}
