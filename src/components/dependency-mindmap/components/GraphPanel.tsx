import React from "react";
import ErrorBoundary from "@/components/ui/error-boundary";
import DependencyGraph from "../DependencyGraph";
import CollapsedPanel from "./CollapsedPanel";
import PanelHeader from "./PanelHeader";
import useSelectedNodeState from "../hooks/useSelectedNodeState";

interface GraphPanelProps {
  taskId: string;
  isMinimized: boolean;
  toggleMinimized: () => void;
  panelLayout: "horizontal" | "vertical";
  togglePanelLayout: () => void;
  expandedPanel: "graph" | "notes" | null;
  togglePanelExpand: (panel: "graph" | "notes") => void;
  renderNoTaskMessage: () => React.ReactNode;
}

const GraphPanel: React.FC<GraphPanelProps> = ({
  taskId,
  isMinimized,
  toggleMinimized,
  panelLayout,
  togglePanelLayout,
  expandedPanel,
  togglePanelExpand,
  renderNoTaskMessage,
}) => {
  const { selectNode } = useSelectedNodeState();

  React.useEffect(() => {
    if (taskId) {
      selectNode(taskId, "task");
    } else {
      selectNode(null, null);
    }
  }, [taskId, selectNode]);

  if (isMinimized) {
    return (
      <CollapsedPanel
        direction="left"
        panelLayout={panelLayout}
        onToggle={toggleMinimized}
        tooltipText="Expand Graph Panel"
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <PanelHeader
        title="Dependency Graph"
        panelLayout={panelLayout}
        togglePanelLayout={togglePanelLayout}
        onCollapse={toggleMinimized}
        onExpand={() => togglePanelExpand("graph")}
        isExpanded={expandedPanel === "graph"}
        panelType="graph"
      />
      <div className="flex-1 overflow-hidden">
        {taskId ? (
          <ErrorBoundary>
            <DependencyGraph taskId={taskId} />
          </ErrorBoundary>
        ) : (
          renderNoTaskMessage()
        )}
      </div>
    </div>
  );
};

export default GraphPanel;
