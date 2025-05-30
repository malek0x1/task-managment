import React from "react";
import ZoomControls from "./ZoomControls";
import UtilityControls from "./UtilityControls";
import DirectionControls from "./DirectionControls";

interface GraphControlsProps {
  direction: "vertical" | "horizontal";
  onToggleLayoutDirection?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onDownloadImage: () => void;
  onGenerateInsights?: () => void;
  showMinimap?: boolean;
  onToggleMinimap?: () => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({
  direction,
  onToggleLayoutDirection,
  onZoomIn,
  onZoomOut,
  onFitView,
  onDownloadImage,
  onGenerateInsights,
  showMinimap = false,
  onToggleMinimap,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <ZoomControls
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitView={onFitView}
      />

      <DirectionControls
        direction={direction}
        onDirectionChange={onToggleLayoutDirection}
      />

      <UtilityControls
        showMinimap={showMinimap}
        onDownloadImage={onDownloadImage}
        onToggleMinimap={onToggleMinimap}
        onGenerateInsights={onGenerateInsights}
      />
    </div>
  );
};

export default GraphControls;
