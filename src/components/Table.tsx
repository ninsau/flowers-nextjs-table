"use client";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { useRowSelection } from "../hooks/useRowSelection";
import { useTableSort } from "../hooks/useTableSort";
import { flowersDefaultClassNames } from "../styles/defaultClassNames";
import type { CellValue, ColumnDef, Localization, TableProps } from "../types";
import {
  formatDate,
  isDateString,
  isNumber,
  isString,
  mergeTableConfig,
  sanitizeString,
} from "../utils";
import ChipDisplay from "./ChipDisplay";
import ExpandableText from "./ExpandableText";
import NoContent from "./NoContent";
import Pagination from "./Pagination";
import TableSkeleton from "./TableSkeleton";

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
 *
 * @example
 * ```tsx
 * import { Table, type ColumnDef } from 'flowers-nextjs-table';
 *
 * const columns: ColumnDef<User>[] = [
 *   { accessorKey: 'name', header: 'Name', enableSorting: true },
 *   { accessorKey: 'email', header: 'Email' },
 * ];
 *
 * <Table data={users} columns={columns} />
 * ```
 */
function Table<T extends Record<string, CellValue>>({
  data,
  columns,
  getRowId = (row) => {
    if (
      row.id !== undefined &&
      (typeof row.id === "string" || typeof row.id === "number")
    ) {
      return row.id;
    }
    console.warn(
      "Table: No valid id found in row data. Using random ID. " +
        "Consider adding an id field to your data or providing a custom getRowId function."
    );
    return String(Math.random());
  },
  loading = false,
  searchValue = "",
  persistenceKey,
  disableInternalProcessing = false,
  classNames: customClassNames,
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
  disableDarkMode = false,
}: Readonly<TableProps<T>>) {
  // Developer experience improvements: validate props
  if (process.env.NODE_ENV === "development") {
    if (!data || !Array.isArray(data)) {
      console.error("Table: data prop must be an array");
    }
    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      console.error("Table: columns prop must be a non-empty array");
    }
    if (columns?.some((col) => !col.accessorKey)) {
      console.warn(
        "Table: Some columns are missing accessorKey, which may cause issues with sorting and selection"
      );
    }
  }

  const classNames = useMemo(
    () => mergeTableConfig(flowersDefaultClassNames, customClassNames),
    [customClassNames]
  );

  const localization = useMemo(
    () => mergeTableConfig(defaultLocalization, customLocalization),
    [customLocalization]
  );

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
    if (disableInternalProcessing) return [...data];
    let result = [...data];

    if (searchValue) {
      const sanitizedSearch = sanitizeString(searchValue.toLowerCase());
      result = result.filter((item) =>
        columns.some((col) => {
          if (col.accessorKey === "actions" || col.accessorKey === "select")
            return false;

          const cellValue = item[col.accessorKey];
          const searchableText = cellValue != null ? String(cellValue) : "";

          return sanitizeString(searchableText.toLowerCase()).includes(
            sanitizedSearch
          );
        })
      );
    }

    if (sortState.key) {
      const { key, direction } = sortState;
      result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (valA == null && valB == null) return 0;
        if (valA == null) return direction === "asc" ? 1 : -1;
        if (valB == null) return direction === "asc" ? -1 : 1;

        if (typeof valA === "string" && typeof valB === "string") {
          return direction === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

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
    ? (controlledPage ?? 1)
    : internalPage;
  const totalDataPages = Math.max(
    1,
    Math.ceil(processedData.length / itemsPerPage)
  );
  const totalPages = isControlledPagination
    ? Math.max(1, controlledTotalPages ?? 1)
    : totalDataPages;
  const handlePageChange =
    isControlledPagination && onPageChange ? onPageChange : setInternalPage;

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

  const rowSelection = useRowSelection({
    controlledSelection,
    onSelectionChange: onRowSelectionChange,
    persistenceKey,
  });

  const startResizing = useCallback(
    (key: string, e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const initialWidth = columnSizes[key] ?? 150;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
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

  const getAriaSort = useCallback(
    (column: ColumnDef<T>): "ascending" | "descending" | "none" => {
      if (sortState.key !== column.accessorKey) return "none";
      return sortState.direction === "asc" ? "ascending" : "descending";
    },
    [sortState]
  );

  const renderCellContent = useCallback(
    (item: T, column: ColumnDef<T>) => {
      if (column.accessorKey === "select") {
        if (!enableRowSelection) return null;
        const canSelect =
          typeof enableRowSelection === "function"
            ? enableRowSelection(item)
            : true;
        const rowId = getRowId(item);
        const isSelected = Boolean(rowSelection.selectedRowIds[rowId]);

        return (
          <div className="flex justify-center items-center">
            <input
              type="checkbox"
              disabled={!canSelect}
              checked={isSelected}
              onChange={() => canSelect && rowSelection.toggleRow(rowId)}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Select row for ${rowId}`}
            />
          </div>
        );
      }

      if (column.cell) return column.cell(item);

      const key = column.accessorKey as keyof T;
      const value = item[key];

      if (formatValue) return formatValue(value, key, item);
      if (value == null) return "-";

      if (Array.isArray(value)) {
        const stringValues = value.map((v: unknown) =>
          isString(v) ? sanitizeString(v) : String(v)
        );
        return (
          <ChipDisplay
            items={stringValues}
            classNames={classNames.chip ?? {}}
          />
        );
      }

      if (isString(value)) {
        if (isDateString(value)) {
          return formatDate(new Date(value));
        }
        return (
          <ExpandableText
            text={sanitizeString(value)}
            classNames={classNames.expandableText ?? {}}
          />
        );
      }

      if (isNumber(value) || typeof value === "boolean") {
        return String(value);
      }

      if (value instanceof Date) {
        return formatDate(value);
      }

      return sanitizeString(String(value));
    },
    [
      enableRowSelection,
      rowSelection,
      getRowId,
      formatValue,
      classNames.chip,
      classNames.expandableText,
    ]
  );

  const renderHeaderContent = useCallback(
    (column: ColumnDef<T>) => {
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

        const isAllSelected = rowSelection.isAllSelected(selectableRowIds);
        const isSomeSelected = rowSelection.isSomeSelected(selectableRowIds);

        return (
          <div className="flex justify-center items-center">
            <input
              type="checkbox"
              aria-label="Select all rows on this page"
              checked={isAllSelected}
              ref={(el) => {
                if (el) {
                  el.indeterminate = isSomeSelected && !isAllSelected;
                }
              }}
              onChange={() => rowSelection.toggleAllRows(selectableRowIds)}
            />
          </div>
        );
      }

      return typeof column.header === "function"
        ? column.header()
        : sanitizeString(String(column.header));
    },
    [enableRowSelection, paginatedData, getRowId, rowSelection]
  );

  if (loading) return <TableSkeleton />;
  if (!data || data.length === 0) {
    return (
      <NoContent
        {...noContentProps}
        text={localization.noContent?.text ?? "No data available"}
      />
    );
  }
  if (paginatedData.length === 0 && searchValue) {
    const sanitizedSearchValue = sanitizeString(searchValue);
    return (
      <NoContent
        {...noContentProps}
        text={
          localization.noContent?.searchFilterText(sanitizedSearchValue) ??
          `No results for "${sanitizedSearchValue}"`
        }
      />
    );
  }

  return (
    <div
      className={`${classNames.container} ${disableDarkMode ? "flowers-table-disable-dark" : ""}`}
    >
      <div className="overflow-x-auto">
        <table className={classNames.table}>
          <thead className={classNames.thead}>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.accessorKey)}
                  scope="col"
                  className={classNames.th}
                  style={{ width: columnSizes[String(column.accessorKey)] }}
                  aria-sort={getAriaSort(column)}
                >
                  <div className="flex items-center justify-between group">
                    <button
                      type="button"
                      onClick={() =>
                        column.enableSorting &&
                        handleSort(column.accessorKey as keyof T)
                      }
                      disabled={!column.enableSorting}
                      className="flex grow items-center gap-2 border-none bg-transparent p-0 text-inherit disabled:cursor-not-allowed"
                    >
                      {renderHeaderContent(column)}
                      {column.enableSorting && (
                        <span className="flex items-center transition-colors">
                          {sortState.key === column.accessorKey ? (
                            <span className="text-gray-900 dark:text-white">
                              {sortState.direction === "asc" ? "▲" : "▼"}
                            </span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500">
                              ↕
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                    {enableColumnResizing &&
                      column.enableResizing !== false && (
                        <button
                          type="button"
                          aria-label={`Resize column ${String(column.header)}`}
                          className={`${classNames.resizer} bg-transparent border-none p-0`}
                          onMouseDown={(e) =>
                            startResizing(String(column.accessorKey), e)
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
                    onClick={() => onRowClick?.(item)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && onRowClick) {
                        e.preventDefault();
                        onRowClick(item);
                      }
                    }}
                    tabIndex={onRowClick ? 0 : -1}
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
          classNames={classNames.pagination ?? {}}
          localization={
            localization.pagination ?? defaultLocalization.pagination
          }
        />
      )}
    </div>
  );
}

export default Table;
