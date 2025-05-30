
import React, { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { Column } from '@/types/kanban';
import { Pencil } from 'lucide-react';

interface ColumnHeaderProps {
  column: Column;
  onUpdateTitle: (id: string, title: string) => void;
  taskCount: number;
  isDragging?: boolean;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = memo(({ 
  column, 
  onUpdateTitle, 
  taskCount,
  isDragging = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);
  
  const handleTitleUpdate = useCallback(() => {
    if (title.trim() && title !== column.title) {
      onUpdateTitle(column.id, title.trim());
    }
    setIsEditing(false);
  }, [title, column.id, column.title, onUpdateTitle]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleUpdate();
    } else if (e.key === 'Escape') {
      setTitle(column.title);
      setIsEditing(false);
    }
  }, [handleTitleUpdate, column.title]);
  
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  return (
    <div className="flex items-center justify-between mb-4">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleTitleUpdate}
          className="flex-1 p-1 text-sm font-semibold rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <h2 className="text-sm font-semibold">{column.title}</h2>
      )}
      
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 text-xs">{taskCount}</span>
        {!isDragging && (
          <button 
            onClick={startEditing}
            className={cn(
              "text-gray-500 hover:text-gray-700 focus:outline-none",
              isEditing ? "hidden" : ""
            )}
            aria-label="Edit column title"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
});

ColumnHeader.displayName = 'ColumnHeader';

export default ColumnHeader;
