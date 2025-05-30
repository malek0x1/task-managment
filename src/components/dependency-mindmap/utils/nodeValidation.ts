
import { Node } from 'reactflow';
import { NodePosition, NodeWithPosition, TypedNode } from '../types/nodeTypes';


export const hasValidPosition = (node: NodeWithPosition | unknown): boolean => {
  if (!node) return false;
  
  const nodeWithPos = node as NodeWithPosition;
  
  return (
    nodeWithPos && 
    nodeWithPos.position && 
    typeof nodeWithPos.position.x === 'number' && 
    typeof nodeWithPos.position.y === 'number' &&
    !isNaN(nodeWithPos.position.x) && 
    !isNaN(nodeWithPos.position.y)
  );
};


export const filterValidNodes = (nodes: TypedNode[]): TypedNode[] => {
  return nodes.filter(node => {
    if (!hasValidPosition(node)) {
      console.warn('Invalid node detected and filtered out:', node);
      return false;
    }
    return true;
  });
};


export const ensureValidNodePositions = (nodes: TypedNode[]): TypedNode[] => {
  return nodes.map((node, index) => {
    if (!hasValidPosition(node)) {
      console.warn('Node with invalid position detected, adding default position:', node);

      const defaultX = (index % 3) * 200;
      const defaultY = Math.floor(index / 3) * 100;
      return {
        ...node,
        position: { x: defaultX, y: defaultY }
      };
    }
    return node;
  });
};
