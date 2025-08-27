# API Reference

## Table Component

The main `Table` component provides a headless, customizable data table.

### Props

#### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `readonly T[]` | Array of data objects to display in the table |
| `columns` | `readonly ColumnDef<T>[]` | Column definitions that specify how data is rendered |

#### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `getRowId` | `(row: T) => string \| number` | `row.id` | Function to extract unique ID from each row |
| `loading` | `boolean` | `false` | Shows skeleton loader when true |
| `searchValue` | `string` | `""` | Client-side search query to filter data |
| `persistenceKey` | `string` | `undefined` | Key for persisting state in localStorage |
| `disableInternalProcessing` | `boolean` | `false` | Disables internal sorting, filtering, and pagination |
| `classNames` | `Partial<TableClassNames>` | `{}` | CSS class overrides for styling |
| `localization` | `Partial<Localization>` | `{}` | Text localization overrides |

#### Rendering Props

| Prop | Type | Description |
|------|------|-------------|
| `renderRow` | `(item: T, index: number) => React.ReactNode` | Custom row renderer |
| `renderBody` | `(rows: T[]) => React.ReactNode` | Custom table body renderer (for virtualization) |
| `formatValue` | `(value: CellValue, key: keyof T, item: T) => React.ReactNode` | Global cell value formatter |

#### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onRowClick` | `(item: T) => void` | Callback when a row is clicked |

#### Column Resizing

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableColumnResizing` | `boolean` | `false` | Enables interactive column resizing |

#### Sorting

| Prop | Type | Description |
|------|------|-------------|
| `sortState` | `SortState<T>` | Controlled sort state |
| `onSortChange` | `(state: SortState<T>) => void` | Callback when sort state changes |

#### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `paginationMode` | `"auto" \| "manual" \| "off"` | `"auto"` | Pagination behavior |
| `itemsPerPage` | `number` | `20` | Items per page (auto mode) |
| `page` | `number` | `undefined` | Current page (manual mode) |
| `totalPages` | `number` | `undefined` | Total pages (manual mode) |
| `onPageChange` | `(page: number) => void` | `undefined` | Page change callback (manual mode) |

#### Row Selection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableRowSelection` | `boolean \| ((row: T) => boolean)` | `false` | Enables row selection |
| `rowSelection` | `Readonly<Record<string \| number, boolean>>` | `undefined` | Controlled selection state |
| `onRowSelectionChange` | `(selection: Readonly<Record<string \| number, boolean>>) => void` | `undefined` | Selection change callback |

#### No Content

| Prop | Type | Description |
|------|------|-------------|
| `noContentProps` | `NoContentProps` | Props for the no content component |

## ColumnDef Interface

Defines how a column should be rendered and behave.

```typescript
interface ColumnDef<T extends Record<string, CellValue>> {
  /** The key to access data from each row object */
  accessorKey: keyof T | 'select' | 'actions';
  
  /** Header content (string or React component) */
  header: string | (() => React.ReactNode);
  
  /** Custom cell renderer */
  cell?: (row: T) => React.ReactNode;
  
  /** Whether this column can be sorted */
  enableSorting?: boolean;
  
  /** Whether this column can be resized */
  enableResizing?: boolean;
  
  /** Initial column width in pixels */
  size?: number;
}
```

### Special Column Types

#### Selection Column
```typescript
{
  accessorKey: 'select',
  header: '',
  size: 50
}
```

#### Actions Column
```typescript
{
  accessorKey: 'actions',
  header: 'Actions',
  cell: (row) => <ActionDropdown actions={[...]} />
}
```

## Type Definitions

### CellValue
```typescript
type CellValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | readonly string[] 
  | null 
  | undefined;
```

### SortState
```typescript
interface SortState<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}
```

### TableClassNames
```typescript
interface TableClassNames {
  container?: string;
  table?: string;
  thead?: string;
  th?: string;
  tbody?: string;
  tr?: string;
  td?: string;
  resizer?: string;
  pagination?: PaginationClassNames;
  expandableText?: ExpandableTextClassNames;
  chip?: ChipDisplayClassNames;
}
```

