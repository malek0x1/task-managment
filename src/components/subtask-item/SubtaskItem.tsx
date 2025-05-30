
import React from 'react';
import { Subtask } from '@/types/kanban';
import SubtaskContextMenu from '@/components/SubtaskContextMenu';
import SubtaskItemContent from './SubtaskItemContent';
import SubtaskDetailWrapper from './SubtaskDetailWrapper';
import { useSubtaskItemLogic } from './useSubtaskItemLogic';

interface SubtaskItemProps {
  subtask: Subtask;
  taskId: string;
  onToggle: (taskId: string, subtaskId: string) => void;
  onOpenDeepSubtasks?: (e: React.MouseEvent) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  onAddNestedSubtask: (taskId: string, parentSubtaskId: string, title: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onReorderSubtask?: (taskId: string, subtaskId: string, direction: 'up' | 'down') => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  taskId,
  onToggle,
  onOpenDeepSubtasks,
  onUpdateSubtask,
  onAddNestedSubtask,
  onDeleteSubtask,
  onReorderSubtask
}) => {
  const {
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
  } = useSubtaskItemLogic({
    subtask,
    taskId,
    onToggle,
    onUpdateSubtask,
    onDeleteSubtask,
    onReorderSubtask,
    onAddNestedSubtask
  });
  
  if (isRemoved) {
    return null;
  }

  const hasChildren = subtask.children && subtask.children.length > 0;

  return (
    <div className="space-y-2">
      <SubtaskContextMenu
        subtask={subtask}
        onEdit={toggleDetailPanel}
        onAddNested={handleAddNested}
        onDelete={handleDelete}
        onToggle={handleToggle}
        onReorderUp={onReorderSubtask ? handleReorder('up') : undefined}
        onReorderDown={onReorderSubtask ? handleReorder('down') : undefined}
      >
        <SubtaskItemContent
          subtask={subtask}
          taskId={taskId}
          isHovered={isHovered}
          isEditing={isEditing}
          titleValue={titleValue}
          hasChildren={hasChildren}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onToggle={handleToggle}
          onDeepClick={onOpenDeepSubtasks}
          onEditTitle={() => setIsEditing(true)}
          onTitleChange={handleTitleChange}
          onTitleBlur={handleTitleBlur}
          onKeyDown={handleKeyDown}
          onToggleDetailPanel={toggleDetailPanel}
          onAddNested={handleAddNested}
          onDelete={handleDelete}
          onReorderUp={onReorderSubtask ? handleReorder('up') : undefined}
          onReorderDown={onReorderSubtask ? handleReorder('down') : undefined}
        />
      </SubtaskContextMenu>
      
      {(isEditing || isClosing) && (
        <SubtaskDetailWrapper
          isClosing={isClosing}
          subtask={subtask}
          onUpdate={handleUpdateSubtask}
          onClose={handleCloseDetailPanel}
        />
      )}
    </div>
  );
};

export default SubtaskItem;
