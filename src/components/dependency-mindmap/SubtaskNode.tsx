import React, { memo, useCallback } from "react";
import { NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SubtaskNodeData } from "./types/nodeTypes";
import useDependencyGraphStore from "@/store/dependencyGraph";
import NodeHandles from "./node-components/NodeHandles";
import SubtaskCardContent from "./node-components/SubtaskCardContent";

const SubtaskNode: React.FC<NodeProps<SubtaskNodeData>> = ({
  data,
  isConnectable,
  selected,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { toast } = useToast();

  const {
    toggleNodeCollapse,
    setSubtaskCompletion,
    isNodeCollapsed,
    isSubtaskCompleted,
    extractTaskId,
  } = useDependencyGraphStore();

  const subtaskId = data.subtask?.id || "";

  const completed = isSubtaskCompleted(subtaskId);

  const isCollapsed = isNodeCollapsed(subtaskId);

  const taskId = data.taskId || extractTaskId(subtaskId);

  const handleToggleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (data.hasChildren) {
        toggleNodeCollapse(subtaskId);
      }
    },
    [data.hasChildren, subtaskId, toggleNodeCollapse]
  );

  const handleToggleComplete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const newCompletedState = !completed;

      setSubtaskCompletion(subtaskId, newCompletedState, taskId);

      toast({
        title: newCompletedState
          ? "Subtask completed"
          : "Subtask marked as incomplete",
        description: `"${data.label}" has been ${
          newCompletedState ? "marked as complete" : "unmarked"
        }`,
        duration: 2000,
      });
    },
    [data.label, subtaskId, completed, setSubtaskCompletion, taskId, toast]
  );

  const handleAddSubtask = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-200 pointer-events-auto",
        data.isHighlighted && "z-10",
        selected && "z-50"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-id={subtaskId}
    >
      <NodeHandles
        isConnectable={isConnectable}
        layoutDirection={data.layoutDirection}
      />

      <Card
        className={cn(
          "w-[240px] transition-all duration-200 border shadow-md overflow-visible pointer-events-auto",
          completed && "bg-green-50/80 border-green-200",
          isHovered && "shadow-lg scale-[1.02]",
          data.isHighlighted && "ring-2 ring-primary scale-[1.03]",
          selected && "ring-2 ring-primary border-primary"
        )}
      >
        <CardContent className="p-3 pointer-events-auto">
          <SubtaskCardContent
            label={data.label}
            completed={completed}
            hasChildren={data.hasChildren || false}
            isCollapsed={isCollapsed}
            collaborators={data.collaborators || []}
            isHovered={isHovered}
            isHighlighted={data.isHighlighted || false}
            dueDate={data.dueDate}
            commentCount={data.commentCount || 0}
            subtaskId={subtaskId}
            taskId={taskId}
            onToggleCollapse={handleToggleCollapse}
            onToggleComplete={handleToggleComplete}
            onAddSubtask={handleAddSubtask}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(SubtaskNode);
