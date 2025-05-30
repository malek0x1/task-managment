
import React from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

interface NodeHandlesProps {
  isConnectable?: boolean;
  layoutDirection?: 'horizontal' | 'vertical';
}

export const NodeHandles: React.FC<NodeHandlesProps> = ({
  isConnectable = true,
  layoutDirection = 'horizontal'
}) => {
  const horizontal = layoutDirection === 'horizontal';
  
  return (
    <>
      <Handle
        type="target"
        position={horizontal ? Position.Left : Position.Top}
        isConnectable={isConnectable}
        className={cn("custom-handle", !isConnectable && "opacity-0")}
        style={{ 
          zIndex: 1, 
          pointerEvents: isConnectable ? 'all' : 'none',
          background: '#ffffff',
          border: '1px solid #AAAAAA',
        }}
      />
      <Handle
        type="source"
        position={horizontal ? Position.Right : Position.Bottom}
        isConnectable={isConnectable}
        className={cn("custom-handle", !isConnectable && "opacity-0")}
        style={{ 
          zIndex: 1,
          pointerEvents: isConnectable ? 'all' : 'none',
          background: '#ffffff',
          border: '1px solid #AAAAAA',
        }}
      />
    </>
  );
};

export default NodeHandles;
