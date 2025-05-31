import { useState, useEffect } from "react";
import TaskDrawer from "./TaskDrawer";
import AiCommandBar from "./ai/AiCommandBar";
import McpDrawer from "./mcp/McpDrawer";
import McpTrigger from "./mcp/McpTrigger";
import { useBoardActions } from "@/hooks/useBoardActions";
import { useBoardInitialization } from "@/hooks/useBoardInitialization";
import { useIsMobile } from "@/hooks/use-mobile";
import useKanbanStore from "@/store/useKanbanStore";
import { useProjectStore } from "@/store/useProjectStore";
import BoardContent from "./kanban/BoardContent";
import BoardLoading from "./kanban/BoardLoading";
import { toast } from "@/hooks/use-toast";
import { checkAuthStatus } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocation } from "react-router-dom";
import { useSubtaskActions } from "@/hooks/useSubtaskActions";

const KanbanBoard: React.FC = () => {
  const {
    activeTask,
    isTaskDrawerOpen,
    closeTaskDrawer,
    fetchData,
    resetState,
  } = useKanbanStore();
  const { initialLoading, isLoading, error, retryLoading, projectAvailable } =
    useBoardInitialization();
  const { fetchProjects, currentProjectId } = useProjectStore();
  const { refreshUser } = useAuthStore();
  const {
    handleUpdateTask,
    handleToggleSubtask,
    addNestedSubtask,
    handleDeleteTask,
    handleDeleteSubtask,
  } = useBoardActions();
  const { deleteSubtask } = useSubtaskActions();
  const isMobile = useIsMobile();
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isMcpDrawerOpen, setIsMcpDrawerOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const location = useLocation();
  const [previousProjectId, setPreviousProjectId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const shouldFetchData =
      (location.pathname === "/" && !initialLoading) ||
      (currentProjectId && previousProjectId !== currentProjectId);

    if (shouldFetchData && currentProjectId) {
      resetState();
      fetchData().catch((err) => {});
      setPreviousProjectId(currentProjectId);
    }
  }, [
    location.pathname,
    currentProjectId,
    fetchData,
    resetState,
    initialLoading,
    previousProjectId,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandBarOpen(true);
      }

      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setIsMcpDrawerOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFullRetry = async () => {
    if (isRetrying) return;

    setIsRetrying(true);
    try {
      await refreshUser();

      const { isAuthenticated, userId } = await checkAuthStatus();
      if (!isAuthenticated || !userId) {
        toast({
          title: "Authentication issue",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        return;
      }

      await fetchProjects();
      retryLoading();

      toast({
        title: "Retrying...",
        description: "Attempting to reload your board data.",
      });
    } catch (err) {
      toast({
        title: "Retry failed",
        description: "Please refresh the page or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  const deleteSubtaskWrapper = async (
    taskId: string,
    subtaskId: string
  ): Promise<void> => {
    await handleDeleteSubtask(taskId, subtaskId);
  };

  const handleMcpActionExecuted = () => {
    fetchData().catch((err) => {});
  };

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <BoardLoading
        isLoading={isLoading}
        isInitialLoading={initialLoading}
        error={error}
        onRetry={handleFullRetry}
        isRetrying={isRetrying}
      />

      {!initialLoading && <BoardContent />}

      <TaskDrawer
        task={activeTask}
        isOpen={isTaskDrawerOpen}
        onClose={closeTaskDrawer}
        onToggleSubtask={handleToggleSubtask}
        onAddNestedSubtask={(taskId, parentSubtaskId, title) => {
          addNestedSubtask(taskId, parentSubtaskId, title);
        }}
        onUpdateTask={handleUpdateTask}
        onDeleteSubtask={deleteSubtaskWrapper}
      />

      <AiCommandBar
        isOpen={isCommandBarOpen}
        onOpenChange={setIsCommandBarOpen}
      />

      <McpDrawer
        isOpen={isMcpDrawerOpen}
        onClose={() => setIsMcpDrawerOpen(false)}
        onActionExecuted={handleMcpActionExecuted}
      />

      <McpTrigger onClick={() => setIsMcpDrawerOpen(true)} />
    </div>
  );
};

export default KanbanBoard;
