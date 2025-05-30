
import { Task, Subtask } from '@/types/kanban';
import { TypedNode, TaskNodeData, SubtaskNodeData, EdgeData } from '../types/nodeTypes';


export const createTaskNode = (task: Task, options?: {
  onToggleCollapse?: (nodeId: string) => void;
  onAddSubtask?: (taskId: string, parentSubtaskId?: string | null) => void;
}): TypedNode<TaskNodeData> => {
  const nodeId = `task-${task.id}`;
  
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
      isCollapsed: false,
      onToggleCollapse: options?.onToggleCollapse || (() => {}),
      onAddSubtask: options?.onAddSubtask || (() => {}),
      collaborators: task.assignees || [],
    },
  };
};


export const createSubtaskNode = (
  subtask: Subtask, 
  parentTask: Task, 
  index: number,
  options?: {
    onToggleComplete?: (subtaskId: string) => void;
    onToggleCollapse?: (subtaskId: string) => void;
    onAddSubtask?: (taskId: string, parentSubtaskId: string) => void;
  }
): TypedNode<SubtaskNodeData> => {

  const nodeId = `subtask-${subtask.id}`;
  

  const onToggleComplete = options?.onToggleComplete || (() => {});
  
  return {
    id: nodeId,
    type: 'subtaskNode',
    position: { x: 0, y: 0 },
    data: {
      subtask,
      taskId: parentTask.id,
      label: subtask.title,
      completed: subtask.completed || false,
      priority: subtask.priority as 'low' | 'medium' | 'high' || 'medium',
      column_id: parentTask.column_id,
      type: 'subtaskNode',
      hasChildren: subtask.children && subtask.children.length > 0,
      level: index,
      isCollapsed: false,
      onToggleComplete,
      onToggleCollapse: options?.onToggleCollapse || (() => {}),
      onAddSubtask: options?.onAddSubtask || (() => {}),
      parentSubtaskId: subtask.parentSubtaskId || null,
      collaborators: subtask.assignee ? [subtask.assignee] : [],
      commentCount: 0,
    }
  };
};

export const createDependencyNode = (dependency: any, options?: {
  // fix type any
  onToggleCollapse?: (nodeId: string) => void;
  onAddSubtask?: (taskId: string, parentSubtaskId?: string | null) => void;
}): TypedNode<any> => {
  return {
    id: `dependency-${dependency.id}`,
    type: 'dependencyNode',
    position: { x: 0, y: 0 },
    data: {
      dependency,
      label: dependency.title,
      priority: dependency.priority || 'medium',
      column_id: dependency.column_id || '',
      type: 'dependencyNode',
      isCollapsed: false,
      hasChildren: false,
      onToggleCollapse: options?.onToggleCollapse || (() => {}),
      onAddSubtask: options?.onAddSubtask || (() => {})
    }
  };
};
