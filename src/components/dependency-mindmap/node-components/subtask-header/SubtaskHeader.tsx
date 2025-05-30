import React from "react";
import { cn } from "@/lib/utils";
import HeaderControls from "./HeaderControls";
import HeaderLabel from "./HeaderLabel";
import CompletionCheckbox from "./CompletionCheckbox";

interface SubtaskHeaderProps {
  label: string;
  completed: boolean;
  hasChildren: boolean;
  isCollapsed?: boolean;
  subtaskId?: string;
  taskId?: string;
  onToggleCollapse?: (e: React.MouseEvent) => void;
  onToggleComplete?: (e: React.MouseEvent) => void;
}

export const SubtaskHeader: React.FC<SubtaskHeaderProps> = ({
  label,
  completed,
  hasChildren,
  isCollapsed = false,
  subtaskId,
  taskId,
  onToggleCollapse,
  onToggleComplete,
}) => {
  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleCollapse) {
      onToggleCollapse(e);
    }
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleComplete) {
      onToggleComplete(e);
    }
  };

  return (
    <div
      className={cn("flex items-center gap-2 clickable pointer-events-auto")}
      data-no-dnd="true"
    >
      <CompletionCheckbox
        completed={completed}
        onToggleComplete={handleToggleComplete}
        subtaskId={subtaskId}
        taskId={taskId}
      />

      <HeaderLabel label={label} completed={completed} />

      <div className="ml-auto">
        <HeaderControls
          hasChildren={hasChildren}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>
    </div>
  );
};

export default SubtaskHeader;
