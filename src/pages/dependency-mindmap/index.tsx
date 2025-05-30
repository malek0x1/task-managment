import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import EnhancedDependencyGraph from "@/components/dependency-mindmap/EnhancedDependencyGraph";
import ErrorBoundary from "@/components/ui/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import AiCommandBar from "@/components/ai/AiCommandBar";
import DependencyMindmapHeader from "./components/DependencyMindmapHeader";
import ErrorFallback from "./components/ErrorFallback";
import { useCommandBar } from "./hooks/useCommandBar";
import { useTaskIdValidation } from "./hooks/useTaskIdValidation";
import { handleError } from "./utils/errorHandling";
import "./mindmap-animations.css";

const DependencyMindmapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId") || "";
  const { toast } = useToast();
  const [panelLayout, setPanelLayout] = useState<"horizontal" | "vertical">(
    () => {
      const savedLayout = localStorage.getItem("dependency-mindmap-layout");
      return savedLayout === "vertical" ? "vertical" : "horizontal";
    }
  );

  const { isOpen: isCommandBarOpen, setIsOpen: setIsCommandBarOpen } =
    useCommandBar();
  useTaskIdValidation(taskId);

  const togglePanelLayout = () => {
    const newLayout = panelLayout === "horizontal" ? "vertical" : "horizontal";
    setPanelLayout(newLayout);
    localStorage.setItem("dependency-mindmap-layout", newLayout);

    toast({
      title: `Panel layout changed`,
      description: `Layout switched to ${newLayout} mode`,
    });
  };

  return (
    <div className="h-screen bg-white">
      <ErrorBoundary
        onError={(error) => handleError(error, toast)}
        fallback={<ErrorFallback />}
      >
        <EnhancedDependencyGraph taskId={taskId} />
      </ErrorBoundary>

      <AiCommandBar
        isOpen={isCommandBarOpen}
        onOpenChange={setIsCommandBarOpen}
      />

      <Toaster />
    </div>
  );
};

export default DependencyMindmapPage;
