"use client";
import { useMemo } from "react";
import { useInternalState } from "./useInternalState";
import type { RowSelectionState } from "../types";

/** The props for the `useRowSelection` hook. */
interface UseRowSelectionProps {
  controlledSelection?: Record<string | number, boolean>;
  onSelectionChange?: (selection: Record<string | number, boolean>) => void;
  persistenceKey?: string;
  data: any[];
}

/**
 * Manages the row selection state for the table.
 */
export function useRowSelection({
  controlledSelection,
  onSelectionChange,
  persistenceKey,
  data,
}: UseRowSelectionProps): RowSelectionState {
  const [internalSelection, setInternalSelection] = useInternalState<
    Record<string | number, boolean>
  >({}, persistenceKey ? `${persistenceKey}-selection` : undefined);

  const isControlled = controlledSelection !== undefined && onSelectionChange;
  const selectedRowIds = isControlled ? controlledSelection : internalSelection;

  const toggleRow = (id: string | number) => {
    const newSelection = {
      ...selectedRowIds,
      [id]: !selectedRowIds[id],
    };
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

    const newSelection = { ...selectedRowIds };
    ids.forEach((id) => {
      newSelection[id] = shouldSelect;
    });

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
