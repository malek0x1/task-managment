
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  ArrowDown, 
  ArrowRight,
  GitBranchPlus,
  Circle,
  LayoutPanelTop
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ToggleDirectionProps {
  direction: 'vertical' | 'horizontal';
  onChange: (direction: 'vertical' | 'horizontal') => void;
  layoutType: 'dagre' | 'breadthfirst' | 'radial';
  onLayoutChange: (layoutType: 'dagre' | 'breadthfirst' | 'radial') => void;
}

const ToggleDirection: React.FC<ToggleDirectionProps> = ({ 
  direction, 
  onChange, 
  layoutType, 
  onLayoutChange 
}) => {
  return (
    <div className="flex flex-col gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Direction:</span>
        <ToggleGroup type="single" value={direction} onValueChange={(value) => value && onChange(value as 'vertical' | 'horizontal')}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="vertical" aria-label="Vertical Layout" className="bg-white">
                  <ArrowDown className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Vertical Flow</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="horizontal" aria-label="Horizontal Layout" className="bg-white">
                  <ArrowRight className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Horizontal Flow</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ToggleGroup>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Layout:</span>
        <ToggleGroup type="single" value={layoutType} onValueChange={(value) => value && onLayoutChange(value as 'dagre' | 'breadthfirst' | 'radial')}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="dagre" aria-label="Tree Layout" className="bg-white">
                  <GitBranchPlus className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Tree Layout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="breadthfirst" aria-label="Breadth-first Layout" className="bg-white">
                  <LayoutPanelTop className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Breadth-first Layout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="radial" aria-label="Radial Layout" className="bg-white">
                  <Circle className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Radial Layout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ToggleDirection;
