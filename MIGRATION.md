# Migration Guide: `nextjs-reusable-table` to `@flowers/nextjs-table`

Welcome to the new, modern version of the table library! We're excited for you to use the new features and enjoy a superior developer experience.

This guide will walk you through the process of upgrading from the legacy `nextjs-reusable-table` (v4.x and below) to the new headless, type-safe `@flowers/nextjs-table`.

## Why Migrate?

The new version is a complete rewrite focused on modern best practices:

- **Truly Headless by Default**: No more fighting with default styles. The component now seamlessly inherits your Tailwind theme.
- **Superior Type-Safety**: The new `ColumnDef` API ensures your column definitions are strongly typed and robust.
- **More Powerful Features**: Includes row selection, column resizing, state persistence, virtualization support, and internationalization out of the box.
- **Cleaner, More Explicit API**: Prop names are clearer and more consistent, making the component easier to reason about.

## Key Breaking Changes

1.  **Package Name**: The package has been renamed from `nextjs-reusable-table` to `@flowers/nextjs-table`.
2.  **Component Name**: The main component is now `<Table />` instead of `<TableComponent />`.
3.  **Column Definition**: The biggest change. Instead of separate `columns` and `props` arrays, you now use a single `columns` prop with an array of `ColumnDef` objects.
4.  **Styling API**: `disableDefaultStyles` and `customClassNames` have been removed in favor of a single, more powerful `classNames` prop.
5.  **Actions API**: The `actions`, `actionTexts`, and `actionFunctions` props have been removed. You now create a dedicated action column with a custom `cell` renderer.

---

## Step-by-Step Migration Guide

### Step 1: Update Package & Imports

First, uninstall the old package and install the new one.

```bash
npm uninstall nextjs-reusable-table
npm install @flowers/nextjs-table
```

Next, update your import statements.

**Before:**

```tsx
import { TableComponent } from "nextjs-reusable-table";
```

**After:**

```tsx
import { Table } from "@flowers/nextjs-table";
// Also import types you'll need
import type { ColumnDef } from "@flowers/nextjs-table";
```

### Step 2: Component Name

Simply rename the component in your JSX.

**Before:**

```tsx
<TableComponent<User>
// ...props
/>
```

**After:**

```tsx
<Table<User>
// ...props
/>
```

### Step 3: Migrating Columns (Most Important)

This is the core change. The old, parallel arrays for `columns` and `props` have been replaced by a single, unified `columns` array of objects.

**Before:**

```tsx
<TableComponent<User>
  columns={["ID", "Full Name"]}
  data={data}
  props={["id", "name"]}
/>
```

**After:**

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Full Name",
  },
];

<Table<User> columns={columns} data={data} />;
```

### Step 4: Migrating Sorting

The `sortableProps` array is gone. You now enable sorting directly within the column definition.

**Before:**

```tsx
<TableComponent<User>
  columns={["Name", "Email"]}
  props={["name", "email"]}
  sortableProps={["name"]}
/>
```

**After:**

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true, // Enable sorting here
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
];

<Table<User>
  columns={columns}
  // The onSort prop still works for controlled sorting, but is now onSortChange
  // onSort={handleSort} -> onSortChange={setSortState}
/>;
```

### Step 5: Migrating Styling

The `disableDefaultStyles` prop is removed because the library is now headless by default. The `customClassNames` prop is renamed to `classNames` for simplicity.

**Before:**

```tsx
<TableComponent
  disableDefaultStyles={true}
  customClassNames={{
    table: "my-table",
    // ...other classes
  }}
/>
```

**After:**

```tsx
<Table
  classNames={{
    table: "my-table",
    // ...other classes
  }}
/>
```

### Step 6: Migrating Actions

The old `actions`, `actionTexts`, and `actionFunctions` props are removed. Now, you create a dedicated action column and use the exported `ActionDropdown` component. This gives you much more control.

**Before:**

```tsx
<TableComponent
  actions
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[editItem, deleteItem]}
/>
```

**After:**

```tsx
import { Table, ActionDropdown, ColumnDef } from "@flowers/nextjs-table";

const columns: ColumnDef<User>[] = [
  // ...other columns
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (row) => (
      <ActionDropdown
        item={row}
        actions={[
          { label: "Edit", onClick: editItem },
          { label: "Delete", onClick: deleteItem },
        ]}
      />
    ),
  },
];

<Table<User> columns={columns} data={data} />;
```

### Step 7: Migrating Custom Formatters

The old `formatValue` and `formatHeader` props have been integrated directly into the `ColumnDef` for better co-location of logic.

- `formatHeader` is now just a render function for the `header` property.
- `formatValue` is now the more powerful `cell` renderer.

**Before:**

```tsx
<TableComponent
  formatValue={(value, prop) => {
    if (prop === "active") return value ? "Active" : "Inactive";
    return value;
  }}
  formatHeader={(header) => <span className="font-bold">{header}</span>}
/>
```

**After:**

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    // Replaces formatHeader
    header: () => <span className="font-bold">Name</span>,
  },
  {
    accessorKey: "active",
    header: "Status",
    // Replaces formatValue
    cell: (row) => (row.active ? "Active" : "Inactive"),
  },
];
```

## Welcome to the New Features!

After migrating, you now have access to powerful new features that were not available in the legacy version. We encourage you to explore them:

- **Row Selection**: `enableRowSelection={true}`
- **Column Resizing**: `enableColumnResizing={true}`
- **State Persistence**: `persistenceKey="my-table-state"`
- **Virtualization**: Use the `renderBody` prop.
- **Internationalization**: Use the `localization` prop.

If you encounter any issues during migration, please don't hesitate to [open an issue](https://github.com/ninsau/nextjs-reusable-table/issues) on GitHub. Thank you for using `@flowers/nextjs-table`!
