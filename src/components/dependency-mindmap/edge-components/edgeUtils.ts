
import { Position } from 'reactflow';
import { LayoutDirection } from '../types/nodeTypes';

export const getPositions = (
  layoutDirection?: LayoutDirection
): { sourcePos: Position; targetPos: Position } => {
  return layoutDirection === 'vertical'
    ? { sourcePos: Position.Bottom, targetPos: Position.Top }
    : { sourcePos: Position.Right, targetPos: Position.Left };
};


export const getCurvature = (
  layoutDirection?: LayoutDirection,
  level?: number
): number => {
  const baseCurvature = 0.4;
  const levelFactor = level ? Math.min(level * 0.05, 0.2) : 0;
  
  return layoutDirection === 'vertical'
    ? baseCurvature - levelFactor
    : baseCurvature + levelFactor;
};

export const getEdgeColor = (
  isHovered: boolean,
  isHighlighted: boolean,
  type?: 'dependency' | 'subtask' | 'blocking',
  status?: 'todo' | 'in-progress' | 'completed',
  priority?: 'low' | 'medium' | 'high'
): string => {
  if (isHovered || isHighlighted) {
    return '#6366f1'; 
  }
  
  if (type === 'blocking') {
    return '#ef4444';
  }
  
  if (status === 'completed') {
    return '#10b981';
  }
  
  if (priority === 'high') {
    return '#f97316';
  }
  
  return '#cbd5e1'; 
};

export const getEdgeDashArray = (
  status?: 'todo' | 'in-progress' | 'completed',
  type?: 'dependency' | 'subtask' | 'blocking'
): string | undefined => {
  if (status === 'in-progress') {
    return '5,5';
  }
  
  if (type === 'dependency') {
    return '3,3';
  }
  
  return undefined;
};
