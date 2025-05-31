/**
 * Multi-Command Protocol (MCP) helpers for AI-powered task management
 * Handles natural language parsing, command execution, and LLM integration via OpenRouter
 */

import { callOpenRouterProxy } from "@/utils/openRouter";
import { toast } from "@/hooks/use-toast";
import useKanbanStore from "@/store/useKanbanStore";
import { useProjectStore } from "@/store/useProjectStore";
import { Task } from "@/types/kanban";

export interface McpResponse {
  action: string;
  payload: McpPayload;
}

export type McpPayload =
  | CreateTaskPayload
  | RefactorTasksPayload
  | SummarizeTaskPayload
  | ExplainDependencyPayload;

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  subtasks?: NestedSubtask[];
}

export interface RefactorTasksPayload {
  task_title: string;
  subtasks: NestedSubtask[];
}

export interface SummarizeTaskPayload {
  task_title: string;
}

export interface ExplainDependencyPayload {
  task: string;
  depends_on: string;
}

export const isCreateTaskPayload = (
  payload: McpPayload
): payload is CreateTaskPayload => {
  return "title" in payload;
};

export const isRefactorTasksPayload = (
  payload: McpPayload
): payload is RefactorTasksPayload => {
  return "task_title" in payload && "subtasks" in payload;
};

export const isSummarizeTaskPayload = (
  payload: McpPayload
): payload is SummarizeTaskPayload => {
  return "task_title" in payload && !("subtasks" in payload);
};

export const isExplainDependencyPayload = (
  payload: McpPayload
): payload is ExplainDependencyPayload => {
  return "task" in payload && "depends_on" in payload;
};

export interface NestedSubtask {
  title: string;
  subtasks?: NestedSubtask[];
}

export interface FlattenedSubtask {
  id: string;
  title: string;
  completed: boolean;
  parentSubtaskId: string | null;
  order: number;
  description: string;
  priority: "low" | "medium" | "high";
  level?: number;
}

// Recursively flattens nested subtask structures for storage compatibility
const flattenSubtasks = (
  subtasks: NestedSubtask[],
  parentId: string | null = null,
  level: number = 0
): FlattenedSubtask[] => {
  const result: FlattenedSubtask[] = [];

  subtasks.forEach((subtask, index) => {
    const id = crypto.randomUUID();
    result.push({
      id,
      title: subtask.title,
      completed: false,
      parentSubtaskId: parentId,
      order: index,
      description: "",
      priority: "medium",
      level,
    });

    if (subtask.subtasks?.length) {
      result.push(...flattenSubtasks(subtask.subtasks, id, level + 1));
    }
  });

  return result;
};

