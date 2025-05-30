import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Minimize2Icon } from "lucide-react";
import ErrorBoundary from "@/components/ui/error-boundary";
import NoteCanvas from "../NoteCanvas";
import useSelectedNodeState from "../hooks/useSelectedNodeState";
import useKanbanStore from "@/store/useKanbanStore";

interface FullscreenNotesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  taskId: string;
  isMobile: boolean;
}

const FullscreenNotesModal: React.FC<FullscreenNotesModalProps> = ({
  isOpen,
  onOpenChange,
  taskId,
  isMobile,
}) => {
  const { selectedNodeId, selectedNodeType } = useSelectedNodeState();
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

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>{getTitle()}</DrawerTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              <Minimize2Icon className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          <div className="px-4 pb-4 h-full">
            <ErrorBoundary>
              <NoteCanvas
                taskId={effectiveNodeId}
                nodeType={effectiveNodeType}
                key={`${effectiveNodeType}-${effectiveNodeId}`}
              />
            </ErrorBoundary>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="max-w-[90vw] h-[90vh]">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle>{getTitle()}</DialogTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            <Minimize2Icon className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded-xl shadow-inner bg-muted/50 p-2">
          <ErrorBoundary>
            <NoteCanvas
              taskId={effectiveNodeId}
              nodeType={effectiveNodeType}
              key={`${effectiveNodeType}-${effectiveNodeId}`}
            />
          </ErrorBoundary>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenNotesModal;
