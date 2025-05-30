
import { StoreState } from '../../types';
import { createCoreTaskActions, CoreTaskActions } from './coreTaskActions';
import { createSubtaskActions, SubtaskActions } from './subtaskActions';

export interface TaskActions extends CoreTaskActions, SubtaskActions {}

export const createTaskActions = (
  set: (state: Partial<StoreState>) => void,
  get: () => StoreState
): TaskActions => {
  return {
    ...createCoreTaskActions(set, get),
    ...createSubtaskActions(set, get)
  };
};

export * from './coreTaskActions';
export * from './subtaskActions';
