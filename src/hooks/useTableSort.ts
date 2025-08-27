"use client";
import { useCallback } from "react";
import type { CellValue, SortState } from "../types";
import { useInternalState } from "./useInternalState";

/** The props for the `useTableSort` hook. */
interface UseTableSortProps<T extends Record<string, CellValue>> {
  controlledSortState?: SortState<T> | undefined;
  onSortChange?: ((state: SortState<T>) => void) | undefined;
  persistenceKey?: string | undefined;
}

/**
 * Manages the sorting state for the table.
 */
export function useTableSort<T extends Record<string, CellValue>>({
  controlledSortState,
  onSortChange,
  persistenceKey,
}: UseTableSortProps<T>): {
  sortState: SortState<T>;
  handleSort: (key: keyof T) => void;
} {
  const [internalSortState, setInternalSortState] = useInternalState<
    SortState<T>
  >(
    { key: null, direction: "asc" },
    persistenceKey ? `${persistenceKey}-sort` : undefined
  );

  const isControlled = Boolean(controlledSortState && onSortChange);
  const sortState = isControlled
    ? (controlledSortState ?? internalSortState)
    : internalSortState;
  const setSortState = isControlled ? onSortChange : setInternalSortState;

  const handleSort = useCallback(
    (key: keyof T): void => {
      if (key === "actions" || key === "select") return;

      let direction: "asc" | "desc" = "asc";
      if (sortState.key === key && sortState.direction === "asc") {
        direction = "desc";
      }

      if (setSortState) {
        setSortState({ key, direction });
      }
    },
    [sortState, setSortState]
  );

  return { sortState, handleSort };
}
