import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import AuthLogo from "../AuthLogo";

describe("AuthLogo", () => {
  it("renders the logo and text correctly", () => {
    render(<AuthLogo />);

    expect(screen.getByText("Project Board")).toBeInTheDocument();

    expect(
      screen.getByText("AI-powered project management")
    ).toBeInTheDocument();

    const svgElement = document.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });
});
