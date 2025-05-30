import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Loader2,
  Zap,
  Check,
  X,
  ArrowRight,
  Clock,
  Brain,
  TreePine,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useKanbanStore from "@/store/useKanbanStore";
import {
  parseCommandWithLLM,
  executeCreateTask,
  executeExplainDependency,
  executeRefactorTasks,
  executeSummarizeTask,
  isCreateTaskPayload,
  isExplainDependencyPayload,
  isRefactorTasksPayload,
  isSummarizeTaskPayload,
} from "./McpDrawerHelpers";

interface McpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onActionExecuted: () => void;
}

const MCP_COMMANDS = [
  {
    command: "/create",
    description: "Create task with intelligent nested subtasks",
    example: "/create Build e-commerce platform",
    icon: <TreePine className="w-4 h-4" />,
  },
  {
    command: "/explain",
    description: "Explain why a task depends on another",
    example: "/explain why Login page depends on Database setup",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    command: "/refactor_tasks",
    description: "Split task into hierarchical subtasks",
    example: "/refactor_tasks Launch marketing campaign",
    icon: <TreePine className="w-4 h-4" />,
  },
  {
    command: "/summarize",
    description: "Summarize task progress with subtask tree",
    example: "/summarize Checkout flow task",
    icon: <Check className="w-4 h-4" />,
  },
];

const RECENT_COMMANDS_KEY = "mcp_recent_commands";

