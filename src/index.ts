// Main components
export { default as Table } from "./components/Table";
export { default as ActionDropdown } from "./components/ActionDropdown";
export { default as ChipDisplay } from "./components/ChipDisplay";
export { default as ExpandableText } from "./components/ExpandableText";
export { default as NoContent } from "./components/NoContent";
export { default as Pagination } from "./components/Pagination";
export { default as TableSkeleton } from "./components/TableSkeleton";

// Utility functions for advanced use cases
export {
  sanitizeString,
  formatDate,
  isDateString,
  mergeTableConfig,
  createColumn,
  createColumns,
} from "./utils";

// Hooks for custom implementations
export { useRowSelection } from "./hooks/useRowSelection";
export { useTableSort } from "./hooks/useTableSort";
export { useInternalState } from "./hooks/useInternalState";

// Export types for consumers
export * from "./types";

// Re-export React types that consumers might need
export type {
  ReactNode,
  CSSProperties,
  MouseEvent,
  KeyboardEvent,
} from "react";
