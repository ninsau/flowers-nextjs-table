import { act, renderHook } from "@testing-library/react";
import { useInternalState } from "../../src/hooks/useInternalState";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("useInternalState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with initial state", () => {
    const { result } = renderHook(() => useInternalState("initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should initialize with function", () => {
    const initializer = jest.fn(() => "computed");
    const { result } = renderHook(() => useInternalState(initializer));

    expect(initializer).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe("computed");
  });

  it("should update state", () => {
    const { result } = renderHook(() => useInternalState("initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
  });

  it("should update state with function", () => {
    const { result } = renderHook(() => useInternalState("initial"));

    act(() => {
      result.current[1]((prev) => `${prev} updated`);
    });

    expect(result.current[0]).toBe("initial updated");
  });

  describe("with persistence", () => {
    it("should load from localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify("persisted"));

      const { result } = renderHook(() =>
        useInternalState("initial", "test-key")
      );

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("test-key");
      expect(result.current[0]).toBe("persisted");
    });

    it("should save to localStorage on update", () => {
      const { result } = renderHook(() =>
        useInternalState("initial", "test-key")
      );

      act(() => {
        result.current[1]("updated");
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "test-key",
        JSON.stringify("updated")
      );
    });

    it("should handle localStorage errors gracefully", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const { result } = renderHook(() =>
        useInternalState("initial", "test-key")
      );

      expect(result.current[0]).toBe("initial");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle invalid JSON gracefully", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid-json");

      const { result } = renderHook(() =>
        useInternalState("initial", "test-key")
      );

      expect(result.current[0]).toBe("initial");
    });

    it("should handle null localStorage value", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useInternalState("initial", "test-key")
      );

      expect(result.current[0]).toBe("initial");
    });
  });

  describe("SSR handling", () => {
    it("should handle server environment", () => {
      const originalWindow = global.window;
      (global as unknown as { window?: unknown }).window = undefined;

      const { result } = renderHook(() =>
        useInternalState("initial", "test-key")
      );

      expect(result.current[0]).toBe("initial");

      global.window = originalWindow;
    });
  });
});
