
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

interface SelectedNodeState {
  selectedNodeId: string | null;
  selectedNodeType: 'task' | 'subtask' | null;
  setSelectedNode: (nodeId: string | null, nodeType: 'task' | 'subtask' | null) => void;
}

const useSelectedNodeStore = create<SelectedNodeState>((set, get) => ({
  selectedNodeId: null,
  selectedNodeType: null,
  setSelectedNode: (nodeId: string | null, nodeType: 'task' | 'subtask' | null) => {
    set({ selectedNodeId: nodeId, selectedNodeType: nodeType });
  },
}));

const useSelectedNodeState = () => {
  const state = useSelectedNodeStore(
    state => ({
      selectedNodeId: state.selectedNodeId,
      selectedNodeType: state.selectedNodeType,
      setSelectedNode: state.setSelectedNode,
    }),
    shallow
  );
  
  return {
    ...state,
    selectNode: state.setSelectedNode
  };
};

export default useSelectedNodeState;
