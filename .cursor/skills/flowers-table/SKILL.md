---
name: flowers-table
description: Use when building data tables with flowers-nextjs-table. Provides API reference, column definitions, pagination patterns, styling guidance, and troubleshooting for the headless React/Next.js table component.
license: ISC
compatibility: React 18+, React 19+, Next.js 13-16, TypeScript 5+
---

# flowers-nextjs-table

Headless, performant, type-safe table component for React and Next.js. Zero built-in styles — all styling via `classNames` prop. WCAG 2.1 AA accessible. XSS-safe.

## Installation

```bash
npm install flowers-nextjs-table
```

Optional default styles:
```tsx
import 'flowers-nextjs-table/styles';
```

## Quick Start

```tsx
"use client";
import { Table, type ColumnDef } from 'flowers-nextjs-table';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'email', header: 'Email' },
];

export default function UsersTable() {
  return <Table data={users} columns={columns} />;
}
```

## Table Props Reference

### Required

| Prop | Type |
|------|------|
| `data` | `readonly T[]` |
| `columns` | `readonly ColumnDef<T>[]` |

### Optional

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `getRowId` | `(row: T) => string \| number` | `row.id` | Unique row identifier |
| `loading` | `boolean` | `false` | Show skeleton loader |
| `searchValue` | `string` | `""` | Client-side text filter |
| `persistenceKey` | `string` | — | Persist state to localStorage |
| `disableInternalProcessing` | `boolean` | `false` | Server-side mode: skip internal sort/filter/paginate |
| `classNames` | `Partial<TableClassNames>` | BEM defaults | Style every element |
| `localization` | `Partial<Localization>` | English | i18n text overrides |
| `renderRow` | `(row: T, index: number) => ReactNode` | — | Custom row renderer |
| `renderBody` | `(rows: readonly T[]) => ReactNode` | — | Custom tbody (for virtualization) |
| `formatValue` | `(value, key, item) => ReactNode` | — | Global cell formatter |
| `onRowClick` | `(item: T) => void` | — | Row click handler |
| `enableColumnResizing` | `boolean` | `false` | Drag-to-resize columns |
| `sortState` | `SortState<T>` | — | Controlled sort |
| `onSortChange` | `(state: SortState<T>) => void` | — | Sort change callback |
| `paginationMode` | `'auto' \| 'manual' \| 'off'` | `'auto'` | Pagination strategy |
| `page` | `number` | — | Current page (manual mode) |
| `totalPages` | `number` | — | Total pages (manual mode) |
| `onPageChange` | `(page: number) => void` | — | Page change callback |
| `itemsPerPage` | `number` | `20` | Rows per page (auto mode) |
| `enableRowSelection` | `boolean \| (row: T) => boolean` | `false` | Checkbox selection |
| `rowSelection` | `Record<string \| number, boolean>` | — | Controlled selection state |
| `onRowSelectionChange` | `(selection) => void` | — | Selection change callback |
| `noContentProps` | `NoContentProps` | — | Custom empty state |
| `enableDarkMode` | `boolean` | `false` | Dark mode (requires default styles) |
| `showPageNumbers` | `boolean` | `false` | Show page number buttons |

## ColumnDef Interface

```tsx
interface ColumnDef<T> {
  accessorKey: keyof T | 'actions' | 'select';
  header: string | (() => ReactNode);
  cell?: (row: T) => ReactNode;
  enableSorting?: boolean;
  enableResizing?: boolean;
  size?: number; // Default: 150px
}
```

### Column Patterns

**Basic columns:**
```tsx
const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'email', header: 'Email' },
];
```

**Custom cell rendering:**
```tsx
{
  accessorKey: 'price',
  header: 'Price',
  cell: (product) => <span>${product.price.toFixed(2)}</span>,
}
```

**Actions column:**
```tsx
import { ActionDropdown } from 'flowers-nextjs-table';

{
  accessorKey: 'actions',
  header: 'Actions',
  cell: (item) => (
    <ActionDropdown
      item={item}
      actions={[
        { label: 'Edit', onClick: (item) => handleEdit(item) },
        { label: 'Delete', onClick: (item) => handleDelete(item) },
      ]}
    />
  ),
}
```

**Selection column:**
```tsx
{ accessorKey: 'select', header: 'Select' }
// Then enable on <Table>: enableRowSelection={true}
```

## Pagination Modes

### Auto (client-side, default)
All data is provided upfront. Table handles filtering, sorting, paging internally.
```tsx
<Table data={allData} columns={columns} itemsPerPage={25} />
```

