import type { ReactNode } from "react";

/** Defines the structure for a single column in the table. */
export interface ColumnDef<T> {
  /** The key in your data object to get the cell value from. Use a unique string like 'actions' or 'select' for non-data columns. */
  accessorKey: keyof T | "actions" | "select";
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
export interface TableProps<T> {
  /** Required. The array of data objects to display. */
  data: T[];
  /** Required. An array of column definition objects that configure the table's columns. */
  columns: ColumnDef<T>[];
  /** A function that returns a unique ID for each row. Important for features like selection and for React's keying. Defaults to using `row.id`. */
  getRowId?: (row: T) => string | number;

  // --- Core Features ---
  /** If `true`, displays a skeleton loader instead of the table. Useful while data is fetching. */
  loading?: boolean;
  /** A search string to filter data client-side. The table will only show rows where at least one cell contains the search string. */
  searchValue?: string;
  /** If provided, persists table state (like sorting and row selection) to browser storage. Use a unique key for each table instance. */
  persistenceKey?: string;
  /** If `true`, disables all internal sorting, filtering, and pagination. Use this when you are handling these operations on a server. */
  disableInternalProcessing?: boolean;

  // --- Styling & Customization ---
  /** An object of class strings to style every part of the table. Essential for applying themes or utility classes like Tailwind. */
  classNames?: TableClassNames;
  /** An object to override the default text labels for internationalization (i18n) or custom wording. */
  localization?: Partial<Localization>;

  // --- Advanced Rendering ---
  /** A function to render a completely custom `<tr>` element, overriding all default cell rendering for that row. */
  renderRow?: (row: T, index: number) => ReactNode;
  /** A function to take over rendering of the entire `<tbody>` content. Essential for implementing virtualization (virtual scrolling). */
  renderBody?: (rows: T[]) => ReactNode;
  /** A fallback function to format cell values if a specific `cell` renderer is not provided in the `ColumnDef`. */
  formatValue?: (value: any, key: keyof T, item: T) => ReactNode;

  // --- Interactivity ---
  /** A callback function triggered when a row is clicked. */
  onRowClick?: (item: T) => void;
  /** If `true`, enables column resizing for all columns that don't explicitly disable it. */
  enableColumnResizing?: boolean;

  // --- Sorting ---
  /** A controlled sort state object `{ key, direction }`. Use this if you want to manage sorting state outside the table. */
  sortState?: SortState<T>;
  /** A callback that fires when the sort state changes. Use with `sortState` for controlled sorting. */
  onSortChange?: (state: SortState<T>) => void;

  // --- Pagination ---
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

  // --- Row Selection ---
  /** If `true`, enables row selection via checkboxes. Can also be a function `(row: T) => boolean` to disable selection for specific rows. */
  enableRowSelection?: boolean | ((row: T) => boolean);
  /** A controlled state object for row selection, mapping row IDs to a boolean `selected` state. */
  rowSelection?: Record<string | number, boolean>;
  /** Callback that fires when the row selection changes. Use with `rowSelection` for a controlled component. */
  onRowSelectionChange?: (selection: Record<string | number, boolean>) => void;

  // --- Edge Cases ---
  /** Custom props for the "No Content" component shown when the table is empty, such as a custom icon. */
  noContentProps?: NoContentProps;
}

// --- Sub-component and State Types ---

/** Represents the sorting state of the table. */
export interface SortState<T> {
  /** The key of the data object the table is sorted by. `null` if not sorted. */
  key: keyof T | null;
  /** The direction of the sort. */
  direction: "asc" | "desc";
}

/** Represents the public API of the `useRowSelection` hook. */
export interface RowSelectionState {
  /** An object mapping row IDs to their selected status (e.g., `{ 'row-1': true }`). */
  selectedRowIds: Record<string | number, boolean>;
  /** A function to toggle the selection state of a single row by its ID. */
  toggleRow: (id: string | number) => void;
  /** A function to toggle the selection state of all visible/passed rows. Can be forced to a specific state with the `value` argument. */
  toggleAllRows: (ids: (string | number)[], value?: boolean) => void;
  /** A utility function that returns `true` if all provided row IDs are selected. */
  isAllSelected: (ids: (string | number)[]) => boolean;
  /** A utility function that returns `true` if some, but not all, of the provided row IDs are selected. Useful for an indeterminate checkbox state. */
  isSomeSelected: (ids: (string | number)[]) => boolean;
}

/** Defines the localizable strings used within the component. */
export interface Localization {
  /** Strings related to the Pagination component. */
  pagination: {
    /** The label for the "Previous" page button. */
    previous: string;
    /** The label for the "Next" page button. */
    next: string;
    /** A function that returns the "Page X of Y" string. */
    pageInfo: (page: number, totalPages: number) => string;
  };
  /** Strings related to the NoContent component. */
  noContent: {
    /** The default text shown when no data is available. */
    text: string;
    /** The text shown when a search filter yields no results. */
    searchFilterText: (searchValue: string) => string;
  };
}

/** Defines the class names for styling the ActionDropdown component. */
export interface ActionDropdownClassNames {
  /** The class for the main container `div`. */
  container?: string;
  /** The class for the trigger `<button>` element. */
  button?: string;
  /** The class for the SVG icon inside the button. */
  icon?: string;
  /** The class for the dropdown menu `div` that appears. */
  menu?: string;
  /** The class for each clickable `<button>` item inside the menu. */
  item?: string;
}

/** Defines the class names for styling the main table structure. */
export interface TableClassNames {
  /** The class for the main wrapper `div` around the table. */
  container?: string;
  /** The class for the `<table>` element. */
  table?: string;
  /** The class for the `<thead>` element. */
  thead?: string;
  /** The class for table header cells (`<th>`). */
  th?: string;
  /** The class for the `<tbody>` element. */
  tbody?: string;
  /** The class for table rows (`<tr>`). */
  tr?: string;
  /** The class for table cells (`<td>`). */
  td?: string;
  /** The class for the column resizer handle `div`. */
  resizer?: string;
  /** An object containing class names for the Pagination component. */
  pagination?: PaginationClassNames;
  /** An object containing class names for the ActionDropdown component. */
  actionDropdown?: ActionDropdownClassNames;
}

/** Defines the class names for styling the Pagination component. */
export interface PaginationClassNames {
  /** The class for the main navigation container. */
  container?: string;
  /** The class for the "Previous" and "Next" buttons. */
  button?: string;
  /** The class applied to buttons when they are disabled. */
  buttonDisabled?: string;
  /** The class for the "Page X of Y" text element. */
  pageInfo?: string;
}

/** Defines the props for the NoContent component. */
export interface NoContentProps {
  /** Overrides the default text displayed. */
  text?: string;
  /** A React node (e.g., an SVG) to display above the text. */
  icon?: ReactNode;
}
