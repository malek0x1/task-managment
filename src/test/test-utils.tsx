import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };

export const mockUseAuthStore = {
  user: { id: "test-user-id", email: "test@example.com" },
  isAuthenticated: true,
  isAuthenticating: false,
  login: vi.fn(),
  signUp: vi.fn(),
  sendMagicLink: vi.fn(),
  signOut: vi.fn(),
  setIsAuthenticating: vi.fn(),
};

export const mockUseProjectStore = {
  projects: [{ id: "project-1", name: "Test Project" }],
  currentProject: { id: "project-1", name: "Test Project" },
  fetchProjects: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
};

export const mockUseKanbanStore = {
  columns: [{ id: "column-1", title: "To Do", order: 0 }],
  tasks: [
    {
      id: "task-1",
      title: "Test Task",
      column_id: "column-1",
      order: 0,
      subtasks: [],
    },
  ],
  addTask: vi.fn(),
  addColumn: vi.fn(),
  updateTask: vi.fn(),
  fetchBoard: vi.fn(),
};
