
import React, { useCallback } from 'react';
import { Task, Subtask } from '@/types/kanban';
import { useTaskDrawerState } from './hooks/useTaskDrawerState';
import TaskDrawerUI from './task-drawer/TaskDrawerUI';
import { useSubtaskActions } from '@/hooks/useSubtaskActions';

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddNestedSubtask: (taskId: string, parentSubtaskId: string | null, title: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onUpdateSubtask?: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => Promise<void>; 
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onToggleSubtask,
  onAddNestedSubtask,
  onUpdateTask,
  onUpdateSubtask,
  onDeleteSubtask
}) => {
  const { 
    deleteSubtask: storeDeleteSubtask,
    updateSubtask: storeUpdateSubtask
  } = useSubtaskActions();
  
  const deleteSubtaskHandler = useCallback(async (taskId: string, subtaskId: string): Promise<void> => {
    if (onDeleteSubtask) {
      return onDeleteSubtask(taskId, subtaskId);
    } else if (storeDeleteSubtask) {
      await storeDeleteSubtask(taskId, subtaskId);
      return;
    } else {
      return Promise.reject(new Error('No delete subtask function available'));
    }
  }, [onDeleteSubtask, storeDeleteSubtask]);
  
  const updateSubtaskHandler = useCallback(async (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    if (onUpdateSubtask) {
      onUpdateSubtask(taskId, subtaskId, updates);
    } else if (storeUpdateSubtask) {
      await storeUpdateSubtask(taskId, subtaskId, updates);
    } else {
      throw new Error('No update subtask function available');
    }
  }, [onUpdateSubtask, storeUpdateSubtask]);
  
  const state = useTaskDrawerState(
    task, 
    isOpen, 
    onUpdateTask, 
    onToggleSubtask, 
    onAddNestedSubtask, 
    updateSubtaskHandler, 
    deleteSubtaskHandler
  );
  
  return (
    <TaskDrawerUI
      task={task}
      isOpen={isOpen}
      onClose={onClose}
      state={state}
      actions={{
        ...state,
        handleDeleteSubtask: deleteSubtaskHandler,
        handleUpdateSubtask: updateSubtaskHandler
      }}
      onToggleSubtask={onToggleSubtask}
      onAddNestedSubtask={onAddNestedSubtask}
    />
  );
};

export default TaskDrawer;
