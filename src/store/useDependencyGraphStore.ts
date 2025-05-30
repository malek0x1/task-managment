import { create } from 'zustand';
import { enableMapSet, produce } from 'immer';
import { ensureCollaboratorsArray } from '@/utils/collaboratorsUtils';
import { Subtask as KanbanSubtask, Task } from '@/types/kanban';
import useKanbanStore from './useKanbanStore';

enableMapSet();

export type LayoutMode = 'vertical' | 'horizontal' | 'radial';

export interface Node {
  id: string;
  label: string;
  type: 'task' | 'subtask' | 'dependency';
  status?: string;
  collaborators?: any[];
  x?: number;
  y?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'dependency' | 'subtask' | 'blocking';
}

interface DependencyGraphState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  selectedLayout: LayoutMode;
  loading: boolean;
  error: string | null;
  collapsedNodes: Set<string>;
  completedSubtasks: Record<string, boolean>;
  
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedLayout: (layout: LayoutMode) => void;
  
  loadTaskDependencies: (taskId: string) => Promise<void>;
  addDependency: (sourceId: string, targetId: string, type?: 'dependency' | 'blocking') => void;
  removeDependency: (sourceId: string, targetId: string) => void;
  
  toggleNodeCollapse: (nodeId: string) => void;
  isNodeCollapsed: (nodeId: string) => boolean;
  setSubtaskCompletion: (subtaskId: string, completed: boolean, taskId?: string | null) => void;
  isSubtaskCompleted: (subtaskId: string) => boolean;
  toggleSubtaskCompletion: (subtaskId: string) => void;
  
  extractTaskId: (compositeId: string) => string | null;

  getState: () => DependencyGraphState;
}

const ensureSubtaskCompatibility = (subtask: any): KanbanSubtask => {
  return {
    ...subtask,
    createdAt: subtask.createdAt || new Date().toISOString()
  };
};

const idFormatExtractors: Array<(id: string) => string | null> = [
  (id) => {
    const match = id.match(/^task-([^-]+)-subtask-/);
    return match ? match[1] : null;
  },
  (id) => {
    const match = id.match(/^subtask-([^-]+)-/);
    return match ? match[1] : null;
  },
  (id) => {
    const match = id.match(/^task-([^-]+)$/);
    return match ? match[1] : null;
  },
  (id) => {
    const parts = id.split('-');
    return parts.length === 2 ? parts[0] : null;
  }
];

const mockNodes: Node[] = [
  { id: '1', label: 'Main Task', type: 'task', status: 'in-progress', priority: 'medium', collaborators: [{ id: '1', name: 'John Doe', avatar: '/avatars/john.png' }] },
  { id: '2', label: 'Subtask 1', type: 'subtask', status: 'todo', priority: 'low', collaborators: [{ id: '2', name: 'Jane Smith', avatar: '/avatars/jane.png' }] },
  { id: '3', label: 'Subtask 2', type: 'subtask', status: 'done', priority: 'medium', collaborators: [] },
  { id: '4', label: 'Blocking Dependency', type: 'dependency', status: 'blocked', priority: 'high', collaborators: [] },
  { id: '5', label: 'Dependency 2', type: 'dependency', status: 'in-progress', priority: 'medium', collaborators: [] },
];

const mockEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'subtask' },
  { id: 'e1-3', source: '1', target: '3', type: 'subtask' },
  { id: 'e4-1', source: '4', target: '1', type: 'blocking' },
  { id: 'e5-1', source: '5', target: '1', type: 'dependency' },
];

