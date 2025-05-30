import React from "react";

interface AnimatedEdgePathProps {
  edgePath: string;
  edgeColor: string;
  isAnimated: boolean;
}

const AnimatedEdgePath: React.FC<AnimatedEdgePathProps> = ({
  edgePath,
  edgeColor,
  isAnimated,
}) => {
  if (!isAnimated) return null;

  return (
    <path
      d={edgePath}
      fill="none"
      strokeWidth={2}
      stroke={edgeColor}
      strokeDasharray="6,6"
      style={{
        strokeDashoffset: 24,
        animation: "react-flow-edge-stroke-animation 1.5s linear infinite",
        pointerEvents: "none",
        zIndex: 3,
      }}
    />
  );
};

export default AnimatedEdgePath;
