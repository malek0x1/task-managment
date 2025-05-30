import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useDependencyGraphStore from "@/store/dependencyGraph";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import MindmapMobileView from "./components/MindmapMobileView";
import MindmapDesktopView from "./components/MindmapDesktopView";
import FullscreenNotesModal from "./components/FullscreenNotesModal";

interface TaskDependencyMindmapProps {
  taskId?: string;
  expandedPanel?: "graph" | "notes" | null;
  onExpandPanel?: (panel: "graph" | "notes" | null) => void;
  isMobile?: boolean;
  panelLayout?: "horizontal" | "vertical";
  onPanelLayoutChange?: (layout: "horizontal" | "vertical") => void;
}

const TaskDependencyMindmap: React.FC<TaskDependencyMindmapProps> = ({
  taskId: propTaskId,
  expandedPanel,
  onExpandPanel,
  isMobile: propIsMobile,
  panelLayout = "horizontal",
  onPanelLayoutChange,
}) => {
  const defaultIsMobile = useIsMobile();
  const isMobile = propIsMobile !== undefined ? propIsMobile : defaultIsMobile;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("graph");
  const [isNotesFullscreen, setIsNotesFullscreen] = useState(false);
  const isCanvasMinimized = useDependencyGraphStore(
    (state) => state.isCanvasMinimized
  );
  const setIsCanvasMinimized = useDependencyGraphStore(
    (state) => state.setCanvasMinimized
  );

  const [isGraphMinimized, setIsGraphMinimized] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlTaskId = queryParams.get("taskId");

  const taskId = propTaskId || urlTaskId || "";

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const togglePanelLayout = useCallback(() => {
    const newLayout = panelLayout === "horizontal" ? "vertical" : "horizontal";
    if (onPanelLayoutChange) {
      onPanelLayoutChange(newLayout);
    }

    toast({
      title: `Panel layout changed`,
      description: `Layout switched to ${newLayout} mode`,
    });
  }, [panelLayout, onPanelLayoutChange, toast]);

  const toggleNotesFullscreen = () => {
    setIsNotesFullscreen(!isNotesFullscreen);

    if (!isNotesFullscreen) {
      toast({
        title: "Fullscreen mode",
        description: "Canvas now in fullscreen view",
      });
    }
  };

  const togglePanelExpand = (panel: "graph" | "notes") => {
    if (onExpandPanel) {
      onExpandPanel(expandedPanel === panel ? null : panel);
    }

    if (expandedPanel !== panel) {
      toast({
        title: panel === "graph" ? "Graph expanded" : "Canvas expanded",
        description: "View expanded for better visibility",
      });
    }
  };

  const toggleCanvasMinimized = () => {
    setIsCanvasMinimized(!isCanvasMinimized);
  };

  const toggleGraphMinimized = () => {
    setIsGraphMinimized(!isGraphMinimized);
  };

  const renderNoTaskMessage = () => (
    <div className="flex items-center justify-center h-full">
      <Alert className="max-w-md">
        <AlertTitle>No task selected</AlertTitle>
        <AlertDescription>
          Select a task to view its dependencies and notes
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderFullscreenNotes = () => (
    <FullscreenNotesModal
      isOpen={isNotesFullscreen}
      onOpenChange={setIsNotesFullscreen}
      taskId={taskId}
      isMobile={isMobile}
    />
  );

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {isMobile ? (
        <MindmapMobileView
          taskId={taskId}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          isNotesFullscreen={isNotesFullscreen}
          toggleNotesFullscreen={toggleNotesFullscreen}
          renderNoTaskMessage={renderNoTaskMessage}
          renderFullscreenNotes={renderFullscreenNotes}
        />
      ) : (
        <div className="flex-1 overflow-hidden">
          <MindmapDesktopView
            taskId={taskId}
            isGraphMinimized={isGraphMinimized}
            isCanvasMinimized={isCanvasMinimized}
            toggleGraphMinimized={toggleGraphMinimized}
            toggleCanvasMinimized={toggleCanvasMinimized}
            panelLayout={panelLayout}
            togglePanelLayout={togglePanelLayout}
            expandedPanel={expandedPanel}
            togglePanelExpand={togglePanelExpand}
            isNotesFullscreen={isNotesFullscreen}
            toggleNotesFullscreen={toggleNotesFullscreen}
            renderNoTaskMessage={renderNoTaskMessage}
          />
        </div>
      )}
    </div>
  );
};

export default TaskDependencyMindmap;
