
import { create } from 'zustand';
import { StoreState } from './types';
import { createDataActions } from './actions/dataActions';
import { createUiActions } from './actions/uiActions';
import { createColumnActions } from './actions/columnActions';
import { createTaskActions } from './actions/task';

const useKanbanStore = create<StoreState>((set, get) => ({
  columns: [],
  tasks: [],
  activeTask: null,
  activeColumn: null,
  kanbanInitialized: false,
  isTaskDrawerOpen: false,
  isLoading: false,
  error: null,
  lastFetch: null,
  
  ...createDataActions(set, get),
  ...createUiActions(set, get),
  ...createColumnActions(set, get),
  ...createTaskActions(set, get),
}));

export default useKanbanStore;
