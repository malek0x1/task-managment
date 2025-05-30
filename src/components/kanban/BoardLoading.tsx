import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import useKanbanStore from "@/store/useKanbanStore";
import { useProjectStore } from "@/store/useProjectStore";

interface BoardLoadingProps {
  isLoading: boolean;
  isInitialLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const BoardLoading: React.FC<BoardLoadingProps> = ({
  isLoading,
  isInitialLoading,
  error,
  onRetry,
  isRetrying = false,
}) => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [showRetry, setShowRetry] = useState(false);
  const { projects } = useProjectStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isInitialLoading) {
      interval = setInterval(() => {
        setLoadingTime((prev) => {
          const newTime = prev + 1;

          if ((error && newTime > 1) || (!error && newTime > 3)) {
            setShowRetry(true);
          }
          return newTime;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isInitialLoading, error, showRetry]);

  const handleRetry = async () => {
    if (!onRetry) return;

    try {
      toast({
        title: "Retrying connection",
        description: "Attempting to fetch your kanban board...",
      });

      setLoadingTime(0);
      setShowRetry(false);

      await onRetry();
    } catch (error) {
      console.error("Retry failed:", error);
      toast({
        title: "Connection failed",
        description: "Could not fetch your board data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isInitialLoading) {
    const hasProjects = projects.length > 0;

    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {isRetrying ? (
          <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
        ) : (
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        )}

        <div className="text-lg text-gray-500 mb-6">
          {isRetrying
            ? "Retrying..."
            : hasProjects
            ? "Loading kanban board"
            : "Loading projects"}
          {loadingTime > 1 ? ` (${loadingTime}s)` : "..."}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-80 bg-muted p-3 rounded-md flex-shrink-0"
              >
                <Skeleton className="h-8 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>

          <Progress
            value={Math.min(loadingTime * 10, 95)}
            className="h-2 w-full max-w-md"
          />

          {(showRetry || error) && !isRetrying && (
            <div className="flex flex-col items-center pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                {error
                  ? "Failed to load board data. Would you like to try again?"
                  : "Loading is taking longer than expected. Would you like to try again?"}
              </p>
              <Button
                onClick={handleRetry}
                variant="default"
                className="px-8"
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  "Retry Loading"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md text-sm text-primary z-50 flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        Updating...
      </div>
    );
  }

  return null;
};

export default BoardLoading;
