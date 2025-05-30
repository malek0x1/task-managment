
import React from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import GraphPanel from './GraphPanel';
import NotesPanel from './NotesPanel';
import FullscreenNotesModal from './FullscreenNotesModal';

interface MindmapDesktopViewProps {
  taskId: string;
  isGraphMinimized: boolean;
  isCanvasMinimized: boolean;
  toggleGraphMinimized: () => void;
  toggleCanvasMinimized: () => void;
  panelLayout: 'horizontal' | 'vertical';
  togglePanelLayout: () => void;
  expandedPanel: 'graph' | 'notes' | null;
  togglePanelExpand: (panel: 'graph' | 'notes') => void;
  isNotesFullscreen: boolean;
  toggleNotesFullscreen: () => void;
  renderNoTaskMessage: () => React.ReactNode;
}

const MindmapDesktopView: React.FC<MindmapDesktopViewProps> = ({
  taskId,
  isGraphMinimized,
  isCanvasMinimized,
  toggleGraphMinimized,
  toggleCanvasMinimized,
  panelLayout,
  togglePanelLayout,
  expandedPanel,
  togglePanelExpand,
  isNotesFullscreen,
  toggleNotesFullscreen,
  renderNoTaskMessage
}) => {
  return (
    <>
      <ResizablePanelGroup 
        direction={panelLayout === 'horizontal' ? 'horizontal' : 'vertical'} 
        className="h-full min-h-[300px]"
      >
        <ResizablePanel 
          defaultSize={60} 
          minSize={isGraphMinimized ? 5 : 20} 
          maxSize={expandedPanel === 'graph' ? 95 : 80}
          className={cn(
            "h-full overflow-hidden transition-all duration-300",
            isGraphMinimized ? (panelLayout === 'horizontal' ? 'max-w-[50px]' : 'max-h-[50px]') : ''
          )}
        >
          <GraphPanel 
            taskId={taskId}
            isMinimized={isGraphMinimized}
            toggleMinimized={toggleGraphMinimized}
            panelLayout={panelLayout}
            togglePanelLayout={togglePanelLayout}
            expandedPanel={expandedPanel}
            togglePanelExpand={togglePanelExpand}
            renderNoTaskMessage={renderNoTaskMessage}
          />
        </ResizablePanel>
        
        <ResizableHandle 
          withHandle 
          className={cn(
            "bg-gray-100 hover:bg-gray-200 transition-colors",
            panelLayout === 'vertical' ? 'h-2' : 'w-2'
          )} 
        />
        
        <ResizablePanel 
          defaultSize={40} 
          minSize={isCanvasMinimized ? 5 : 20} 
          maxSize={expandedPanel === 'notes' ? 95 : 80}
          className={cn(
            "h-full overflow-hidden transition-all duration-300",
            isCanvasMinimized ? (panelLayout === 'horizontal' ? 'max-w-[50px]' : 'max-h-[50px]') : ''
          )}
        >
          <NotesPanel 
            taskId={taskId}
            isMinimized={isCanvasMinimized}
            toggleMinimized={toggleCanvasMinimized}
            panelLayout={panelLayout}
            togglePanelLayout={togglePanelLayout}
            expandedPanel={expandedPanel}
            togglePanelExpand={togglePanelExpand}
            toggleFullscreen={toggleNotesFullscreen}
            renderNoTaskMessage={renderNoTaskMessage}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <FullscreenNotesModal
        isOpen={isNotesFullscreen}
        onOpenChange={toggleNotesFullscreen}
        taskId={taskId}
        isMobile={false}
      />
    </>
  );
};

export default MindmapDesktopView;
