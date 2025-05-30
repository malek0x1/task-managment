
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TaskNodeHeaderProps {
  label: string;
  status?: string;
  isCollapsed: boolean;
  handleToggleCollapse: (e: React.MouseEvent) => void;
}

export const TaskNodeHeader: React.FC<TaskNodeHeaderProps> = ({
  label,
  status,
  isCollapsed,
  handleToggleCollapse
}) => {
  return (
    <div className="flex items-center gap-2 flex-grow">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "h-6 w-6 p-0 hover:bg-gray-100 flex-shrink-0 clickable pointer-events-auto",
          isCollapsed ? "bg-blue-50 text-blue-600" : "text-gray-500"
        )}
        onClick={handleToggleCollapse}
        aria-label={isCollapsed ? "Expand subtasks" : "Collapse subtasks"}
        data-no-dnd="true"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{label}</h3>
        <div className="flex items-center gap-2 mt-1">
          {status === 'completed' || status === 'done' ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
          ) : status === 'in-progress' ? (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">In Progress</Badge>
          ) : status === 'blocked' ? (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Blocked</Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">To Do</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskNodeHeader;
