[![npm](https://img.shields.io/npm/v/flowers-nextjs-table)](https://www.npmjs.com/package/flowers-nextjs-table)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/flowers-nextjs-table)](https://bundlephobia.com/package/flowers-nextjs-table)
[![license](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

# flowers-nextjs-table

A truly headless, highly performant, and type-safe table component for Next.js and React, designed for rapid development without sacrificing customization.

---

## Why This Table? 🤔

This library strikes a deliberate balance between the raw power of table _engines_ (like TanStack Table) and the ease of fully-styled component libraries.

- **Truly Headless by Default**: Ships with zero styles. Use the `classNames` prop to apply your Tailwind CSS classes and make the table a seamless part of your existing design system.
- **Optional Pre-built Styles**: For those who want to get started instantly, a clean, optional stylesheet is provided that is also dark-mode aware.
- **Superior Developer Experience**: A fully-typed API built with TypeScript. The `ColumnDef` pattern makes defining columns intuitive, safe, and powerful.
- **Feature-Rich & Performant**: Includes client-side sorting/filtering, pagination, state persistence, column resizing, row selection, and full accessibility (ARIA) support.
- **Extensible Architecture**: Built from the ground up to support advanced use cases like server-side data operations and high-performance virtualization.

---

## Installation

```bash
npm install flowers-nextjs-table
# or
yarn add flowers-nextjs-table
# or
pnpm add flowers-nextjs-table
```

**Prerequisites:**

- React 18+
- React DOM 18+
- Tailwind CSS (Recommended for styling)

---

## Quick Start

This library is a **Client Component** (`"use client"`). The quickest way to get started is by defining your columns, providing data, and importing the optional pre-built styles.

```tsx
// src/app/my-table-page.tsx
"use client";

import { Table } from "flowers-nextjs-table";
import type { ColumnDef } from "flowers-nextjs-table";
import "flowers-nextjs-table"; // Optional: includes default styling

// 1. Define your data type
type User = {
  id: number;
  name: string;
  role: "Admin" | "User";
};

// 2. Create your column definitions
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Full Name",
    enableSorting: true, // This column is now sortable
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

const data: User[] = [
  { id: 1, name: "Alice Johnson", role: "Admin" },
  { id: 2, name: "Bob Williams", role: "User" },
];

// 3. Render the component
export default function MyTablePage() {
  return (
    <div className="p-4">
      <Table<User> data={data} columns={columns} />
    </div>
  );
}
```

---

## Features & Recipes

### Headless Styling

For full control, skip the optional stylesheet and use the `classNames` prop to apply your own classes (e.g., Tailwind CSS).

```tsx
<Table
  data={data}
  columns={columns}
  classNames={{
    container: "rounded-lg border border-gray-200",
    table: "w-full text-sm",
    thead: "bg-gray-50",
    th: "p-3 font-medium text-left",
    tr: "hover:bg-gray-50",
    td: "p-3 border-t border-gray-200",
    resizer: "w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize",
    pagination: {
      container: "p-3 border-t",
      button: "px-3 py-1 border rounded-md hover:bg-gray-100",
      pageInfo: "text-sm text-gray-600",
    },
  }}
/>
```

### Row Selection

To enable row selection, set `enableRowSelection={true}` and add a special column with `accessorKey: 'select'`. The library will automatically render the checkboxes and handle the logic.

```tsx
import { Table, ColumnDef } from "flowers-nextjs-table";

// Add the selection column to your definitions
const selectionColumn: ColumnDef<User> = {
  accessorKey: "select",
  header: "", // The header checkbox is rendered automatically
  size: 50, // A smaller size for the checkbox column
};

const myColumns = [selectionColumn, ...otherColumns];

// Render the table
<Table
  columns={myColumns}
  data={data}
  enableRowSelection={true}
  getRowId={(row) => row.id} // Important for selection
  // Optionally control the selection state
  // rowSelection={mySelectionState}
  // onRowSelectionChange={setMySelectionState}
/>;
```

### Custom Cells & Action Columns

Use the `cell` renderer for custom components like status badges or action buttons. The library exports a headless `ActionDropdown` component for your convenience.

```tsx
import { Table, ActionDropdown, ColumnDef } from "flowers-nextjs-table";

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (row) => (
      <ActionDropdown
        item={row}
        actions={[
          { label: "Edit", onClick: (item) => console.log("Editing:", item) },
          {
            label: "Delete",
            onClick: (item) => console.log("Deleting:", item),
          },
        ]}
      />
    ),
  },
];
```

### Column Resizing

Enable column resizing by setting `enableColumnResizing={true}`. You can prevent specific columns from being resizable in their `ColumnDef`.

```tsx
<Table columns={columns} data={data} enableColumnResizing={true} />;

// Example column that cannot be resized
const nonResizableColumn: ColumnDef<User> = {
  accessorKey: "id",
  header: "ID",
  enableResizing: false,
};
```

### State Persistence

Persist user preferences like sorting and row selection across sessions with a single prop.

```tsx
<Table
  data={data}
  columns={columns}
  persistenceKey="unique-key-for-my-user-table"
/>
```

### Internationalization (i18n)

Customize all built-in text labels using the `localization` prop.

```tsx
<Table
  data={data}
  columns={columns}
  localization={{
    pagination: {
      previous: "Anterior",
      next: "Siguiente",
      pageInfo: (page, total) => `Página ${page} de ${total}`,
    },
    noContent: {
      text: "No hay datos disponibles",
    },
  }}
/>
```

---

## Performance & Virtualization

### Performance Caveat

By default, this library renders all rows in the current page to the DOM. This is highly performant for hundreds of rows but is **not suitable for rendering thousands of rows at once**. For very large datasets, you must use virtualization (virtual scrolling).

### Virtualization Recipe

This library is architected to fully support virtualization via the `renderBody` prop. This allows you to integrate a library like **TanStack Virtual** to render only the visible rows.

**Conceptual Example:**

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function MyVirtualizedTable({ data, columns }) {
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Estimate height of a row in pixels
  });

  return (
    <div ref={parentRef} style={{ height: "500px", overflow: "auto" }}>
      <Table
        data={data}
        columns={columns}
        // Take over rendering of the table body
        renderBody={(rows) => (
          <tbody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const row = rows[virtualItem.index];
              return (
                <tr
                  key={row.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {/* ... Your logic to render cells for this 'row' ... */}
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

---

## Accessibility

The table implements ARIA roles to ensure it is accessible to screen readers and keyboard users.

- **Roles**: The table uses `role="grid"`, with `role="row"`, `role="columnheader"`, and `role="gridcell"`.
- **Sorting**: Sorted columns are marked with `aria-sort`.
- **Selection**: Checkboxes include `aria-label` and rows are marked with `aria-selected`.
- **Interactivity**: All interactive elements (sort buttons, checkboxes, dropdowns) are focusable and can be operated with a keyboard.

---

## Comparison with Other Libraries ⚖️

This library was built to fill a specific niche. Here’s how it compares to the industry-standard TanStack Table.

| Aspect                  | `flowers-nextjs-table` (This Library)                                                                     | TanStack Table                                                                                           |
| :---------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Core Philosophy**     | **A complete component, ready to be styled.**                                                             | **A headless engine, ready to be built upon.**                                                           |
| **"Headless" Approach** | **Component-Headless:** Renders the `<table>` markup for you; you provide `classNames`.                   | **Engine-Headless:** Gives you data models; you render all the markup.                                   |
| **Setup & Speed**       | **🚀 Very Fast.** Get a feature-rich table working in minutes.                                            | **🐢 Slower.** Requires a steeper learning curve and more boilerplate.                                   |
| **Built-in Features**   | **"Batteries-Included":** State persistence, i18n props, column resizing, and row selection are built-in. | **"Bring Your Own Batteries":** Provides only the core logic. You must implement most features yourself. |
| **Target Audience**     | Developers in the **React/Next.js ecosystem** who value **rapid development**.                            | Developers who need **absolute, granular control** for enterprise design systems.                        |

> **In short:** Choose this library when you want the fastest path to a powerful, customizable table that feels native to your Next.js + Tailwind project.

---

## API Reference

### `<Table />` Props

A comprehensive list of all available props for the main `<Table />` component.

| Prop                        | Type                                | Default  | Description                                                            |
| :-------------------------- | :---------------------------------- | :------- | :--------------------------------------------------------------------- |
| `data`                      | `T[]`                               | -        | **Required.** The array of data objects.                               |
| `columns`                   | `ColumnDef<T>[]`                    | -        | **Required.** The column definition objects.                           |
| `getRowId`                  | `(row: T) => string \| number`      | `row.id` | A function to get a unique ID for each row.                            |
| `loading`                   | `boolean`                           | `false`  | If `true`, displays a skeleton loader.                                 |
| `searchValue`               | `string`                            | `""`     | A string to filter data client-side.                                   |
| `persistenceKey`            | `string`                            | -        | If provided, persists state to browser storage.                        |
| `disableInternalProcessing` | `boolean`                           | `false`  | If `true`, disables internal sorting, filtering, etc.                  |
| `classNames`                | `TableClassNames`                   | `{}`     | An object of class strings for headless styling.                       |
| `localization`              | `Partial<Localization>`             | `{}`     | An object to override default text labels for i18n.                    |
| `renderBody`                | `(rows: T[]) => ReactNode`          | -        | A function to take over rendering of the `<tbody>` for virtualization. |
| `enableColumnResizing`      | `boolean`                           | `false`  | If `true`, enables column resizing.                                    |
| `sortState`                 | `SortState<T>`                      | -        | A controlled sort state object `{ key, direction }`.                   |
| `onSortChange`              | `(state: SortState<T>) => void`     | -        | Callback for when sort state changes.                                  |
| `paginationMode`            | `'auto' \| 'manual' \| 'off'`       | `'auto'` | Determines pagination behavior.                                        |
| `itemsPerPage`              | `number`                            | `20`     | The number of items per page in `auto` mode.                           |
| `page`, `totalPages`        | `number`                            | -        | Controlled state for `manual` pagination.                              |
| `onPageChange`              | `(page: number) => void`            | -        | Callback for page changes in `manual` pagination.                      |
| `enableRowSelection`        | `boolean \| ((row: T) => boolean)`  | `false`  | If `true`, enables row selection.                                      |
| `rowSelection`              | `Record<string \| number, boolean>` | -        | A controlled state object for row selection.                           |
| `onRowSelectionChange`      | `(selection) => void`               | -        | Callback for when row selection changes.                               |
| `noContentProps`            | `NoContentProps`                    | `{}`     | Custom props for the "No Content" component.                           |
| `renderRow`                 | `(item, index) => ReactNode`        | -        | Renders a completely custom `<tr>` element.                            |
| `onRowClick`                | `(item: T) => void`                 | -        | Callback for when a `<tr>` is clicked.                                 |
| `formatValue`               | `(val, key, item) => ReactNode`     | -        | A fallback function to format cell values.                             |

### `ColumnDef<T>` Object

The configuration object for a single column.

| Key              | Type                               | Default | Description                                                             |
| :--------------- | :--------------------------------- | :------ | :---------------------------------------------------------------------- |
| `accessorKey`    | `keyof T \| 'actions' \| 'select'` | -       | **Required.** The key in your data object or a special key.             |
| `header`         | `string \| () => ReactNode`        | -       | **Required.** The content for the column header (`<th>`).               |
| `cell`           | `(row: T) => ReactNode`            | -       | A function to render custom content in the table cell (`<td>`).         |
| `enableSorting`  | `boolean`                          | `false` | If `true`, this column header is clickable to trigger sorting.          |
| `enableResizing` | `boolean`                          | `true`  | If `false`, this column cannot be resized even if table resizing is on. |
| `size`           | `number`                           | `150`   | The initial width of the column in pixels.                              |

---

## Migrating from `nextjs-reusable-table`?

This package is the modern, type-safe, and fully headless successor to [`nextjs-reusable-table`](https://www.npmjs.com/package/nextjs-reusable-table).

If you're upgrading from the legacy package, see our [Migration Guide](MIGRATION.md) for tips and a step-by-step walkthrough.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## Versioning

We use [Semantic Versioning](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ninsau/flowers-nextjs-table/tags).

To bump the version, update the `version` field in `package.json` and follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Acknowledgments

- Inspired by common data table patterns in React and Next.js applications.
- Thanks to all contributors and users for their support.

---
