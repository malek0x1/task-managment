
import React, { useState, useCallback } from 'react';
import { BaseEdge, getBezierPath, EdgeProps } from 'reactflow';
import { getEdgeColor, getEdgeDashArray, getPositions, getCurvature } from './edge-components/edgeUtils';
import EdgeLabel from './edge-components/EdgeLabel';
import AnimatedEdgePath from './edge-components/AnimatedEdgePath';
import HitDetectionPath from './edge-components/HitDetectionPath';
import { EdgeData } from './types/nodeTypes';

const EnhancedEdge: React.FC<EdgeProps<EdgeData>> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { sourcePos, targetPos } = getPositions(data?.layoutDirection);
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePos,
    targetX,
    targetY,
    targetPosition: targetPos,
    curvature: getCurvature(data?.layoutDirection, data?.level || 0),
  });

  const edgeColor = getEdgeColor(
    isHovered, 
    !!data?.highlighted, 
    data?.type, 
    data?.status,
    data?.priority
  );
  
  const strokeWidth = isHovered || data?.highlighted ? 2.5 : 
                      (data?.type === 'blocking' || data?.type === 'dependency') ? 2 : 1.5;
  
  const dashArray = getEdgeDashArray(data?.status, data?.type);
  
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    setIsHovered(false);
  }, []);
  
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth,
          transition: 'stroke-width 0.2s, stroke 0.3s',
          strokeDasharray: dashArray,
          ...(isHovered && {
            filter: 'drop-shadow(0 0 2px rgba(99, 102, 241, 0.4))'
          })
        }}
      />
      
      <HitDetectionPath 
        edgePath={edgePath} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
      />
      
      <AnimatedEdgePath 
        edgePath={edgePath} 
        edgeColor={edgeColor} 
        isAnimated={!!(data?.animated || isHovered)} 
      />
      
      <EdgeLabel 
        labelX={labelX} 
        labelY={labelY} 
        label={data?.label || ''} 
        isHovered={isHovered} 
      />
    </>
  );
};

export default EnhancedEdge;
