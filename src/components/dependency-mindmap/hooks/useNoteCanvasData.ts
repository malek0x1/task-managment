
import { useState, useRef, useCallback, useEffect } from 'react';
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState as ExcalidrawAppState } from "@excalidraw/excalidraw/types/types";
import useKanbanStore from '@/store/useKanbanStore';
import { updateTask, fetchTaskById } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { isEqual } from 'lodash';
import { Task, Subtask } from '@/types/kanban';

interface SavedExcalidrawData {
  elements: ExcalidrawElement[];
  appState: Partial<ExcalidrawAppState>;
  lastSaved: string;
}

interface UseNoteCanvasDataProps {
  taskId: string | null;
  nodeType?: 'task' | 'subtask' | null;
}

interface UseNoteCanvasDataReturn {
  elements: ExcalidrawElement[];
  appState: Partial<ExcalidrawAppState>;
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  isSaved: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
  currentTask: any | null;
  extractedTaskId: string | null;
  handleChange: (elements: readonly ExcalidrawElement[], appState: ExcalidrawAppState) => void;
  saveExcalidrawData: () => Promise<boolean>;
  setElements: (elements: ExcalidrawElement[]) => void;
  setAppState: (appState: Partial<ExcalidrawAppState>) => void;
}

function findSubtaskById(task: Task, subtaskId: string): Subtask | null {
  if (!task || !subtaskId) return null;
  
  if (!task.subtasks || !Array.isArray(task.subtasks)) return null;
  
  for (const subtask of task.subtasks) {
    if (subtask.id === subtaskId) {
      return subtask;
    }
    
    if (subtask.children && Array.isArray(subtask.children) && subtask.children.length > 0) {
      const foundInChildren = findSubtaskInChildren(subtask.children, subtaskId);
      if (foundInChildren) return foundInChildren;
    }
  }
  
  return null;
}

function findSubtaskInChildren(subtasks: Subtask[], subtaskId: string): Subtask | null {
  if (!subtasks || !Array.isArray(subtasks)) return null;
  
  for (const subtask of subtasks) {
    if (subtask.id === subtaskId) {
      return subtask;
    }
    
    if (subtask.children && Array.isArray(subtask.children) && subtask.children.length > 0) {
      const foundInChildren = findSubtaskInChildren(subtask.children, subtaskId);
      if (foundInChildren) return foundInChildren;
    }
  }
  
  return null;
}

