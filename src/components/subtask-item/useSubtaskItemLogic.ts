
import { useState, useCallback, useEffect } from 'react';
import { Subtask } from '@/types/kanban';

interface UseSubtaskItemLogicProps {
  subtask: Subtask;
  taskId: string;
  onToggle: (taskId: string, subtaskId: string) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onReorderSubtask?: (taskId: string, subtaskId: string, direction: 'up' | 'down') => void;
  onAddNestedSubtask: (taskId: string, parentSubtaskId: string, title: string) => void;
}

export const useSubtaskItemLogic = ({
  subtask,
  taskId,
  onToggle,
  onUpdateSubtask,
  onDeleteSubtask,
  onReorderSubtask,
  onAddNestedSubtask
}: UseSubtaskItemLogicProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [titleValue, setTitleValue] = useState(subtask.title);
  const [isClosing, setIsClosing] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  
  useEffect(() => {
    setTitleValue(subtask.title);
  }, [subtask.title]);
  
  const handleToggle = useCallback(() => {
    onToggle(taskId, subtask.id);
  }, [taskId, subtask.id, onToggle]);
  
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  }, []);
  
  const handleTitleBlur = useCallback(() => {
    if (titleValue.trim() && titleValue !== subtask.title) {
      onUpdateSubtask(taskId, subtask.id, { title: titleValue.trim() });
    } else {
      setTitleValue(subtask.title);
    }
  }, [taskId, subtask.id, titleValue, subtask.title, onUpdateSubtask]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (titleValue.trim() && titleValue !== subtask.title) {
        onUpdateSubtask(taskId, subtask.id, { title: titleValue.trim() });
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setTitleValue(subtask.title);
      setIsEditing(false);
    }
  }, [taskId, subtask.id, titleValue, subtask.title, onUpdateSubtask]);
  
  const toggleDetailPanel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(prev => !prev);
    if (!isEditing) {
      setIsClosing(false);
    }
  }, [subtask.id, isEditing]);
  
  const handleUpdateSubtask = useCallback((updates: Partial<Subtask>) => {
    onUpdateSubtask(taskId, subtask.id, updates);
  }, [taskId, subtask.id, onUpdateSubtask]);
  
  const handleAddNested = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSubtaskTitle = 'New subtask';
    onAddNestedSubtask(taskId, subtask.id, newSubtaskTitle);
  }, [taskId, subtask.id, onAddNestedSubtask]);
  
  const handleDelete = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDeleteSubtask(taskId, subtask.id);
    setIsRemoved(true);
  }, [taskId, subtask.id, onDeleteSubtask]);
  
  const handleCloseDetailPanel = useCallback(() => {
    setIsClosing(true);
    
    const timer = setTimeout(() => {
      setIsEditing(false);
      setIsClosing(false);
    }, 350);
    
    return () => clearTimeout(timer);
  }, [subtask.id]);
  
  const handleReorder = useCallback((direction: 'up' | 'down') => (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onReorderSubtask) {
      onReorderSubtask(taskId, subtask.id, direction);
    }
  }, [taskId, subtask.id, onReorderSubtask]);
  
  return {
    isEditing,
    setIsEditing,
    isHovered,
    setIsHovered,
    titleValue,
    isClosing,
    isRemoved,
    handleToggle,
    handleTitleChange,
    handleTitleBlur,
    handleKeyDown,
    toggleDetailPanel,
    handleUpdateSubtask,
    handleAddNested,
    handleDelete,
    handleCloseDetailPanel,
    handleReorder
  };
};
