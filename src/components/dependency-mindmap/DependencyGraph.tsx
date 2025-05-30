
import React, { useMemo, useState } from "react";
import DependencyGraphContent from "./components/DependencyGraphContent";
import { useDependencyGraphData } from "./hooks/useDependencyGraphData";
import { useGraphLayout } from "./hooks/useGraphLayout";

const DependencyGraph: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { graphData, isLoading } = useDependencyGraphData(taskId);
  const { applyLayout } = useGraphLayout();
  const [layoutDirection, setLayoutDirection] = useState<"horizontal" | "vertical">(() => {
    const savedDirection = localStorage.getItem("dependency-graph-direction");
    return (savedDirection === "vertical" || savedDirection === "horizontal") 
      ? savedDirection 
      : "horizontal";
  });

  const toggleLayoutDirection = () => {
    const newDirection = layoutDirection === "horizontal" ? "vertical" : "horizontal";
    setLayoutDirection(newDirection);
    localStorage.setItem("dependency-graph-direction", newDirection);
  };

  const layouted = useMemo(() => {
    return applyLayout(
      { nodes: graphData.nodes, edges: graphData.edges },
      "dagre",
      layoutDirection
    );
  }, [graphData.nodes, graphData.edges, layoutDirection, applyLayout]);

  return (
    <DependencyGraphContent
      taskId={taskId}
      nodes={layouted.nodes}
      edges={layouted.edges}
      isLoading={isLoading}
      layoutDirection={layoutDirection}
      onToggleLayoutDirection={toggleLayoutDirection}
    />
  );
};

export default DependencyGraph;
