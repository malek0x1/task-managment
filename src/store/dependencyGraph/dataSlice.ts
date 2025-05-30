
import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { GraphState, GraphNode, GraphEdge, DataState, DataActions, DependencyGraphStore } from './types';
import useKanbanStore from '@/store/useKanbanStore';

export type DataSlice = DataState & DataActions;


export const createDataSlice: StateCreator<
  DependencyGraphStore, 
  [],
  [],
  DataSlice
> = (set, get) => ({

  nodes: [],
  edges: [],
  

  setNodes: (nodes: GraphNode[]) => set({ nodes }),
  
  setEdges: (edges: GraphEdge[]) => set({ edges }),
  
  addNode: (node: GraphNode) => set(
    produce((state: GraphState) => {
      state.nodes.push(node);
    })
  ),
  
  addEdge: (edge: GraphEdge) => set(
    produce((state: GraphState) => {
      state.edges.push(edge);
    })
  ),
  
  removeNode: (nodeId: string) => set(
    produce((state: GraphState) => {
      state.nodes = state.nodes.filter(node => node.id !== nodeId);
      state.edges = state.edges.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      );
    })
  ),
  
  removeEdge: (edgeId: string) => set(
    produce((state: GraphState) => {
      state.edges = state.edges.filter(edge => edge.id !== edgeId);
    })
  ),
  
  updateNodePosition: (nodeId: string, position: { x: number, y: number }) => set(
    produce((state: GraphState) => {
      const nodeIndex = state.nodes.findIndex(n => n.id === nodeId);
      if (nodeIndex >= 0) {
        state.nodes[nodeIndex].position = position;
      }
    })
  ),
  
  buildGraphFromTask: (taskId: string) => {
    const kanbanStore = useKanbanStore.getState();
    const task = kanbanStore.tasks.find(t => t.id === taskId);
    
    if (!task) {
      get().setError(`Task with ID ${taskId} not found`);
      return;
    }
    
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const completedSubtasks: Record<string, boolean> = {};
    

    const taskNode: GraphNode = {
      id: `task-${task.id}`,
      label: task.title,
      type: 'task',
      data: task,
    };
    nodes.push(taskNode);
    

    const processSubtasks = (
      parentTask: any,
      parentNodeId: string,
      subtasks?: any[],
      depth = 0
    ) => {
      if (!subtasks || subtasks.length === 0) return;
      
      subtasks.forEach((subtask, index) => {
        const subtaskNodeId = `subtask-${subtask.id}`;
        

        const subtaskNode: GraphNode = {
          id: subtaskNodeId,
          label: subtask.title,
          type: 'subtask',
          data: subtask,
          parentId: parentNodeId,
        };
        nodes.push(subtaskNode);
        

        completedSubtasks[subtaskNodeId] = !!subtask.completed;
        

        const edge: GraphEdge = {
          id: `edge-${parentNodeId}-${subtaskNodeId}`,
          source: parentNodeId,
          target: subtaskNodeId,
          type: 'subtask',
        };
        edges.push(edge);
        

        if (subtask.children && subtask.children.length > 0) {
          processSubtasks(subtask, subtaskNodeId, subtask.children, depth + 1);
        }
      });
    };
    

    processSubtasks(task, taskNode.id, task.subtasks);
    

    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId: string) => {
        const depTask = kanbanStore.tasks.find(t => t.id === depId);
        if (depTask) {
          const depNodeId = `task-${depTask.id}`;
          

          if (!nodes.some(n => n.id === depNodeId)) {
            nodes.push({
              id: depNodeId,
              label: depTask.title,
              type: 'task',
              data: depTask,
            });
          }
          

          edges.push({
            id: `dep-${depNodeId}-${taskNode.id}`,
            source: depNodeId,
            target: taskNode.id,
            type: 'dependency',
            label: 'depends on'
          });
        }
      });
    }
    
    set({ 
      nodes, 
      edges,
      completedSubtasks 
    });
  },
  
  loadTaskDependencies: async (taskId: string) => {

    set({ isLoading: true, activeTaskId: taskId, error: null });
    
    try {

      get().buildGraphFromTask(taskId);
    } catch (error) {
      console.error('Error loading task dependencies:', error);
      set({ error: 'Failed to load task dependencies' });
    } finally {
      set({ isLoading: false });
    }
  },
});