### Manual (server-side)
Parent manages page state. Table renders what it receives.
```tsx
<Table
  data={pageData}
  columns={columns}
  paginationMode="manual"
  disableInternalProcessing={true}
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  sortState={sortState}
  onSortChange={setSortState}
/>
```

### Off
```tsx
<Table data={data} columns={columns} paginationMode="off" />
```

## Styling

The library is headless. Pass class strings via the `classNames` prop:

```tsx
<Table
  classNames={{
    container: 'bg-white rounded-lg shadow',
    table: 'min-w-full divide-y divide-gray-200',
    thead: 'bg-gray-50',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
    tbody: 'bg-white divide-y divide-gray-200',
    tr: 'hover:bg-gray-50',
    td: 'px-6 py-4 whitespace-nowrap text-sm',
    resizer: 'w-1 bg-gray-300 cursor-col-resize',
    pagination: {
      container: 'flex items-center justify-between px-4 py-3 border-t',
      button: 'px-4 py-2 text-sm border rounded-md hover:bg-gray-50',
      buttonDisabled: 'px-4 py-2 text-sm text-gray-400 cursor-not-allowed',
      pageInfo: 'text-sm text-gray-700',
    },
  }}
/>
```

Or use default styles with optional dark mode:
```tsx
import 'flowers-nextjs-table/styles';
<Table data={data} columns={columns} enableDarkMode={true} />
```

## Exported Hooks

| Hook | Purpose |
|------|---------|
| `useTableSort` | Sort state management (controlled/uncontrolled) |
| `useRowSelection` | Row selection with toggle/toggleAll/isAllSelected |
| `useInternalState` | localStorage-backed state persistence |

## Exported Components

| Component | Purpose |
|-----------|---------|
| `Table` | Main table component |
| `ActionDropdown` | Row actions menu |
| `ChipDisplay` | Render arrays as chips/tags |
| `ExpandableText` | Truncate long text with expand toggle |
| `Pagination` | Standalone pagination controls |
| `NoContent` | Empty state display |
| `TableSkeleton` | Loading skeleton |

## Exported Utilities

| Function | Purpose |
|----------|---------|
| `sanitizeString(str)` | XSS protection for manual HTML |
| `formatDate(date, includeTime?)` | Date formatting |
| `isDateString(value)` | Date string detection |
| `createColumn<T>(def)` | Type-safe column helper |
| `createColumns<T>(defs)` | Type-safe columns helper |
| `mergeTableConfig(target, source)` | Deep merge config objects |

## Key Types

```tsx
import type {
  ColumnDef,
  TableProps,
  SortState,
  RowSelectionState,
  TableClassNames,
  PaginationClassNames,
  ActionDropdownClassNames,
  ChipDisplayClassNames,
  ExpandableTextClassNames,
  Localization,
  NoContentProps,
  CellValue,
  DataValue,
} from 'flowers-nextjs-table';
```

## Common Gotchas

1. **"actions" column type error** — Use `accessorKey: 'actions' as const`
2. **Pagination not showing** — In auto mode, `data.length` must exceed `itemsPerPage` (default 20)
3. **Sorting not working** — Set `enableSorting: true` on the column AND ensure `disableInternalProcessing` is `false` (or provide `sortState`/`onSortChange` for manual)
4. **Selection resets on page change** — Use `persistenceKey` or manage `rowSelection` externally
5. **Styles not applying** — Either import `flowers-nextjs-table/styles` or provide `classNames`. If using Tailwind, add `'./node_modules/flowers-nextjs-table/**/*.{js,ts,jsx,tsx}'` to `content`
6. **Dark mode not working** — Requires importing default styles AND `enableDarkMode={true}`
7. **Server-side table** — Must set BOTH `paginationMode="manual"` AND `disableInternalProcessing={true}`

## SSR / Next.js App Router

The Table component uses `"use client"`. In the App Router, import it in a client component:

```tsx
// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  const users = await fetchUsers();
  return <ClientTable initialData={users} />;
}

// components/ClientTable.tsx (Client Component)
'use client';
import { Table } from 'flowers-nextjs-table';
export function ClientTable({ initialData }) {
  return <Table data={initialData} columns={columns} />;
}
```

## Full Documentation

- [API.md](../../API.md) — Complete API reference with all examples
- [MIGRATION.md](../../MIGRATION.md) — Migration from other table libraries
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — Development setup and contribution guide
