
import React from 'react';
import { cn } from '@/lib/utils';
import { Priority } from '@/types/kanban';

export interface PrioritySelectorProps {
  selectedPriority: Priority;
  onPriorityChange: (priority: Priority, e?: React.MouseEvent) => void;
  taskId?: string;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  selectedPriority,
  onPriorityChange,
  taskId
}) => {
  const handlePriorityClick = (priority: Priority) => (e: React.MouseEvent) => {
    onPriorityChange(priority, e);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-500 mb-1 block">
        Priority
      </label>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePriorityClick('low')}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors hover:bg-blue-100 hover:text-blue-800",
            selectedPriority === 'low' ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
          )}
        >
          Low
        </button>
        <button
          onClick={handlePriorityClick('medium')}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors hover:bg-yellow-100 hover:text-yellow-800",
            selectedPriority === 'medium' ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
          )}
        >
          Medium
        </button>
        <button
          onClick={handlePriorityClick('high')}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors hover:bg-red-100 hover:text-red-800",
            selectedPriority === 'high' ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-600"
          )}
        >
          High
        </button>
      </div>
    </div>
  );
};

export default PrioritySelector;
