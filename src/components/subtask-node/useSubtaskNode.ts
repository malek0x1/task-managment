
import { useState, useCallback } from 'react';
import { Subtask } from '@/types/kanban';

export const useSubtaskNode = ({ id, data }: { id: string; data: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [subtaskData, setSubtaskData] = useState(data?.subtask || {});

  const toggleContentExpanded = useCallback(() => {
    setIsContentExpanded(!isContentExpanded);
  }, [isContentExpanded]);

  const handleToggleComplete = useCallback(() => {
    if (data && data.onToggleComplete && data.subtask && data.subtask.id) {
      data.onToggleComplete(data.subtask.id);
    }
  }, [data]);

  const handleLabelChange = useCallback((newLabel: string) => {
    if (data && data.onUpdateSubtask && data.subtask && data.subtask.id) {
      data.onUpdateSubtask(data.taskId, data.subtask.id, { title: newLabel });
      setSubtaskData(prev => ({ ...prev, title: newLabel }));
    }
  }, [data]);

  const handleAddSubtask = useCallback(() => {
    if (data && data.onAddSubtask && data.subtask && data.subtask.id) {
      data.onAddSubtask(data.taskId, data.subtask.id);
    }
  }, [data]);

  const handleCollapseToggle = useCallback(() => {
    if (data && data.onToggleCollapse && data.subtask && data.subtask.id) {
      data.onToggleCollapse(data.subtask.id);
    }
  }, [data]);

  const handleDeleteSubtask = useCallback(() => {
    if (data && data.onDeleteSubtask && data.subtask && data.subtask.id) {
      data.onDeleteSubtask(data.taskId, data.subtask.id);
    }
  }, [data]);

  const handleAssigneeChange = useCallback((assigneeId: string) => {
    if (data && data.onUpdateSubtask && data.subtask && data.subtask.id) {
      data.onUpdateSubtask(data.taskId, data.subtask.id, { assigneeId });
      setSubtaskData(prev => ({ ...prev, assigneeId }));
    }
  }, [data]);

  const handleDescriptionChange = useCallback((description: string) => {
    if (data && data.onUpdateSubtask && data.subtask && data.subtask.id) {
      data.onUpdateSubtask(data.taskId, data.subtask.id, { description });
      setSubtaskData(prev => ({ ...prev, description }));
    }
  }, [data]);

  const handleDueDateChange = useCallback((dueDate: string) => {
    if (data && data.onUpdateSubtask && data.subtask && data.subtask.id) {
      data.onUpdateSubtask(data.taskId, data.subtask.id, { dueDate });
      setSubtaskData(prev => ({ ...prev, dueDate }));
    }
  }, [data]);

  const handleTimeEstimateChange = useCallback((timeEstimate: string) => {
    if (data && data.onUpdateSubtask && data.subtask && data.subtask.id) {
      data.onUpdateSubtask(data.taskId, data.subtask.id, { timeEstimate });
      setSubtaskData(prev => ({ ...prev, timeEstimate }));
    }
  }, [data]);

  const handlePriorityChange = useCallback((priority: string) => {
    if (data && data.onUpdateSubtask && data.subtask && data.subtask.id) {
      data.onUpdateSubtask(data.taskId, data.subtask.id, { priority });
      setSubtaskData(prev => ({ ...prev, priority }));
    }
  }, [data]);

  return {
    isExpanded,
    isContentExpanded,
    toggleContentExpanded,
    handleToggleComplete,
    handleLabelChange,
    handleAddSubtask,
    handleCollapseToggle,
    handleDeleteSubtask,
    isEditing,
    setIsEditing,
    handleAssigneeChange,
    handleDescriptionChange,
    handleDueDateChange,
    handleTimeEstimateChange,
    handlePriorityChange,
    isDetailPanelOpen,
    setIsDetailPanelOpen,
    subtaskData
  };
};
