
import { Column, Task, Subtask } from '@/types/kanban';


export type LayoutMode = 'vertical' | 'horizontal' | 'radial';


export interface GraphNode {
  id: string;
  label?: string;
  type: 'task' | 'subtask';
  data?: unknown;
  parentId?: string;
  position?: { x: number; y: number };
}


export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: 'subtask' | 'dependency';
  label?: string;
}


export interface UIState {
  selectedNodeId: string | null;
  isLoading: boolean;
  error: string | null;
  activeTaskId: string | null;
}

export interface UIActions {
  setSelectedNode: (nodeId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTaskId: (taskId: string | null) => void;
}


export interface DataState {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DataActions {
  setNodes: (nodes: GraphNode[]) => void;
  setEdges: (edges: GraphEdge[]) => void;
  addNode: (node: GraphNode) => void;
  addEdge: (edge: GraphEdge) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
  updateNodePosition: (nodeId: string, position: { x: number, y: number }) => void;
  buildGraphFromTask: (taskId: string) => void;
  loadTaskDependencies: (taskId: string) => Promise<void>;
}


export interface LayoutState {
  layoutMode: LayoutMode;
  collapsedNodes: Set<string>;
  completedSubtasks: Record<string, boolean>;
  collapseUpdateTimestamp: number;
}

export interface LayoutActions {
  setLayoutMode: (mode: LayoutMode) => void;
  toggleNodeCollapse: (nodeId: string) => void;
  isNodeCollapsed: (nodeId: string) => boolean;
  setSubtaskCompletion: (subtaskId: string, completed: boolean, taskId?: string | null) => void;
  isSubtaskCompleted: (subtaskId: string) => boolean;
  toggleSubtaskCompletion: (subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  addNestedSubtask: (taskId: string, parentSubtaskId: string, title: string) => void;
  extractTaskId: (compositeId: string) => string | null;
}


export interface GraphState extends UIState, DataState, LayoutState {
    isCanvasMinimized?: boolean;
}


export interface GraphActions extends UIActions, DataActions, LayoutActions {
    setCanvasMinimized?: (minimized: boolean) => void;

}


export type DependencyGraphStore = GraphState & GraphActions;


export const initialGraphState: GraphState = {

  selectedNodeId: null,
  isLoading: false,
  error: null,
  activeTaskId: null,
  
  isCanvasMinimized: true,

  nodes: [],
  edges: [],
  

  layoutMode: 'vertical',
  collapsedNodes: new Set<string>(),
  completedSubtasks: {},
  collapseUpdateTimestamp: 0,
};
