import React, { memo, useCallback } from "react";
import { NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import useDependencyGraphStore from "@/store/dependencyGraph";
import { useToast } from "@/hooks/use-toast";
import { TaskNodeData } from "./types/nodeTypes";
import NodeHandles from "./node-components/NodeHandles";
import TaskNodeCard from "./node-components/TaskNodeCard";

const TaskNode: React.FC<NodeProps<TaskNodeData>> = ({
  data,
  isConnectable,
  id,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { toast } = useToast();
  const { isNodeCollapsed, toggleNodeCollapse } = useDependencyGraphStore();

  const nodeId =
    id || data.id || (data.task?.id ? `task-${data.task.id}` : undefined);

  if (!nodeId) {
    console.error("TaskNode created with no valid ID:", data);
  }

  const isCollapsed = isNodeCollapsed(nodeId || "");

  const handleToggleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (nodeId) {
        toggleNodeCollapse(nodeId);
      } else {
        console.error("Cannot toggle collapse: Missing node ID");
      }
    },
    [nodeId, toggleNodeCollapse]
  );

  const handleAddSubtask = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleViewTask = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      toast({
        title: "View Task",
        description: `Opening task: ${data.label}`,
      });
    },
    [data.label, toast]
  );

  const handleAddDependency = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      toast({
        title: "Add Dependency",
        description: "Select another task to create dependency",
      });
    },
    [toast]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const enhancedData = {
    ...data,
    id: nodeId,
  };

  return (
    <div
      className={cn(
        "transition-all duration-200 pointer-events-auto",
        data.isHighlighted && "z-10"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-id={nodeId}
    >
      <NodeHandles
        isConnectable={isConnectable}
        layoutDirection={data.layoutDirection}
      />

      <TaskNodeCard
        data={{
          ...enhancedData,
          isCollapsed: isCollapsed,
          isHighlighted: data.isHighlighted || false,
        }}
        isHovered={isHovered}
        handleToggleCollapse={handleToggleCollapse}
        handleViewTask={handleViewTask}
        handleAddDependency={handleAddDependency}
        handleAddSubtask={handleAddSubtask}
      />
    </div>
  );
};

export default memo(TaskNode);
