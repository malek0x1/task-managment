
import { Task, Subtask } from '@/types/kanban';
import { Node, Edge, NodeChange, EdgeChange, EdgeMouseHandler as ReactFlowEdgeMouseHandler } from 'reactflow';


export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;
export type EdgeMouseHandler = ReactFlowEdgeMouseHandler;


export interface BaseNodeData {
  label: string;
  priority?: 'low' | 'medium' | 'high';
  column_id?: string;
  type: 'taskNode' | 'subtaskNode' | 'dependencyNode';
  isHighlighted?: boolean;
  isRecentlyAdded?: boolean;
  layoutDirection?: 'horizontal' | 'vertical';
}

export interface TaskNodeData extends BaseNodeData {
  task: Task;
  type: 'taskNode';
  id?: string;
  taskId: string;
  isCollapsed: boolean;
  hasChildren: boolean;
  onToggleCollapse: (nodeId: string) => void;
  onAddSubtask: (taskId: string, parentSubtaskId?: string | null) => void;
  collaborators?: any[];
  status?: string;
}

export interface SubtaskNodeData extends BaseNodeData {
  subtask: Subtask;
  taskId: string;
  completed: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  type: 'subtaskNode';
  id?: string;
  level?: number;
  dueDate?: string;
  parentSubtaskId?: string | null;
  onToggleComplete: (subtaskId: string) => void;
  onToggleCollapse: (subtaskId: string) => void;
  onAddSubtask: (taskId: string, parentSubtaskId: string) => void;
  collaborators?: any[];
  commentCount?: number;
}


export interface EdgeData {
  type?: 'dependency' | 'subtask' | 'blocking';
  status?: 'todo' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  animated?: boolean;
  highlighted?: boolean;
  label?: string;
  layoutDirection?: 'horizontal' | 'vertical';
  level?: number;
}


export interface DependencyNodeData extends BaseNodeData {
  dependency: any;
  type: 'dependencyNode';
  id?: string;
  hasChildren?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (nodeId: string) => void;
  onAddSubtask?: (taskId: string, parentSubtaskId?: string | null) => void;
}


export type NodeData = TaskNodeData | SubtaskNodeData | DependencyNodeData;


export type TypedNode<T = NodeData> = Node<T>;
export type TypedEdge<T = EdgeData> = Edge<T>;


export type LayoutDirection = 'horizontal' | 'vertical';
export type LayoutType = 'dagre' | 'breadthfirst' | 'radial';


export interface GraphData {
  nodes: TypedNode[];
  edges: TypedEdge[];
}


export interface LayoutResult {
  nodes: TypedNode[];
  edges: TypedEdge[];
}


export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeWithPosition {
  id: string;
  position: NodePosition;
}


export function isTaskNodeData(data: NodeData): data is TaskNodeData {
  return data.type === 'taskNode';
}

export function isSubtaskNodeData(data: NodeData): data is SubtaskNodeData {
  return data.type === 'subtaskNode';
}


export function isDependencyNodeData(data: any): data is DependencyNodeData {
  return data.type === 'dependencyNode';
}
