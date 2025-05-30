
import { StateCreator } from 'zustand';
import { GraphState, UIState, UIActions, DependencyGraphStore } from './types';

export type UISlice = UIState & UIActions;

export const createUISlice: StateCreator<
  DependencyGraphStore,
  [],
  [],
  UISlice
> = (set) => ({

  selectedNodeId: null,
  isLoading: false,
  error: null,
  activeTaskId: null,
  

  setSelectedNode: (nodeId: string | null) => set({ selectedNodeId: nodeId }),
  
  setLoading: (isLoading: boolean) => set({ isLoading }),
  
  setError: (error: string | null) => set({ error }),
  
  setActiveTaskId: (taskId: string | null) => set({ activeTaskId: taskId }),
});
