"use client";
import { useCallback } from "react";
import { useInternalState } from "./useInternalState";
import type { SortState } from "../types";

/** The props for the `useTableSort` hook. */
interface UseTableSortProps<T> {
  controlledSortState?: SortState<T>;
  onSortChange?: (state: SortState<T>) => void;
  persistenceKey?: string;
}

/**
 * Manages the sorting state for the table.
 */
export function useTableSort<T>({
  controlledSortState,
  onSortChange,
  persistenceKey,
}: UseTableSortProps<T>) {
  const [internalSortState, setInternalSortState] = useInternalState<
    SortState<T>
  >(
    { key: null, direction: "asc" },
    persistenceKey ? `${persistenceKey}-sort` : undefined
  );

  const isControlled = controlledSortState !== undefined && onSortChange;
  const sortState = isControlled ? controlledSortState : internalSortState;
  const setSortState = isControlled ? onSortChange : setInternalSortState;

  const handleSort = useCallback(
    (key: keyof T) => {
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
