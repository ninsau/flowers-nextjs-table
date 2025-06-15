"use client";
import { useMemo, useState, useCallback } from "react";
import { TableProps, ColumnDef, Localization } from "../types";
import { useTableSort } from "../hooks/useTableSort";
import { useRowSelection } from "../hooks/useRowSelection";
import Pagination from "./Pagination";
import NoContent from "./NoContent";
import TableSkeleton from "./TableSkeleton";
import { formatDate, isDateString } from "../utils";

const defaultLocalization: Localization = {
  pagination: {
    previous: "Previous",
    next: "Next",
    pageInfo: (page, totalPages) => `Page ${page} of ${totalPages}`,
  },
  noContent: {
    text: "No data available",
    searchFilterText: (searchValue) => `No results for "${searchValue}"`,
  },
};

/**
 * A headless, performant, and highly customizable table component for React and Next.js.
 */
function Table<T extends Record<string, any>>({
  data,
  columns,
  getRowId = (row) => row.id,
  loading = false,
  searchValue = "",
  persistenceKey,
  disableInternalProcessing = false,
  classNames = {},
  localization: customLocalization,
  renderRow,
  renderBody,
  formatValue,
  onRowClick,
  enableColumnResizing = false,
  sortState: controlledSortState,
  onSortChange,
  paginationMode = "auto",
  page: controlledPage,
  totalPages: controlledTotalPages,
  onPageChange,
  itemsPerPage = 20,
  enableRowSelection = false,
  rowSelection: controlledSelection,
  onRowSelectionChange,
  noContentProps,
}: Readonly<TableProps<T>>) {
  const localization = { ...defaultLocalization, ...customLocalization };
  const [columnSizes, setColumnSizes] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      columns.map((c) => [String(c.accessorKey), c.size ?? 150])
    )
  );

  const { sortState, handleSort } = useTableSort({
    controlledSortState,
    onSortChange,
    persistenceKey,
  });

  const processedData = useMemo(() => {
    if (disableInternalProcessing) return data;
    let result = [...data];
    if (searchValue) {
      const lowercasedSearch = searchValue.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => {
          if (col.accessorKey === "actions" || col.accessorKey === "select")
            return false;
          return String(item[col.accessorKey as keyof T] ?? "")
            .toLowerCase()
            .includes(lowercasedSearch);
        })
      );
    }
    if (sortState.key) {
      const { key, direction } = sortState;
      result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, searchValue, sortState, columns, disableInternalProcessing]);

  const [internalPage, setInternalPage] = useState(1);
  const isControlledPagination = paginationMode === "manual";
  const isPaginationEnabled =
    paginationMode !== "off" &&
    (isControlledPagination ||
      (paginationMode === "auto" && processedData.length > itemsPerPage));

  const currentPage = isControlledPagination
    ? controlledPage ?? 1
    : internalPage;
  const totalDataPages = Math.ceil(processedData.length / itemsPerPage);
  const totalPages = isControlledPagination
    ? controlledTotalPages ?? 1
    : totalDataPages;
  const handlePageChange = isControlledPagination
    ? onPageChange!
    : setInternalPage;

  const paginatedData = useMemo(
    () =>
      isPaginationEnabled && !isControlledPagination
        ? processedData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
        : processedData,
    [
      processedData,
      isPaginationEnabled,
      isControlledPagination,
      currentPage,
      itemsPerPage,
    ]
  );

  // FIX: The `data` prop is now correctly passed to the useRowSelection hook.
  // We pass `paginatedData` because "select all" should apply to the visible data.
  const rowSelection = useRowSelection({
    controlledSelection,
    onSelectionChange: onRowSelectionChange,
    persistenceKey,
    data: paginatedData,
  });

  const startResizing = useCallback(
    (key: string, initialClientX: number) => {
      const initialWidth = columnSizes[key];

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - initialClientX;
        setColumnSizes((prev) => ({
          ...prev,
          [key]: Math.max(initialWidth + delta, 50),
        }));
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [columnSizes]
  );

  const renderCellContent = (item: T, column: ColumnDef<T>) => {
    if (column.accessorKey === "select") {
      if (!enableRowSelection) return null;
      const canSelect =
        typeof enableRowSelection === "function"
          ? enableRowSelection(item)
          : true;
      return (
        <input
          type="checkbox"
          disabled={!canSelect}
          checked={rowSelection.selectedRowIds[getRowId(item)] ?? false}
          onChange={() => canSelect && rowSelection.toggleRow(getRowId(item))}
          onClick={(e) => e.stopPropagation()} // Prevent row click from firing
          aria-label={`Select row for ${getRowId(item)}`}
        />
      );
    }
    if (column.cell) return column.cell(item);
    const key = column.accessorKey as keyof T;
    const value = item[key];
    if (formatValue) return formatValue(value, key, item);
    if (value === null || value === undefined) return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string" && isDateString(value))
      return formatDate(new Date(value));
    return String(value);
  };

  const renderHeaderContent = (column: ColumnDef<T>) => {
    if (column.accessorKey === "select") {
      if (!enableRowSelection) return null;
      const visibleRowIds = paginatedData.map(getRowId);
      const selectableRowIds =
        typeof enableRowSelection === "function"
          ? visibleRowIds.filter((id) => {
              const row = paginatedData.find((r) => getRowId(r) === id);
              return row ? enableRowSelection(row) : false;
            })
          : visibleRowIds;

      return (
        <input
          type="checkbox"
          aria-label="Select all rows on this page"
          checked={rowSelection.isAllSelected(selectableRowIds)}
          ref={(el) => {
            if (el) {
              el.indeterminate = rowSelection.isSomeSelected(selectableRowIds);
            }
          }}
          onChange={() => rowSelection.toggleAllRows(selectableRowIds)}
        />
      );
    }
    return typeof column.header === "function"
      ? column.header()
      : column.header;
  };

  if (loading) return <TableSkeleton />;
  if (!data || data.length === 0)
    return <NoContent {...noContentProps} text={localization.noContent.text} />;
  if (paginatedData.length === 0 && searchValue)
    return (
      <NoContent
        {...noContentProps}
        text={localization.noContent.searchFilterText(searchValue)}
      />
    );

  return (
    <div className={classNames.container}>
      <div className="overflow-x-auto">
        <table role="grid" className={classNames.table}>
          <thead className={classNames.thead}>
            <tr role="row">
              {columns.map((column) => (
                <th
                  key={String(column.accessorKey)}
                  role="columnheader"
                  className={classNames.th}
                  style={{ width: columnSizes[String(column.accessorKey)] }}
                  aria-sort={
                    sortState.key === column.accessorKey
                      ? sortState.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        column.enableSorting &&
                        handleSort(column.accessorKey as keyof T)
                      }
                      disabled={!column.enableSorting}
                      className="flex w-full items-center gap-2 border-none bg-transparent p-0 text-inherit disabled:cursor-not-allowed"
                    >
                      {renderHeaderContent(column)}
                    </button>
                    {enableColumnResizing &&
                      column.enableResizing !== false && (
                        <div
                          role="separator"
                          aria-orientation="vertical"
                          className={classNames.resizer}
                          onMouseDown={(e) =>
                            startResizing(String(column.accessorKey), e.clientX)
                          }
                        />
                      )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {renderBody ? (
            renderBody(paginatedData)
          ) : (
            <tbody className={classNames.tbody}>
              {paginatedData.map((item, index) =>
                renderRow ? (
                  renderRow(item, index)
                ) : (
                  <tr
                    key={getRowId(item)}
                    role="row"
                    onClick={() => onRowClick?.(item)}
                    className={classNames.tr}
                    aria-selected={
                      enableRowSelection
                        ? rowSelection.selectedRowIds[getRowId(item)]
                        : undefined
                    }
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.accessorKey)}
                        role="gridcell"
                        className={classNames.td}
                      >
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
      </div>
      {isPaginationEnabled && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          classNames={classNames.pagination}
          localization={localization.pagination}
        />
      )}
    </div>
  );
}

export default Table;
