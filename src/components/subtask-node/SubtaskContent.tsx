
import React from 'react';
import { cn } from '@/lib/utils';
import { Subtask } from '@/types/kanban';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CompletionButton from './CompletionButton';
import TitleEditor from './TitleEditor';
import SubtaskActionButtons from './SubtaskActionButtons';

interface SubtaskContentProps {
  subtask: Subtask;
  taskId: string;
  completed: boolean;
  hasChildren: boolean;
  isHovered: boolean;
  isEditingTitle: boolean;
  titleValue: string;
  handleTitleChange: (newTitle: string) => void;
  handleTitleBlur: (e: React.FocusEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleToggle: (taskId: string, subtaskId: string) => void;
  handleToggleDetailPanel: (e: React.MouseEvent) => void;
  setShowAddInput: (value: boolean | ((prev: boolean) => boolean)) => void;
  handleDelete: (e: React.MouseEvent) => void;
  setIsEditingTitle: (value: boolean) => void;
}

const SubtaskContent: React.FC<SubtaskContentProps> = ({
  subtask,
  taskId,
  completed,
  hasChildren,
  isHovered,
  isEditingTitle,
  titleValue,
  handleTitleChange,
  handleTitleBlur,
  handleKeyDown,
  handleToggle,
  handleToggleDetailPanel,
  setShowAddInput,
  handleDelete,
  setIsEditingTitle
}) => {
  const handleShowAddInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddInput(prev => !prev);
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTitleChange(e.target.value);
  };

  return (
    <div 
      className="flex items-start py-1 group hover:bg-gray-50 rounded px-1"
      onClick={(e) => e.stopPropagation()}
    >
      <CompletionButton 
        completed={completed}
        taskId={taskId}
        subtaskId={subtask?.id || ''}
        onToggle={handleToggle}
      />
      
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TitleEditor
            title={subtask?.title || titleValue}
            completed={completed}
            isEditingTitle={isEditingTitle}
            titleValue={titleValue}
            onTitleChange={onTitleChange}
            onTitleBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            onStartEdit={() => setIsEditingTitle(true)}
          />
          
          {hasChildren && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {subtask?.children?.length || 0}
            </span>
          )}
          
          {subtask?.priority && (
            <span className={cn(
              "h-1.5 w-1.5 rounded-full",
              subtask.priority === 'high' ? "bg-red-500" : 
              subtask.priority === 'medium' ? "bg-yellow-500" : "bg-gray-500"
            )} />
          )}
        </div>
        
        <div className="flex items-center">
          {subtask?.assignee && typeof subtask.assignee !== 'string' && (
            <Avatar className="h-5 w-5 mr-1">
              <AvatarImage 
                src={subtask.assignee.avatar} 
                alt={subtask.assignee.name} 
              />
              <AvatarFallback className="text-xs">
                {subtask.assignee.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={cn(
            "transition-opacity duration-200", 
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <SubtaskActionButtons
              onToggleDetailPanel={handleToggleDetailPanel}
              onShowAddInput={handleShowAddInput}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtaskContent;
