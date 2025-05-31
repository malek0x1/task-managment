import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BetaIndicatorProps {
  variant?: "default" | "minimal" | "prominent";
  className?: string;
}

const BetaIndicator: React.FC<BetaIndicatorProps> = ({
  variant = "default",
  className,
}) => {
  const getBadgeContent = () => {
    switch (variant) {
      case "minimal":
        return (
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-medium bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors",
              className
            )}
          >
            Beta
          </Badge>
        );
      case "prominent":
        return (
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-medium bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200 hover:from-purple-100 hover:to-blue-100 transition-all duration-200 shadow-sm",
              className
            )}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Beta
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors",
              className
            )}
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Beta
          </Badge>
        );
    }
  };

  const getTooltipContent = () => {
    return (
      <div className="max-w-xs">
        <div className="font-semibold text-sm mb-1">Beta Version</div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This software is currently in beta. Features may change and you might
          encounter occasional bugs. Your feedback helps us improve!
        </p>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{getBadgeContent()}</div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="z-50">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BetaIndicator;
