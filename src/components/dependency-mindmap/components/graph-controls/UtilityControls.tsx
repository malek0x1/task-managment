
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Map, Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface UtilityControlsProps {
  showMinimap?: boolean;
  onDownloadImage: () => void;
  onToggleMinimap?: () => void;
  onGenerateInsights?: () => void;
}

const UtilityControls: React.FC<UtilityControlsProps> = ({
  showMinimap = false,
  onDownloadImage,
  onToggleMinimap = () => {},
  onGenerateInsights
}) => {
  return (
    <div className="flex flex-col gap-1.5 pt-1">
      <div className="border-t border-gray-200 w-full my-1"></div>
      <div className="flex gap-1 justify-center">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={onDownloadImage}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Download as Image</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {onToggleMinimap && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showMinimap ? "secondary" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={onToggleMinimap}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{showMinimap ? 'Hide Minimap' : 'Show Minimap'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {onGenerateInsights && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full text-xs justify-start mt-1"
                onClick={onGenerateInsights}
              >
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                <span>AI Insights</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>AI Analysis of Dependencies</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default UtilityControls;
