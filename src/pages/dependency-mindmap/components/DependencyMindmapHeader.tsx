import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  HelpCircle,
  LayoutPanelLeftIcon,
  LayoutGridIcon,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DependencyMindmapHeaderProps {
  taskId: string;
  title?: string;
  panelLayout?: "horizontal" | "vertical";
  togglePanelLayout?: () => void;
}

const DependencyMindmapHeader: React.FC<DependencyMindmapHeaderProps> = ({
  taskId,
  title,
  panelLayout = "horizontal",
  togglePanelLayout = () => {},
}) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container flex h-14 items-center px-4 sm:px-6 justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {title || "Task Dependencies"}
              {taskId && (
                <Badge variant="outline" className="text-sm py-1 ml-2">
                  Task ID: {taskId.substring(0, 8)}...
                </Badge>
              )}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              View and manage task relationships
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={togglePanelLayout}
                >
                  {panelLayout === "horizontal" ? (
                    <LayoutPanelLeftIcon className="h-3.5 w-3.5 rotate-90" />
                  ) : (
                    <LayoutGridIcon className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {panelLayout === "horizontal"
                      ? "Vertical Layout"
                      : "Horizontal Layout"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Panel Layout</p>
                <p className="text-xs text-gray-500">
                  {panelLayout === "horizontal"
                    ? "Switch to vertical stacked view"
                    : "Switch to side-by-side view"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs max-w-xs">
                  <p className="font-medium">Task Dependency View</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Click and drag to move the canvas</li>
                    <li>Click nodes to expand/collapse subtasks</li>
                    <li>Use controls to adjust view and layout</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DependencyMindmapHeader;
