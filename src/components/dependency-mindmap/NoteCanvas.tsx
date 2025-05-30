
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState as ExcalidrawAppState } from "@excalidraw/excalidraw/types/types";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DrawingToolbar from './components/DrawingToolbar';
import { useNoteCanvasData } from './hooks/useNoteCanvasData';

interface NoteCanvasProps {
  taskId: string | null;
  nodeType?: 'task' | 'subtask' | null;
}

const NoteCanvas: React.FC<NoteCanvasProps> = ({ taskId, nodeType = 'task' }) => {
  const { 
    elements,
    appState,
    isLoading,
    isLoaded,
    hasError,
    isSaved,
    isSaving,
    lastSavedAt,
    currentTask,
    extractedTaskId,
    handleChange,
    saveExcalidrawData,
    setAppState
  } = useNoteCanvasData({ taskId, nodeType });
  
  const excalidrawRef = useRef<any>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const excalidrawInitializedRef = useRef(false);
  const { toast } = useToast();
  
  const onExcalidrawAPIMount = useCallback((api: any) => {
    excalidrawRef.current = api;
    excalidrawInitializedRef.current = true;
    
    setTimeout(() => {
      if (excalidrawRef.current && elements.length > 0) {
        excalidrawRef.current.updateScene({ 
          elements: elements,
          appState: appState
        });
      }
    }, 100);
  }, [elements, appState, taskId]);

  const handleManualSave = useCallback(async () => {
    if (isSaving) {
      toast({
        title: "Save in Progress",
        description: "Please wait for the current save to complete.",
      });
      return;
    }
    
    const result = await saveExcalidrawData();
    
    if (result) {
      toast({
        title: "Drawing Saved",
        description: "Your drawing has been saved successfully.",
      });
    }
  }, [saveExcalidrawData, toast, isSaving]);

  const addStickyNote = useCallback(() => {
    if (!excalidrawRef.current) return;
    
    setActiveTool("sticky");
    const stickyNote = {
      type: "text",
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      backgroundColor: "#FFFF88",
      strokeColor: "#000000",
      fillStyle: "solid",
      strokeWidth: 1,
      roughness: 0,
      opacity: 100,
      text: "Add your note here",
      fontSize: 20,
      fontFamily: 1,
      textAlign: "left",
      verticalAlign: "top"
    };
    
    excalidrawRef.current.updateScene({
      elements: [...excalidrawRef.current.getSceneElements(), stickyNote]
    });
    
    toast({
      title: "Sticky Note Added",
      description: "A new sticky note has been added to the canvas."
    });
  }, [toast]);
  
  const addLabel = useCallback(() => {
    if (!excalidrawRef.current) return;
    
    setActiveTool("label");
    const label = {
      type: "text",
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      backgroundColor: "transparent",
      strokeColor: "#1E40AF",
      fillStyle: "solid",
      strokeWidth: 2,
      roughness: 0,
      opacity: 100,
      text: "Label Text",
      fontSize: 20,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle"
    };
    
    excalidrawRef.current.updateScene({
      elements: [...excalidrawRef.current.getSceneElements(), label]
    });
    
    toast({
      title: "Label Added",
      description: "A new label has been added to the canvas."
    });
  }, [toast]);
  
  const addTaskLink = useCallback(() => {
    if (!excalidrawRef.current) return;
    
    setActiveTool("link");
    const taskLink = {
      type: "rectangle",
      x: 100,
      y: 100,
      width: 180,
      height: 60,
      backgroundColor: "#BFDBFE",
      strokeColor: "#2563EB",
      fillStyle: "solid",
      strokeWidth: 2,
      roughness: 0,
      opacity: 100,
      link: `?taskId=${extractedTaskId}`
    };
    
    excalidrawRef.current.updateScene({
      elements: [...excalidrawRef.current.getSceneElements(), taskLink]
    });
    
    toast({
      title: "Task Link Added",
      description: "A new task link has been added to the canvas."
    });
  }, [extractedTaskId, toast]);
  
  const zoomToFit = useCallback(() => {
    if (!excalidrawRef.current) return;
    
    excalidrawRef.current.zoomToFit();
    
    toast({
      title: "Zoom to Fit",
      description: "Adjusted view to fit all elements."
    });
  }, [toast]);
  
  const centerCanvas = useCallback(() => {
    if (!excalidrawRef.current) return;
    
    excalidrawRef.current.resetScene();
    
    toast({
      title: "Canvas Reset",
      description: "The canvas view has been reset."
    });
  }, [toast]);
  
  const exportToImage = useCallback(async () => {
    if (!excalidrawRef.current) return;
    
    try {
      const blob = await exportToBlob({
        elements: excalidrawRef.current.getSceneElements(),
        appState: excalidrawRef.current.getAppState(),
        files: excalidrawRef.current.getFiles(),
        exportPadding: 10,
        mimeType: "image/png"
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${nodeType === 'subtask' ? 'subtask' : 'task'}-${extractedTaskId}-notes.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Your drawing has been exported as a PNG."
      });
    } catch (error) {
      console.error("Error exporting image:", error);
      toast({
        title: "Export Failed",
        description: "There was an issue exporting your drawing.",
        variant: "destructive"
      });
    }
  }, [extractedTaskId, nodeType, toast]);
  
  const handleZoomIn = useCallback(() => {
    if (excalidrawRef.current) {
      excalidrawRef.current.zoomIn();
    }
  }, []);
  
  const handleZoomOut = useCallback(() => {
    if (excalidrawRef.current) {
      excalidrawRef.current.zoomOut();
    }
  }, []);

  const excalidrawInitialData = {
    elements: elements,
    appState: {
      ...appState,
      viewBackgroundColor: "#FFFFFF",
      currentItemFontFamily: 1,
      collaborators: new Map() 
    }
  };
  
  if (!taskId) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <Alert>
          <AlertTitle>No task selected</AlertTitle>
          <AlertDescription>
            Please select a task to view or create notes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Canvas Error</AlertTitle>
          <AlertDescription>
            There was an error loading the drawing canvas. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-gray-50/50">
        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your drawing for task: {taskId}...</p>
      </div>
    );
  }
  
  return (
    <Card className="h-full w-full flex flex-col border-0 shadow-none overflow-hidden">
      <DrawingToolbar 
        taskId={taskId}
        extractedTaskId={extractedTaskId}
        nodeType={nodeType}
        currentTask={currentTask}
        isSaved={isSaved}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onSave={handleManualSave}
        onAddStickyNote={addStickyNote}
        onAddLabel={addLabel}
        onAddTaskLink={addTaskLink}
        onZoomToFit={function(): void {
          if (excalidrawRef.current) {
            excalidrawRef.current.zoomToFit();
          }
        }}
        onCenterCanvas={function(): void {
          if (excalidrawRef.current) {
            excalidrawRef.current.resetScene();
          }
        }}
        onZoomIn={function(): void {
          if (excalidrawRef.current) {
            excalidrawRef.current.zoomIn();
          }
        }}
        onZoomOut={function(): void {
          if (excalidrawRef.current) {
            excalidrawRef.current.zoomOut();
          }
        }}
        onExportToImage={async function(): Promise<void> {
          if (!excalidrawRef.current) return;
          
          try {
            const blob = await exportToBlob({
              elements: excalidrawRef.current.getSceneElements(),
              appState: excalidrawRef.current.getAppState(),
              files: excalidrawRef.current.getFiles(),
              exportPadding: 10,
              mimeType: "image/png"
            });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${nodeType === 'subtask' ? 'subtask' : 'task'}-${extractedTaskId}-notes.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast({
              title: "Export Successful",
              description: "Your drawing has been exported as a PNG."
            });
          } catch (error) {
            console.error("Error exporting image:", error);
            toast({
              title: "Export Failed",
              description: "There was an issue exporting your drawing.",
              variant: "destructive"
            });
          }
        }}
      />
      
      <CardContent className="p-0 flex-1 rounded-b-lg overflow-hidden bg-muted/20">
        <React.Suspense 
          fallback={
            <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-gray-50/50">
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Loading canvas...</p>
            </div>
          }
        >
          <Excalidraw
            key={`excalidraw-${nodeType}-${taskId}`}
            excalidrawAPI={onExcalidrawAPIMount}
            initialData={{
              elements: elements,
              appState: {
                ...appState,
                viewBackgroundColor: "#FFFFFF",
                currentItemFontFamily: 1,
                collaborators: new Map()
              }
            }}
            onChange={handleChange}
            viewModeEnabled={false}
            zenModeEnabled={false}
            gridModeEnabled={false}
            theme="light"
            renderTopRightUI={null}
          />
        </React.Suspense>
      </CardContent>
    </Card>
  );
};

export default NoteCanvas;
