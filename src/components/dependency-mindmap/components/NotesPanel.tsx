import React, { useState, useEffect } from "react";
import ErrorBoundary from "@/components/ui/error-boundary";
import NoteCanvas from "../NoteCanvas";
import CollapsedPanel from "./CollapsedPanel";
import PanelHeader from "./PanelHeader";
import useSelectedNodeState from "../hooks/useSelectedNodeState";
import { Button } from "@/components/ui/button";
import { HardDrive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ensureExcalidrawData,
  clearAllExcalidrawDataExcept,
} from "@/utils/excalidrawDataFix";
import useKanbanStore from "@/store/useKanbanStore";

interface NotesPanelProps {
  taskId: string;
  isMinimized: boolean;
  toggleMinimized: () => void;
  panelLayout: "horizontal" | "vertical";
  togglePanelLayout: () => void;
  expandedPanel: "graph" | "notes" | null;
  togglePanelExpand: (panel: "graph" | "notes") => void;
  toggleFullscreen: () => void;
  renderNoTaskMessage: () => React.ReactNode;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  taskId,
  isMinimized,
  toggleMinimized,
  panelLayout,
  togglePanelLayout,
  expandedPanel,
  togglePanelExpand,
  toggleFullscreen,
  renderNoTaskMessage,
}) => {
  const { selectedNodeId, selectedNodeType } = useSelectedNodeState();
  const { toast } = useToast();
  const [isFixingData, setIsFixingData] = useState(false);
  const { tasks } = useKanbanStore();

  const effectiveNodeId = selectedNodeId || taskId;
  const effectiveNodeType = selectedNodeType || "task";

  const getTaskTitle = (id: string | null) => {
    if (!id) return "No task selected";

    const task = tasks.find((t) => t.id === id);
    if (task) return task.title;

    for (const task of tasks) {
      if (!task.subtasks) continue;

      const subtask = task.subtasks.find((st) => st.id === id);
      if (subtask) return subtask.title;
    }

    return id;
  };

  const getTitle = () => {
    if (selectedNodeId && selectedNodeId !== taskId) {
      return `Notes for: ${getTaskTitle(selectedNodeId)}`;
    }
    return `Notes for: ${getTaskTitle(taskId)}`;
  };

  const hasValidId = Boolean(effectiveNodeId);

  const handleFixExcalidrawData = () => {
    setIsFixingData(true);

    ensureExcalidrawData()
      .then(() => {
        toast({
          title: "Data Fixed",
          description:
            "All subtasks now have proper Excalidraw data structures.",
        });
      })
      .catch((error) => {
        console.error("Error fixing data:", error);
        toast({
          title: "Error",
          description: "Failed to fix Excalidraw data.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsFixingData(false);
      });
  };

  const handleClearExcept = () => {
    if (!effectiveNodeId) return;

    setIsFixingData(true);

    clearAllExcalidrawDataExcept(effectiveNodeId)
      .then(() => {
        toast({
          title: "Data Cleared",
          description: `All Excalidraw data cleared except for current node: ${effectiveNodeId}`,
        });
      })
      .catch((error) => {
        console.error("Error clearing data:", error);
        toast({
          title: "Error",
          description: "Failed to clear Excalidraw data.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsFixingData(false);
      });
  };

  if (isMinimized) {
    return (
      <CollapsedPanel
        direction="right"
        panelLayout={panelLayout}
        onToggle={toggleMinimized}
        tooltipText="Expand Canvas Panel"
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <PanelHeader
        title={getTitle()}
        taskId={null}
        panelLayout={panelLayout}
        togglePanelLayout={togglePanelLayout}
        onCollapse={toggleMinimized}
        onExpand={() => togglePanelExpand("notes")}
        onFullscreen={toggleFullscreen}
        isExpanded={expandedPanel === "notes"}
        panelType="notes"
        showFullscreen={true}
      />

      <div className="flex-1 p-3 overflow-hidden">
        <div className="h-full rounded-xl shadow-inner bg-muted/50 p-1">
          {hasValidId ? (
            <ErrorBoundary>
              <NoteCanvas
                taskId={effectiveNodeId}
                nodeType={effectiveNodeType}
                key={`${effectiveNodeType}-${effectiveNodeId}`}
              />
            </ErrorBoundary>
          ) : (
            renderNoTaskMessage()
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
