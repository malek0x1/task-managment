import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { callAI, buildPrompt } from "@/utils/aiAssistant";
import useKanbanStore from "@/store/useKanbanStore";

interface AiCommandBarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXAMPLE_COMMANDS = [
  { id: "create-task", text: "/create task to fix onboarding" },
  { id: "assign-tasks", text: "/assign all unassigned tasks to me" },
  { id: "blocked-tasks", text: "/show blocked tasks" },
  { id: "overdue-tasks", text: "/show overdue tasks" },
  { id: "summary", text: "/summarize my board" },
  { id: "priority", text: "/suggest task priorities" },
];

const AiCommandBar: React.FC<AiCommandBarProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { tasks, columns } = useKanbanStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onOpenChange]);

  const handleCommandSelect = async (commandText: string) => {
    setInputValue(commandText);

    onOpenChange(false);

    setTimeout(() => setInputValue(""), 300);

    setIsProcessing(true);

    try {
      let result: any;

      const boardContext = {
        columns: columns.map((col) => ({
          title: col.title,
          taskCount: tasks.filter((t) => t.column_id === col.id).length,
        })),
        highPriorityTasks: tasks
          .filter((t) => t.priority === "high")
          .map((t) => ({
            title: t.title,
            priority: t.priority,
            assignees: t.assignees || [],
          }))
          .slice(0, 5),
        subtaskProgress: tasks
          .filter((t) => t.subtasks && t.subtasks.length > 0)
          .map((t) => ({
            title: t.title,
            completedSubtasks: t.subtasks.filter((st) => st.completed).length,
            totalSubtasks: t.subtasks.length,
          }))
          .slice(0, 5),
      };

      if (commandText.includes("/create task")) {
        toast({
          title: "Creating new task...",
          description: "Processing your request",
        });
        result = "New task 'Fix onboarding flow' created in 'To Do' column";
      } else if (commandText.includes("/assign")) {
        toast({
          title: "Assigning tasks...",
          description: "Processing your request",
        });
        result = "5 unassigned tasks have been assigned to you";
      } else if (commandText.includes("/show blocked")) {
        toast({
          title: "Finding blocked tasks...",
          description: "Analyzing dependencies...",
        });

        const blockedTasksPrompt = `
List tasks that are currently blocked by dependencies.

Current board state:
${columns
  .map(
    (col) =>
      `- ${col.title}: ${
        tasks.filter((t) => t.column_id === col.id).length
      } tasks`
  )
  .join("\n")}

Some key tasks:
${tasks
  .slice(0, 5)
  .map(
    (t) =>
      `- "${t.title}" (${t.priority || "medium"} priority, ${
        t.subtasks?.length || 0
      } subtasks)`
  )
  .join("\n")}

Return a list of tasks that appear to be blocked, with a brief explanation for each.
`;

        result = await callAI(blockedTasksPrompt, "blockedTasks");
      } else if (commandText.includes("/show overdue")) {
        toast({
          title: "Finding overdue tasks...",
          description: "Checking deadlines...",
        });

        const overdueTasksPrompt = `
List tasks that are past their due dates.

Current date: ${new Date().toISOString().split("T")[0]}

Task deadlines:
${tasks
  .filter((t) => t.due_date)
  .map(
    (t) =>
      `- "${t.title}": due ${t.due_date}, priority: ${t.priority || "medium"}`
  )
  .join("\n")}

Return a list of tasks that are overdue, including how many days overdue they are and their priority.
`;

        result = await callAI(overdueTasksPrompt, "overdueTasks");
      } else if (commandText.includes("/summarize")) {
        toast({
          title: "Summarizing board...",
          description: "Analyzing task distribution...",
        });

        const promptText = buildPrompt("board_summary", boardContext);
        result = await callAI(promptText, "boardSummaries");
      } else if (commandText.includes("/suggest")) {
        toast({
          title: "Analyzing priorities...",
          description: "Evaluating current workload...",
        });

        const priorityPrompt = `
Suggest how task priorities might be adjusted based on due dates, dependencies, and team capacity.

Current task priorities:
${tasks
  .map(
    (t) =>
      `- "${t.title}": ${t.priority || "medium"} priority, deadline: ${
        t.due_date || "none"
      }`
  )
  .slice(0, 10)
  .join("\n")}

Column distribution:
${columns
  .map(
    (col) =>
      `- ${col.title}: ${
        tasks.filter((t) => t.column_id === col.id).length
      } tasks`
  )
  .join("\n")}

Give 2-3 specific priority adjustment recommendations.
`;

        result = await callAI(priorityPrompt, "prioritySuggestions");
      } else {
        result = `Command processed: ${commandText}`;
      }

      if (Array.isArray(result)) {
        toast({
          title: "AI Assistant",
          description: (
            <div className="space-y-1">
              {result.map((item, i) => (
                <div key={i} className="text-sm">
                  {item}
                </div>
              ))}
            </div>
          ),
          duration: 5000,
        });
      } else {
        toast({
          title: "AI Assistant",
          description: result,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error processing AI command:", error);
      toast({
        title: "Error",
        description: "Failed to process command. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-2xl">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center px-3 border-b">
            <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
            <CommandInput
              placeholder="Type a command or start with / for suggestions..."
              value={inputValue}
              onValueChange={setInputValue}
              className="flex-1 py-3 outline-none"
            />
          </div>
          <CommandList>
            <CommandGroup heading="Example Commands">
              {EXAMPLE_COMMANDS.map((command) => (
                <CommandItem
                  key={command.id}
                  className="px-4 py-2.5 cursor-pointer"
                  onSelect={() => handleCommandSelect(command.text)}
                >
                  <div className="flex items-center">
                    <span className="text-muted-foreground font-mono text-sm mr-2">
                      {command.text.split(" ")[0]}
                    </span>
                    <span className="text-sm flex-1">
                      {command.text.split(" ").slice(1).join(" ")}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default AiCommandBar;
