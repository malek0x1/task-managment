
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Plus, Check, Circle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Subtask } from '@/types/kanban';

interface SubtaskContextMenuProps {
  children: React.ReactNode;
  subtask: Subtask;
  onEdit: (e: React.MouseEvent) => void;
  onAddNested: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onToggle: (e: React.MouseEvent) => void;
  onReorderUp?: (e: React.MouseEvent) => void;
  onReorderDown?: (e: React.MouseEvent) => void;
}

const SubtaskContextMenu: React.FC<SubtaskContextMenuProps> = ({
  children,
  subtask,
  onEdit,
  onAddNested,
  onDelete,
  onToggle,
  onReorderUp,
  onReorderDown
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      onDelete(e);
    } catch (error) {
      console.error('SubtaskContextMenu: Error in delete handler:', error);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onToggle} className="cursor-pointer">
          {subtask.completed ? (
            <>
              <Circle className="mr-2 h-4 w-4" />
              <span>Mark as incomplete</span>
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              <span>Mark as complete</span>
            </>
          )}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit details</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onAddNested} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          <span>Add nested subtask</span>
        </ContextMenuItem>
        {(onReorderUp || onReorderDown) && (
          <>
            <ContextMenuSeparator />
            {onReorderUp && (
              <ContextMenuItem onClick={onReorderUp} className="cursor-pointer">
                <ArrowUp className="mr-2 h-4 w-4" />
                <span>Move up</span>
              </ContextMenuItem>
            )}
            {onReorderDown && (
              <ContextMenuItem onClick={onReorderDown} className="cursor-pointer">
                <ArrowDown className="mr-2 h-4 w-4" />
                <span>Move down</span>
              </ContextMenuItem>
            )}
          </>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete} className="cursor-pointer text-red-600 focus:bg-red-50">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default SubtaskContextMenu;