// Renders a tree structure of subtasks for display
const renderSubtaskTree = (
  subtasks: NestedSubtask[],
  level: number = 0
): JSX.Element => {
  return (
    <div className="space-y-1">
      {subtasks.map((subtask, i) => (
        <div
          key={i}
          style={{ marginLeft: `${level * 12}px` }}
          className="text-sm"
        >
          <div className="flex items-center gap-1">
            <span>•</span>
            <span>{subtask.title}</span>
          </div>
          {subtask.subtasks && subtask.subtasks.length > 0 && (
            <div className="mt-1">
              {renderSubtaskTree(subtask.subtasks, level + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Parses natural language commands into structured MCP actions using LLM
 * Returns validated JSON with action type and payload for downstream processing
 */
export const parseCommandWithLLM = async (
  userCommand: string
): Promise<McpResponse> => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Pre-process the command to determine the correct action type
    const commandLower = userCommand.toLowerCase().trim();
    let expectedAction = "";

    if (commandLower.startsWith("/create")) {
      expectedAction = "create_task";
    } else if (commandLower.startsWith("/summarize")) {
      expectedAction = "summarize_task";
    } else if (commandLower.startsWith("/refactor_tasks")) {
      expectedAction = "refactor_tasks";
    } else if (commandLower.startsWith("/explain")) {
      expectedAction = "explain_dependency";
    }

    const response = await callOpenRouterProxy({
      model: "mistralai/mistral-medium",
      messages: [
        {
          role: "system",
          content: `You are an MCP server. Respond ONLY with one clean JSON object.
Your job is to convert natural language commands into structured actions for project task management.

CRITICAL: The user command starts with "${
            userCommand.split(" ")[0]
          }" which MUST map to action "${expectedAction}".

Always return: { action: string, payload: object }

✅ Supported actions:

1. create_task (for /create commands):
  → { title: string, description?: string, priority?: "low"|"medium"|"high", subtasks?: Subtask[] }
  
  🏗️ SUBTASK GENERATION RULES FOR /create:
  - If task is complex (contains "website", "platform", "project", "campaign", "app", "system", "build", "develop", "implement"), create recursive nested subtasks
  - If task is simple (like "fix bug", "write docs", "update", "test", "review", "check"), return flat subtasks only
  - For complex tasks, break into 3-5 main areas, each with 2-4 sub-items
  - Use logical hierarchy: Design → Wireframes → Components, or Backend → Frontend → Testing
  - Create meaningful nested structure that reflects real workflow dependencies

2. refactor_tasks (for /refactor_tasks commands):
  → { task_title: string, subtasks: Subtask[] }

3. summarize_task (for /summarize commands):
  → { task_title: string }

4. explain_dependency (for /explain commands):
  → { task: string, depends_on: string }

✅ Subtask type (supports recursion):
interface Subtask {
  title: string;
  subtasks?: Subtask[];
}

🧠 Command Processing Rules:
- /create → ALWAYS use "create_task" action
- /summarize → ALWAYS use "summarize_task" action  
- /refactor_tasks → ALWAYS use "refactor_tasks" action
- /explain → ALWAYS use "explain_dependency" action

For the current command "${userCommand}", you MUST use action "${expectedAction}".

❌ Do NOT include markdown, comments, or multiple JSON blocks. Only return one valid JSON.`,
        },
        {
          role: "user",
          content: userCommand,
        },
      ],
      temperature: 0.1,
      max_tokens: 400,
    });

    const content = response.choices[0].message.content;

    // Extract the first valid JSON block from potentially malformed LLM output
    const extractFirstJsonBlock = (raw: string): string => {
      const start = raw.indexOf("{");
      if (start === -1) return "";

      let openBraces = 0;
      for (let i = start; i < raw.length; i++) {
        if (raw[i] === "{") openBraces++;
        if (raw[i] === "}") openBraces--;

        if (openBraces === 0) {
          return raw.slice(start, i + 1);
        }
      }

      return "";
    };

    const cleanJson = extractFirstJsonBlock(content)
      .replace(/\\_/g, "_")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

    if (!cleanJson) {
      throw new Error("No valid JSON block found in response");
    }

    let parsedResponse: McpResponse;
    try {
      parsedResponse = JSON.parse(cleanJson);
    } catch (parseError) {
      throw new Error("Invalid response format from AI");
    }

    // Validate that the action matches what we expected
    if (expectedAction && parsedResponse.action !== expectedAction) {
      console.warn(
        `Expected action ${expectedAction} but got ${parsedResponse.action}, correcting...`
      );
      parsedResponse.action = expectedAction;
    }

    return parsedResponse;
  } catch (error) {
    throw error;
  }
};

export const executeCreateTask = async (
  payload: CreateTaskPayload
): Promise<void> => {
  const { default: useKanbanStore } = await import("@/store/useKanbanStore");
  const { useProjectStore } = await import("@/store/useProjectStore");

  const { addTask } = useKanbanStore.getState();
  const { currentProjectId } = useProjectStore.getState();
  const { columns } = useKanbanStore.getState();

  if (!currentProjectId) {
    throw new Error("No active project selected");
  }

  const firstColumn = columns[0];
  if (!firstColumn) {
    throw new Error("No columns available in the board");
  }

  const processedSubtasks = payload.subtasks
    ? flattenSubtasks(payload.subtasks)
    : [];

  const taskData = {
    title: payload.title,
    description: payload.description || "",
    priority: payload.priority || ("medium" as const),
    column_id: firstColumn.id,
    project_id: currentProjectId,
    labels: [],
    assignees: [],
    subtasks: processedSubtasks,
    has_deep_subtasks: processedSubtasks.length > 0,
  };

  await addTask(taskData);
};

export const executeExplainDependency = async (
  payload: ExplainDependencyPayload
): Promise<void> => {
  const response = await callOpenRouterProxy({
    model: "mistralai/mistral-medium",
    messages: [
      {
        role: "system",
        content:
          "Explain why task dependencies exist based on project context. Be concise and practical. Focus on logical workflow dependencies.",
      },
      {
        role: "user",
        content: `Explain why "${payload.task}" depends on "${payload.depends_on}" in a software project context.`,
      },
    ],
    temperature: 0.4,
    max_tokens: 200,
  });

  const explanation = response.choices[0].message.content;

  toast({
    title: "Task Dependency Explanation",
    description: explanation,
    duration: 8000,
  });
};

export const executeRefactorTasks = async (
  payload: RefactorTasksPayload
): Promise<void> => {
  const response = await callOpenRouterProxy({
    model: "mistralai/mistral-medium",
    messages: [
      {
        role: "system",
        content: `Generate a structured breakdown of a task into nested subtasks. Return as JSON with recursive Subtask structure.

For complex tasks, create hierarchical breakdown:
- 3-5 main categories
- Each category has 2-4 sub-items
- Use logical workflow order

Return format: { "subtasks": Subtask[] }

Subtask interface:
{
  title: string;
  subtasks?: Subtask[];
}`,
      },
      {
        role: "user",
        content: `Break down this task into a structured hierarchy: "${payload.task_title}"`,
      },
    ],
    temperature: 0.4,
    max_tokens: 600,
  });

  let subtasksData;
  try {
    const parsed = JSON.parse(response.choices[0].message.content);
    subtasksData = parsed.subtasks || parsed;
  } catch {
    const lines = response.choices[0].message.content
      .split("\n")
      .filter((line) => line.trim());
    subtasksData = lines.map((line) => ({
      title: line.replace(/^[-*]\s*/, "").trim(),
    }));
  }

  const applySuggestedSubtasks = async (
    taskTitle: string,
    nestedSubtasks: NestedSubtask[]
  ) => {
    const { tasks, updateTask } = useKanbanStore.getState();
    const task = tasks.find((t) =>
      t.title.toLowerCase().includes(taskTitle.toLowerCase())
    );
    if (!task) {
      toast({
        title: "Task not found",
        description: `Could not find task: ${taskTitle}`,
        variant: "destructive",
      });
      return;
    }

    const existingSubtasks = task.subtasks || [];
    const newSubtasks = flattenSubtasks(nestedSubtasks);

    const adjustedNewSubtasks = newSubtasks.map((sub, i) => ({
      ...sub,
      order: existingSubtasks.length + i,
    }));

    const updatedSubtasks = [...existingSubtasks, ...adjustedNewSubtasks];

    try {
      await updateTask({
        ...task,
        subtasks: updatedSubtasks,
        has_deep_subtasks: true,
      });

      toast({
        title: "Subtasks added successfully",
        description: `${adjustedNewSubtasks.length} nested subtasks were added to "${task.title}"`,
      });
    } catch (error) {
      toast({
        title: "Failed to apply subtasks",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  toast({
    title: "Task Refactoring Suggestion",
    description: (
      <div className="space-y-3 max-w-md">
        <p>Suggested breakdown for "{payload.task_title}":</p>
        {renderSubtaskTree(subtasksData.slice(0, 5))}
        <button
          onClick={() =>
            applySuggestedSubtasks(payload.task_title, subtasksData)
          }
          className="mt-3 px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
        >
          ✅ Apply All Subtasks
        </button>
      </div>
    ),
    duration: 20000,
  });
};

export const executeSummarizeTask = async (
  payload: SummarizeTaskPayload
): Promise<void> => {
  const { tasks } = useKanbanStore.getState();
  const task = tasks.find((t) =>
    t.title.toLowerCase().includes(payload.task_title.toLowerCase())
  );

  if (!task) {
    throw new Error(`Task "${payload.task_title}" not found`);
  }

  const subtasksTyped = (task.subtasks || []) as unknown as FlattenedSubtask[];

  const buildSubtaskTree = (
    subtasks: FlattenedSubtask[],
    parentId: string | null = null,
    level: number = 0
  ): string => {
    const children = subtasks.filter((st) => st.parentSubtaskId === parentId);
    return children
      .map((st) => {
        const indent = "  ".repeat(level);
        const status = st.completed ? "✅" : "⏳";
        let result = `${indent}- ${status} ${st.title}`;

        const grandchildren = buildSubtaskTree(subtasks, st.id, level + 1);
        if (grandchildren) {
          result += "\n" + grandchildren;
        }

        return result;
      })
      .join("\n");
  };

  const subtaskTree = task.subtasks
    ? buildSubtaskTree(subtasksTyped)
    : "No subtasks";
  const completedCount =
    task.subtasks?.filter((st) => st.completed).length || 0;
  const totalCount = task.subtasks?.length || 0;

  const taskContext = `
Task: ${task.title}
Description: ${task.description || "No description"}
Priority: ${task.priority}
Progress: ${completedCount}/${totalCount} subtasks completed

Subtask Breakdown:
${subtaskTree}
`;

  const response = await callOpenRouterProxy({
    model: "mistralai/mistral-medium",
    messages: [
      {
        role: "system",
        content:
          "Summarize task progress with focus on hierarchical subtask completion. Highlight blockers, next steps, and overall status. Be concise but insightful.",
      },
      {
        role: "user",
        content: `Summarize this task with its nested structure:\n${taskContext}`,
      },
    ],
    temperature: 0.4,
    max_tokens: 300,
  });

  const summary = response.choices[0].message.content;

  toast({
    title: "Task Summary",
    description: (
      <div className="space-y-2 max-w-md">
        <p className="text-sm">{summary}</p>
        <div className="text-xs text-muted-foreground border-t pt-2">
          Progress: {completedCount}/{totalCount} subtasks • {task.priority}{" "}
          priority
        </div>
      </div>
    ),
    duration: 12000,
  });
};
