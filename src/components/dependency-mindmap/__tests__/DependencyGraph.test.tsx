import { describe, it, expect, vi } from "vitest";
import { render } from "@/test/test-utils";
import DependencyGraph from "../DependencyGraph";

vi.mock("reactflow", () => ({
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../components/DependencyGraphContent", () => ({
  default: ({ taskId }: { taskId: string }) => (
    <div data-testid="dependency-graph-content">{taskId}</div>
  ),
}));

describe("DependencyGraph", () => {
  it("renders the DependencyGraphContent with the provided taskId", () => {
    const taskId = "test-task-id";
    const { getByTestId } = render(<DependencyGraph taskId={taskId} />);

    const content = getByTestId("dependency-graph-content");
    expect(content).toBeInTheDocument();
    expect(content.textContent).toBe(taskId);
  });
});
