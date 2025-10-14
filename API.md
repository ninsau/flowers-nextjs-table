# 📚 Flowers Next.js Table - Complete API Reference

> **Comprehensive API documentation for the production-ready, headless table component**

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Table Component](#table-component)
  - [Props Reference](#props-reference)
  - [Examples](#table-examples)
- [Pagination System](#pagination-system)
  - [Auto Pagination](#auto-pagination)
  - [Manual Pagination](#manual-pagination)
  - [Flow Diagrams](#pagination-flow-diagrams)
- [Column Definitions](#column-definitions)
- [TypeScript Types](#typescript-types)
- [Hooks](#hooks)
  - [useTableSort](#usetablesort)
  - [useRowSelection](#userowselection)
  - [useInternalState](#useinternalstate)
- [Components](#components)
  - [ActionDropdown](#actiondropdown)
  - [ChipDisplay](#chipdisplay)
  - [ExpandableText](#expandabletext)
  - [Pagination](#pagination-component)
  - [NoContent](#nocontent)
  - [TableSkeleton](#tableskeleton)
- [Utility Functions](#utility-functions)
- [Styling System](#styling-system)
- [Performance Optimization](#performance-optimization)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
npm install flowers-nextjs-table
```

```tsx
"use client";
import { Table, type ColumnDef } from 'flowers-nextjs-table';
import 'flowers-nextjs-table/styles';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'email', header: 'Email' },
];

export default function MyTable() {
  return <Table data={users} columns={columns} />;
}
```

---

## Table Component

The main `<Table />` component is the core of the library, providing a fully-featured data table with sorting, filtering, pagination, and row selection.

### Props Reference

#### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `readonly T[]` | Array of data objects to display. Each object represents a row. |
| `columns` | `readonly ColumnDef<T>[]` | Column definitions that specify how data is accessed and rendered. |

#### Optional Props

##### Data Management

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `getRowId` | `(row: T) => string \| number` | `(row) => row.id` | Function to extract a unique identifier from each row. Used for selection and React keys. |
| `loading` | `boolean` | `false` | Shows a skeleton loader when `true`. Hides the table until data is ready. |
| `searchValue` | `string` | `""` | Client-side search query. Filters rows where any cell contains this value (case-insensitive). |
| `disableInternalProcessing` | `boolean` | `false` | Disables all internal sorting, filtering, and pagination. Use for server-side processing. |

##### Rendering & Formatting

| Prop | Type | Description |
|------|------|-------------|
| `renderRow` | `(row: T, index: number) => ReactNode` | Custom row renderer. Completely overrides default row rendering. |
| `renderBody` | `(rows: readonly T[]) => ReactNode` | Custom table body renderer. Use for virtual scrolling implementations. |
| `formatValue` | `(value: CellValue, key: keyof T, item: T) => ReactNode` | Global cell value formatter. Applied when no column-specific `cell` renderer exists. |

##### Styling

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `classNames` | `Partial<TableClassNames>` | `{}` | CSS class names for all table elements. See [Styling System](#styling-system). |
| `enableDarkMode` | `boolean` | `false` | Enables dark mode styling when default styles are imported. |

##### Interaction

| Prop | Type | Description |
|------|------|-------------|
| `onRowClick` | `(item: T) => void` | Callback fired when a row is clicked. Enables keyboard navigation (Enter/Space). |

##### Column Resizing

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableColumnResizing` | `boolean` | `false` | Enables interactive column resizing. Users can drag column borders. |

##### Sorting

| Prop | Type | Description |
|------|------|-------------|
| `sortState` | `SortState<T>` | Controlled sort state `{ key, direction }`. Use with `onSortChange` for external control. |
| `onSortChange` | `(state: SortState<T>) => void` | Callback fired when sort state changes. Use for controlled sorting. |

##### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `paginationMode` | `"auto" \| "manual" \| "off"` | `"auto"` | **auto**: Client-side pagination. **manual**: Server-side pagination. **off**: No pagination. |
| `itemsPerPage` | `number` | `20` | Number of items per page (auto mode only). |
| `page` | `number` | `1` | Current page number (manual mode, controlled). |
| `totalPages` | `number` | - | Total number of pages (manual mode, controlled). |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes (manual mode). |
| `showPageNumbers` | `boolean` | `false` | Shows clickable page numbers in pagination UI. |

##### Row Selection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableRowSelection` | `boolean \| ((row: T) => boolean)` | `false` | Enables row selection. Pass function to selectively disable rows. |
| `rowSelection` | `Readonly<Record<string \| number, boolean>>` | `{}` | Controlled selection state mapping row IDs to boolean. |
| `onRowSelectionChange` | `(selection: Record<string \| number, boolean>) => void` | - | Callback when selection changes. Use for controlled selection. |

##### State Persistence

| Prop | Type | Description |
|------|------|-------------|
| `persistenceKey` | `string` | Unique key for persisting state (sort, selection) to localStorage. |

##### Localization

| Prop | Type | Description |
|------|------|-------------|
| `localization` | `Partial<Localization>` | Text overrides for i18n. Customize pagination labels, empty states, etc. |

##### Empty States

| Prop | Type | Description |
|------|------|-------------|
| `noContentProps` | `NoContentProps` | Props for the empty state component (`text`, `icon`). |

### Table Examples

#### Basic Table with Sorting

```tsx
"use client";
import { Table, type ColumnDef } from 'flowers-nextjs-table';
import 'flowers-nextjs-table/styles';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const columns: ColumnDef<Product>[] = [
  { 
    accessorKey: 'name', 
    header: 'Product Name', 
    enableSorting: true 
  },
  { 
    accessorKey: 'price', 
    header: 'Price', 
    enableSorting: true,
    cell: (product) => `$${product.price.toFixed(2)}`
  },
  { 
    accessorKey: 'stock', 
    header: 'Stock' 
  },
];

export default function ProductTable() {
  return <Table data={products} columns={columns} />;
}
```

#### Table with Search and Row Selection

```tsx
"use client";
import { useState } from 'react';
import { Table, type ColumnDef } from 'flowers-nextjs-table';
import 'flowers-nextjs-table/styles';

export default function SelectableTable() {
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<Record<string, boolean>>({});

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'select', header: '', size: 50 },
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'email', header: 'Email' },
  ];

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <Table
        data={users}
        columns={columns}
        searchValue={search}
        enableRowSelection={true}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
      />
      <p>{Object.keys(selection).length} items selected</p>
    </div>
  );
}
```

#### Table with Custom Cell Rendering

```tsx
const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'Employee',
    cell: (employee) => (
      <div className="flex items-center gap-3">
        <img 
          src={employee.avatar} 
          alt={employee.name}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <div className="font-medium">{employee.name}</div>
          <div className="text-sm text-gray-500">{employee.role}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    enableSorting: true,
    cell: (employee) => (
      <span className="font-mono text-green-600">
        ${employee.salary.toLocaleString()}
      </span>
    ),
  },
];
```

---

## Pagination System

The table supports three pagination modes: **auto** (client-side), **manual** (server-side), and **off** (disabled).

### Auto Pagination

Client-side pagination that automatically splits data into pages.

**When to use:**
- Small to medium datasets (< 10,000 rows)
- All data available client-side
- No server-side processing needed

**Example:**

```tsx
<Table
  data={products}
  columns={columns}
  paginationMode="auto"      // Default
  itemsPerPage={25}          // 25 items per page
  showPageNumbers={true}     // Show page number buttons
/>
```

**How it works:**
1. Table receives full dataset
2. Applies search/filter (if `searchValue` provided)
3. Applies sorting (if enabled)
4. Splits result into pages of `itemsPerPage`
5. Renders only current page

### Manual Pagination

Server-side pagination for large datasets or API-driven tables.

**When to use:**
- Large datasets (> 10,000 rows)
- Data fetched from API/database
- Server-side filtering/sorting

**Example:**

```tsx
"use client";
import { useState, useEffect } from 'react';
import { Table, type SortState } from 'flowers-nextjs-table';

export default function ServerTable() {
  const [data, setData] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortState, setSortState] = useState<SortState<User>>({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        sortBy: sortState.key || '',
        sortOrder: sortState.direction,
      });

      const response = await fetch(`/api/users?${params}`);
      const result = await response.json();
      
      setData(result.items);
      setTotalPages(result.totalPages);
      setLoading(false);
    }

    fetchData();
  }, [page, sortState]);

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      paginationMode="manual"
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      sortState={sortState}
      onSortChange={setSortState}
      disableInternalProcessing={true}
    />
  );
}
```

### Pagination Flow Diagrams

#### Auto Pagination Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Auto Pagination Flow                      │
└─────────────────────────────────────────────────────────────┘

User provides data                    Table Component
      │                                      │
      ├──── data={allItems} ────────────────>│
      │                                      │
      │                                      ▼
      │                           ┌──────────────────┐
      │                           │  Apply Search    │
      │                           │  (if searchValue)│
      │                           └────────┬─────────┘
      │                                    │
      │                                    ▼
      │                           ┌──────────────────┐
      │                           │  Apply Sorting   │
      │                           │  (if sortState)  │
      │                           └────────┬─────────┘
      │                                    │
      │                                    ▼
      │                           ┌──────────────────┐
      │                           │  Calculate Pages │
      │                           │  totalPages =    │
      │                           │  ceil(filtered   │
      │                           │  .length/perPage)│
      │                           └────────┬─────────┘
      │                                    │
      │                                    ▼
      │                           ┌──────────────────┐
      │                           │  Slice Data      │
      │                           │  [start:end]     │
      │                           │  based on page   │
      │                           └────────┬─────────┘
      │                                    │
      │                                    ▼
      │                           ┌──────────────────┐
      │                           │  Render Visible  │
      │                           │  Rows Only       │
      │                           └──────────────────┘
      │
User clicks "Next"
      │
      ├──── onPageChange(page+1) ────────>│
      │                                    │
      │                                    ▼
      │                         (Re-render with new page)

State: Managed internally by Table component
Performance: O(n) for search/sort, O(1) for pagination
```

#### Manual Pagination Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Manual Pagination Flow                     │
└─────────────────────────────────────────────────────────────┘

Parent Component              Table Component           Server/API
      │                              │                       │
      ├── Initial State ─────────────┤                       │
      │   page={1}                   │                       │
      │   totalPages={10}            │                       │
      │                              │                       │
      │                              ▼                       │
      │                     ┌──────────────┐                 │
      │                     │ Render Page 1│                 │
      │                     │ data (20 rows)│                │
      │                     └──────────────┘                 │
      │                              │                       │
User clicks "Next"                   │                       │
      │                              │                       │
      │<── onPageChange(2) ──────────┤                       │
      │                              │                       │
      ▼                              │                       │
┌──────────────┐                     │                       │
│ setPage(2)   │                     │                       │
│ Trigger      │                     │                       │
│ useEffect    │                     │                       │
└──────┬───────┘                     │                       │
       │                             │                       │
       ├── Fetch Data ───────────────┼──────────────────────>│
       │   GET /api/data?            │                       │
       │   page=2&pageSize=20        │                       │
       │                             │                       │
       │                             │    ┌──────────────┐   │
       │                             │    │ Query DB     │   │
       │                             │    │ LIMIT 20     │   │
       │                             │    │ OFFSET 20    │   │
       │                             │    └──────┬───────┘   │
       │                             │           │           │
       │<────── Response ────────────┼───────────┤           │
       │   { items: [...],           │                       │
       │     total: 200,             │                       │
       │     totalPages: 10 }        │                       │
       │                             │                       │
       ▼                             │                       │
┌──────────────┐                     │                       │
│ setData(items)│                    │                       │
│ setTotalPages │                    │                       │
│ (10)         │                     │                       │
└──────┬───────┘                     │                       │
       │                             │                       │
       ├── Re-render with ───────────>                       │
       │   new data                  │                       │
       │   page={2}                  │                       │
       │   totalPages={10}           │                       │
       │                             ▼                       │
       │                    ┌──────────────┐                 │
       │                    │ Render Page 2│                 │
       │                    │ (new 20 rows)│                 │
       │                    └──────────────┘                 │

State: Managed by parent component
Table: Only renders provided data
Performance: Depends on server query optimization
```

#### Pagination State Management

```
┌─────────────────────────────────────────────────────┐
│           Pagination State Transitions              │
└─────────────────────────────────────────────────────┘

Auto Mode (paginationMode="auto"):

    ┌─────────────────┐
    │  Initial Render │
    │  page = 1       │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │  Internal State Management  │
    │  - internalPage state       │
    │  - Calculate totalPages     │
    │  - Slice data automatically │
    └────────┬────────────────────┘
             │
             ▼
    User clicks Next/Previous
             │
             ▼
    ┌─────────────────────────────┐
    │  setInternalPage(newPage)   │
    │  Auto re-render with slice  │
    └─────────────────────────────┘


Manual Mode (paginationMode="manual"):

    ┌─────────────────┐
    │  Initial Render │
    │  page={1}       │
    │  totalPages={N} │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │  Controlled State           │
    │  - Parent manages page      │
    │  - Parent manages totalPages│
    │  - Table just displays      │
    └────────┬────────────────────┘
             │
             ▼
    User clicks Next/Previous
             │
             ▼
    ┌─────────────────────────────┐
    │  onPageChange(newPage)      │
    │  Callback to parent         │
    └────────┬────────────────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │  Parent updates:            │
    │  setPage(newPage)           │
    │  Fetch new data from server │
    │  Re-render table            │
    └─────────────────────────────┘
```

---

## Column Definitions

Columns define how data is accessed, displayed, and behaves in the table.

### ColumnDef Interface

```typescript
interface ColumnDef<T extends Record<string, CellValue>> {
  accessorKey: keyof T | 'select' | 'actions';
  header: string | (() => ReactNode);
  cell?: (row: T) => ReactNode;
  enableSorting?: boolean;
  enableResizing?: boolean;
  size?: number;
}
```

### Property Details

#### `accessorKey` (required)

The key to access data from each row object. Special reserved keys:
- `'select'`: Renders a checkbox column for row selection
- `'actions'`: Typically used for action menus/buttons

```tsx
// Regular data column
{ accessorKey: 'name', header: 'Name' }

// Selection column
{ accessorKey: 'select', header: '', size: 50 }

// Actions column
{ accessorKey: 'actions', header: 'Actions' }
```

#### `header` (required)

Column header content. Can be a string or function returning React element.

```tsx
// String header
{ accessorKey: 'name', header: 'Full Name' }

// Function header (custom component)
{
  accessorKey: 'price',
  header: () => (
    <div className="flex items-center gap-2">
      <DollarIcon />
      <span>Price</span>
    </div>
  )
}
```

#### `cell` (optional)

Custom cell renderer. Overrides default cell formatting.

```tsx
{
  accessorKey: 'status',
  header: 'Status',
  cell: (row) => (
    <span className={`badge ${row.status === 'active' ? 'green' : 'gray'}`}>
      {row.status}
    </span>
  )
}
```

#### `enableSorting` (optional)

Enables sorting for this column. Default: `false`.

```tsx
{ 
  accessorKey: 'createdAt', 
  header: 'Created', 
  enableSorting: true 
}
```

#### `enableResizing` (optional)

Enables column resizing (if table-level `enableColumnResizing` is `true`). Default: `true`.

```tsx
{ 
  accessorKey: 'description', 
  header: 'Description',
  enableResizing: true,
  size: 300  // Initial width
}
```

#### `size` (optional)

Initial column width in pixels. Default: `150`.

```tsx
{ accessorKey: 'id', header: 'ID', size: 80 }
{ accessorKey: 'description', header: 'Description', size: 400 }
```

### Special Column Types

#### Selection Column

Add a selection checkbox column:

```tsx
const columns: ColumnDef<User>[] = [
  { accessorKey: 'select', header: '', size: 50 },
  // ... other columns
];

<Table
  data={users}
  columns={columns}
  enableRowSelection={true}
/>
```

#### Actions Column

Add action buttons/menus:

```tsx
import { ActionDropdown } from 'flowers-nextjs-table';

const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: (user) => (
      <ActionDropdown
        item={user}
        actions={[
          { label: 'Edit', onClick: (u) => handleEdit(u) },
          { label: 'Delete', onClick: (u) => handleDelete(u) },
        ]}
      />
    ),
  },
];
```

### Column Examples

#### Dynamic Status Badge

```tsx
{
  accessorKey: 'status',
  header: 'Status',
  enableSorting: true,
  cell: (order) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
        {order.status.toUpperCase()}
      </span>
    );
  }
}
```

#### Currency Formatting

```tsx
{
  accessorKey: 'price',
  header: 'Price',
  enableSorting: true,
  cell: (product) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price)
}
```

#### Date with Relative Time

```tsx
{
  accessorKey: 'createdAt',
  header: 'Created',
  enableSorting: true,
  cell: (item) => {
    const date = new Date(item.createdAt);
    const relative = formatDistanceToNow(date, { addSuffix: true });
    
    return (
      <div>
        <div>{date.toLocaleDateString()}</div>
        <div className="text-xs text-gray-500">{relative}</div>
      </div>
    );
  }
}
```

---

## TypeScript Types

### Core Types

#### CellValue

The base type for all cell values in the table.

```typescript
type DataValue = string | number | boolean | Date | null | undefined;
type CellValue = DataValue | readonly DataValue[];
```

**Supported types:**
- Primitives: `string`, `number`, `boolean`
- Temporal: `Date`
- Nullable: `null`, `undefined`
- Arrays: `readonly DataValue[]` (rendered as chips)

#### SortState

Represents the sorting state of the table.

```typescript
interface SortState<T extends Record<string, CellValue>> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}
```

**Example:**
```typescript
const sortState: SortState<User> = {
  key: 'name',
  direction: 'asc'
};
```

#### RowSelectionState

The return type of `useRowSelection` hook.

```typescript
interface RowSelectionState {
  selectedRowIds: Readonly<Record<string | number, boolean>>;
  toggleRow: (id: string | number) => void;
  toggleAllRows: (ids: readonly (string | number)[], value?: boolean) => void;
  isAllSelected: (ids: readonly (string | number)[]) => boolean;
  isSomeSelected: (ids: readonly (string | number)[]) => boolean;
}
```

### Styling Types

#### TableClassNames

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
  actionDropdown?: ActionDropdownClassNames;
  chip?: ChipDisplayClassNames;
  expandableText?: ExpandableTextClassNames;
}
```

#### PaginationClassNames

```typescript
interface PaginationClassNames {
  container?: string;
  button?: string;
  buttonDisabled?: string;
  pageButton?: string;
  activePageButton?: string;
  pageInfo?: string;
}
```

### Localization Type

```typescript
interface Localization {
  pagination: {
    previous: string;
    next: string;
    pageInfo: (page: number, totalPages: number) => string;
  };
  noContent: {
    text: string;
    searchFilterText: (searchValue: string) => string;
  };
}
```

**Example:**
```typescript
const spanishLocalization: Partial<Localization> = {
  pagination: {
    previous: 'Anterior',
    next: 'Siguiente',
    pageInfo: (page, total) => `Página ${page} de ${total}`,
  },
  noContent: {
    text: 'No hay datos disponibles',
    searchFilterText: (search) => `Sin resultados para "${search}"`,
  },
};
```

---

## Hooks

### useTableSort

Manages table sorting state with optional persistence.

**Signature:**
```typescript
function useTableSort<T extends Record<string, CellValue>>(props: {
  controlledSortState?: SortState<T>;
  onSortChange?: (state: SortState<T>) => void;
  persistenceKey?: string;
}): {
  sortState: SortState<T>;
  handleSort: (key: keyof T) => void;
}
```

**Uncontrolled Example:**
```typescript
import { useTableSort } from 'flowers-nextjs-table';

function MyTable() {
  const { sortState, handleSort } = useTableSort<User>({});

  return (
    <Table
      data={users}
      columns={columns}
      sortState={sortState}
      onSortChange={(state) => handleSort(state.key)}
    />
  );
}
```

**Controlled with Persistence:**
```typescript
const { sortState, handleSort } = useTableSort<Product>({
  persistenceKey: 'product-table'  // Saves to localStorage
});
```

### useRowSelection

Manages row selection state with helper methods.

**Signature:**
```typescript
function useRowSelection(props: {
  controlledSelection?: Readonly<Record<string | number, boolean>>;
  onSelectionChange?: (selection: Record<string | number, boolean>) => void;
  persistenceKey?: string;
}): RowSelectionState
```

**Example:**
```typescript
import { useRowSelection } from 'flowers-nextjs-table';

function SelectableTable() {
  const rowSelection = useRowSelection({
    persistenceKey: 'my-table-selection'
  });

  const selectedCount = Object.values(rowSelection.selectedRowIds)
    .filter(Boolean).length;

  return (
    <div>
      <p>{selectedCount} rows selected</p>
      <Table
        data={data}
        columns={columns}
        enableRowSelection={true}
        rowSelection={rowSelection.selectedRowIds}
        onRowSelectionChange={(sel) => {
          // Custom logic here
          rowSelection.toggleAllRows(Object.keys(sel));
        }}
      />
      <button onClick={() => rowSelection.toggleAllRows(data.map(d => d.id), false)}>
        Clear Selection
      </button>
    </div>
  );
}
```

**Methods:**

- `toggleRow(id)`: Toggle single row selection
- `toggleAllRows(ids, value?)`: Toggle multiple rows (optional force value)
- `isAllSelected(ids)`: Check if all provided IDs are selected
- `isSomeSelected(ids)`: Check if some (but not all) IDs are selected

### useInternalState

Internal state management with localStorage persistence.

**Signature:**
```typescript
function useInternalState<T>(
  initialValue: T,
  persistenceKey?: string
): [T, (value: T | ((prev: T) => T)) => void]
```

**Example:**
```typescript
import { useInternalState } from 'flowers-nextjs-table';

function MyComponent() {
  const [filters, setFilters] = useInternalState(
    { status: 'all', category: '' },
    'my-filters'  // Persists to localStorage
  );

  return (
    <div>
      <select 
        value={filters.status} 
        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
      </select>
    </div>
  );
}
```

---

## Components

### ActionDropdown

A headless dropdown menu for row-level actions.

**Props:**
```typescript
interface ActionDropdownProps<T> {
  item: T;
  actions: readonly Action<T>[];
  classNames?: ActionDropdownClassNames;
}

interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  disabled?: boolean;
}
```

**Example:**
```tsx
import { ActionDropdown } from 'flowers-nextjs-table';

<ActionDropdown
  item={user}
  actions={[
    {
      label: 'Edit Profile',
      onClick: (user) => router.push(`/users/${user.id}/edit`),
    },
    {
      label: 'Send Email',
      onClick: (user) => openEmailModal(user.email),
    },
    {
      label: 'Delete',
      onClick: (user) => handleDelete(user.id),
      disabled: !user.canDelete,
    },
  ]}
  classNames={{
    button: 'p-2 hover:bg-gray-100 rounded',
    menu: 'bg-white shadow-lg rounded-lg border',
    item: 'px-4 py-2 hover:bg-gray-50 text-sm',
  }}
/>
```

### ChipDisplay

Displays an array of strings as chips with overflow handling.

**Props:**
```typescript
interface ChipDisplayProps {
  items: readonly string[];
  maxVisibleItems?: number;  // Default: 3
  classNames?: ChipDisplayClassNames;
}
```

**Example:**
```tsx
import { ChipDisplay } from 'flowers-nextjs-table';

// Automatic usage (for array values)
const columns: ColumnDef<Product>[] = [
  { accessorKey: 'tags', header: 'Tags' }  // Auto-renders as ChipDisplay
];

// Manual usage
<ChipDisplay 
  items={['React', 'TypeScript', 'Next.js', 'TailwindCSS']} 
  maxVisibleItems={2}
  classNames={{
    chip: 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs',
    moreButton: 'text-blue-600 text-xs cursor-pointer',
  }}
/>
// Renders: [React] [TypeScript] +2 more
```

### ExpandableText

Displays text with expand/collapse for long content.

**Props:**
```typescript
interface ExpandableTextProps {
  text: string;
  maxLength?: number;  // Default: 50
  classNames?: ExpandableTextClassNames;
}
```

**Example:**
```tsx
import { ExpandableText } from 'flowers-nextjs-table';

// Automatic usage (for string values)
const columns: ColumnDef<Post>[] = [
  { accessorKey: 'content', header: 'Content' }  // Auto-uses ExpandableText
];

// Manual usage
<ExpandableText 
  text="This is a very long text that will be truncated..."
  maxLength={100}
  classNames={{
    toggleButton: 'text-blue-600 hover:underline text-sm',
  }}
/>
```

### Pagination Component

The pagination UI component (used internally by Table).

**Props:**
```typescript
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  classNames?: PaginationClassNames;
  localization: Localization['pagination'];
  showPageNumbers: boolean;
}
```

**Standalone Example:**
```tsx
import { Pagination } from 'flowers-nextjs-table';

<Pagination
  page={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
  showPageNumbers={true}
  localization={{
    previous: 'Prev',
    next: 'Next',
    pageInfo: (page, total) => `${page}/${total}`,
  }}
  classNames={{
    container: 'flex items-center justify-between p-4',
    button: 'px-4 py-2 bg-blue-600 text-white rounded',
    buttonDisabled: 'px-4 py-2 bg-gray-300 text-gray-500 rounded',
  }}
/>
```

### NoContent

Empty state component shown when table has no data.

**Props:**
```typescript
interface NoContentProps {
  text?: string;
  icon?: ReactNode;
}
```

**Example:**
```tsx
import { NoContent } from 'flowers-nextjs-table';

<Table
  data={[]}
  columns={columns}
  noContentProps={{
    text: 'No products found',
    icon: <EmptyBoxIcon className="w-16 h-16 text-gray-400" />,
  }}
/>
```

### TableSkeleton

Loading skeleton shown when `loading={true}`.

**Example:**
```tsx
import { TableSkeleton } from 'flowers-nextjs-table';

// Used automatically
<Table data={data} columns={columns} loading={isLoading} />

// Or standalone
{isLoading ? <TableSkeleton /> : <Table data={data} columns={columns} />}
```

---

## Utility Functions

### sanitizeString

Sanitizes string input to prevent XSS attacks.

```typescript
function sanitizeString(str: string): string
```

**Note:** React automatically escapes JSX content. This is only needed for `dangerouslySetInnerHTML` or manual HTML construction.

```tsx
import { sanitizeString } from 'flowers-nextjs-table';

// ❌ Not needed - React handles this
<div>{userInput}</div>

// ✅ Needed for manual HTML
const html = `<div>${sanitizeString(userInput)}</div>`;
```

### formatDate

Formats a Date object into a localized string.

```typescript
function formatDate(date: Date, includeTime?: boolean): string
```

**Example:**
```tsx
import { formatDate } from 'flowers-nextjs-table';

formatDate(new Date('2025-01-15'))              // "Jan 15, 2025"
formatDate(new Date('2025-01-15'), true)        // "Jan 15, 2025, 10:30 AM"
```

### isDateString

Checks if a string is a valid date.

```typescript
function isDateString(value: string): boolean
```

**Example:**
```tsx
import { isDateString } from 'flowers-nextjs-table';

isDateString('2025-01-15')           // true
isDateString('Jan 15, 2025')         // true
isDateString('invalid-date')         // false
```

### createColumn / createColumns

Type-safe column definition helpers.

```typescript
function createColumn<T>(def: ColumnDef<T>): ColumnDef<T>
function createColumns<T>(defs: ColumnDef<T>[]): ColumnDef<T>[]
```

**Example:**
```tsx
import { createColumn, createColumns } from 'flowers-nextjs-table';

// Better type inference
const nameColumn = createColumn<User>({
  accessorKey: 'name',
  header: 'Name',
  enableSorting: true,
});

// Or for multiple columns
const columns = createColumns<User>([
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
]);
```

### mergeTableConfig

Deep merges configuration objects (classNames, localization).

```typescript
function mergeTableConfig<T>(target: T, source: Partial<T>): T
```

---

## Styling System

The table is completely headless - you control all styling via the `classNames` prop.

### Default Styles

Import pre-built styles for quick setup:

```tsx
import 'flowers-nextjs-table/styles';

<Table data={data} columns={columns} enableDarkMode={true} />
```

### Custom Styling

#### With Tailwind CSS

```tsx
<Table
  data={data}
  columns={columns}
  classNames={{
    container: 'bg-white rounded-lg shadow overflow-hidden',
    table: 'min-w-full divide-y divide-gray-200',
    thead: 'bg-gray-50',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    tbody: 'bg-white divide-y divide-gray-200',
    tr: 'hover:bg-gray-50 transition-colors',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    resizer: 'w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize',
    pagination: {
      container: 'flex items-center justify-between px-4 py-3 bg-white border-t',
      button: 'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50',
      buttonDisabled: 'px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed',
      pageInfo: 'text-sm text-gray-700',
    },
  }}
/>
```

#### With CSS Modules

```tsx
import styles from './Table.module.css';

<Table
  data={data}
  columns={columns}
  classNames={{
    container: styles.container,
    table: styles.table,
    thead: styles.thead,
    th: styles.th,
    tbody: styles.tbody,
    tr: styles.tr,
    td: styles.td,
  }}
/>
```

#### Dynamic Styles

```tsx
<Table
  data={data}
  columns={columns}
  classNames={{
    tr: (row) => row.isActive ? 'bg-green-50' : 'bg-gray-50',
    td: (row) => row.isPriority ? 'font-bold' : 'font-normal',
  }}
/>
```

---

## Performance Optimization

### Large Datasets

For tables with > 1,000 rows:

#### 1. Server-Side Processing

```tsx
<Table
  data={pagedData}
  columns={columns}
  paginationMode="manual"
  disableInternalProcessing={true}
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

#### 2. Virtual Scrolling

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualTable() {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <Table
        data={data}
        columns={columns}
        renderBody={(rows) => (
          <tbody style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr key={virtualRow.index} style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}>
                  {/* Render cells */}
                </tr>
              );
            })}
          </tbody>
        )}
      />
    </div>
  );
}
```

#### 3. Memoization

```tsx
import { useMemo } from 'react';

function OptimizedTable() {
  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ], []);

  const data = useMemo(() => 
    expensiveDataTransform(rawData),
    [rawData]
  );

  return <Table data={data} columns={columns} />;
}
```

### Bundle Size Optimization

Tree-shake unused components:

```tsx
// Import only what you need
import { Table } from 'flowers-nextjs-table';

// Instead of
import * as FlowersTable from 'flowers-nextjs-table';
```

---

## Common Patterns

### Multi-Select with Bulk Actions

```tsx
function BulkActionTable() {
  const [selection, setSelection] = useState<Record<string, boolean>>({});
  
  const selectedIds = Object.keys(selection).filter(id => selection[id]);
  const selectedItems = data.filter(item => selection[item.id]);

  const handleBulkDelete = async () => {
    await deleteItems(selectedIds);
    setSelection({});
  };

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 p-4 flex items-center justify-between">
          <span>{selectedIds.length} items selected</span>
          <div className="space-x-2">
            <button onClick={handleBulkDelete}>Delete Selected</button>
            <button onClick={() => exportItems(selectedItems)}>Export</button>
          </div>
        </div>
      )}
      
      <Table
        data={data}
        columns={columns}
        enableRowSelection={true}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
      />
    </div>
  );
}
```

### Inline Editing

```tsx
function EditableTable() {
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (product) => (
        editingId === product.id ? (
          <input
            defaultValue={product.name}
            onBlur={(e) => {
              updateProduct(product.id, { name: e.target.value });
              setEditingId(null);
            }}
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => setEditingId(product.id)}>
            {product.name}
          </span>
        )
      ),
    },
  ];

  return <Table data={products} columns={columns} />;
}
```

### Real-Time Updates

```tsx
function RealtimeTable() {
  const [data, setData] = useState<Order[]>([]);

  useEffect(() => {
    const socket = io('https://api.example.com');
    
    socket.on('order:created', (order) => {
      setData(prev => [order, ...prev]);
    });
    
    socket.on('order:updated', (order) => {
      setData(prev => prev.map(o => o.id === order.id ? order : o));
    });

    return () => socket.disconnect();
  }, []);

  return <Table data={data} columns={columns} />;
}
```

### Export Data

```tsx
function ExportableTable() {
  const exportToCSV = () => {
    const csv = [
      columns.map(c => c.header).join(','),
      ...data.map(row => 
        columns.map(c => row[c.accessorKey]).join(',')
      ),
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
  };

  return (
    <div>
      <button onClick={exportToCSV}>Export to CSV</button>
      <Table data={data} columns={columns} />
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

#### 1. TypeScript Errors with Column Keys

**Problem:**
```tsx
// Error: Type 'string' is not assignable to type 'keyof User'
const columns: ColumnDef<User>[] = [
  { accessorKey: 'actions', header: 'Actions' }
];
```

**Solution:**
```tsx
const columns: ColumnDef<User>[] = [
  { accessorKey: 'actions' as const, header: 'Actions' }
];
```

#### 2. Pagination Not Showing

**Problem:** Pagination doesn't appear even with large datasets.

**Solutions:**
```tsx
// Ensure paginationMode is not 'off'
<Table paginationMode="auto" itemsPerPage={20} />

// For auto mode, ensure data.length > itemsPerPage
data.length > 20  // Must be true
```

#### 3. Sorting Not Working

**Problem:** Clicking headers doesn't sort.

**Solutions:**
```tsx
// Ensure enableSorting is true
{ accessorKey: 'name', header: 'Name', enableSorting: true }

// Check if disableInternalProcessing is false
<Table disableInternalProcessing={false} />

// For manual sorting, provide sortState and onSortChange
<Table sortState={sortState} onSortChange={setSortState} />
```

#### 4. Row Selection Not Persisting

**Problem:** Selection resets on page change.

**Solution:**
```tsx
// Use persistenceKey to save selection
<Table
  enableRowSelection={true}
  persistenceKey="my-table"  // Saves to localStorage
/>

// Or manage selection externally
const [selection, setSelection] = useState({});
<Table
  rowSelection={selection}
  onRowSelectionChange={setSelection}
/>
```

#### 5. Performance Issues with Large Data

**Problem:** Table is slow with 10,000+ rows.

**Solutions:**
```tsx
// Use server-side pagination
<Table paginationMode="manual" disableInternalProcessing={true} />

// Implement virtual scrolling
<Table renderBody={(rows) => <VirtualizedBody rows={rows} />} />

// Memoize data and columns
const data = useMemo(() => processData(rawData), [rawData]);
const columns = useMemo(() => [...], []);
```

#### 6. Styles Not Applying

**Problem:** Custom classNames not working.

**Solutions:**
```tsx
// Ensure you're using the correct property names
classNames={{
  container: '...',  // Not 'wrapper'
  table: '...',      // Not 'tableElement'
}}

// Check Tailwind purge configuration
// tailwind.config.js
content: [
  './node_modules/flowers-nextjs-table/**/*.{js,ts,jsx,tsx}',
]

// Or import default styles
import 'flowers-nextjs-table/styles';
```

#### 7. Dark Mode Not Working

**Problem:** Dark mode doesn't apply.

**Solution:**
```tsx
// Import default styles first
import 'flowers-nextjs-table/styles';

// Then enable dark mode
<Table enableDarkMode={true} />

// Ensure Tailwind dark mode is configured
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

### Debug Checklist

- [ ] Are `data` and `columns` props provided?
- [ ] Is `data` an array of objects?
- [ ] Do column `accessorKey` values match data keys?
- [ ] Is TypeScript showing any errors?
- [ ] Are you using the latest version?
- [ ] Check browser console for warnings
- [ ] Verify `persistenceKey` is unique per table
- [ ] Check if `disableInternalProcessing` should be `false`

### Getting Help

1. **Check Examples**: Review [docs/api.md](./docs/api.md) for detailed examples
2. **GitHub Issues**: [Report bugs](https://github.com/ninsau/flowers-nextjs-table/issues)
3. **Discussions**: [Ask questions](https://github.com/ninsau/flowers-nextjs-table/discussions)
4. **TypeScript**: Enable strict mode for better error messages

---

## Advanced Topics

### Custom State Management

Integrate with Redux, Zustand, or other state libraries:

```tsx
// With Zustand
import { useTableStore } from './store';

function ZustandTable() {
  const { data, sortState, setSortState } = useTableStore();

  return (
    <Table
      data={data}
      columns={columns}
      sortState={sortState}
      onSortChange={setSortState}
    />
  );
}
```

### SSR/SSG with Next.js

```tsx
// app/users/page.tsx
export default async function UsersPage() {
  const users = await fetchUsers(); // Server-side fetch

  return (
    <ClientTable initialData={users} />
  );
}

// components/ClientTable.tsx
'use client';
function ClientTable({ initialData }) {
  return <Table data={initialData} columns={columns} />;
}
```

### Testing

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from 'flowers-nextjs-table';

test('sorts data when header is clicked', async () => {
  const user = userEvent.setup();
  
  render(<Table data={mockData} columns={mockColumns} />);
  
  const nameHeader = screen.getByText('Name');
  await user.click(nameHeader);
  
  // Assert sorted order
  const rows = screen.getAllByRole('row');
  expect(rows[1]).toHaveTextContent('Alice'); // First alphabetically
});
```

---

## Version Compatibility

| flowers-nextjs-table | React | Next.js | TypeScript |
|---------------------|-------|---------|------------|
| 1.x.x               | ≥18.0 | ≥13.0   | ≥5.0       |

---

## Migration Guide

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions from other table libraries.

---

## Related Documentation

- [Contributing Guide](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)
- [License](./LICENSE)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

---

**Last Updated:** October 2025  
**Maintainers:** [@ninsau](https://github.com/ninsau)  
**License:** ISC

