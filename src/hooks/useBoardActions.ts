
import { useCallback } from 'react';
import useKanbanStore from '@/store/useKanbanStore';
import { Task } from '@/types/kanban';
import { toast } from '@/hooks/use-toast';

export const useBoardActions = () => {
  const {
    updateColumnTitle,
    addTask,
    openTaskDrawer,
    toggleSubtaskCompletion,
    addSubtask,
    addNestedSubtask,
    updateTask,
    addColumn,
    deleteTask,
    deleteSubtask
  } = useKanbanStore();

  const handleAddTask = useCallback((columnId: string, title: string) => {
    addTask({
      title,
      column_id: columnId,
      priority: 'medium',
      labels: [],
      assignees: [],
      subtasks: [],
      has_deep_subtasks: false
    });
    
    toast({
      title: "Task added",
      description: `"${title}" has been added to the board`,
    });
  }, [addTask]);

  const handleOpenTaskDrawer = useCallback((task: Task) => {
    openTaskDrawer(task.id);
  }, [openTaskDrawer]);

  const handleToggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    toggleSubtaskCompletion(taskId, subtaskId);
  }, [toggleSubtaskCompletion]);

  const handleAddColumn = useCallback(async (columnData: any): Promise<void> => {
    await addColumn(columnData);
  }, [addColumn]);

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    updateTask({
      id: taskId,
      ...updates
    });
  }, [updateTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      const success = deleteTask(taskId);
      
      if (success) {
        toast({
          title: "Task deleted",
          description: "The task has been removed from the board",
        });
      }
    }
  }, [deleteTask]);

  const handleDeleteSubtask = useCallback(async (taskId: string, subtaskId: string): Promise<void> => {
    const confirmed = window.confirm("Are you sure you want to delete this subtask?");
    
    if (confirmed) {
      try {
        const success = await deleteSubtask(taskId, subtaskId);
        
        if (success) {
          toast({
            title: "Subtask deleted",
            description: "The subtask has been removed",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete subtask. Please try again.",
          variant: "destructive"
        });
      }
    }
    
    return Promise.resolve();
  }, [deleteSubtask]);

  return {
    updateColumnTitle,
    handleAddTask,
    handleOpenTaskDrawer,
    handleToggleSubtask,
    handleAddColumn,
    handleUpdateTask,
    handleDeleteTask,
    handleDeleteSubtask,
    addNestedSubtask
  };
};
