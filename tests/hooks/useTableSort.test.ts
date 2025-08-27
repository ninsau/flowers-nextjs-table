import { act, renderHook } from "@testing-library/react";
import { useTableSort } from "../../src/hooks/useTableSort";

describe("useTableSort", () => {
  describe("uncontrolled mode", () => {
    it("should initialize with no sort", () => {
      const { result } = renderHook(() => useTableSort({}));

      expect(result.current.sortState).toEqual({
        key: null,
        direction: "asc",
      });
    });

    it("should sort in ascending order first", () => {
      const { result } = renderHook(() => useTableSort({}));

      act(() => {
        result.current.handleSort("name");
      });

      expect(result.current.sortState).toEqual({
        key: "name",
        direction: "asc",
      });
    });

    it("should toggle to descending when sorting same column", () => {
      const { result } = renderHook(() => useTableSort({}));

      act(() => {
        result.current.handleSort("name");
      });

      act(() => {
        result.current.handleSort("name");
      });

      expect(result.current.sortState).toEqual({
        key: "name",
        direction: "desc",
      });
    });

    it("should reset to ascending when sorting different column", () => {
      const { result } = renderHook(() => useTableSort({}));

      act(() => {
        result.current.handleSort("name");
      });

      act(() => {
        result.current.handleSort("name");
      });

      act(() => {
        result.current.handleSort("age");
      });

      expect(result.current.sortState).toEqual({
        key: "age",
        direction: "asc",
      });
    });

    it("should ignore reserved keys", () => {
      const { result } = renderHook(() => useTableSort({}));

      const initialState = result.current.sortState;

      act(() => {
        result.current.handleSort("actions");
      });

      expect(result.current.sortState).toEqual(initialState);

      act(() => {
        result.current.handleSort("select");
      });

      expect(result.current.sortState).toEqual(initialState);
    });
  });

  describe("controlled mode", () => {
    it("should use controlled sort state", () => {
      const controlledSortState = {
        key: "name" as const,
        direction: "desc" as const,
      };
      const onSortChange = jest.fn();

      const { result } = renderHook(() =>
        useTableSort({
          controlledSortState,
          onSortChange,
        })
      );

      expect(result.current.sortState).toEqual(controlledSortState);
    });

    it("should call onSortChange when sorting", () => {
      const controlledSortState = { key: null, direction: "asc" as const };
      const onSortChange = jest.fn();

      const { result } = renderHook(() =>
        useTableSort({
          controlledSortState,
          onSortChange,
        })
      );

      act(() => {
        result.current.handleSort("name");
      });

      expect(onSortChange).toHaveBeenCalledWith({
        key: "name",
        direction: "asc",
      });
    });

    it("should call onSortChange with correct direction toggle", () => {
      const controlledSortState = {
        key: "name" as const,
        direction: "asc" as const,
      };
      const onSortChange = jest.fn();

      const { result } = renderHook(() =>
        useTableSort({
          controlledSortState,
          onSortChange,
        })
      );

      act(() => {
        result.current.handleSort("name");
      });

      expect(onSortChange).toHaveBeenCalledWith({
        key: "name",
        direction: "desc",
      });
    });
  });

  describe("with persistence", () => {
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: mockLocalStorage,
        configurable: true,
      });
      jest.clearAllMocks();
    });

    it("should persist sort state", () => {
      const { result } = renderHook(() =>
        useTableSort({
          persistenceKey: "test-table",
        })
      );

      act(() => {
        result.current.handleSort("name");
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "test-table-sort",
        JSON.stringify({
          key: "name",
          direction: "asc",
        })
      );
    });
  });
});