const McpDrawer: React.FC<McpDrawerProps> = ({
  isOpen,
  onClose,
  onActionExecuted,
}) => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [showTaskSuggestions, setShowTaskSuggestions] = useState(false);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const { tasks } = useKanbanStore();

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_COMMANDS_KEY);
    if (stored) {
      try {
        setRecentCommands(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent commands:", e);
      }
    }
  }, []);

  const saveRecentCommand = (cmd: string) => {
    const updated = [cmd, ...recentCommands.filter((c) => c !== cmd)].slice(
      0,
      5
    );
    setRecentCommands(updated);
    localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(updated));
  };

  const getFilteredCommands = () => {
    return command.trim() === "/"
      ? MCP_COMMANDS
      : MCP_COMMANDS.filter(
          (cmd) =>
            cmd.command.toLowerCase().includes(command.toLowerCase()) ||
            cmd.description.toLowerCase().includes(command.toLowerCase())
        );
  };

  const isValidCommand = () => {
    if (!command.trim().startsWith("/")) return false;
    return MCP_COMMANDS.some((cmd) => command.trim().startsWith(cmd.command));
  };

  const getTaskSuggestions = () => {
    const needsTaskName = ["/summarize", "/refactor_tasks", "/explain"].some(
      (cmd) => command.toLowerCase().startsWith(cmd)
    );

    if (!needsTaskName) return [];

    const commandPart = command.split(" ")[0];
    const searchTerm = command
      .substring(commandPart.length)
      .trim()
      .toLowerCase();

    if (searchTerm.length < 1) return tasks.slice(0, 5);

    return tasks
      .filter((task) => {
        const title = task.title.toLowerCase();

        return (
          title.includes(searchTerm) ||
          title.split(" ").some((word) => word.startsWith(searchTerm))
        );
      })
      .slice(0, 5);
  };

  const taskSuggestions = getTaskSuggestions();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (showTaskSuggestions && taskSuggestions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev < taskSuggestions.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : taskSuggestions.length - 1
          );
        } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
          e.preventDefault();
          const selectedTask = taskSuggestions[selectedSuggestionIndex];
          const commandPart = command.split(" ")[0];
          setCommand(`${commandPart} ${selectedTask.title}`);
          setShowTaskSuggestions(false);
          setSelectedSuggestionIndex(-1);
          return;
        }
      }

      if (showCommands && !showTaskSuggestions) {
        const filteredCommands = getFilteredCommands();
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
          e.preventDefault();
          const selectedCmd = filteredCommands[selectedSuggestionIndex];
          setCommand(selectedCmd.command + " ");
          setShowCommands(false);
          setSelectedSuggestionIndex(-1);
          return;
        }
      }

      if (e.key === "Tab" && command.startsWith("/") && command.length > 1) {
        e.preventDefault();
        const match = MCP_COMMANDS.find((cmd) =>
          cmd.command.toLowerCase().startsWith(command.toLowerCase())
        );
        if (match) {
          setCommand(match.command + " ");
          setShowCommands(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isOpen,
    onClose,
    command,
    showCommands,
    showTaskSuggestions,
    taskSuggestions,
    selectedSuggestionIndex,
  ]);

  useEffect(() => {
    const shouldShowCommands = command.startsWith("/") && command.length > 0;
    const shouldShowTasks =
      taskSuggestions.length > 0 &&
      ["/summarize", "/refactor_tasks", "/explain"].some((cmd) =>
        command.toLowerCase().startsWith(cmd)
      );

    setShowCommands(shouldShowCommands && !shouldShowTasks);
    setShowTaskSuggestions(shouldShowTasks);
    setSelectedSuggestionIndex(-1);
  }, [command, taskSuggestions.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim() || isProcessing || !isValidCommand()) return;

    setIsProcessing(true);
    setLastResult(null);
    saveRecentCommand(command);

    try {
      const mcpResponse = await parseCommandWithLLM(command);

      switch (mcpResponse.action) {
        case "create_task":
          if (isCreateTaskPayload(mcpResponse.payload)) {
            await executeCreateTask(mcpResponse.payload);
            const hasNested =
              mcpResponse.payload.subtasks &&
              mcpResponse.payload.subtasks.some(
                (st) => st.subtasks?.length > 0
              );
            setLastResult({
              success: true,
              message: `Created task "${mcpResponse.payload.title}"${
                hasNested ? " with nested subtasks" : ""
              }`,
            });
            onActionExecuted();
          }
          break;

        case "explain_dependency":
          if (isExplainDependencyPayload(mcpResponse.payload)) {
            await executeExplainDependency(mcpResponse.payload);
            setLastResult({
              success: true,
              message: `Explained dependency between "${mcpResponse.payload.task}" and "${mcpResponse.payload.depends_on}"`,
            });
          }
          break;

        case "refactor_tasks":
          if (isRefactorTasksPayload(mcpResponse.payload)) {
            await executeRefactorTasks(mcpResponse.payload);
            setLastResult({
              success: true,
              message: `Generated hierarchical breakdown for "${mcpResponse.payload.task_title}"`,
            });
          }
          break;

        case "summarize_task":
          if (isSummarizeTaskPayload(mcpResponse.payload)) {
            await executeSummarizeTask(mcpResponse.payload);
            setLastResult({
              success: true,
              message: `Summarized task "${mcpResponse.payload.task_title}" with subtask tree`,
            });
          }
          break;

        default:
          throw new Error(`Unsupported action: ${mcpResponse.action}`);
      }

      setTimeout(() => {
        setCommand("");
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error executing MCP command:", error);

      setLastResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to execute command",
      });

      toast({
        title: "Command failed",
        description:
          error instanceof Error ? error.message : "Failed to execute command",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommandSelect = (selectedCommand: string) => {
    setCommand(selectedCommand + " ");
    setShowCommands(false);
    setSelectedSuggestionIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTaskSelect = (task: any) => {
    const commandPart = command.split(" ")[0];
    setCommand(`${commandPart} ${task.title}`);
    setShowTaskSuggestions(false);
    setSelectedSuggestionIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getValidationIcon = () => {
    if (!command.trim()) return null;
    if (!command.startsWith("/")) return <X className="w-4 h-4 text-red-500" />;
    if (isValidCommand()) return <Check className="w-4 h-4 text-green-500" />;
    return <X className="w-4 h-4 text-red-500" />;
  };

  const filteredCommands = getFilteredCommands();

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[500px]">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <DrawerTitle className="text-lg font-semibold">
                AI Task Assistant
              </DrawerTitle>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                Now with nested subtasks
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                ref={inputRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Type / for commands or describe what you want to do..."
                className="text-base pr-20"
                disabled={isProcessing}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {getValidationIcon()}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!isValidCommand() || isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Execute"
                  )}
                </Button>
              </div>
            </div>

            {}
            {showCommands && (
              <div className="border rounded-lg p-2 bg-background shadow-lg z-50">
                <Command>
                  <CommandList>
                    <CommandGroup heading="AI-Powered Commands">
                      {filteredCommands.map((cmd, index) => (
                        <CommandItem
                          key={cmd.command}
                          onSelect={() => handleCommandSelect(cmd.command)}
                          className={`cursor-pointer ${
                            index === selectedSuggestionIndex ? "bg-accent" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              {cmd.icon}
                              <div>
                                <span className="font-mono text-sm text-primary">
                                  {cmd.command}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {cmd.description}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}

            {}
            {showTaskSuggestions && (
              <div className="border rounded-lg p-2 bg-background shadow-lg z-50">
                <Command>
                  <CommandList>
                    <CommandGroup heading="Select Task">
                      {taskSuggestions.map((task, index) => (
                        <CommandItem
                          key={task.id}
                          onSelect={() => handleTaskSelect(task)}
                          className={`cursor-pointer ${
                            index === selectedSuggestionIndex ? "bg-accent" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <span className="text-sm">{task.title}</span>
                              <p className="text-xs text-muted-foreground">
                                {task.priority} priority •{" "}
                                {task.subtasks?.length || 0} subtasks
                                {task.has_deep_subtasks && " • Nested"}
                              </p>
                            </div>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}

            {lastResult && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  lastResult.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {lastResult.success ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                {lastResult.message}
              </div>
            )}
          </form>

          {}
          {recentCommands.length > 0 &&
            !showCommands &&
            !showTaskSuggestions && (
              <div className="mt-4 text-xs text-muted-foreground space-y-2">
                <p className="font-medium flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Recent Commands
                </p>
                <div className="grid gap-1">
                  {recentCommands.slice(0, 3).map((cmd, index) => (
                    <button
                      key={index}
                      onClick={() => setCommand(cmd)}
                      className="text-left p-2 rounded hover:bg-muted transition-colors"
                    >
                      <span className="font-mono text-primary text-xs">
                        {cmd}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          <div className="mt-6 text-xs text-muted-foreground space-y-2">
            <p className="font-medium">Try these enhanced examples:</p>
            <div className="grid gap-1">
              {MCP_COMMANDS.map((cmd) => (
                <button
                  key={cmd.command}
                  onClick={() => setCommand(cmd.example)}
                  className="text-left p-2 rounded hover:bg-muted transition-colors flex items-center gap-2"
                >
                  {cmd.icon}
                  <span className="font-mono text-primary">{cmd.example}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default McpDrawer;
