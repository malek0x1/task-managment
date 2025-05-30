import React from "react";

interface HitDetectionPathProps {
  edgePath: string;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}

const HitDetectionPath: React.FC<HitDetectionPathProps> = ({
  edgePath,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <path
      d={edgePath}
      fill="none"
      strokeWidth={20}
      stroke="transparent"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        pointerEvents: "stroke",
        cursor: "pointer",
        zIndex: 5,
      }}
    />
  );
};

export default HitDetectionPath;
