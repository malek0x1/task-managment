import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import AppHeader from "../AppHeader";

vi.mock("../ProjectHeader", () => ({
  default: ({
    projects,
    currentProjectId,
    projectName,
    switchProject,
    openProjectModal,
  }: any) => <div data-testid="project-header">Project: {projectName}</div>,
}));

vi.mock("../HeaderActions", () => ({
  default: ({ user, handleSignOut }: any) => (
    <div data-testid="header-actions">User: {user.email}</div>
  ),
}));

describe("AppHeader", () => {
  const projects = [
    { id: "project-1", name: "Test Project 1" },
    { id: "project-2", name: "Test Project 2" },
  ];

  const mockUser = { id: "user-1", email: "test@example.com" };
  const mockSwitchProject = vi.fn();
  const mockHandleSignOut = vi.fn();
  const mockOpenProjectModal = vi.fn();

  it("renders ProjectHeader with correct props", () => {
    render(
      <AppHeader
        projects={projects}
        currentProjectId="project-1"
        projectName="Test Project 1"
        user={mockUser}
        switchProject={mockSwitchProject}
        handleSignOut={mockHandleSignOut}
        openProjectModal={mockOpenProjectModal}
      />
    );

    const projectHeader = screen.getByTestId("project-header");
    expect(projectHeader).toBeInTheDocument();
    expect(projectHeader.textContent).toContain("Test Project 1");
  });

  it("renders HeaderActions with correct props", () => {
    render(
      <AppHeader
        projects={projects}
        currentProjectId="project-1"
        projectName="Test Project 1"
        user={mockUser}
        switchProject={mockSwitchProject}
        handleSignOut={mockHandleSignOut}
        openProjectModal={mockOpenProjectModal}
      />
    );

    const headerActions = screen.getByTestId("header-actions");
    expect(headerActions).toBeInTheDocument();
    expect(headerActions.textContent).toContain("test@example.com");
  });
});
