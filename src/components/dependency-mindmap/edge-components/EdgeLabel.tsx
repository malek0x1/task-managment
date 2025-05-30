import React from "react";
import { EdgeLabelRenderer } from "reactflow";

interface EdgeLabelProps {
  labelX: number;
  labelY: number;
  label: string;
  isHovered: boolean;
}

const EdgeLabel: React.FC<EdgeLabelProps> = ({
  labelX,
  labelY,
  label,
  isHovered,
}) => {
  if (!label) return null;

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          pointerEvents: "all",
          backgroundColor: "white",
          padding: "2px 4px",
          borderRadius: "4px",
          fontSize: "10px",
          fontWeight: 500,
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
          transition: "transform 0.2s",
          ...(isHovered && {
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) scale(1.05)`,
          }),
        }}
        className="nodrag nopan edge-label clickable"
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </div>
    </EdgeLabelRenderer>
  );
};

export default EdgeLabel;
