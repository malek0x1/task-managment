
import { Column, Task } from '@/types/kanban';


export interface StoreState {
  columns: Column[];
  tasks: Task[];
  activeTask: Task | null;
  activeColumn: Column | null;
  kanbanInitialized: boolean;
  isTaskDrawerOpen: boolean;
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
}


export const initialState: StoreState = {
  columns: [],
  tasks: [],
  activeTask: null,
  activeColumn: null,
  kanbanInitialized: false,
  isTaskDrawerOpen: false,
  isLoading: false,
  error: null,
  lastFetch: null,
};


export { type Task } from '@/types/kanban';


export interface ResetStateAction {
  resetState: () => void;
}
