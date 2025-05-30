import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import useDependencyGraphStore from "@/store/dependencyGraph";

import { Eye, MessageSquare, Link, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSelectedNodeState from "../hooks/useSelectedNodeState";
import AiDependencyExplainer from "@/components/ai/AiDependencyExplainer";

export interface SubtaskActionsProps {
  isHovered: boolean;
  label: string;
  hasChildren: boolean;
  subtaskId?: string;
  onAddSubtask: (e: React.MouseEvent) => void;
}

export const SubtaskActions: React.FC<SubtaskActionsProps> = ({
  isHovered,
  label,
  hasChildren,
  subtaskId,
  onAddSubtask,
}) => {
  const isCanvasMinimized = useDependencyGraphStore(
    (state) => state.isCanvasMinimized
  );
  const setIsCanvasMinimized = useDependencyGraphStore(
    (state) => state.setCanvasMinimized
  );

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { selectNode } = useSelectedNodeState();

  const handleAddSubtask = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onAddSubtask(e);
    },
    [onAddSubtask]
  );

  const handleDetailsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleNotesClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (isCanvasMinimized) setIsCanvasMinimized(false);

      if (subtaskId) {
        selectNode(subtaskId, "subtask");
      }
    },
    [subtaskId, selectNode]
  );

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const DetailsButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 rounded-full hover:bg-gray-100/80 animate-fade-in clickable pointer-events-auto"
      onClick={handleDetailsClick}
      data-no-dnd="true"
    >
      <Eye className="h-3.5 w-3.5 text-gray-600" />
    </Button>
  );

  const NotesButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 rounded-full hover:bg-gray-100/80 animate-fade-in clickable pointer-events-auto"
      onClick={handleNotesClick}
      data-no-dnd="true"
    >
      <MessageSquare className="h-3.5 w-3.5 text-gray-600" />
    </Button>
  );

  return (
    <>
      <div
        className={cn(
          "flex justify-end gap-1 mt-1",
          isHovered ? "opacity-100" : "opacity-0",
          "transition-opacity duration-200",
          "pointer-events-auto"
        )}
        data-no-dnd="true"
      >
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                  <SheetTrigger asChild>
                    <div onClick={handleDetailsClick} className="inline-block">
                      {DetailsButton()}
                    </div>
                  </SheetTrigger>
                  <SheetContent side="right" className="sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Subtask: {label}</SheetTitle>
                      <SheetDescription>View subtask details</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Pending
                        </span>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </TooltipTrigger>
            <TooltipContent>View Details (Double-click)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {!!subtaskId && <AiDependencyExplainer taskId={subtaskId} />}

        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={handleNotesClick} className="inline-block">
                {NotesButton()}
              </div>
            </TooltipTrigger>
            <TooltipContent>View Notes (N)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-gray-100/80 animate-fade-in clickable pointer-events-auto"
                  onClick={handleLinkClick}
                  data-no-dnd="true"
                >
                  <Link className="h-3.5 w-3.5 text-gray-600" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>Create Link</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default SubtaskActions;
