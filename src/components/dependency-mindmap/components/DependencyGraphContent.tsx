import React from "react";
import { ReactFlowProvider } from "reactflow";
import {
  PanelPosition,
  OnNodesChange,
  OnEdgesChange,
  EdgeMouseHandler,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { LayoutType, TypedNode, TypedEdge } from "../types/nodeTypes";
import MindmapLoadingState from "./MindmapLoadingState";
import MindmapFlow from "./MindmapFlow";
import { useNodeEventHandlers } from "../hooks/useNodeEventHandlers";
import useDependencyGraphStore from "@/store/useDependencyGraphStore";
import { useGraphControls } from "../hooks/useGraphControls";

interface DependencyGraphContentProps {
  nodes?: TypedNode[];
  edges?: TypedEdge[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onEdgeMouseEnter?: EdgeMouseHandler;
  onEdgeMouseLeave?: EdgeMouseHandler;
  isLoading?: boolean;
  layoutDirection?: "horizontal" | "vertical";
  onToggleLayoutDirection?: () => void;
  taskId?: string;
}

const DependencyGraphContent: React.FC<DependencyGraphContentProps> = ({
  nodes = [],
  edges = [],
  onNodesChange = () => {},
  onEdgesChange = () => {},
  onEdgeMouseEnter = () => {},
  onEdgeMouseLeave = () => {},
  isLoading = false,
  layoutDirection = "horizontal",
  onToggleLayoutDirection = () => {},
  taskId,
}) => {
  const { setNodes: setStoreNodes, setEdges: setStoreEdges } =
    useDependencyGraphStore();

  const {
    direction,
    layoutType,
    showMinimap,
    handleDirectionChange,
    handleLayoutChange,
    toggleMinimap,
  } = useGraphControls();

  const {
    throttledNodesChange,
    throttledEdgesChange,
    onNodeClick,
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
    onPaneClick,
  } = useNodeEventHandlers(
    (changes) => {
      onNodesChange(changes);

      setStoreNodes(
        nodes.map((node) => ({
          id: node.id,
          label: node.data?.label || "",
          type: node.type === "taskNode" ? "task" : "subtask",
        }))
      );
    },
    (changes) => {
      onEdgesChange(changes);

      setStoreEdges(
        edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.data?.type || "subtask",
        }))
      );
    }
  );

  if (isLoading) {
    return <MindmapLoadingState />;
  }

  return (
    <ReactFlowProvider>
      <MindmapFlow
        initialNodes={nodes}
        initialEdges={edges}
        direction={layoutDirection || direction}
        layoutType={layoutType}
        showMinimap={showMinimap}
        handleDirectionChange={handleDirectionChange}
        handleLayoutChange={handleLayoutChange}
        toggleMinimap={toggleMinimap}
        onNodesChangeExternal={throttledNodesChange}
        onEdgesChangeExternal={throttledEdgesChange}
        onToggleLayoutDirection={
          onToggleLayoutDirection ||
          (() =>
            handleDirectionChange(
              direction === "vertical" ? "horizontal" : "vertical"
            ))
        }
      />
    </ReactFlowProvider>
  );
};

export default React.memo(DependencyGraphContent);
