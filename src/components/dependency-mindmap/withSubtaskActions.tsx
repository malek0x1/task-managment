import React from "react";
import { useToast } from "@/hooks/use-toast";
import useNodeInteractions from "./hooks/useNodeInteractions";
import useDependencyGraphStore from "@/store/useDependencyGraphStore";

export interface WithSubtaskActionsProps {
  hoveredEdge: string | null;
  highlightedNodes: Set<string>;
  recentlyAddedNodes: Set<string>;
  // to fix type
  onEdgeMouseEnter: (event: React.MouseEvent, edge: any) => void;
  onEdgeMouseLeave: (event: React.MouseEvent, edge: any) => void;
  collapsedNodes: Set<string>;
  toggleNodeCollapse: (nodeId: string) => void;
  handleToggleSubtaskComplete: (
    subtaskId: string,
    completed: boolean,
    taskId?: string
  ) => void;
  handleAddSubtask: (taskId: string, parentSubtaskId?: string | null) => void;
  isNodeCollapsed: (nodeId: string) => boolean;
  isSubtaskCompleted: (subtaskId: string) => boolean;
}

const withSubtaskActions = <P extends object>(
  Component: React.ComponentType<P & WithSubtaskActionsProps>
) => {
  return (props: P) => {
    const { toast } = useToast();

    const {
      recentlyAddedNodes,
      hoveredEdge,
      highlightedNodes,
      onEdgeMouseEnter,
      onEdgeMouseLeave,
      collapsedNodes,
      toggleNodeCollapse,
      isNodeCollapsed,
      handleToggleSubtaskComplete,
      handleAddSubtask,
      isSubtaskCompleted,
    } = useNodeInteractions();

    return (
      <Component
        {...props}
        hoveredEdge={hoveredEdge}
        highlightedNodes={highlightedNodes}
        recentlyAddedNodes={recentlyAddedNodes}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        collapsedNodes={collapsedNodes}
        toggleNodeCollapse={toggleNodeCollapse}
        handleToggleSubtaskComplete={handleToggleSubtaskComplete}
        handleAddSubtask={handleAddSubtask}
        isNodeCollapsed={isNodeCollapsed}
        isSubtaskCompleted={isSubtaskCompleted}
      />
    );
  };
};

export default withSubtaskActions;
