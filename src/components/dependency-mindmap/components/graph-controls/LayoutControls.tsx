
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FolderTree, LayoutGridIcon, Radar } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LayoutType } from '../../utils/layoutUtils';

interface LayoutControlsProps {
  layoutType: LayoutType;
  onLayoutChange: (layoutType: 'dagre' | 'breadthfirst' | 'radial') => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({
  layoutType,
  onLayoutChange
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="px-2 pt-1 pb-0.5 text-xs text-gray-500 font-medium">Layout</div>
      <div className="flex flex-col gap-1">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={layoutType === 'dagre' ? "secondary" : "outline"}
                size="sm"
                className={cn("h-8 w-full text-xs justify-start")}
                onClick={() => onLayoutChange('dagre')}
              >
                <FolderTree className="h-3.5 w-3.5 mr-2" />
                <span>Hierarchical</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Tree Layout</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={layoutType === 'breadthfirst' ? "secondary" : "outline"}
                size="sm"
                className={cn("h-8 w-full text-xs justify-start")}
                onClick={() => onLayoutChange('breadthfirst')}
              >
                <LayoutGridIcon className="h-3.5 w-3.5 mr-2" />
                <span>Breadth-first</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Grid Layout</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={layoutType === 'radial' ? "secondary" : "outline"}
                size="sm"
                className={cn("h-8 w-full text-xs justify-start")}
                onClick={() => onLayoutChange('radial')}
              >
                <Radar className="h-3.5 w-3.5 mr-2" />
                <span>Radial</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Circular Layout</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default LayoutControls;
