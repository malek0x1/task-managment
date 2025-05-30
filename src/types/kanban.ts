export interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type TabType = 'details' | 'subtasks' | 'dependencies' | 'comments' | 'activity';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  task_id?: string;
  created_at?: string;
  updated_at?: string;
  priority?: Priority;
  due_date?: string;
  assignee?: Assignee;
  assignees?: Assignee[];
  tags?: string[];
  children?: Subtask[];
  parentSubtaskId?: string | null;
  description?: string;
  time_estimate?: string | number;
  excalidraw_data?: any; 
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  column_id: string;
  position?: number;
  created_at?: string;
  updated_at?: string;
  subtasks?: Subtask[];
  priority?: Priority;
  due_date?: string;
  assignee?: Assignee;
  assignees?: Assignee[];
  tags?: string[];
  status?: string;
  dependencies?: string[];
  blocked_by?: string[];
  excalidraw_data?: any;
  

  order?: number;
  project_id?: string;
  labels?: Label[];
  time_estimate?: string | number;
  has_deep_subtasks?: boolean;
  has_dependencies?: boolean;
  has_automations?: boolean;
  has_ai_assistant?: boolean;
  initialTab?: TabType;
}

export interface Column {
  id: string;
  title: string;
  position: number;
  created_at?: string;
  updated_at?: string;
  task_ids?: string[];
  

  order?: number;
  project_id?: string;
  color?: string;
  wip_limit?: number;
}
