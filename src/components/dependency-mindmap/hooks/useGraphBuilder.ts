
import { useCallback } from 'react';
import { Task, Subtask } from '@/types/kanban';
import { SubtaskNodeData, TaskNodeData, TypedNode, TypedEdge, EdgeData } from '../types/nodeTypes';

interface UseGraphBuilderProps {
  task: Task | undefined;
  collapsedNodes: Set<string>;
  toggleNodeCollapse: (nodeId: string) => void;
  handleToggleSubtaskComplete: (subtaskId: string, completed: boolean) => void;
  handleAddSubtask: (parentId: string, subtaskId?: string | null) => void;
  recentlyAddedNodes: Set<string>;
  highlightedNodes: Set<string>;
  isNodeCollapsed: (nodeId: string) => boolean; 
  isSubtaskCompleted: (subtaskId: string) => boolean;
}

export const useGraphBuilder = (props: UseGraphBuilderProps) => {
  const { 
    task, 
    toggleNodeCollapse, 
    handleToggleSubtaskComplete, 
    handleAddSubtask, 
    recentlyAddedNodes, 
    highlightedNodes,
    isNodeCollapsed,
    isSubtaskCompleted
  } = props;
  
  const createTaskNode = useCallback((task: Task): TypedNode<TaskNodeData> => {
    const nodeId = `task-${task.id}`;
    const isCollapsed = isNodeCollapsed(nodeId);
    
    return {
      id: nodeId,
      type: 'taskNode',
      position: { x: 0, y: 0 },
      data: {
        task,
        taskId: task.id,
        label: task.title,
        priority: task.priority || 'medium',
        column_id: task.column_id,
        type: 'taskNode',
        hasChildren: task.subtasks && task.subtasks.length > 0,
        isCollapsed,
        onToggleCollapse: toggleNodeCollapse,
        collaborators: task.assignees || [],
        isHighlighted: nodeId ? highlightedNodes.has(nodeId) : false,
        isRecentlyAdded: nodeId ? recentlyAddedNodes.has(nodeId) : false,
        onAddSubtask: (taskId: string) => handleAddSubtask(taskId),
        status: task.status || 'todo',
      },
    };
  }, [toggleNodeCollapse, highlightedNodes, recentlyAddedNodes, handleAddSubtask, isNodeCollapsed]);
  
  const createSubtaskNode = useCallback((subtask: Subtask, parentTask: Task, level = 0): TypedNode<SubtaskNodeData> => {
    const subtaskId = subtask.id;
    const nodeId = `subtask-${subtask.id}`;
    const isCollapsed = isNodeCollapsed(nodeId);
    const completed = isSubtaskCompleted(subtaskId);
    
    const onToggleCompleteAdapter = (subtaskId: string) => {
      handleToggleSubtaskComplete(subtaskId, !completed);
    };
    
    return {
      id: nodeId,
      type: 'subtaskNode',
      position: { x: 0, y: 0 },
      data: {
        subtask,
        taskId: parentTask.id,
        label: subtask.title,
        completed,
        priority: subtask.priority as 'low' | 'medium' | 'high' || 'medium',
        column_id: parentTask.column_id,
        type: 'subtaskNode',
        hasChildren: subtask.children && subtask.children.length > 0,
        isCollapsed,
        level,
        collaborators: subtask.assignee ? [subtask.assignee] : [],
        isHighlighted: nodeId ? highlightedNodes.has(nodeId) : false,
        isRecentlyAdded: nodeId ? recentlyAddedNodes.has(nodeId) : false,
        parentSubtaskId: subtask.parentSubtaskId || null,
        onToggleCollapse: toggleNodeCollapse,
        onToggleComplete: onToggleCompleteAdapter,
        onAddSubtask: (taskId: string, parentSubtaskId: string) => 
          handleAddSubtask(taskId, parentSubtaskId),
        dueDate: subtask.due_date,
        commentCount: 0
      }
    };
  }, [
    toggleNodeCollapse, 
    handleToggleSubtaskComplete, 
    handleAddSubtask, 
    highlightedNodes, 
    recentlyAddedNodes,
    isNodeCollapsed,
    isSubtaskCompleted
  ]);
  
  const createEdge = useCallback((source: string, target: string, type: 'subtask' | 'dependency' = 'subtask'): TypedEdge => {
    const edgeData: EdgeData = {
      type,
    };

    return {
      id: `edge-${source}-to-${target}-${Date.now()}`,
      source,
      target,
      type: 'enhanced',
      animated: type === 'dependency',
      data: edgeData,
    };
  }, []);
  
  const buildParentChildMap = useCallback((task: Task | undefined) => {
    if (!task || !task.subtasks || task.subtasks.length === 0) {
      return new Map<string, Subtask[]>();
    }
    
    const map = new Map<string, Subtask[]>();
    
    for (const subtask of task.subtasks) {
      const parentId = subtask.parentSubtaskId || task.id;
      
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      
      map.get(parentId)!.push(subtask);
    }
    
    return map;
  }, []);
  
  const generateGraph = useCallback(() => {
    const nodes: TypedNode[] = [];
    const edges: TypedEdge[] = [];
    
    if (!task) {
      return { nodes, edges };
    }

    const taskNode = createTaskNode(task);
    const taskNodeId = taskNode.id;
    nodes.push(taskNode);

    const parentChildMap = buildParentChildMap(task);
    
    const buildHierarchy = (parentId: string, parentNodeId: string, level = 0) => {
      const children = parentChildMap.get(parentId) || [];
      
      const isParentCollapsed = isNodeCollapsed(parentNodeId);
      
      if (isParentCollapsed) {
        return;
      }
      
      children.forEach((subtask) => {
        const subtaskNode = createSubtaskNode(subtask, task, level);
        nodes.push(subtaskNode);
        
        edges.push(createEdge(parentNodeId, subtaskNode.id));
        
        buildHierarchy(subtask.id, subtaskNode.id, level + 1);
      });
    };
    
    buildHierarchy(task.id, taskNodeId);

    return { nodes, edges };
  }, [
    task, 
    createTaskNode, 
    createSubtaskNode, 
    createEdge, 
    buildParentChildMap,
    isNodeCollapsed
  ]);

  return {
    generateGraph,
  };
};

export default useGraphBuilder;
