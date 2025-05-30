
import React from 'react';
import { Check, Circle } from 'lucide-react';
import { CompletionButtonProps } from './types';

const CompletionButton: React.FC<CompletionButtonProps> = ({
  completed,
  taskId,
  subtaskId,
  onToggle
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(taskId, subtaskId);
  };

  return (
    <button 
      className="mr-2 flex-shrink-0 mt-0.5"
      onClick={handleToggle}
      aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
    >
      {completed ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Circle className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
};

export default CompletionButton;
