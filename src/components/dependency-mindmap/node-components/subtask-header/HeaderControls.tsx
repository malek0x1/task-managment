
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderControlsProps {
  hasChildren: boolean;
  isCollapsed: boolean;
  onToggleCollapse: (e: React.MouseEvent) => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  hasChildren,
  isCollapsed,
  onToggleCollapse
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleCollapse(e);
  };

  if (!hasChildren) {
    return <div className="w-6" />;
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={cn(
        "h-6 w-6 p-0 hover:bg-gray-100 flex-shrink-0 clickable pointer-events-auto",
        isCollapsed ? "bg-blue-50 text-blue-600" : "text-gray-500"
      )}
      onClick={handleToggle}
      aria-label={isCollapsed ? "Expand subtasks" : "Collapse subtasks"}
      data-no-dnd="true"
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
};

export default HeaderControls;
