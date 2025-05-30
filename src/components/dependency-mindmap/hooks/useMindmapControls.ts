
import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useGraphExport } from '../utils/graphExportUtils';

export const useMindmapControls = (
  taskId: string = '',
  markNodeAsRecentlyAdded: (nodeId: string) => void = () => {}
) => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const { handleDownloadImage, handleGenerateInsights, handleAddDemoNode } = useGraphExport();
  
  const onZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const onZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  const onFitView = useCallback(() => {
    fitView({ padding: 0.2, includeHiddenNodes: false });
  }, [fitView]);

  const onDownloadImage = useCallback(() => {
    handleDownloadImage(taskId);
  }, [handleDownloadImage, taskId]);

  const onGenerateInsights = useCallback(() => {
    handleGenerateInsights();
  }, [handleGenerateInsights]);

  const onAddDemoNode = useCallback(() => {
    handleAddDemoNode(markNodeAsRecentlyAdded);
  }, [handleAddDemoNode, markNodeAsRecentlyAdded]);

  return {
    onZoomIn,
    onZoomOut,
    onFitView,
    onDownloadImage,
    onGenerateInsights,
    onAddDemoNode
  };
};
