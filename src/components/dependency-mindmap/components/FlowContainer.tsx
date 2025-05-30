import React, { useMemo } from "react";
import { ReactFlowProvider } from "reactflow";
import { Node, Edge } from "reactflow";
import { OnNodesChange, OnEdgesChange, EdgeMouseHandler } from "reactflow";

interface FlowContainerProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onEdgeMouseEnter?: EdgeMouseHandler;
  onEdgeMouseLeave?: EdgeMouseHandler;
  layoutDirection?: "horizontal" | "vertical";
  children: React.ReactNode;
}

const FlowContainer: React.FC<FlowContainerProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onEdgeMouseEnter,
  onEdgeMouseLeave,
  layoutDirection = "horizontal",
  children,
}) => {
  const contextValue = useMemo(
    () => ({
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onEdgeMouseEnter,
      onEdgeMouseLeave,
    }),
    [
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onEdgeMouseEnter,
      onEdgeMouseLeave,
    ]
  );

  return (
    <div className="w-full h-full relative">
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </div>
  );
};

export default React.memo(FlowContainer);
