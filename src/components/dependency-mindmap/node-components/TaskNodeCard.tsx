
import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import TaskNodeHeader from "./TaskNodeHeader";
import TaskNodeContent from "./TaskNodeContent";
import TaskNodeFooter from "./TaskNodeFooter";
import { TaskNodeData } from "../types/nodeTypes";

interface TaskNodeCardProps {
  data: TaskNodeData;
  isHovered: boolean;
  handleToggleCollapse: (e: React.MouseEvent) => void;
  handleViewTask: (e: React.MouseEvent) => void;
  handleAddDependency: (e: React.MouseEvent) => void;
  handleAddSubtask: (e: React.MouseEvent) => void;
}

export const TaskNodeCard: React.FC<TaskNodeCardProps> = ({
  data,
  isHovered,
  handleToggleCollapse,
  handleViewTask,
  handleAddDependency,
  handleAddSubtask,
}) => {
  const subtasksCount = data.task.subtasks?.length || 0;
  const taskId = data.id || (data.task?.id ? `task-${data.task.id}` : undefined);

  return (
    <Card
      className={cn(
        "w-[280px] transition-all duration-200 shadow-md border-l-4 pointer-events-auto",
        data.task.priority === "high"
          ? "border-l-red-500"
          : data.task.priority === "medium"
          ? "border-l-amber-500"
          : data.task.priority === "low"
          ? "border-l-blue-500"
          : "border-l-gray-300",
        isHovered && "shadow-lg scale-[1.02]",
        data.isHighlighted && "ring-2 ring-primary/40 scale-[1.03]"
      )}
    >
      <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-start pointer-events-auto">
        <TaskNodeHeader
          label={data.label}
          status={data.status}
          isCollapsed={!!data.isCollapsed}
          handleToggleCollapse={handleToggleCollapse}
        />
      </CardHeader>

      <CardContent className="pb-2 px-4 pointer-events-auto">
        <TaskNodeContent data={data} />
      </CardContent>

      <CardFooter className="pt-0 px-4 pb-3 pointer-events-auto">
        <TaskNodeFooter
          id={taskId}
          isHovered={isHovered}
          hasChildren={!!data.hasChildren}
          subtasksCount={subtasksCount}
          handleViewTask={handleViewTask}
          handleAddDependency={handleAddDependency}
          handleAddSubtask={handleAddSubtask}
        />
      </CardFooter>
    </Card>
  );
};

export default TaskNodeCard;
