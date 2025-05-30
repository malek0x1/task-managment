import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AiMenuTriggerProps {
  options: {
    label: string;
    description?: string;
    onClick: () => Promise<void>;
  }[];
  size?: "sm" | "xs" | "default";
  variant?: "ghost" | "outline" | "default";
  triggerClassName?: string;
  contentClassName?: string;
  showText?: boolean;
  compact?: boolean;
}

const AiMenuTrigger: React.FC<AiMenuTriggerProps> = ({
  options,
  size = "default",
  variant = "ghost",
  triggerClassName,
  contentClassName,
  showText = false,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOption, setLoadingOption] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOptionClick = async (option: (typeof options)[0]) => {
    setIsLoading(true);
    setLoadingOption(option.label);
    setIsOpen(false);

    try {
      await option.onClick();
    } catch (error) {
      console.error("Error processing AI request:", error);
      toast({
        title: "AI Assistant Error",
        description: "Could not process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingOption(null);
    }
  };

  const buttonSize =
    size === "xs"
      ? "h-6 w-6 text-xs"
      : size === "sm"
      ? "h-8 w-8 text-sm"
      : "h-9 w-9";

  const iconSize =
    size === "xs" ? "h-3 w-3" : size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={showText ? (size === "xs" ? "sm" : size) : "icon"}
          className={cn(
            "flex items-center gap-1.5 group relative",
            showText ? "" : buttonSize,
            isLoading && "opacity-70 cursor-not-allowed",
            variant === "ghost" && "hover:bg-purple-50 hover:text-purple-600",
            triggerClassName
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className={cn(iconSize, "text-purple-500 animate-spin")} />
          ) : (
            <Sparkles
              className={cn(
                iconSize,
                "text-purple-500 group-hover:animate-pulse transition-all"
              )}
            />
          )}

          {showText && (
            <span className="text-xs font-medium">
              {isLoading
                ? `Processing${loadingOption ? ` ${loadingOption}` : ""}...`
                : "AI Assist"}
            </span>
          )}

          {!showText && variant === "ghost" && !isLoading && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-64 p-1.5 shadow-lg",
          compact ? "space-y-0.5" : "space-y-1",
          contentClassName
        )}
        align="end"
      >
        <div className="text-xs font-medium text-gray-500 px-2 py-1">
          AI Assistant
        </div>

        {options.map((option, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full justify-start text-sm gap-2 hover:bg-purple-50 hover:text-purple-700",
              compact ? "py-1.5 h-auto" : "py-2",
              loadingOption === option.label && "bg-purple-50 text-purple-700"
            )}
            onClick={() => handleOptionClick(option)}
            disabled={isLoading}
          >
            {loadingOption === option.label ? (
              <Loader2 className="h-3.5 w-3.5 text-purple-500 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            )}
            <div className="flex flex-col items-start">
              <span>{option.label}</span>
              {option.description && (
                <span className="text-xs text-gray-500">
                  {option.description}
                </span>
              )}
            </div>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default AiMenuTrigger;
