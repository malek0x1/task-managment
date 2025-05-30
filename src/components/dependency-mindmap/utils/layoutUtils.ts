/**
 * Layout utilities for DAG-based task dependency visualization
 * Handles automatic positioning of nodes using Dagre with custom spacing rules
 */

import { Node, Edge, Position } from 'reactflow';
import dagre from 'dagre';

export type LayoutType = 'dagre' | 'breadthfirst' | 'radial';

// Base dimensions and spacing constants - tuned for readability at various zoom levels
const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;
const BASE_SEPARATION = 120;
const VERTICAL_SPACING = 220;
const RADIAL_BASE_RADIUS = 250;

export const getLayoutConfig = (direction: 'TB' | 'LR', nestingLevel: number = 0) => {
  const baseSeparation = BASE_SEPARATION;

  // Reduce spacing for deeply nested hierarchies to prevent excessive spread
  const rankSeparation = direction === 'TB'
    ? Math.max(300 - nestingLevel * 10, 200) // bump spacing when TB
    : Math.max(220 - nestingLevel * 10, 160); // keep LR as is

  const nodeSeparation = Math.max(baseSeparation - nestingLevel * 5, 80);

  return {
    rankdir: direction,
    nodesep: nodeSeparation,
    ranksep: rankSeparation,
    marginx: 60,
    marginy: 60,
    align: direction === 'TB' ? 'UL' : 'DL',
  };
};

/**
 * Applies Dagre layout algorithm with custom node sizing and parent-child alignment
 * Ensures task nodes are properly sized and parents center over their children
 */
export const getLayoutedElements = (
  nodes: Node[], 
  edges: Edge[], 
  direction: 'TB' | 'LR',
  nestingLevel: number = 0
) => {
  if (nodes.length === 0) return nodes;
  
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const layoutConfig = getLayoutConfig(direction, nestingLevel);
  dagreGraph.setGraph(layoutConfig);

  nodes.forEach((node) => {
    // Task nodes get extra space for better visual hierarchy
    const width = node.type === 'taskNode' ? NODE_WIDTH + 60 : NODE_WIDTH;
    const height = node.type === 'taskNode' ? NODE_HEIGHT + 20 : NODE_HEIGHT;
    
    const nodeLevel = node.data?.level || 0;
    
    // Gradually shrink nodes at deeper levels to show hierarchy
    const adjustedWidth = Math.max(width - (nodeLevel * 10), width * 0.7);
    const adjustedHeight = height;
    
    dagreGraph.setNode(node.id, { width: adjustedWidth, height: adjustedHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Center parent nodes horizontally over their children for cleaner visual flow
  if (direction === 'TB') {
    const parents = new Set(edges.map(e => e.source));
    parents.forEach(parentId => {
      const children = edges
        .filter(e => e.source === parentId)
        .map(e => dagreGraph.node(e.target));
      
      if (children.length > 0) {
        const minX = Math.min(...children.map(c => c.x));
        const maxX = Math.max(...children.map(c => c.x));
        const parent = dagreGraph.node(parentId);
        parent.x = (minX + maxX) / 2;
      }
    });
  }

  // Convert Dagre coordinates to React Flow positions (accounting for node dimensions)
  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    const widthOffset = node.type === 'taskNode' ? (NODE_WIDTH + 60) / 2 : NODE_WIDTH / 2;
    const heightOffset = node.type === 'taskNode' ? (NODE_HEIGHT + 20) / 2 : NODE_HEIGHT / 2;
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - widthOffset,
        y: nodeWithPosition.y - heightOffset,
      },
    };
  });
};

export const getBreadthFirstLayout = (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR') => {
  if (nodes.length === 0) return nodes;
  
  const isHorizontal = direction === 'LR';
  const levels: Record<string, number> = {};
  const nodeMap: Record<string, Node> = {};
  
  nodes.forEach(node => {
    nodeMap[node.id] = node;
    levels[node.id] = 0;
  });
  
  const rootIds = nodes
    .filter(node => !edges.some(edge => edge.target === node.id))
    .map(node => node.id);
  
  if (rootIds.length === 0 && nodes.length > 0) {
    rootIds.push(nodes[0].id);
  }
  
  const queue = [...rootIds];
  const visited = new Set(rootIds);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const level = levels[current];
    
    const children = edges
      .filter(edge => edge.source === current)
      .map(edge => edge.target);
    
    children.forEach(child => {
      if (!visited.has(child)) {
        visited.add(child);
        levels[child] = level + 1;
        queue.push(child);
      } else {
        levels[child] = Math.max(levels[child], level + 1);
      }
    });
  }
  
  const nodesPerLevel: Record<number, number> = {};
  Object.entries(levels).forEach(([nodeId, level]) => {
    nodesPerLevel[level] = (nodesPerLevel[level] || 0) + 1;
  });
  
  const levelPositions: Record<number, number> = {};
  
  return nodes.map(node => {
    const level = levels[node.id];
    const nodesInThisLevel = nodesPerLevel[level];
    
    if (levelPositions[level] === undefined) {
      levelPositions[level] = 0;
    } else {
      levelPositions[level]++;
    }
    
    const positionInLevel = levelPositions[level];
    
    const x = isHorizontal 
      ? level * BASE_SEPARATION 
      : (positionInLevel - (nodesInThisLevel - 1) / 2) * BASE_SEPARATION;
    
    const y = isHorizontal 
      ? (positionInLevel - (nodesInThisLevel - 1) / 2) * VERTICAL_SPACING 
      : level * VERTICAL_SPACING;
    
    return {
      ...node,
      position: { x, y }
    };
  });
};

export const getRadialLayout = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) return nodes;
  
  const nodeMap: Record<string, Node> = {};
  const levelMap: Record<string, number> = {};
  
  nodes.forEach(node => {
    nodeMap[node.id] = node;
    levelMap[node.id] = 0;
  });
  
  const rootNode = nodes.find(node => node.type === 'taskNode') || 
                  nodes.find(node => !edges.some(edge => edge.target === node.id));
  
  if (!rootNode) return nodes;
  
  const queue = [rootNode.id];
  const visited = new Set([rootNode.id]);
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const level = levelMap[currentId];
    
    edges
      .filter(edge => edge.source === currentId)
      .forEach(edge => {
        const targetId = edge.target;
        if (!visited.has(targetId)) {
          visited.add(targetId);
          levelMap[targetId] = level + 1;
          queue.push(targetId);
        }
      });
  }
  
  const levelCounts: Record<number, number> = {};
  const levelPositions: Record<number, number> = {};
  
  Object.entries(levelMap).forEach(([nodeId, level]) => {
    levelCounts[level] = (levelCounts[level] || 0) + 1;
  });
  
  return nodes.map(node => {
    const level = levelMap[node.id];
    
    if (levelPositions[level] === undefined) {
      levelPositions[level] = 0;
    } else {
      levelPositions[level]++;
    }
    
    const angle = (2 * Math.PI * levelPositions[level]) / (levelCounts[level] || 1);
    const radius = RADIAL_BASE_RADIUS * Math.pow(1.5, level);
    
    return {
      ...node,
      position: { 
        x: Math.cos(angle) * radius + 600,
        y: Math.sin(angle) * radius + 500
      }
    };
  });
};
