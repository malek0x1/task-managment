
import React, { useCallback } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface CompletionCheckboxProps {
  completed: boolean;
  subtaskId?: string;
  taskId?: string;
  onToggleComplete?: (e: React.MouseEvent) => void;
}

const CompletionCheckbox: React.FC<CompletionCheckboxProps> = ({
  completed,
  subtaskId,
  taskId,
  onToggleComplete
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (onToggleComplete) {
      onToggleComplete(e);
    }
  }, [onToggleComplete]);

  return (
    <div 
      className="subtask-checkbox flex items-center justify-center clickable pointer-events-auto"
      onClick={handleClick}
      data-no-dnd="true"
      role="checkbox"
      aria-checked={completed}
      tabIndex={0}
    >
      {completed ? (
        <CheckCircle2 
          className="h-4 w-4 text-green-600 cursor-pointer"
          data-no-dnd="true"
        />
      ) : (
        <Circle 
          className="h-4 w-4 text-gray-400 cursor-pointer"
          data-no-dnd="true"
        />
      )}
    </div>
  );
};

export default CompletionCheckbox;