### Localization
```typescript
interface Localization {
  pagination?: {
    previous?: string;
    next?: string;
    pageInfo?: (page: number, totalPages: number) => string;
  };
  noContent?: {
    text?: string;
    searchFilterText?: (searchValue: string) => string;
  };
}
```

## ActionDropdown Component

A headless dropdown menu component for row actions.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `actions` | `readonly Action<T>[]` | Array of action definitions |
| `classNames` | `ActionDropdownClassNames` | CSS class overrides |

### Action Interface

```typescript
interface Action<T> {
  /** Display label for the action */
  label: string;
  
  /** Click handler that receives the row data */
  onClick: (item: T) => void;
  
  /** Whether the action is disabled */
  disabled?: boolean;
}
```

### Usage Example

```typescript
<ActionDropdown
  actions={[
    {
      label: 'Edit',
      onClick: (user) => handleEdit(user.id),
    },
    {
      label: 'Delete',
      onClick: (user) => handleDelete(user.id),
      disabled: !user.canDelete,
    },
  ]}
/>
```

## ChipDisplay Component

Displays an array of strings as chips with overflow handling.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `readonly string[]` | **Required** | Array of strings to display |
| `maxVisibleItems` | `number` | `3` | Maximum chips to show before "show more" |
| `classNames` | `ChipDisplayClassNames` | `{}` | CSS class overrides |

## ExpandableText Component

Displays text that can be expanded/collapsed if it exceeds a certain length.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **Required** | Text content to display |
| `maxLength` | `number` | `50` | Maximum characters before truncation |
| `classNames` | `ExpandableTextClassNames` | `{}` | CSS class overrides |

## Hooks

### useTableSort

Manages table sorting state with optional persistence.

```typescript
function useTableSort<T>(props: UseTableSortProps<T>): {
  sortState: SortState<T>;
  handleSort: (key: keyof T) => void;
}
```

### useRowSelection

Manages row selection state with optional persistence.

```typescript
function useRowSelection(props: UseRowSelectionProps): RowSelectionState
```

### useInternalState

Manages state with optional localStorage persistence.

```typescript
function useInternalState<T>(
  initialValue: T,
  persistenceKey?: string
): [T, (value: T | ((prev: T) => T)) => void]
```

## Utility Functions

### sanitizeString
```typescript
function sanitizeString(str: string): string
```
Sanitizes string input to prevent XSS attacks by escaping HTML entities.

### formatDate
```typescript
function formatDate(date: Date): string
```
Formats a Date object into a localized string representation.

### isDateString
```typescript
function isDateString(value: string): boolean
```
Checks if a string represents a valid date.

### mergeDeep
```typescript
function mergeDeep<T extends Record<string, unknown>>(
  target: T, 
  source: Partial<T>
): T
```
Deep merges two objects, with source overriding target properties.

## Performance Considerations

### Large Datasets

For datasets larger than 1000 rows, consider:

1. **Server-side processing**: Use `paginationMode="manual"` and `disableInternalProcessing={true}`
2. **Virtualization**: Use the `renderBody` prop with a virtualization library
3. **Memoization**: Wrap your data and columns in `useMemo`

### Optimization Example

```typescript
const optimizedColumns = useMemo(() => [
  { accessorKey: 'name', header: 'Name' },
  // ... other columns
], []);

const optimizedData = useMemo(() => 
  expensiveDataProcessing(rawData), 
  [rawData]
);

<Table 
  data={optimizedData}
  columns={optimizedColumns}
  disableInternalProcessing={true}
/>
```

## Accessibility

The table implements WCAG 2.1 AA compliance:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Logical tab order and focus indicators
- **Semantic HTML**: Uses proper table markup

### ARIA Attributes

- `role="grid"` on the table
- `role="columnheader"` on header cells
- `aria-sort` indicates column sort state
- `aria-selected` on selectable rows
- `aria-label` on interactive elements

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | ≥ 91 |
| Firefox | ≥ 90 |
| Safari | ≥ 14 |
| Edge | ≥ 91 |

## Bundle Size

| Import | Size (gzipped) |
|--------|----------------|
| Full library | < 20kB |
| Table only | ~15kB |
| Utils only | ~2kB |