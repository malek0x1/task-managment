import React from "react";
import { Panel } from "reactflow";
import { GraphControls } from "../../components/graph-controls";

interface ControlsOverlayProps {
  direction: "vertical" | "horizontal";
  onToggleLayoutDirection?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onDownloadImage: () => void;
  onGenerateInsights: () => void;
}

const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  direction,
  onToggleLayoutDirection,
  onZoomIn,
  onZoomOut,
  onFitView,
  onDownloadImage,
  onGenerateInsights,
}) => {
  const controlProps = {
    direction,
    onToggleLayoutDirection,
    onZoomIn,
    onZoomOut,
    onFitView,
    onDownloadImage,
    onGenerateInsights,
  };

  return (
    <>
      <Panel
        position="top-left"
        className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
      >
        <GraphControls {...controlProps} />
      </Panel>
    </>
  );
};

export default ControlsOverlay;
