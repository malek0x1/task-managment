
import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { 
  GraphState, 
  LayoutMode, 
  LayoutState, 
  LayoutActions,
  DependencyGraphStore 
} from './types';
import useKanbanStore from '@/store/useKanbanStore';

export type LayoutSlice = LayoutState & LayoutActions;


const extractTaskIdFromSubtaskId = (subtaskId: string): string | null => {
  if (!subtaskId) return null;
  

  if (subtaskId.startsWith('task-')) {
    const taskIdMatch = subtaskId.match(/^task-([^-]+)$/);
    if (taskIdMatch) {
      return taskIdMatch[1];
    }
  }
  

  const idFormatExtractors = [

    (id: string) => {
      const match = id.match(/^task-([^-]+)-subtask-/);
      return match ? match[1] : null;
    },

    (id: string) => {
      const match = id.match(/^subtask-([^-]+)-/);
      return match ? match[1] : null;
    },

    (id: string) => {
      const parts = id.split('-');

      return parts.length === 2 ? parts[0] : null;
    }
  ];
  

  for (const extractor of idFormatExtractors) {
    const taskId = extractor(subtaskId);
    if (taskId) {
      return taskId;
    }
  }
  

  const tasks = useKanbanStore.getState().tasks;
  for (const task of tasks) {
    if (task.subtasks?.some(s => s.id === subtaskId)) {
      return task.id;
    }
  }
  
  return null;
};


export const createLayoutSlice: StateCreator<
  DependencyGraphStore,
  [],
  [],
  LayoutSlice
> = (set, get) => ({

  layoutMode: 'horizontal',
  collapsedNodes: new Set<string>(),
  completedSubtasks: {},
  collapseUpdateTimestamp: 0,
  

    setCanvasMinimized: (minimized: boolean) => {
    set({ isCanvasMinimized: minimized });
  },
  

  setLayoutMode: (mode: LayoutMode) => set({ layoutMode: mode }),
  
  toggleNodeCollapse: (nodeId: string) => {
    if (!nodeId) {
      console.warn('toggleNodeCollapse called with empty nodeId');
      return;
    }
    
    
    set(
      produce((state: GraphState) => {
        if (state.collapsedNodes.has(nodeId)) {
          state.collapsedNodes.delete(nodeId);
        } else {
          state.collapsedNodes.add(nodeId);
        }
        


        state.collapseUpdateTimestamp = Date.now();
      })
    );
  },
  
  isNodeCollapsed: (nodeId: string) => {
    if (!nodeId) return false;
    return get().collapsedNodes.has(nodeId);
  },
  
  setSubtaskCompletion: (subtaskId: string, completed: boolean, taskId?: string | null) => {

    set(
      produce((state: GraphState) => {
        state.completedSubtasks[subtaskId] = completed;
      })
    );
    

    const actualTaskId = taskId || get().extractTaskId(subtaskId);
    if (!actualTaskId) return;
    

    const match = subtaskId.match(/^subtask-(.+)$/);
    const actualSubtaskId = match ? match[1] : subtaskId;
    

    try {
      useKanbanStore.getState().toggleSubtaskCompletion(actualTaskId, actualSubtaskId);
    } catch (error) {
      console.error('Error toggling subtask completion:', error);
    }
  },
  
  isSubtaskCompleted: (subtaskId: string) => {
    return !!get().completedSubtasks[subtaskId];
  },
  
  toggleSubtaskCompletion: (subtaskId: string) => {
    const currentState = get().isSubtaskCompleted(subtaskId);
    get().setSubtaskCompletion(subtaskId, !currentState);
  },
  

  addSubtask: (taskId: string, title: string) => {
    try {
      const kanbanStore = useKanbanStore.getState();
      const result = kanbanStore.addSubtask(taskId, title);
      

      if (taskId && typeof get().buildGraphFromTask === 'function') {
        get().buildGraphFromTask(taskId);
      }
      return result;
    } catch (error) {
      console.error('Error adding subtask:', error);
      get().setError('Failed to add subtask');
      return null;
    }
  },
  
  addNestedSubtask: (taskId: string, parentSubtaskId: string, title: string) => {
    try {
      const kanbanStore = useKanbanStore.getState();
      const result = kanbanStore.addNestedSubtask(taskId, parentSubtaskId, title);
      

      if (taskId && typeof get().buildGraphFromTask === 'function') {
        get().buildGraphFromTask(taskId);
      }
      return result;
    } catch (error) {
      console.error('Error adding nested subtask:', error);
      get().setError('Failed to add nested subtask');
      return null;
    }
  },
  

  extractTaskId: (compositeId: string) => {
    return extractTaskIdFromSubtaskId(compositeId);
  }
});
