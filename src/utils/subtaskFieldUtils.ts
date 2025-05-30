import { Task, Subtask } from '@/types/kanban';


const DEFAULT_EXCALIDRAW_DATA = {
  appState: {
    viewBackgroundColor: "#FFFFFF",
    currentItemFontFamily: 1
  },
  elements: [],
  lastSaved: new Date().toISOString()
};

const normalizeSubtask = (subtask: Partial<Subtask>): Subtask => {
  if (!subtask) return {
    id: crypto.randomUUID(), 
    title: "",
    completed: false,
    parentSubtaskId: null,
    excalidraw_data: { ...DEFAULT_EXCALIDRAW_DATA }
  };


  const excalidraw_data = subtask.excalidraw_data ? 

    {
      appState: subtask.excalidraw_data.appState || { viewBackgroundColor: "#FFFFFF", currentItemFontFamily: 1 },
      elements: Array.isArray(subtask.excalidraw_data.elements) ? subtask.excalidraw_data.elements : [],
      lastSaved: subtask.excalidraw_data.lastSaved || new Date().toISOString()
    } :

    { ...DEFAULT_EXCALIDRAW_DATA };

  return {
    id: subtask.id || crypto.randomUUID(),
    title: subtask.title || "",
    completed: typeof subtask.completed === 'boolean' ? subtask.completed : false,
    parentSubtaskId: subtask.parentSubtaskId || null,
    excalidraw_data,
    

    ...(subtask.description !== undefined && { description: subtask.description }),
    ...(subtask.due_date !== undefined && { due_date: subtask.due_date }),
    ...(subtask.priority !== undefined && { priority: subtask.priority }),
    ...(subtask.task_id !== undefined && { task_id: subtask.task_id }),
    ...(subtask.assignee !== undefined && { assignee: subtask.assignee }),
    ...(subtask.assignees !== undefined && { assignees: subtask.assignees }),
    ...(subtask.tags !== undefined && { tags: subtask.tags }),
    ...(subtask.time_estimate !== undefined && { time_estimate: subtask.time_estimate }),
    

    ...(subtask.children && {
      children: normalizeSubtaskChildren(subtask.children)
    })
  };
};

const normalizeSubtaskChildren = (children: Array<Partial<Subtask>>): Subtask[] => {
  if (!Array.isArray(children)) return [];
  return children.map(child => normalizeSubtask(child));
};


export const ensureSubtaskFields = (tasks: Task[]): Task[] => {
  if (!Array.isArray(tasks)) return [];
  
  return tasks.map(task => {

    if (!task) return task;
    

    if (!task.subtasks) return task;
    

    if (!Array.isArray(task.subtasks)) return {
      ...task,
      subtasks: []
    };
    

    return {
      ...task,
      subtasks: task.subtasks.map(subtask => normalizeSubtask(subtask))
    };
  });
};


export const ensureSubtaskFieldsInPlace = (tasks: Task[]): void => {
  if (!Array.isArray(tasks)) return;
  
  tasks.forEach((task, index) => {
    if (!task || !task.subtasks || !Array.isArray(task.subtasks)) return;
    
    task.subtasks.forEach((subtask, subtaskIndex) => {
      tasks[index].subtasks![subtaskIndex] = normalizeSubtask(subtask);
    });
  });
};