export function useNoteCanvasData({ 
  taskId, 
  nodeType = 'task' 
}: UseNoteCanvasDataProps): UseNoteCanvasDataReturn {
  const [elements, setElements] = useState<ExcalidrawElement[]>([]);
  const [appState, setAppState] = useState<Partial<ExcalidrawAppState>>({
    viewBackgroundColor: "#FFFFFF",
    currentItemFontFamily: 1,
    collaborators: new Map(),
  });
  
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  
  const lastSavedStateRef = useRef<{
    elements: ExcalidrawElement[],
    appState: Partial<ExcalidrawAppState>,
    lastSaved?: string
  }>({ elements: [], appState: { collaborators: new Map() } });
  
  const hasChangesRef = useRef(false);
  const isMountedRef = useRef(false);
  const saveInProgressRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingStateUpdateRef = useRef(false);
  const previousElementsRef = useRef<ExcalidrawElement[]>([]);
  const previousAppStateRef = useRef<Partial<ExcalidrawAppState>>({});
  const saveAttemptsRef = useRef(0);
  const currentTaskIdRef = useRef<string | null>(null);
  const dataLoadedForNodeRef = useRef<string | null>(null);

  const { toast } = useToast();

  const { tasks, updateTask: updateTaskInStore } = useKanbanStore(state => ({
    tasks: state.tasks,
    updateTask: state.updateTask
  }));
  
  const extractedTaskId = taskId ? 
    (taskId.startsWith('task-') ? taskId.substring(5) : taskId) : null;
  
  useEffect(() => {
    if (extractedTaskId !== currentTaskIdRef.current || 
        extractedTaskId !== dataLoadedForNodeRef.current) {
      
      setElements([]);
      setAppState({
        viewBackgroundColor: "#FFFFFF",
        currentItemFontFamily: 1,
        collaborators: new Map(), 
      });
      
      setIsLoading(true);
      setIsLoaded(false);
      setHasError(false);
      setIsSaved(false);
      setIsSaving(false);
      setLastSavedAt(null);
      
      lastSavedStateRef.current = { 
        elements: [], 
        appState: { 
          viewBackgroundColor: "#FFFFFF",
          currentItemFontFamily: 1,
          collaborators: new Map() 
        } 
      };
      previousElementsRef.current = [];
      previousAppStateRef.current = {};
      dataLoadedForNodeRef.current = null;
      hasChangesRef.current = false;
      
      currentTaskIdRef.current = extractedTaskId;
    }
  }, [extractedTaskId]);
  
  const currentTask = extractedTaskId ? 
    tasks.find(t => {
      if (nodeType === 'task') {
        return t.id === extractedTaskId;
      }
      
      if (t.subtasks && Array.isArray(t.subtasks)) {
        const foundSubtask = findSubtaskById(t, extractedTaskId);
        if (foundSubtask) {
          const parentTask = {...t};
          (parentTask as any).targetSubtask = foundSubtask;
          return true;
        }
      }
      
      return false;
    }) : null;
  
  useEffect(() => {
    if (!extractedTaskId || !currentTask) return;
    
    setIsLoading(true);
    
    try {
      let excalidrawData = null;
      
      if (nodeType === 'subtask') {
        const subtaskWithExcalidrawData = findSubtaskById(currentTask, extractedTaskId);
        
        if (subtaskWithExcalidrawData?.excalidraw_data) {
          excalidrawData = subtaskWithExcalidrawData.excalidraw_data;
        } else {
          excalidrawData = null;
        }
      } else if (currentTask.excalidraw_data) {
        excalidrawData = currentTask.excalidraw_data;
      }
      
      if (excalidrawData) {
        const savedData = excalidrawData as SavedExcalidrawData;
        
        if (savedData.elements && Array.isArray(savedData.elements)) {
          const clonedElements = JSON.parse(JSON.stringify(savedData.elements));
          setElements(clonedElements);
          lastSavedStateRef.current.elements = JSON.parse(JSON.stringify(clonedElements));
          previousElementsRef.current = JSON.parse(JSON.stringify(clonedElements));
        }
        
        if (savedData.appState) {
          const cleanedAppState = { 
            ...savedData.appState,
            collaborators: new Map(),
            viewBackgroundColor: savedData.appState.viewBackgroundColor || "#FFFFFF",
            currentItemFontFamily: savedData.appState.currentItemFontFamily || 1
          };
          
          setAppState(cleanedAppState);
          lastSavedStateRef.current.appState = { ...cleanedAppState };
          previousAppStateRef.current = { ...cleanedAppState };
        }
        
        if (savedData.lastSaved) {
          setLastSavedAt(new Date(savedData.lastSaved));
          lastSavedStateRef.current.lastSaved = savedData.lastSaved;
        }
        
        toast({
          title: `Drawing Loaded for ${nodeType}`,
          description: `Notes loaded for ${nodeType} ${extractedTaskId}`,
        });
      } else {
        setElements([]);
        lastSavedStateRef.current.elements = [];
        previousElementsRef.current = [];
      }
      
      dataLoadedForNodeRef.current = extractedTaskId;
    } catch (error) {
      setHasError(true);
      toast({
        title: "Error Loading Drawing",
        description: "There was an issue loading your saved drawing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [extractedTaskId, currentTask, toast, nodeType]);
  
  const handleChange = useCallback((elements: readonly ExcalidrawElement[], appState: ExcalidrawAppState) => {
    if (extractedTaskId !== dataLoadedForNodeRef.current) {
      return;
    }
    
    if (pendingStateUpdateRef.current) {
      return;
    }
    
    pendingStateUpdateRef.current = true;
    
    const { collaborators, ...restState } = appState;
    
    try {
      const elementsChanged = !isEqual(elements, previousElementsRef.current);
      const appStateChanged = !isEqual(restState, previousAppStateRef.current);
      
      if (elementsChanged || appStateChanged) {
        if (elementsChanged) {
          const clonedElements = JSON.parse(JSON.stringify(elements)) as ExcalidrawElement[];
          lastSavedStateRef.current.elements = clonedElements;
          setElements(clonedElements);
          previousElementsRef.current = clonedElements;
        }
        
        if (appStateChanged) {
          const newAppState = { 
            ...restState,
            collaborators: new Map()
          };
          
          lastSavedStateRef.current.appState = { ...newAppState };
          previousAppStateRef.current = { ...newAppState };
          
          setAppState(prevState => {
            if (!isEqual(prevState, newAppState)) {
              return newAppState;
            }
            return prevState;
          });
        }
        
        hasChangesRef.current = true;
      }
    } finally {
      setTimeout(() => {
        pendingStateUpdateRef.current = false;
      }, 0);
    }
  }, [extractedTaskId]);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      if (hasChangesRef.current && 
          !saveInProgressRef.current && 
          extractedTaskId === dataLoadedForNodeRef.current) {
        
        const finalSave = async () => {
          try {
            saveInProgressRef.current = true;
            
            const cleanAppState = { ...lastSavedStateRef.current.appState };
            delete cleanAppState.collaborators;
            
            const dataToSave: SavedExcalidrawData = {
              elements: lastSavedStateRef.current.elements,
              appState: cleanAppState,
              lastSaved: new Date().toISOString()
            };
            
            if (nodeType === 'subtask' && currentTask && extractedTaskId === dataLoadedForNodeRef.current) {
              const updatedTask = {...currentTask};
              
              if (!updatedTask.subtasks) {
                updatedTask.subtasks = [];
              }
              
              const updateSubtaskRecursively = (subtasks: any[], subtaskId: string): boolean => {
                for (let i = 0; i < subtasks.length; i++) {
                  if (subtasks[i].id === subtaskId) {
                    subtasks[i] = {
                      ...subtasks[i],
                      excalidraw_data: dataToSave
                    };
                    return true;
                  }
                  
                  if (subtasks[i].children && Array.isArray(subtasks[i].children)) {
                    const found = updateSubtaskRecursively(subtasks[i].children, subtaskId);
                    if (found) return true;
                  }
                }
                return false;
              };
              
              const updated = updateSubtaskRecursively(updatedTask.subtasks, extractedTaskId);
              
              if (updated) {
                try {
                  const latestTask = await fetchTaskById(updatedTask.id);
                  
                  if (latestTask) {
                    await updateTask({
                      ...latestTask,
                      subtasks: updatedTask.subtasks
                    });
                  }
                } catch (err) {
                  console.error("Failed to update subtask excalidraw data on unmount:", err);
                }
              }
            } else if (extractedTaskId === dataLoadedForNodeRef.current) {
              try {
                const latestTask = await fetchTaskById(extractedTaskId);
                
                if (latestTask) {
                  await updateTask({
                    ...latestTask,
                    excalidraw_data: dataToSave
                  });
                }
              } catch (err) {
                console.error("Failed to update task excalidraw data on unmount:", err);
              }
            }
          } catch (err) {

          }
        };
        
        finalSave();
      }
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [taskId, extractedTaskId, nodeType, currentTask]);
  
  const saveExcalidrawData = useCallback(async () => {
    if (!extractedTaskId || 
        extractedTaskId !== dataLoadedForNodeRef.current || 
        saveInProgressRef.current || 
        !isMountedRef.current) {
      return false;
    }
    
    try {
      setIsSaving(true);
      saveInProgressRef.current = true;
      
      const now = new Date().toISOString();
      
      const cleanAppState = { ...lastSavedStateRef.current.appState };
      delete cleanAppState.collaborators;
      
      const dataToSave: SavedExcalidrawData = {
        elements: lastSavedStateRef.current.elements,
        appState: cleanAppState,
        lastSaved: now
      };
      
      if (nodeType === 'subtask' && currentTask) {
        
        let subtaskToUpdate = findSubtaskById(currentTask, extractedTaskId);
        
        if (subtaskToUpdate) {
          const updatedTask = {...currentTask};
          
          if (!updatedTask.subtasks) {
            updatedTask.subtasks = [];
          }
          
          const updateSubtaskRecursively = (subtasks: Subtask[], subtaskId: string): boolean => {
            for (let i = 0; i < subtasks.length; i++) {
              if (subtasks[i].id === subtaskId) {
                subtasks[i] = {
                  ...subtasks[i],
                  excalidraw_data: dataToSave
                };
                return true;
              }
              
              if (subtasks[i].children && Array.isArray(subtasks[i].children)) {
                const updated = updateSubtaskRecursively(subtasks[i].children, subtaskId);
                if (updated) return true;
              }
            }
            return false;
          };
          
          const updated = updateSubtaskRecursively(updatedTask.subtasks, extractedTaskId);
          
          if (updated) {
            try {
              const latestTask = await fetchTaskById(updatedTask.id);
              
              if (!latestTask) {
                throw new Error(`Failed to fetch latest task ${updatedTask.id} for full-payload update`);
              }
              
              const fullUpdatePayload = {
                ...latestTask,
                subtasks: updatedTask.subtasks
              };
              
              await updateTask(fullUpdatePayload);
              updateTaskInStore(fullUpdatePayload);
              
            } catch (err) {
              console.error("Error saving subtask with full payload:", err);
              throw err;
            }
          } else {
            throw new Error('Subtask not found during save operation');
          }
        } else {
          throw new Error('Subtask not found during save preparation');
        }
      } else {
        try {
          const latestTask = await fetchTaskById(extractedTaskId);
          
          if (!latestTask) {
            throw new Error(`Failed to fetch latest task ${extractedTaskId} for full-payload update`);
          }
          
          const fullUpdatePayload = {
            ...latestTask,
            excalidraw_data: dataToSave
          };
          
          await updateTask(fullUpdatePayload);
          updateTaskInStore(fullUpdatePayload);
          
        } catch (err) {
          console.error("Error saving task with full payload:", err);
          throw err;
        }
      }
      
      setLastSavedAt(new Date(now));
      setIsSaved(true);
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        setIsSaved(false);
        saveTimeoutRef.current = null;
      }, 2000);
      
      hasChangesRef.current = false;
      saveInProgressRef.current = false;
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Error in saveExcalidrawData:", error);
      saveInProgressRef.current = false;
      setIsSaving(false);
      toast({
        title: "Error Saving Drawing",
        description: "There was an issue saving your drawing.",
        variant: "destructive",
      });
      return false;
    }
  }, [extractedTaskId, updateTaskInStore, toast, nodeType, currentTask]);

  return {
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
    setElements,
    setAppState
  };
}
