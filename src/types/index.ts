import type { ReactNode } from "react";

type ReservedKeys = "actions" | "select";

export type DataValue = string | number | boolean | Date | null | undefined;
export type CellValue = DataValue | readonly DataValue[];

/** Defines the structure for a single column in the table. */
export interface ColumnDef<T extends Record<string, CellValue>> {
  /** The key in your data object to get the cell value from. Use a unique string like 'actions' or 'select' for non-data columns. */
  accessorKey: keyof T | ReservedKeys;
  /** The content to display in the column header (`<th>`). Can be a string or a function returning a React node for custom headers. */
  header: string | (() => ReactNode);
  /** A function to render custom content or a React component in the table cell (`<td>`). Takes precedence over any default formatting. */
  cell?: (row: T) => ReactNode;
  /** If `true`, this column header becomes clickable to trigger sorting. */
  enableSorting?: boolean;
  /** If `true` (and the table's `enableColumnResizing` is on), this column can be resized. Defaults to `true` if table resizing is enabled. */
  enableResizing?: boolean;
  /** The initial width of the column in pixels. Defaults to 150. */
  size?: number;
}

/** Props for the main `<Table />` component. */
export interface TableProps<T extends Record<string, CellValue>> {
  /** Required. The array of data objects to display. */
  data: readonly T[];
  /** Required. An array of column definition objects that configure the table's columns. */
  columns: readonly ColumnDef<T>[];
  /** A function that returns a unique ID for each row. Important for features like selection and for React's keying. Defaults to using `row.id`. */
  getRowId?: (row: T) => string | number;
  /** If `true`, displays a skeleton loader instead of the table. Useful while data is fetching. */
  loading?: boolean;
  /** A search string to filter data client-side. The table will only show rows where at least one cell contains the search string. */
  searchValue?: string;
  /** If provided, persists table state (like sorting and row selection) to browser storage. Use a unique key for each table instance. */
  persistenceKey?: string;
  /** If `true`, disables all internal sorting, filtering, and pagination. Use this when you are handling these operations on a server. */
  disableInternalProcessing?: boolean;
  /** An object of class strings to style every part of the table. Essential for applying themes or utility classes like Tailwind. */
  classNames?: Partial<TableClassNames>;
  /** An object to override the default text labels for internationalization (i18n) or custom wording. */
  localization?: Partial<Localization>;
  /** A function to render a completely custom `<tr>` element, overriding all default cell rendering for that row. */
  renderRow?: (row: T, index: number) => ReactNode;
  /** A function to take over rendering of the entire `<tbody>` content. Essential for implementing virtualization (virtual scrolling). */
  renderBody?: (rows: readonly T[]) => ReactNode;
  /** A fallback function to format cell values if a specific `cell` renderer is not provided in the `ColumnDef`. */
  formatValue?: (value: CellValue, key: keyof T, item: T) => ReactNode;
  /** A callback function triggered when a row is clicked. */
  onRowClick?: (item: T) => void;
  /** If `true`, enables column resizing for all columns that don't explicitly disable it. */
  enableColumnResizing?: boolean;
  /** A controlled sort state object `{ key, direction }`. Use this if you want to manage sorting state outside the table. */
  sortState?: SortState<T>;
  /** A callback that fires when the sort state changes. Use with `sortState` for controlled sorting. */
  onSortChange?: (state: SortState<T>) => void;
  /** Determines pagination behavior. `auto`: Paginates if data length exceeds `itemsPerPage`. `manual`: For server-side pagination. `off`: Disables pagination. */
  paginationMode?: "auto" | "manual" | "off";
  /** The current page number (for controlled, `manual` pagination). */
  page?: number;
  /** The total number of pages (for controlled, `manual` pagination). */
  totalPages?: number;
  /** Callback for when the page changes (for controlled, `manual` pagination). */
  onPageChange?: (page: number) => void;
  /** The number of items to display per page when `paginationMode` is `auto`. */
  itemsPerPage?: number;
  /** If `true`, enables row selection via checkboxes. Can also be a function `(row: T) => boolean` to disable selection for specific rows. */
  enableRowSelection?: boolean | ((row: T) => boolean);
  /** A controlled state object for row selection, mapping row IDs to a boolean `selected` state. */
  rowSelection?: Readonly<Record<string | number, boolean>>;
  /** Callback that fires when the row selection changes. Use with `rowSelection` for a controlled component. */
  onRowSelectionChange?: (
    selection: Readonly<Record<string | number, boolean>>
  ) => void;
  /** Custom props for the "No Content" component shown when the table is empty, such as a custom icon. */
  noContentProps?: NoContentProps;
  /** If `true`, enables dark mode styling when the default styles are imported. */
  enableDarkMode?: boolean;
}

/** Represents the sorting state of the table. */
export interface SortState<T extends Record<string, CellValue>> {
  /** The key of the data object the table is sorted by. `null` if not sorted. */
  key: keyof T | null;
  /** The direction of the sort. */
  direction: "asc" | "desc";
}

/** Represents the public API of the `useRowSelection` hook. */
export interface RowSelectionState {
  /** An object mapping row IDs to their selected status (e.g., `{ 'row-1': true }`). */
  selectedRowIds: Readonly<Record<string | number, boolean>>;
  /** A function to toggle the selection state of a single row by its ID. */
  toggleRow: (id: string | number) => void;
  /** A function to toggle the selection state of all visible/passed rows. Can be forced to a specific state with the `value` argument. */
  toggleAllRows: (ids: readonly (string | number)[], value?: boolean) => void;
  /** A utility function that returns `true` if all provided row IDs are selected. */
  isAllSelected: (ids: readonly (string | number)[]) => boolean;
  /** A utility function that returns `true` if some, but not all, of the provided row IDs are selected. Useful for an indeterminate checkbox state. */
  isSomeSelected: (ids: readonly (string | number)[]) => boolean;
}

/** Defines the localizable strings used within the component. */
export interface Localization {
  /** Strings related to the Pagination component. */
  pagination: {
    previous: string;
    next: string;
    pageInfo: (page: number, totalPages: number) => string;
  };
  /** Strings related to the NoContent component. */
  noContent: {
    text: string;
    searchFilterText: (searchValue: string) => string;
  };
}

/** Defines the class names for styling the ChipDisplay component. */
export interface ChipDisplayClassNames {
  container?: string;
  chip?: string;
  moreButton?: string;
}

/** Defines the class names for styling the ExpandableText component. */
export interface ExpandableTextClassNames {
  toggleButton?: string;
}

/** Defines the class names for styling the ActionDropdown component. */
export interface ActionDropdownClassNames {
  container?: string;
  button?: string;
  icon?: string;
  menu?: string;
  item?: string;
}

/** Defines the class names for styling the Pagination component. */
export interface PaginationClassNames {
  container?: string;
  button?: string;
  buttonDisabled?: string;
  pageInfo?: string;
}

/** Defines the props for the NoContent component. */
export interface NoContentProps {
  text?: string;
  icon?: ReactNode;
}

/** Defines the class names for styling the main table structure. */
export interface TableClassNames {
  container?: string;
  table?: string;
  thead?: string;
  th?: string;
  tbody?: string;
  tr?: string;
  td?: string;
  resizer?: string;
  pagination?: PaginationClassNames;
  actionDropdown?: ActionDropdownClassNames;
  chip?: ChipDisplayClassNames;
  expandableText?: ExpandableTextClassNames;
}
