import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutIcon, LayoutGrid } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DirectionControlsProps {
  direction: "vertical" | "horizontal";
  onDirectionChange?: (direction: "vertical" | "horizontal") => void;
}

const DirectionControls: React.FC<DirectionControlsProps> = ({
  direction,
  onDirectionChange,
}) => {
  const handleDirectionChange = (newDirection: "vertical" | "horizontal") => {
    if (onDirectionChange) {
      if (typeof onDirectionChange === "function") {
        onDirectionChange(newDirection);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="px-2 pt-1 pb-0.5 text-xs text-gray-500 font-medium">
        Direction
      </div>
      <div className="flex gap-1 justify-center">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={direction === "vertical" ? "secondary" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDirectionChange("vertical")}
              >
                <LayoutIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Top to Bottom</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={direction === "horizontal" ? "secondary" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDirectionChange("horizontal")}
              >
                <LayoutGrid className="h-4 w-4 rotate-90" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Left to Right</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default DirectionControls;
