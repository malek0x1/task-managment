
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LayoutType } from '../utils/layoutUtils';

export function useGraphControls() {
  const { toast } = useToast();
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');
  const [layoutType, setLayoutType] = useState<LayoutType>('dagre');
  const [showMinimap, setShowMinimap] = useState(true);

  const handleDirectionChange = useCallback((newDirection: 'vertical' | 'horizontal') => {
    setDirection(newDirection);
    toast({
      title: "Layout updated",
      description: `Direction changed to ${newDirection}`,
    });
  }, [toast]);

  const handleLayoutChange = useCallback((type: 'dagre' | 'breadthfirst' | 'radial') => {
    setLayoutType(type);
    toast({
      title: "Layout updated",
      description: `Layout changed to ${type === 'dagre' ? 'Hierarchical' : type === 'breadthfirst' ? 'Breadth-first' : 'Radial'}`,
    });
  }, [toast]);

  const toggleMinimap = useCallback(() => {
    setShowMinimap(prev => !prev);
  }, []);

  return {
    direction,
    layoutType,
    showMinimap,
    handleDirectionChange,
    handleLayoutChange,
    toggleMinimap
  };
}
