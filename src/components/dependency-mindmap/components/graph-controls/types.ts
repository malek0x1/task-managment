
import { LayoutType } from '../../utils/layoutUtils';

export interface GraphControlsProps {
  direction: 'vertical' | 'horizontal';
  layoutType?: LayoutType;
  showMinimap?: boolean;
  onDirectionChange?: (direction: 'vertical' | 'horizontal') => void;
  onLayoutChange?: (layoutType: 'dagre' | 'breadthfirst' | 'radial') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onDownloadImage: () => void;
  onToggleMinimap?: () => void;
  onAddDemoNode?: () => void;
  onGenerateInsights?: () => void;
}
