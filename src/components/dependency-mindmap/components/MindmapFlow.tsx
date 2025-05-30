import React, { useCallback, useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  PanelPosition,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import BackgroundLayer from "./flow-layers/BackgroundLayer";
import ControlsOverlay from "./flow-layers/ControlsOverlay";
import { useFlowComponents } from "./flow-layers/FlowComponents";
import {
  TypedNode,
  TypedEdge,
  isSubtaskNodeData,
  isTaskNodeData,
} from "../types/nodeTypes";

interface MindmapFlowProps {
  initialNodes: TypedNode[];
  initialEdges: TypedEdge[];
  direction: "vertical" | "horizontal";
  layoutType?: string;
  showMinimap?: boolean;
  handleDirectionChange?: (dir: "vertical" | "horizontal") => void;
  handleLayoutChange?: (layout: string) => void;
  toggleMinimap?: () => void;
  onNodesChangeExternal?: OnNodesChange;
  onEdgesChangeExternal?: OnEdgesChange;
  onConnectExternal?: OnConnect;
  onToggleLayoutDirection?: () => void;
}

const MindmapFlow: React.FC<MindmapFlowProps> = ({
  initialNodes,
  initialEdges,
  direction,
  onToggleLayoutDirection = () => {},
  layoutType = "dagre",
  showMinimap = true,
  handleDirectionChange = () => {},
  handleLayoutChange = () => {},
  toggleMinimap = () => {},
  onNodesChangeExternal,
  onEdgesChangeExternal,
  onConnectExternal,
}) => {
  const { nodeTypes, edgeTypes } = useFlowComponents();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes as Node[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges as Edge[]
  );

  const latestStateRef = useRef({
    direction,
    layoutType,
    nodeCount: initialNodes.length,
    nodeStructureFingerprint: "",
    collapsedNodesCount: 0,
  });

  const nodeStructureFingerprint = useMemo(() => {
    return initialNodes
      .map((node) => {
        let parentId = "";

        if (node.data) {
          if (isSubtaskNodeData(node.data)) {
            parentId = node.data.parentSubtaskId || "";
          } else if (isTaskNodeData(node.data)) {
            parentId = "";
          }
        }

        return `${node.id}:${parentId}:${node.hidden ? "1" : "0"}`;
      })
      .join("|");
  }, [initialNodes]);

  const collapsedNodesCount = useMemo(() => {
    return initialNodes.filter((node) => node.hidden).length;
  }, [initialNodes]);

  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    const currentState = {
      direction,
      layoutType,
      nodeCount: initialNodes.length,
      nodeStructureFingerprint,
      collapsedNodesCount,
    };

    const hasLayoutDirectionChanged =
      currentState.direction !== latestStateRef.current.direction;
    const hasLayoutTypeChanged =
      currentState.layoutType !== latestStateRef.current.layoutType;
    const hasNodeCountChanged =
      currentState.nodeCount !== latestStateRef.current.nodeCount;
    const hasStructureChanged =
      currentState.nodeStructureFingerprint !==
      latestStateRef.current.nodeStructureFingerprint;
    const hasCollapsedStateChanged =
      currentState.collapsedNodesCount !==
      latestStateRef.current.collapsedNodesCount;

    if (
      hasLayoutDirectionChanged ||
      hasLayoutTypeChanged ||
      hasNodeCountChanged ||
      hasStructureChanged ||
      hasCollapsedStateChanged
    ) {
      setNodes(initialNodes as Node[]);
      setEdges(initialEdges as Edge[]);

      if (hasLayoutDirectionChanged) {
        setTimeout(() => {
          reactFlowInstance.fitView({
            padding: 0.2,
            includeHiddenNodes: false,
          });
        }, 50);
      }

      latestStateRef.current = currentState;
    }
  }, [
    direction,
    layoutType,
    initialNodes,
    initialEdges,
    nodeStructureFingerprint,
    collapsedNodesCount,
    setNodes,
    setEdges,
    reactFlowInstance,
  ]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      if (onConnectExternal) {
        onConnectExternal(params);
      }
    },
    [setEdges, onConnectExternal]
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      if (onNodesChangeExternal) {
        onNodesChangeExternal(changes);
      }
    },
    [onNodesChange, onNodesChangeExternal]
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      if (onEdgesChangeExternal) {
        onEdgesChangeExternal(changes);
      }
    },
    [onEdgesChange, onEdgesChangeExternal]
  );

  const onZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);

  const onZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);

  const onFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
  }, [reactFlowInstance]);

  const handleToggleDirection = useCallback(() => {
    onToggleLayoutDirection();

    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
    }, 100);
  }, [onToggleLayoutDirection, reactFlowInstance]);

  const onDownloadImage = useCallback(() => {}, []);

  const onGenerateInsights = useCallback(() => {}, []);

  const enhancedReactFlowProps = {
    nodesDraggable: true,
    nodesConnectable: true,
    elementsSelectable: true,
    selectNodesOnDrag: false,
    panOnDrag: true,
    zoomOnScroll: true,
    zoomOnPinch: true,
    panOnScroll: false,
    preventScrolling: false,
    proOptions: { hideAttribution: true },
    fitView: true,

    nodeTypes,
    edgeTypes,
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={onConnect}
      {...enhancedReactFlowProps}
    >
      <BackgroundLayer />

      <ControlsOverlay
        direction={direction}
        onToggleLayoutDirection={handleToggleDirection}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitView={onFitView}
        onDownloadImage={onDownloadImage}
        onGenerateInsights={onGenerateInsights}
      />
    </ReactFlow>
  );
};

export default React.memo(MindmapFlow);
