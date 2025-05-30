import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import TaskCard from "../TaskCard";
import { Task } from "@/types/kanban";

const mockTask: Task = {
  id: "task-1",
  title: "Test Task",
  description: "This is a test task",
  column_id: "column-1",
  project_id: "project-1",
  order: 0,
  priority: "medium",
  subtasks: [
    { id: "subtask-1", title: "Subtask 1", completed: false },
    { id: "subtask-2", title: "Subtask 2", completed: true },
  ],
};

const mockOpenTaskDrawer = vi.fn();
const mockToggleSubtask = vi.fn();
const mockAddSubtask = vi.fn();
const mockUpdateSubtask = vi.fn();

describe("TaskCard", () => {
  it("renders the task title correctly", () => {
    render(
      <TaskCard
        task={mockTask}
        onOpenTaskDrawer={mockOpenTaskDrawer}
        onToggleSubtask={mockToggleSubtask}
        onAddSubtask={mockAddSubtask}
        onUpdateSubtask={mockUpdateSubtask}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("displays the priority badge correctly", () => {
    render(
      <TaskCard
        task={mockTask}
        onOpenTaskDrawer={mockOpenTaskDrawer}
        onToggleSubtask={mockToggleSubtask}
        onAddSubtask={mockAddSubtask}
        onUpdateSubtask={mockUpdateSubtask}
      />
    );

    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("shows subtask progress correctly", () => {
    render(
      <TaskCard
        task={mockTask}
        onOpenTaskDrawer={mockOpenTaskDrawer}
        onToggleSubtask={mockToggleSubtask}
        onAddSubtask={mockAddSubtask}
        onUpdateSubtask={mockUpdateSubtask}
      />
    );

    expect(screen.getByText("Subtasks (1/2)")).toBeInTheDocument();
  });
});
