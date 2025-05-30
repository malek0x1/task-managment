
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CollapsedPanelProps {
  direction: 'left' | 'right';
  panelLayout: 'horizontal' | 'vertical';
  onToggle: () => void;
  tooltipText: string;
  tooltipSide?: 'left' | 'right' | 'top' | 'bottom';
}

const CollapsedPanel: React.FC<CollapsedPanelProps> = ({
  direction,
  panelLayout,
  onToggle,
  tooltipText,
  tooltipSide
}) => {
  const isHorizontal = panelLayout === 'horizontal';
  const side = tooltipSide || (isHorizontal ? 
    (direction === 'left' ? 'right' : 'left') : 
    (direction === 'left' ? 'bottom' : 'top'));
  
  return (
    <div className={cn(
      "h-full flex items-center py-4",
      isHorizontal ? 
        (direction === 'left' ? 'border-r flex-col' : 'border-l flex-col') : 
        (direction === 'left' ? 'border-b flex-row justify-center' : 'border-t flex-row justify-center')
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={onToggle}
            >
              {isHorizontal ? (
                direction === 'left' ? 
                  <ChevronRight className="h-5 w-5" /> : 
                  <ChevronLeft className="h-5 w-5" />
              ) : (
                direction === 'left' ? 
                  <ChevronRight className="h-5 w-5 rotate-90" /> : 
                  <ChevronRight className="h-5 w-5 rotate-90 transform scale-y-[-1]" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CollapsedPanel;
