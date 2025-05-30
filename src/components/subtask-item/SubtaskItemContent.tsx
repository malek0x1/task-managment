
import React from 'react';
import { Check, Circle, ChevronsDown, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Subtask } from '@/types/kanban';
import SubtaskItemMetadata from './SubtaskItemMetadata';

interface SubtaskItemContentProps {
  subtask: Subtask;
  taskId: string;
  isHovered: boolean;
  isEditing: boolean;
  titleValue: string;
  hasChildren: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: (e: React.MouseEvent) => void;
  onDeepClick: (e: React.MouseEvent) => void;
  onEditTitle: (e: React.MouseEvent) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: (e: React.FocusEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onToggleDetailPanel: (e: React.MouseEvent) => void;
  onAddNested: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onReorderUp?: (e: React.MouseEvent) => void;
  onReorderDown?: (e: React.MouseEvent) => void;
}

const SubtaskItemContent: React.FC<SubtaskItemContentProps> = ({
  subtask,
  taskId,
  isHovered,
  isEditing,
  titleValue,
  hasChildren,
  onMouseEnter,
  onMouseLeave,
  onToggle,
  onDeepClick,
  onEditTitle,
  onTitleChange,
  onTitleBlur,
  onKeyDown,
  onToggleDetailPanel,
  onAddNested,
  onDelete,
  onReorderUp,
  onReorderDown
}) => {
  const showReorderControls = !!onReorderUp && !!onReorderDown;

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onToggle(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div 
      className="flex items-center py-1.5 text-sm group hover:bg-gray-50 rounded px-1.5 transition-colors"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showReorderControls && (
        <button 
          className={cn(
            "mr-1 cursor-grab text-gray-400 hover:text-gray-600 transition-opacity", 
            isHovered ? "opacity-100" : "opacity-0"
          )}
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      )}
      
      <button 
        className="mr-2 flex-shrink-0 hover:scale-110 transition-transform"
        onClick={handleToggleClick}
        onKeyDown={handleKeyDown}
        aria-label={subtask.completed ? "Mark as incomplete" : "Mark as complete"}
        tabIndex={0}
      >
        {subtask.completed ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Circle className="w-4 h-4 text-gray-400" />
        )}
      </button>
      
      <div className="flex-1 flex items-center justify-between">
        {!isEditing ? (
          <div className="flex items-center flex-1">
            <span 
              className={cn(
                "flex-1", 
                subtask.completed ? "line-through text-gray-400" : ""
              )}
              onClick={onEditTitle}
            >
              {subtask.title}
            </span>
            
            {hasChildren && (
              <button 
                className="ml-1 text-gray-400 hover:text-blue-500"
                onClick={onDeepClick}
              >
                <ChevronsDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={titleValue}
            onChange={onTitleChange}
            onBlur={onTitleBlur}
            onKeyDown={onKeyDown}
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        
        <SubtaskItemMetadata 
          subtask={subtask} 
          isHovered={isHovered} 
          isEditing={isEditing}
          onToggleDetailPanel={onToggleDetailPanel}
          onAddNested={onAddNested}
          onDelete={onDelete}
          onReorderUp={onReorderUp}
          onReorderDown={onReorderDown}
        />
      </div>
    </div>
  );
};

export default SubtaskItemContent;
