
/**
 * Custom hook for applying different layout algorithms to dependency graphs
 * Supports Dagre (hierarchical), breadth-first, and radial layouts with directional control
 */

import { useCallback } from 'react';
import { TypedNode, TypedEdge, GraphData } from '../types/nodeTypes';
import { getLayoutedElements, getBreadthFirstLayout, getRadialLayout, LayoutType } from '../utils/layoutUtils';

export const useGraphLayout = () => {
  const applyLayout = useCallback((
    data: GraphData,
    layoutType: LayoutType = 'dagre',
    direction: 'vertical' | 'horizontal' | 'radial' = 'vertical'
  ): GraphData => {
    if (!data.nodes.length) {
      return { nodes: [], edges: [] };
    }

    let layoutedNodes: TypedNode[];
    const dagreDirection = direction === 'vertical' ? 'TB' : 'LR';

    switch (layoutType) {
      case 'breadthfirst':
        layoutedNodes = getBreadthFirstLayout(data.nodes, data.edges, dagreDirection);
        break;
      case 'radial':
        layoutedNodes = getRadialLayout(data.nodes, data.edges);
        break;
      case 'dagre':
      default:
        layoutedNodes = getLayoutedElements(data.nodes, data.edges, dagreDirection);
        break;
    }

    // Inject layout direction into node data for conditional rendering
    const updatedNodes = layoutedNodes.map(node => {
      return {
        ...node,
        data: {
          ...node.data,
          layoutDirection: direction === 'radial' ? 'horizontal' : direction
        }
      };
    });

    const updatedEdges = data.edges.map(edge => {
      return {
        ...edge,
        data: {
          ...edge.data,
          layoutDirection: direction === 'radial' ? 'horizontal' : direction
        }
      };
    });

    return {
      nodes: updatedNodes,
      edges: updatedEdges,
    };
  }, []);

  return { applyLayout };
};

export default useGraphLayout;
