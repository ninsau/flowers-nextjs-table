"use client";
import { useMemo } from "react";
import { useInternalState } from "./useInternalState";
import type { RowSelectionState } from "../types";

/** The props for the `useRowSelection` hook. */
interface UseRowSelectionProps {
  /** A controlled state object for the selected rows. */
  controlledSelection?: Record<string | number, boolean>;
  /** A callback that fires when the selection changes. */
  onSelectionChange?: (selection: Record<string | number, boolean>) => void;
  /** A unique key to persist the selection state in browser storage. */
  persistenceKey?: string;
  /** The current data being displayed in the table. */
  data: any[];
}

/**
 * A hook to manage the row selection state for the table.
 * It can operate in either controlled or uncontrolled mode and supports state persistence.
 * @param props - Configuration for the hook.
 * @returns An object containing the selection state and updater functions.
 */
export function useRowSelection({
  controlledSelection,
  onSelectionChange,
  persistenceKey,
  data, // Pass data to useMemo for dependency tracking
}: UseRowSelectionProps): RowSelectionState {
  const [internalSelection, setInternalSelection] = useInternalState<
    Record<string | number, boolean>
  >({}, persistenceKey ? `${persistenceKey}-selection` : undefined);

  const isControlled = controlledSelection !== undefined && onSelectionChange;
  const selectedRowIds = isControlled ? controlledSelection : internalSelection;

  const toggleRow = (id: string | number) => {
    // FIX: First, calculate the new state.
    const newSelection = {
      ...selectedRowIds,
      [id]: !selectedRowIds[id],
    };
    // FIX: Then, call the appropriate setter with the new state object.
    if (isControlled) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelection(newSelection);
    }
  };

  const toggleAllRows = (ids: (string | number)[], value?: boolean) => {
    const isAllCurrentlySelected =
      ids.length > 0 && ids.every((id) => selectedRowIds[id]);
    const shouldSelect = value ?? !isAllCurrentlySelected;

    // FIX: Calculate the new state object first.
    const newSelection = { ...selectedRowIds };
    ids.forEach((id) => {
      newSelection[id] = shouldSelect;
    });

    // FIX: Call the appropriate setter.
    if (isControlled) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelection(newSelection);
    }
  };

  const isAllSelected = (ids: (string | number)[]) =>
    ids.length > 0 && ids.every((id) => selectedRowIds[id]);

  const isSomeSelected = (ids: (string | number)[]) => {
    if (ids.length === 0) return false;
    const selectedCount = ids.filter((id) => selectedRowIds[id]).length;
    return selectedCount > 0 && selectedCount < ids.length;
  };

  return useMemo(
    () => ({
      selectedRowIds,
      toggleRow,
      toggleAllRows,
      isAllSelected,
      isSomeSelected,
    }),
    [selectedRowIds, data]
  );
}
