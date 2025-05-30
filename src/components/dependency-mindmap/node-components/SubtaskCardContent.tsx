
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { SubtaskHeader } from './subtask-header/SubtaskHeader';
import { SubtaskActions } from './SubtaskActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageSquare } from 'lucide-react';

export interface SubtaskCardContentProps {
  label: string;
  completed: boolean;
  hasChildren: boolean;
  isCollapsed?: boolean;
  collaborators?: any[];
  isHovered?: boolean;
  isHighlighted?: boolean;
  dueDate?: string;
  commentCount?: number;
  subtaskId?: string;
  taskId?: string;
  onToggleCollapse: (e: React.MouseEvent) => void;
  onToggleComplete: (e: React.MouseEvent) => void;
  onAddSubtask: (e: React.MouseEvent) => void;
}

export const SubtaskCardContent: React.FC<SubtaskCardContentProps> = memo(({
  label,
  completed,
  hasChildren,
  isCollapsed = false,
  collaborators = [],
  isHovered = false,
  isHighlighted = false,
  dueDate,
  commentCount = 0,
  subtaskId,
  taskId,
  onToggleCollapse,
  onToggleComplete,
  onAddSubtask
}) => {
  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCollapse(e);
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(e);
  };

  const handleAddSubtask = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddSubtask(e);
  };

  return (
    <div className="flex flex-col gap-1 w-full clickable pointer-events-auto">
      <SubtaskHeader
        label={label}
        completed={completed}
        hasChildren={hasChildren}
        isCollapsed={isCollapsed}
        subtaskId={subtaskId}
        taskId={taskId}
        onToggleCollapse={handleToggleCollapse}
        onToggleComplete={handleToggleComplete}
      />

      <div className={cn(
        "flex justify-between items-center mt-1",
        completed && "opacity-60"
      )}>
        <div className="flex -space-x-2 overflow-hidden">
          {collaborators && collaborators.length > 0 ? (
            collaborators.slice(0, 3).map((collaborator, index) => (
              <Avatar 
                key={`${collaborator?.id || index}`}
                className="h-5 w-5 border border-white"
              >
                <AvatarImage src={collaborator?.avatar} alt={collaborator?.name || 'Collaborator'} />
                <AvatarFallback className="text-[8px]">
                  {collaborator?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            ))
          ) : (
            <span className="text-xs text-gray-400">No assignees</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{new Date(dueDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {commentCount > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <MessageSquare className="w-3 h-3 mr-1" />
              <span>{commentCount}</span>
            </div>
          )}
        </div>
      </div>

      <SubtaskActions
        isHovered={isHovered || false}
        label={label}
        hasChildren={hasChildren}
        subtaskId={subtaskId}
        onAddSubtask={handleAddSubtask}
      />
    </div>
  );
});

SubtaskCardContent.displayName = 'SubtaskCardContent';

export default SubtaskCardContent;
