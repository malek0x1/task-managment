import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "../use-mobile";

describe("useIsMobile", () => {
  const matchMediaMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.matchMedia = matchMediaMock;
    global.innerWidth = 1024;
  });

  it("should return false when screen width is greater than mobile breakpoint", () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should return true when screen width is less than mobile breakpoint", () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should update when window is resized", () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result, rerender } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    global.innerWidth = 480;
    window.dispatchEvent(new Event("resize"));

    rerender();
    expect(result.current).toBe(true);
  });
});