const useDependencyGraphStore = create<DependencyGraphState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedLayout: 'vertical',
  loading: false,
  error: null,
  collapsedNodes: new Set<string>(),
  completedSubtasks: {},
  
  getState: () => get(),
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, {
      ...node,
      collaborators: ensureCollaboratorsArray(node.collaborators)
    }] 
  })),
  
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  
  removeNode: (nodeId) => set((state) => ({ 
    nodes: state.nodes.filter(node => node.id !== nodeId),
    edges: state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
  })),
  
  removeEdge: (edgeId) => set((state) => ({ 
    edges: state.edges.filter(edge => edge.id !== edgeId) 
  })),
  
  updateNode: (nodeId, updates) => set((state) => ({ 
    nodes: state.nodes.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            ...updates,
            collaborators: updates.collaborators 
              ? ensureCollaboratorsArray(updates.collaborators)
              : ensureCollaboratorsArray(node.collaborators)
          } 
        : node
    ) 
  })),
  
  updateEdge: (edgeId, updates) => set((state) => ({ 
    edges: state.edges.map(edge => 
      edge.id === edgeId ? { ...edge, ...updates } : edge
    ) 
  })),
  
  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setSelectedLayout: (layout) => set({ selectedLayout: layout }),
  
  loadTaskDependencies: async (taskId) => {
    const { setLoading, setError, setNodes, setEdges } = get();
    
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const processedNodes = mockNodes.map(node => ({
        ...node,
        collaborators: ensureCollaboratorsArray(node.collaborators)
      }));
      
      setNodes(processedNodes);
      setEdges(mockEdges);
      
      const initialCompletedState: Record<string, boolean> = {};
      processedNodes.forEach(node => {
        if (node.type === 'subtask') {
          initialCompletedState[node.id] = node.status === 'done';
        }
      });
      
      set({ completedSubtasks: initialCompletedState });
    } catch (error) {
      console.error('Error loading task dependencies:', error);
      setError('Failed to load task dependencies');
    } finally {
      setLoading(false);
    }
  },
  
  addDependency: (sourceId, targetId, type = 'dependency') => {
    const { addEdge } = get();
    const newEdge: Edge = {
      id: `e${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type
    };
    addEdge(newEdge);
  },
  
  removeDependency: (sourceId, targetId) => {
    const { removeEdge } = get();
    const edgeId = `e${sourceId}-${targetId}`;
    removeEdge(edgeId);
  },
  
  extractTaskId: (compositeId: string) => {
    if (!compositeId) return null;
    
    if (compositeId.startsWith('task-')) {
      const taskIdMatch = compositeId.match(/^task-([^-]+)$/);
      if (taskIdMatch) {
        return taskIdMatch[1];
      }
    }
    
    for (const extractor of idFormatExtractors) {
      const taskId = extractor(compositeId);
      if (taskId) {
        return taskId;
      }
    }
    
    const tasks = useKanbanStore.getState().tasks;
    for (const task of tasks) {
      if (task.subtasks?.some(s => s.id === compositeId)) {
        return task.id;
      }
    }
    
    console.warn(`Could not extract taskId from: ${compositeId}`);
    return null;
  },
  
  toggleNodeCollapse: (nodeId) => {
    if (!nodeId) {
      console.warn('toggleNodeCollapse called with empty nodeId');
      return;
    }
    
    set(produce((state: DependencyGraphState) => {
      if (state.collapsedNodes.has(nodeId)) {
        state.collapsedNodes.delete(nodeId);
      } else {
        state.collapsedNodes.add(nodeId);
      }
    }));
  },
  
  isNodeCollapsed: (nodeId) => {
    if (!nodeId) return false;
    return get().collapsedNodes.has(nodeId);
  },
  
  setSubtaskCompletion: (subtaskId, completed) => {
    if (!subtaskId) {
      console.warn('setSubtaskCompletion called with empty subtaskId');
      return;
    }
    
    set(produce((state: DependencyGraphState) => {
      state.completedSubtasks[subtaskId] = completed;
    }));
    
    const extractedTaskId = get().extractTaskId(subtaskId);
    
    if (extractedTaskId) {
      try {
        useKanbanStore.getState().toggleSubtaskCompletion(extractedTaskId, subtaskId);
      } catch (error) {
        console.error('Error in toggleSubtaskCompletion with extracted taskId:', error);
        
        const tasks = useKanbanStore.getState().tasks;
        let found = false;
        
        for (const task of tasks) {
          if (task.subtasks?.some(s => s.id === subtaskId)) {
            try {
              useKanbanStore.getState().toggleSubtaskCompletion(task.id, subtaskId);
              found = true;
              break;
            } catch (e) {
              console.error('Error in last resort toggle attempt:', e);
            }
          }
        }
        
        if (!found) {
          console.error(`Could not find task containing subtask: ${subtaskId}`);
        }
      }
    } else {
      console.warn(`Could not determine taskId from subtaskId: ${subtaskId}`);
      
      const tasks = useKanbanStore.getState().tasks;
      for (const task of tasks) {
        if (task.subtasks?.some(s => s.id === subtaskId)) {
          try {
            useKanbanStore.getState().toggleSubtaskCompletion(task.id, subtaskId);
            break;
          } catch (e) {
            console.error('Error in task search toggle:', e);
          }
        }
      }
    }
  },
  
  isSubtaskCompleted: (subtaskId) => {
    if (!subtaskId) return false;
    return get().completedSubtasks[subtaskId] || false;
  },
  
  toggleSubtaskCompletion: (subtaskId) => {
    if (!subtaskId) {
      console.warn('toggleSubtaskCompletion called with empty subtaskId');
      return;
    }
    
    const currentState = get().isSubtaskCompleted(subtaskId);
    get().setSubtaskCompletion(subtaskId, !currentState);
  }
}));

export default useDependencyGraphStore;
