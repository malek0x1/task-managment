import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ZapIcon, InfoIcon, Maximize2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/ui/error-boundary";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DependencyGraph from "../DependencyGraph";
import NoteCanvas from "../NoteCanvas";

interface MindmapMobileViewProps {
  taskId: string;
  activeTab: string;
  handleTabChange: (value: string) => void;
  isNotesFullscreen: boolean;
  toggleNotesFullscreen: () => void;
  renderNoTaskMessage: () => React.ReactNode;
  renderFullscreenNotes: () => React.ReactNode;
}

const MindmapMobileView: React.FC<MindmapMobileViewProps> = ({
  taskId,
  activeTab,
  handleTabChange,
  isNotesFullscreen,
  toggleNotesFullscreen,
  renderNoTaskMessage,
  renderFullscreenNotes,
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <Tabs
        defaultValue="graph"
        value={activeTab}
        onValueChange={handleTabChange}
        className="h-full flex flex-col"
      >
        <div className="sticky top-0 z-20 px-4 py-2 border-b bg-white/95 backdrop-blur-sm">
          <TabsList className="w-full">
            <TabsTrigger
              value="graph"
              className="flex-1 flex items-center gap-1"
            >
              <ZapIcon className="h-3.5 w-3.5" />
              Dependency Graph
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex-1 flex items-center gap-1"
            >
              <InfoIcon className="h-3.5 w-3.5" />
              Notes Canvas
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="graph" className="flex-1 overflow-hidden p-0 m-0">
          {taskId ? (
            <ErrorBoundary>
              <DependencyGraph taskId={taskId} />
            </ErrorBoundary>
          ) : (
            renderNoTaskMessage()
          )}
        </TabsContent>
        <TabsContent
          value="notes"
          className="flex-1 overflow-hidden p-0 m-0 relative"
        >
          {taskId ? (
            <ErrorBoundary>
              <div className="sticky top-[105px] z-10 bg-white/90 backdrop-blur-sm border-b flex justify-between items-center p-2">
                <span className="text-sm font-medium truncate">
                  Notes for: <span className="text-primary">{taskId}</span>
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleNotesFullscreen}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <Maximize2Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fullscreen Mode</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="px-2 h-[calc(100%-40px)]">
                <div className="h-full rounded-xl shadow-inner bg-muted/50 p-1">
                  <NoteCanvas taskId={taskId} />
                </div>
              </div>
            </ErrorBoundary>
          ) : (
            renderNoTaskMessage()
          )}
        </TabsContent>
      </Tabs>

      {isNotesFullscreen && renderFullscreenNotes()}
    </div>
  );
};

export default MindmapMobileView;
