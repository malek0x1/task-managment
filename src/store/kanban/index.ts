
import { create } from 'zustand';
import { createDataActions } from './actions/dataActions';
import { createTaskActions } from './actions/task';
import { createColumnActions } from './actions/columnActions';
import { createUiActions } from './actions/uiActions';
import { initialState, StoreState, ResetStateAction } from './types';

const useKanbanStore = create<
  StoreState & 
  ReturnType<typeof createDataActions> & 
  ReturnType<typeof createTaskActions> & 
  ReturnType<typeof createColumnActions> & 
  ReturnType<typeof createUiActions> &
  ResetStateAction
>((set, get) => ({
  ...initialState,
  
  ...createDataActions(set, get),
  ...createTaskActions(set, get),
  ...createColumnActions(set, get),
  ...createUiActions(set, get),
  
  resetState: () => {
    set({ ...initialState });
  },
}));

export default useKanbanStore;
