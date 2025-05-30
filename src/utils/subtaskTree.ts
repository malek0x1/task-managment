
import { Subtask } from '@/types/kanban';

export interface NestedSubtask extends Subtask {
  children?: NestedSubtask[];
  id: string;
}

export const buildSubtaskTree = (subtasks: Subtask[]): NestedSubtask[] => {
  const subtaskMap = new Map<string, NestedSubtask>();
  
  const subtasksWithChildren = subtasks.map(subtask => ({
    ...subtask,
    children: [] as NestedSubtask[]
  }));
  
  subtasksWithChildren.forEach(subtask => {
    subtaskMap.set(subtask.id, subtask);
  });
  
  const rootSubtasks: NestedSubtask[] = [];
  
  subtasksWithChildren.forEach(subtask => {
    if (subtask.parentSubtaskId) {
      const parent = subtaskMap.get(subtask.parentSubtaskId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(subtask);
      } else {
        rootSubtasks.push(subtask);
      }
    } else {
      rootSubtasks.push(subtask);
    }
  });
  
  return rootSubtasks;
};

