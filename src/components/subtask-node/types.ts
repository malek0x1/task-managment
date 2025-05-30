
import { Subtask } from '@/types/kanban';

export interface SubtaskNodeProps {
  id: string;
  data: {
    label: string;
    completed: boolean;
    hasChildren: boolean;
    isCollapsed: boolean;
    onToggleCollapse: (subtaskId: string) => void;
    priority?: 'low' | 'medium' | 'high';
    level?: number;
    subtask: Subtask;
    taskId: string;
    parentSubtaskId?: string | null;
    onToggleComplete: (subtaskId: string) => void;
    onAddSubtask: (taskId: string, subtaskId: string) => void;
    onUpdateSubtask?: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
    onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
    collaborators?: any[];
    isHighlighted?: boolean;
  };
}

export interface CompletionButtonProps {
  completed: boolean;
  taskId: string;
  subtaskId: string;
  onToggle: (taskId: string, subtaskId: string) => void;
}
