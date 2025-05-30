
import { create } from 'zustand';
import { enableMapSet } from 'immer';
import { initialGraphState, DependencyGraphStore } from './types';
import { createUISlice } from './uiSlice';
import { createDataSlice } from './dataSlice';
import { createLayoutSlice } from './layoutSlice';


enableMapSet();


export const useDependencyGraphStore = create<DependencyGraphStore>()((set, get, api) => ({

  ...initialGraphState,
  

  ...createUISlice(set, get, api),
  ...createDataSlice(set, get, api),
  ...createLayoutSlice(set, get, api),
}));


export default useDependencyGraphStore;


export type { GraphNode, GraphEdge, LayoutMode } from './types';
