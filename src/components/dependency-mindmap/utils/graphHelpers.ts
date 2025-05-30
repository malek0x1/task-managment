
import { MarkerType, EdgeMarker } from 'reactflow';
import { Subtask } from '@/types/kanban';

export const getEdgeStyle = (level: number, isCollapsed: boolean = false, status?: string, priority?: string) => {
  return {
    strokeWidth: 1.5,
    stroke: '#8F8F8F',
    opacity: isCollapsed ? 0.5 : 0.8
  };
};

export const createArrowMarker = (id: string, color: string = "#8F8F8F"): EdgeMarker => {
  return {
    type: MarkerType.ArrowClosed,
    width: 12,
    height: 12,
    color: color,
    strokeWidth: 1.5
  };
};

export const ensureSubtaskCompatibility = (subtasks: any[]): Subtask[] => {
  return subtasks.map(subtask => ({
    ...subtask,
    createdAt: subtask.createdAt || new Date().toISOString(),
  }));
};

export const createNestedSubtasks = (subtasks: Subtask[]): Subtask[] => {
  return subtasks.map(subtask => {
    const children = subtask.children ? createNestedSubtasks(subtask.children) : [];
    return {
      ...subtask,
      children,
    };
  });
};

export const getMaxNestingLevel = (subtasks: Subtask[]): number => {
  if (!subtasks || subtasks.length === 0) return 0;
  
  let maxNestingLevel = 0;
  
  const traverse = (items: Subtask[], level = 1): void => {
    maxNestingLevel = Math.max(maxNestingLevel, level);
    
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        traverse(item.children, level + 1);
      }
    }
  };
  
  traverse(subtasks);
  return maxNestingLevel;
};

export const calculateMaxNestingLevel = (subtasks: Subtask[], parentId?: string, currentLevel = 0): number => {
  const childSubtasks = subtasks.filter(s => s.parentSubtaskId === parentId);
  
  if (childSubtasks.length === 0) {
    return currentLevel;
  }
  
  const nestingLevels = childSubtasks.map(subtask => 
    calculateMaxNestingLevel(subtasks, subtask.id, currentLevel + 1)
  );
  
  return nestingLevels.length > 0 ? Math.max(...nestingLevels) : currentLevel;
};
