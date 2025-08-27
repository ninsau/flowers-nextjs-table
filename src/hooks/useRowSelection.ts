"use client";
import type { RowSelectionState } from "../types";
import { useInternalState } from "./useInternalState";

/** The props for the `useRowSelection` hook. */
interface UseRowSelectionProps {
  controlledSelection?: Readonly<Record<string | number, boolean>> | undefined;
  onSelectionChange?:
    | ((selection: Readonly<Record<string | number, boolean>>) => void)
    | undefined;
  persistenceKey?: string | undefined;
}

/**
 * Manages the row selection state for the table.
 */
export function useRowSelection({
  controlledSelection,
  onSelectionChange,
  persistenceKey,
}: UseRowSelectionProps): RowSelectionState {
  const [internalSelection, setInternalSelection] = useInternalState<
    Record<string | number, boolean>
  >({}, persistenceKey ? `${persistenceKey}-selection` : undefined);

  const isControlled = Boolean(controlledSelection && onSelectionChange);
  const selectedRowIds = isControlled
    ? (controlledSelection ?? {})
    : internalSelection;

  const toggleRow = (id: string | number): void => {
    const newSelection = {
      ...selectedRowIds,
      [id]: !selectedRowIds[id],
    };
    if (isControlled && onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelection(newSelection);
    }
  };

  const toggleAllRows = (
    ids: readonly (string | number)[],
    value?: boolean
  ): void => {
    const isAllCurrentlySelected =
      ids.length > 0 && ids.every((id) => Boolean(selectedRowIds[id]));
    const shouldSelect = value ?? !isAllCurrentlySelected;

    const newSelection = { ...selectedRowIds };
    for (const id of ids) {
      newSelection[id] = shouldSelect;
    }

    if (isControlled && onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelection(newSelection);
    }
  };

  const isAllSelected = (ids: readonly (string | number)[]): boolean =>
    ids.length > 0 && ids.every((id) => Boolean(selectedRowIds[id]));

  const isSomeSelected = (ids: readonly (string | number)[]): boolean => {
    if (ids.length === 0) return false;
    const selectedCount = ids.filter((id) =>
      Boolean(selectedRowIds[id])
    ).length;
    return selectedCount > 0 && selectedCount < ids.length;
  };

  return {
    selectedRowIds,
    toggleRow,
    toggleAllRows,
    isAllSelected,
    isSomeSelected,
  };
}
