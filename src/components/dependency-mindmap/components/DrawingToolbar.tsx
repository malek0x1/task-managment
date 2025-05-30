import React, { useState, useCallback } from "react";
import {
  StickyNote,
  PanelLeft,
  Tag,
  Link,
  Download,
  Copy,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface DrawingToolbarProps {
  taskId: string | null;
  extractedTaskId: string | null;
  nodeType?: "task" | "subtask" | null;
  currentTask: any | null;
  isSaved: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
  onSave: () => Promise<void>;
  onAddStickyNote: () => void;
  onAddLabel: () => void;
  onAddTaskLink: () => void;
  onZoomToFit: () => void;
  onCenterCanvas: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExportToImage: () => void;
}

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  taskId,
  extractedTaskId,
  nodeType = "task",
  currentTask,
  isSaved,
  isSaving,
  lastSavedAt,
  activeTool,
  setActiveTool,
  onSave,
  onAddStickyNote,
  onAddLabel,
  onAddTaskLink,
  onZoomToFit,
  onCenterCanvas,
  onZoomIn,
  onZoomOut,
  onExportToImage,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-t-lg shadow-sm border border-gray-100 flex flex-col gap-1">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate max-w-[200px]">
            🧠{" "}
            {nodeType === "subtask"
              ? "Subtask Notes"
              : currentTask?.title || "Task Notes"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isSaved && (
            <Badge
              variant="outline"
              className="text-xs text-green-600 bg-green-50 flex items-center gap-1"
            >
              <span className="bg-green-500 w-1.5 h-1.5 rounded-full animate-pulse"></span>
              Saved {lastSavedAt && `at ${format(lastSavedAt, "HH:mm:ss")}`}
            </Badge>
          )}
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 flex gap-1 items-center text-xs"
                  onClick={onSave}
                  disabled={isSaving}
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save your drawing</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {}
      <div className="px-3 pb-2 flex flex-wrap gap-1 items-center">
        {}
        <div className="flex items-center bg-gray-50 rounded-xl p-0.5 border border-gray-100 shadow-sm">
          <button
            className={`h-8 px-3 text-xs rounded-l-lg rounded-r-none flex gap-1 items-center pointer-events-auto ${
              activeTool === "sticky"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent hover:bg-gray-100"
            }`}
            onClick={onAddStickyNote}
            data-no-dnd="true"
          >
            <StickyNote className="h-3.5 w-3.5" />
            <span>Sticky Note</span>
          </button>

          <button
            className={`h-8 px-3 text-xs rounded-none border-l border-gray-200 flex gap-1 items-center pointer-events-auto ${
              activeTool === "label"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent hover:bg-gray-100"
            }`}
            onClick={onAddLabel}
            data-no-dnd="true"
          >
            <Tag className="h-3.5 w-3.5" />
            <span>Label</span>
          </button>

          <button
            className={`h-8 px-3 text-xs rounded-l-none rounded-r-lg border-l border-gray-200 flex gap-1 items-center pointer-events-auto ${
              activeTool === "link"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent hover:bg-gray-100"
            }`}
            onClick={onAddTaskLink}
            data-no-dnd="true"
          >
            <Link className="h-3.5 w-3.5" />
            <span>Link Task</span>
          </button>
        </div>

        {}
        <div className="flex items-center ml-1 bg-gray-50 rounded-xl p-0.5 border border-gray-100 shadow-sm">
          <button
            className="h-8 w-8 rounded-l-lg rounded-r-none flex items-center justify-center hover:bg-gray-100"
            onClick={onZoomToFit}
            data-no-dnd="true"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>

          <button
            className="h-8 w-8 rounded-none border-l border-gray-200 flex items-center justify-center hover:bg-gray-100"
            onClick={onCenterCanvas}
            data-no-dnd="true"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            className="h-8 w-8 rounded-none border-l border-gray-200 flex items-center justify-center hover:bg-gray-100"
            onClick={onZoomIn}
            data-no-dnd="true"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <button
            className="h-8 w-8 rounded-l-none rounded-r-lg border-l border-gray-200 flex items-center justify-center hover:bg-gray-100"
            onClick={onZoomOut}
            data-no-dnd="true"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        </div>

        {}
        <div className="ml-auto">
          <button
            className="h-7 px-3 text-xs bg-transparent hover:bg-gray-100 rounded flex gap-1 items-center"
            onClick={onExportToImage}
            data-no-dnd="true"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingToolbar;
