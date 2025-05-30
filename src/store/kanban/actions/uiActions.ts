
import { StoreState } from '../types';

export interface UiActions {
  openTaskDrawer: (taskId: string) => void;
  closeTaskDrawer: () => void;
}

export const createUiActions = (
  set: (state: Partial<StoreState>) => void,
  get: () => StoreState
): UiActions => ({
  openTaskDrawer: (taskId: string) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      set({ activeTask: task, isTaskDrawerOpen: true });
    } else {
      console.error(`Task with ID ${taskId} not found`);
    }
  },

  closeTaskDrawer: () => {
    set({ isTaskDrawerOpen: false });
  },
});
