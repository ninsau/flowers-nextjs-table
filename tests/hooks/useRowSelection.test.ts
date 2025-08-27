import { act, renderHook } from "@testing-library/react";
import { useRowSelection } from "../../src/hooks/useRowSelection";

const _mockData = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];

describe("useRowSelection", () => {
  describe("uncontrolled mode", () => {
    it("should initialize with empty selection", () => {
      const { result } = renderHook(() => useRowSelection({}));

      expect(result.current.selectedRowIds).toEqual({});
    });

    it("should toggle row selection", () => {
      const { result } = renderHook(() => useRowSelection({}));

      act(() => {
        result.current.toggleRow("1");
      });

      expect(result.current.selectedRowIds["1"]).toBe(true);

      act(() => {
        result.current.toggleRow("1");
      });

      expect(result.current.selectedRowIds["1"]).toBe(false);
    });

    it("should toggle all rows", () => {
      const { result } = renderHook(() => useRowSelection({}));

      const rowIds = ["1", "2", "3"];

      act(() => {
        result.current.toggleAllRows(rowIds);
      });

      expect(result.current.selectedRowIds["1"]).toBe(true);
      expect(result.current.selectedRowIds["2"]).toBe(true);
      expect(result.current.selectedRowIds["3"]).toBe(true);

      act(() => {
        result.current.toggleAllRows(rowIds);
      });

      expect(result.current.selectedRowIds["1"]).toBe(false);
      expect(result.current.selectedRowIds["2"]).toBe(false);
      expect(result.current.selectedRowIds["3"]).toBe(false);
    });

    it("should toggle all rows with explicit value", () => {
      const { result } = renderHook(() => useRowSelection({}));

      const rowIds = ["1", "2"];

      act(() => {
        result.current.toggleAllRows(rowIds, true);
      });

      expect(result.current.selectedRowIds["1"]).toBe(true);
      expect(result.current.selectedRowIds["2"]).toBe(true);

      act(() => {
        result.current.toggleAllRows(rowIds, false);
      });

      expect(result.current.selectedRowIds["1"]).toBe(false);
      expect(result.current.selectedRowIds["2"]).toBe(false);
    });

    it("should check if all rows are selected", () => {
      const { result } = renderHook(() => useRowSelection({}));

      const rowIds = ["1", "2"];

      expect(result.current.isAllSelected(rowIds)).toBe(false);

      act(() => {
        result.current.toggleRow("1");
      });

      act(() => {
        result.current.toggleRow("2");
      });

      expect(result.current.isAllSelected(rowIds)).toBe(true);
    });

    it("should check if some rows are selected", () => {
      const { result } = renderHook(() => useRowSelection({}));

      const rowIds = ["1", "2"];

      expect(result.current.isSomeSelected(rowIds)).toBe(false);

      act(() => {
        result.current.toggleRow("1");
      });

      expect(result.current.isSomeSelected(rowIds)).toBe(true);

      act(() => {
        result.current.toggleRow("2");
      });

      expect(result.current.isSomeSelected(rowIds)).toBe(false);
    });

    it("should handle empty row ids", () => {
      const { result } = renderHook(() => useRowSelection({}));

      expect(result.current.isAllSelected([])).toBe(false);
      expect(result.current.isSomeSelected([])).toBe(false);
    });
  });

  describe("controlled mode", () => {
    it("should use controlled selection", () => {
      const mockSelection = { "1": true, "2": false };
      const onSelectionChange = jest.fn();

      const { result } = renderHook(() =>
        useRowSelection({
          controlledSelection: mockSelection,
          onSelectionChange,
        })
      );

      expect(result.current.selectedRowIds).toEqual(mockSelection);
    });

    it("should call onSelectionChange when toggling row", () => {
      const mockSelection = { "1": false };
      const onSelectionChange = jest.fn();

      const { result } = renderHook(() =>
        useRowSelection({
          controlledSelection: mockSelection,
          onSelectionChange,
        })
      );

      act(() => {
        result.current.toggleRow("1");
      });

      expect(onSelectionChange).toHaveBeenCalledWith({ "1": true });
    });

    it("should call onSelectionChange when toggling all rows", () => {
      const mockSelection = {};
      const onSelectionChange = jest.fn();

      const { result } = renderHook(() =>
        useRowSelection({
          controlledSelection: mockSelection,
          onSelectionChange,
        })
      );

      act(() => {
        result.current.toggleAllRows(["1", "2"]);
      });

      expect(onSelectionChange).toHaveBeenCalledWith({
        "1": true,
        "2": true,
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

    it("should persist selection state", () => {
      const { result } = renderHook(() =>
        useRowSelection({
          persistenceKey: "test-table",
        })
      );

      act(() => {
        result.current.toggleRow("1");
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "test-table-selection",
        JSON.stringify({ "1": true })
      );
    });
  });
});
