
import React from 'react';
import { Plus, Trash2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Subtask } from '@/types/kanban';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SubtaskItemMetadataProps {
  subtask: Subtask;
  isHovered: boolean;
  isEditing: boolean;
  onToggleDetailPanel: (e: React.MouseEvent) => void;
  onAddNested: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onReorderUp?: (e: React.MouseEvent) => void;
  onReorderDown?: (e: React.MouseEvent) => void;
}

const SubtaskItemMetadata: React.FC<SubtaskItemMetadataProps> = ({
  subtask,
  isHovered,
  isEditing,
  onToggleDetailPanel,
  onAddNested,
  onDelete,
  onReorderUp,
  onReorderDown
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(e);
  };
  
  return (
    <div className="flex items-center space-x-1">
      {subtask.assignee && typeof subtask.assignee !== 'string' && (
        <div className="relative opacity-80 group-hover:opacity-100 transition-opacity">
          <Avatar className="h-5 w-5 ring-1 ring-white">
            <AvatarImage 
              src={subtask.assignee.avatar} 
              alt={subtask.assignee.name} 
            />
            <AvatarFallback className="text-xs">
              {subtask.assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      {subtask.priority && !isEditing && (
        <div className={cn(
          "h-2 w-2 rounded-full",
          subtask.priority === 'high' ? "bg-red-500" :
          subtask.priority === 'medium' ? "bg-yellow-500" : "bg-gray-400"
        )} />
      )}
      
      <div className={cn(
        "flex space-x-1 transition-opacity duration-200", 
        isHovered && !isEditing ? "opacity-100" : "opacity-0"
      )}>
        {onReorderUp && onReorderDown && (
          <>
            <button 
              onClick={onReorderUp}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
              aria-label="Move subtask up"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </button>
            <button 
              onClick={onReorderDown}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
              aria-label="Move subtask down"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </>
        )}
        <button 
          onClick={onToggleDetailPanel}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
          aria-label="Edit subtask details"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={onAddNested}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
          aria-label="Add nested subtask"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={handleDelete}
          className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-sm transition-colors"
          aria-label="Delete subtask"
          data-subtask-id={subtask.id}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SubtaskItemMetadata;
