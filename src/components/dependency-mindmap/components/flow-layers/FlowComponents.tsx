import React, { useMemo } from "react";
import TaskNode from "../../TaskNode";
import SubtaskNode from "../../SubtaskNode";
import EnhancedEdge from "../../EnhancedEdge";

export const useFlowComponents = () => {
  const nodeTypes = useMemo(
    () => ({
      taskNode: TaskNode,
      subtaskNode: SubtaskNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      enhanced: EnhancedEdge,
    }),
    []
  );

  return {
    nodeTypes,
    edgeTypes,
  };
};
