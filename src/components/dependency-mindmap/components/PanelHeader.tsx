import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2Icon,
  LayoutGridIcon,
  LayoutPanelLeftIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
  PanelBottomIcon,
  InfoIcon,
  ArrowLeft,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PanelHeaderProps {
  title: string;
  taskId?: string | null;
  panelLayout: "horizontal" | "vertical";
  togglePanelLayout: () => void;
  onCollapse: () => void;
  onExpand?: () => void;
  onFullscreen?: () => void;
  isExpanded?: boolean;
  panelType: "graph" | "notes";
  showCollapse?: boolean;
  showFullscreen?: boolean;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  taskId,
  panelLayout,
  togglePanelLayout,
  onCollapse,
  onExpand,
  onFullscreen,
  isExpanded,
  panelType,
  showCollapse = true,
  showFullscreen = false,
}) => {
  const isHorizontal = panelLayout === "horizontal";

  return (
    <div className="bg-white border-b px-3 py-2 flex justify-between items-center sticky top-0 z-10">
      <span className="text-sm font-medium truncate flex items-center gap-1">
        {panelType === "notes" ? (
          <InfoIcon className="h-3.5 w-3.5 text-gray-500" />
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        {title}
      </span>
      <div className="flex items-center gap-1">
        {panelType === "graph" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 transition-all duration-200 hover:bg-gray-100"
                  onClick={togglePanelLayout}
                >
                  {isHorizontal ? (
                    <LayoutPanelLeftIcon className="h-4 w-4 rotate-90" />
                  ) : (
                    <LayoutGridIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Panel Layout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* {onExpand && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 transition-all duration-200 hover:bg-gray-100"
                  onClick={onExpand}
                >
                  {isExpanded ? (
                    isHorizontal ? (
                      panelType === "graph" ? (
                        <PanelLeftIcon className="h-4 w-4" />
                      ) : (
                        <PanelRightIcon className="h-4 w-4" />
                      )
                    ) : panelType === "graph" ? (
                      <PanelTopIcon className="h-4 w-4" />
                    ) : (
                      <PanelBottomIcon className="h-4 w-4" />
                    )
                  ) : (
                    <Maximize2Icon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isExpanded
                  ? "Restore Split View"
                  : `Expand ${panelType === "graph" ? "Graph" : "Canvas"}`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )} */}
        {/* 
        {showFullscreen && onFullscreen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 transition-all duration-200 hover:bg-gray-100"
                  onClick={onFullscreen}
                >
                  <Maximize2Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )} */}

        {showCollapse && panelType !== "graph" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 transition-all duration-200 hover:bg-gray-100"
                  onClick={onCollapse}
                >
                  {isHorizontal ? (
                    panelType === "graph" ? (
                      <ChevronLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  ) : panelType === "graph" ? (
                    <ChevronLeft className="h-4 w-4 rotate-90" />
                  ) : (
                    <ChevronRight className="h-4 w-4 rotate-90 transform scale-y-[-1]" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {`Minimize ${panelType === "graph" ? "Graph" : "Canvas"} Panel`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default PanelHeader;
