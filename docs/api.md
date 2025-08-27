# API Reference

## Table Component

The main `Table` component is the core of the library. It provides a headless, type-safe interface for building data tables.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `readonly T[]` | **required** | Array of data objects to display |
| `columns` | `readonly ColumnDef<T>[]` | **required** | Column definition objects |
| `getRowId` | `(row: T) => string \| number` | `(row) => row.id` | Function to get unique row ID |
| `loading` | `boolean` | `false` | Shows skeleton loader when true |
| `searchValue` | `string` | `""` | Client-side search filter |
| `persistenceKey` | `string` | `undefined` | Key for localStorage persistence |
| `disableInternalProcessing` | `boolean` | `false` | Disables sorting/filtering/pagination |
| `classNames` | `Partial<TableClassNames>` | `{}` | CSS class overrides |
| `localization` | `Partial<Localization>` | `{}` | Text labels for i18n |
| `enableRowSelection` | `boolean \| ((row: T) => boolean)` | `false` | Enables row selection |
| `paginationMode` | `"auto" \| "manual" \| "off"` | `"auto"` | Pagination behavior |

### Column Definition

```typescript
interface ColumnDef<T> {
  accessorKey: keyof T | "actions" | "select";
  header: string | (() => ReactNode);
  cell?: (row: T) => ReactNode;
  enableSorting?: boolean;
  enableResizing?: boolean;
  size?: number;
}
```

### Type Constraints

The library uses strict TypeScript with a `CellValue` type system:

```typescript
type DataValue = string | number | boolean | Date | null | undefined;
type CellValue = DataValue | readonly DataValue[];
```

All data objects must extend `Record<string, CellValue>` for type safety.

## Hooks

### useRowSelection

Manages row selection state with persistence support.

```typescript
const rowSelection = useRowSelection({
  controlledSelection,
  onSelectionChange,
  persistenceKey,
  data
});
```

### useTableSort

Manages sorting state with persistence support.

```typescript
const { sortState, handleSort } = useTableSort({
  controlledSortState,
  onSortChange,
  persistenceKey
});
```

### useInternalState

Internal hook for state management with localStorage persistence.

```typescript
const [state, setState] = useInternalState(initialValue, persistenceKey);
```

## Utility Functions

### sanitizeString

Sanitizes strings to prevent XSS attacks:

```typescript
const safe = sanitizeString("<script>alert('xss')</script>");
// Result: "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;"
```

### formatDate

Formats Date objects into readable strings:

```typescript
const formatted = formatDate(new Date(), true); // Include time
```

### mergeDeep

Deep merges objects for configuration:

```typescript
const merged = mergeDeep(defaults, overrides);
```

## Components

### ActionDropdown

Dropdown component for row actions:

```typescript
<ActionDropdown
  item={row}
  actions={[
    { label: "Edit", onClick: (item) => edit(item) },
    { label: "Delete", onClick: (item) => delete(item), disabled: !canDelete }
  ]}
/>
```

### ChipDisplay

Displays arrays as chips with expansion:

```typescript
<ChipDisplay
  items={["tag1", "tag2", "tag3"]}
  maxVisibleItems={2}
/>
```

### ExpandableText

Text component with show more/less functionality:

```typescript
<ExpandableText
  text="Very long text content..."
  maxLength={100}
/>
```

### Pagination

Pagination controls:

```typescript
<Pagination
  page={1}
  totalPages={10}
  onPageChange={setPage}
  localization={paginationLabels}
/>
```

## Styling

### Class Name Structure

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

### CSS Variables

The library uses CSS custom properties for theming:

```css
:root {
  --table-border-color: #e5e7eb;
  --table-header-bg: #f9fafb;
  --table-row-hover: #f3f4f6;
  --table-selected-bg: #dbeafe;
}
```

## Accessibility

The library follows WCAG 2.1 AA guidelines:

- Full keyboard navigation support
- Proper ARIA labels and roles
- Screen reader compatibility
- Focus management
- High contrast support

## Performance

- Bundle size: < 20kB gzipped
- Tree-shaking support
- Optimized re-rendering with memoization
- Efficient sorting/filtering algorithms
- Virtual scrolling ready (via `renderBody`)

## Browser Support

- Chrome/Edge: 88+
- Firefox: 78+
- Safari: 14+
- Mobile browsers with ES2020 support

