"use client";

import { useCallback } from "react";
import type { SortState } from "../types";
import { useInternalState } from "./useInternalState";

interface UseTableSortProps<T> {
  controlledSortState?: SortState<T>;
  onSortChange?: (state: SortState<T>) => void;
  persistenceKey?: string;
}

/**
 * Manages the sorting state for the table.
 * It can be controlled by parent component's state or manage its own state internally.
 * @param props - Configuration for the hook.
 * @returns The current sort state and a function to handle sort actions.
 */
// FIX: Added the 'export' keyword to make this function importable.
export function useTableSort<T>({
  controlledSortState,
  onSortChange,
  persistenceKey,
}: UseTableSortProps<T>) {
  const [internalSortState, setInternalSortState] = useInternalState<SortState<T>>(
    { key: null, direction: "asc" },
    persistenceKey ? `${persistenceKey}-sort` : undefined
  );

  const isControlled = controlledSortState !== undefined && onSortChange;
  const sortState = isControlled ? controlledSortState : internalSortState;
  const setSortState = isControlled ? onSortChange : setInternalSortState;

  const handleSort = useCallback((key: keyof T) => {
      if (key === 'actions') return;

      let direction: "asc" | "desc" = "asc";
      if (sortState.key === key && sortState.direction === "asc") {
        direction = "desc";
      }

      setSortState({ key, direction });
    },
    [sortState, setSortState]
  );

  return { sortState, handleSort };
}