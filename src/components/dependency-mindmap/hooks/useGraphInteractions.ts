
import { useCallback } from 'react';
import { 
  NodeMouseHandler,
  Connection,
  Edge,
  OnConnect,
  NodeDragHandler
} from 'reactflow';
import useDependencyGraphStore from '@/store/dependencyGraph';
import useSelectedNodeState from './useSelectedNodeState';

interface GraphInteractions {
  onNodeDragStop: NodeDragHandler;
  onNodeClick: NodeMouseHandler;
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  onConnect: OnConnect;
}

export function useGraphInteractions(): GraphInteractions {
  const { 
    updateNodePosition,
    setSelectedNode, 
    toggleNodeCollapse,
    toggleSubtaskCompletion
  } = useDependencyGraphStore();
  
  const { selectNode } = useSelectedNodeState();
  
  const onNodeDragStop: NodeDragHandler = useCallback((event, node) => {
    updateNodePosition(node.id, node.position);
  }, [updateNodePosition]);
  
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node.id);
    
    let actualId: string;
    let nodeType: 'task' | 'subtask' | null = null;
    
    if (node.id.startsWith('subtask-')) {
      actualId = node.id.substring(8);
      nodeType = 'subtask';
    } else if (node.id.startsWith('task-')) {
      actualId = node.id.substring(5);
      nodeType = 'task';
    } else {
      actualId = node.id;
      nodeType = 'task';
    }
    
    selectNode(actualId, nodeType);
  }, [setSelectedNode, selectNode]);
  
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {

  }, []);
  
  const onConnect: OnConnect = useCallback((params: Connection) => {

  }, []);

  return {
    onNodeDragStop,
    onNodeClick,
    onEdgeClick,
    onConnect,
  };
}

export default useGraphInteractions;
