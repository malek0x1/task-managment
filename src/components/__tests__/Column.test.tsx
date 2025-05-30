import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import Column from "../Column";
import { Column as ColumnType, Task } from "@/types/kanban";

vi.mock("../TaskCard", () => ({
  default: ({ task }: { task: Task }) => (
    <div data-testid={`task-card-${task.id}`}>{task.title}</div>
  ),
}));

vi.mock("../ColumnHeader", () => ({
  default: ({ column }: { column: ColumnType }) => (
    <div data-testid="column-header">{column.title}</div>
  ),
}));

vi.mock("../AddTaskForm", () => ({
  default: ({ columnId }: { columnId: string }) => (
    <div data-testid={`add-task-form-${columnId}`}>Add Task Form</div>
  ),
}));

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  verticalListSortingStrategy: "vertical",
}));

describe("Column", () => {
  const mockColumn: ColumnType = {
    id: "column-1",
    title: "To Do",
    position: 0,
    project_id: "project-1",
  };

  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Task 1",
      column_id: "column-1",
      position: 0,
      subtasks: [],
      project_id: "project-1",
      priority: "medium",
    },
    {
      id: "task-2",
      title: "Task 2",
      column_id: "column-1",
      position: 1,
      subtasks: [],
      project_id: "project-1",
      priority: "medium",
    },
  ];

  const mockProps = {
    onUpdateColumnTitle: vi.fn(),
    onAddTask: vi.fn(),
    onOpenTaskDrawer: vi.fn(),
    onToggleSubtask: vi.fn(),
    onAddSubtask: vi.fn(),
    onUpdateSubtask: vi.fn(),
  };

  it("renders the column header with correct title", () => {
    render(<Column column={mockColumn} tasks={mockTasks} {...mockProps} />);

    const header = screen.getByTestId("column-header");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toBe("To Do");
  });

  it("renders the add task form", () => {
    render(<Column column={mockColumn} tasks={mockTasks} {...mockProps} />);

    const addTaskForm = screen.getByTestId("add-task-form-column-1");
    expect(addTaskForm).toBeInTheDocument();
  });

  it("renders all tasks in the column", () => {
    render(<Column column={mockColumn} tasks={mockTasks} {...mockProps} />);

    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-2")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("displays empty column message when there are no tasks", () => {
    render(<Column column={mockColumn} tasks={[]} {...mockProps} />);

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(screen.getByText("Add your first task")).toBeInTheDocument();
  });
});
