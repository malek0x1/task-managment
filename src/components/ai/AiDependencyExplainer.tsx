import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useKanbanStore from "@/store/useKanbanStore";
import { callOpenRouterProxy } from "@/utils/openRouter";

interface AiDependencyExplainerProps {
  taskId: string;
  dependencyId?: string;
  size?: "sm" | "xs";
}

const AiDependencyExplainer: React.FC<AiDependencyExplainerProps> = ({
  taskId,
  dependencyId,
  size = "xs",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { tasks } = useKanbanStore();

  const handleExplainClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setExplanation(null);

    try {
      let title = "";
      let description = "";

      const task = tasks.find((t) => t.id === taskId);

      if (task) {
        title = task.title;
        description = task.description || "";
      } else {
        for (const t of tasks) {
          if (!t.subtasks) continue;

          const subtask = t.subtasks.find((s) => s.id === taskId);

          if (subtask) {
            title = subtask.title;
            description = subtask.description || "";
            break;
          }
        }
      }

      if (!title) {
        throw new Error("Task or subtask not found");
      }

      const prompt = `Explain this task: "${title}". ${
        description ? `Details: ${description}` : ""
      }`;

      const response = await callOpenRouterProxy({
        model: "mistralai/mistral-medium",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that provides brief, clear explanations about tasks and their purposes. Keep your response under 100 words.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const content = response.choices[0].message.content;

      setExplanation(content);
      setIsOpen(true);
    } catch (error) {
      console.error("Error getting AI explanation:", error);
      toast({
        title: "Error",
        description: "Could not generate task explanation",
        variant: "destructive",
      });
      setExplanation("Unable to generate explanation at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open && !explanation && isLoading) {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={`rounded-full ${
            size === "xs" ? "h-7 w-7" : "h-8 w-8"
          } bg-purple-50 hover:bg-purple-100 text-purple-700`}
          onClick={handleExplainClick}
          title="✨ AI Insight: Explain this task"
        >
          {isLoading ? (
            <Sparkles
              className={`${
                size === "xs" ? "h-3.5 w-3.5" : "h-4 w-4"
              } animate-pulse`}
            />
          ) : (
            <Brain className={size === "xs" ? "h-3.5 w-3.5" : "h-4 w-4"} />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4" align="center" side="top">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-purple-700">
            <Sparkles className="h-4 w-4" />
            <h4>AI Task Insight</h4>
          </div>

          <p className="text-sm text-gray-700">
            {explanation || "Loading explanation..."}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AiDependencyExplainer;
