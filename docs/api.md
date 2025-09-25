# API Reference

## Table Component

The main `Table` component provides a headless, customizable data table with sorting, filtering, pagination, and more.

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
| `enableDarkMode` | `boolean` | `false` | Enables dark mode styling when default styles are imported |

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
  | null
  | undefined
  | readonly CellValue[];
```
The core data type for all table cell values. Arrays are typically rendered as chips/tags.

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

## Advanced Use Cases

### Custom Data Formatting

```typescript
import { Table, type ColumnDef, formatDate, sanitizeString } from 'flowers-nextjs-table';

interface BlogPost {
  title: string;
  content: string;
  publishedAt: Date;
  tags: string[];
  author: { name: string; avatar?: string };
}

const columns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: (post) => (
      <div>
        <h3 className="font-semibold">{sanitizeString(post.title)}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {sanitizeString(post.content)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'publishedAt',
    header: 'Published',
    cell: (post) => formatDate(post.publishedAt, true),
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: (post) => (
      <div className="flex items-center space-x-2">
        {post.author.avatar && (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-6 h-6 rounded-full"
          />
        )}
        <span>{post.author.name}</span>
      </div>
    ),
  },
  { accessorKey: 'tags', header: 'Tags' }, // Auto-renders as chips
];
```

### Advanced Sorting with Custom Comparators

```typescript
import { Table, type ColumnDef, type SortState } from 'flowers-nextjs-table';

interface Product {
  name: string;
  price: number;
  stock: number;
  category: 'electronics' | 'clothing' | 'books';
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    enableSorting: true,
    cell: (product) => `$${product.price.toFixed(2)}`,
  },
  {
    accessorKey: 'stock',
    header: 'Stock Level',
    enableSorting: true,
    cell: (product) => {
      const level = product.stock > 50 ? 'High' :
                   product.stock > 10 ? 'Medium' : 'Low';
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${
          level === 'High' ? 'bg-green-100 text-green-800' :
          level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {level}
        </span>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    enableSorting: true,
    cell: (product) => (
      <span className="capitalize">{product.category}</span>
    ),
  },
];
```

### Server-Side Processing with Real-time Updates

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Table, type ColumnDef, type SortState } from 'flowers-nextjs-table';
import 'flowers-nextjs-table/styles';

interface ServerData {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
}

function ServerTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [sortState, setSortState] = useState<SortState<User>>({
    key: null,
    direction: 'asc'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        sortBy: sortState.key || '',
        sortOrder: sortState.direction,
      });

      const response = await fetch(`/api/users?${params}`);
      const result: ServerData = await response.json();

      setData(result.items);
      setTotalItems(result.total);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, sortState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      paginationMode="manual"
      page={page}
      totalPages={Math.ceil(totalItems / 20)}
      onPageChange={setPage}
      sortState={sortState}
      onSortChange={setSortState}
      disableInternalProcessing={true}
    />
  );
}
```

### Complex Row Selection with Bulk Actions

```typescript
import { useState } from 'react';
import { Table, type ColumnDef } from 'flowers-nextjs-table';
import 'flowers-nextjs-table/styles';

interface Order {
  id: number;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}

function OrdersTable() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const selectedOrders = Object.keys(rowSelection)
    .filter(id => rowSelection[id])
    .map(id => data.find(order => order.id.toString() === id))
    .filter(Boolean);

  const handleBulkStatusUpdate = (status: Order['status']) => {
    // Update selected orders
    selectedOrders.forEach(order => {
      updateOrderStatus(order.id, status);
    });
    setRowSelection({});
  };

  const columns: ColumnDef<Order>[] = [
    { accessorKey: 'select', header: '', size: 50 },
    {
      accessorKey: 'customer',
      header: 'Customer',
      enableSorting: true,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      enableSorting: true,
      cell: (order) => `$${order.amount.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: (order) => (
        <select
          value={order.status}
          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
          className="px-2 py-1 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      enableSorting: true,
      cell: (order) => formatDate(order.createdAt),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
          <span className="font-medium">
            {selectedOrders.length} orders selected
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkStatusUpdate('processing')}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Mark Processing
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('shipped')}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            >
              Mark Shipped
            </button>
          </div>
        </div>
      )}

      <Table
        data={orders}
        columns={columns}
        enableRowSelection={true}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        enableColumnResizing={true}
        persistenceKey="orders-table"
      />
    </div>
  );
}
```

### Custom Table Body with Virtualization

```typescript
import { useState, useMemo } from 'react';
import { Table, type ColumnDef } from 'flowers-nextjs-table';

interface LargeDatasetItem {
  id: number;
  name: string;
  value: number;
  category: string;
}

function VirtualizedTable({ data }: { data: LargeDatasetItem[] }) {
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 48; // Height of each row
  const containerHeight = 400; // Visible area height
  const totalHeight = data.length * itemHeight;

  // Calculate visible range
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    data.length
  );

  const visibleItems = useMemo(() =>
    data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  const columns: ColumnDef<LargeDatasetItem>[] = [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'value', header: 'Value', enableSorting: true },
    { accessorKey: 'category', header: 'Category' },
  ];

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{ height: containerHeight }}
    >
      <Table
        data={visibleItems}
        columns={columns}
        renderBody={(rows) => (
          <tbody>
            <tr style={{ height: startIndex * itemHeight }} />
            {rows}
            <tr style={{ height: (data.length - endIndex) * itemHeight }} />
          </tbody>
        )}
        disableInternalProcessing={true}
        classNames={{
          container: 'h-full overflow-auto',
          table: 'border-collapse',
        }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      />
    </div>
  );
}
```

### Multi-Table Dashboard with Shared State

```typescript
import { useState } from 'react';
import { Table, type ColumnDef, useTableSort, useRowSelection } from 'flowers-nextjs-table';
import 'flowers-nextjs-table/styles';

interface DashboardItem {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  priority: 'high' | 'medium' | 'low';
  category: string;
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');

  // Shared hooks across multiple tables
  const sortState = useTableSort<DashboardItem>({ persistenceKey: 'dashboard-sort' });
  const rowSelection = useRowSelection({ persistenceKey: 'dashboard-selection' });

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case 'active': return data.filter(item => item.status === 'active');
      case 'inactive': return data.filter(item => item.status === 'inactive');
      default: return data;
    }
  }, [data, activeTab]);

  const columns: ColumnDef<DashboardItem>[] = [
    { accessorKey: 'select', header: '', size: 50 },
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: (item) => {
        const colors = {
          high: 'bg-red-100 text-red-800',
          medium: 'bg-yellow-100 text-yellow-800',
          low: 'bg-blue-100 text-blue-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[item.priority]}`}>
            {item.priority}
          </span>
        );
      },
    },
    { accessorKey: 'category', header: 'Category' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4">
        {[
          { key: 'all', label: 'All Items' },
          { key: 'active', label: 'Active Only' },
          { key: 'inactive', label: 'Inactive Only' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Table
        data={filteredData}
        columns={columns}
        enableRowSelection={true}
        sortState={sortState.sortState}
        onSortChange={sortState.handleSort}
        rowSelection={rowSelection.selectedRowIds}
        onRowSelectionChange={(selection) =>
          rowSelection.toggleAllRows(Object.keys(selection), false)
        }
      />

      {/* Selection Summary */}
      {Object.keys(rowSelection.selectedRowIds).length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {Object.keys(rowSelection.selectedRowIds).length} items selected
          </p>
        </div>
      )}
    </div>
  );
}
```

### Form Integration with Real-time Validation

```typescript
import { useState, useCallback } from 'react';
import { Table, type ColumnDef, sanitizeString } from 'flowers-nextjs-table';
import 'flowers-nextjs-table/styles';

interface FormData {
  name: string;
  email: string;
  age: number;
  errors: Record<string, string>;
}

function DataEntryTable() {
  const [rows, setRows] = useState<FormData[]>([
    { name: '', email: '', age: 0, errors: {} }
  ]);

  const updateRow = useCallback((index: number, field: keyof FormData, value: any) => {
    setRows(prev => prev.map((row, i) => {
      if (i !== index) return row;

      const updated = { ...row, [field]: value };

      // Real-time validation
      const errors: Record<string, string> = {};
      if (!updated.name.trim()) errors.name = 'Name is required';
      if (!updated.email.trim()) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updated.email)) {
        errors.email = 'Invalid email format';
      }
      if (updated.age < 18) errors.age = 'Must be 18 or older';

      return { ...updated, errors };
    }));
  }, []);

  const addRow = () => {
    setRows(prev => [...prev, { name: '', email: '', age: 0, errors: {} }]);
  };

  const removeRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const isValid = rows.every(row =>
    row.name.trim() && row.email.trim() && !Object.keys(row.errors).length
  );

  const columns: ColumnDef<FormData>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (row, index) => (
        <input
          type="text"
          value={row.name}
          onChange={(e) => updateRow(index, 'name', sanitizeString(e.target.value))}
          className={`px-2 py-1 border rounded ${
            row.errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter name"
        />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (row, index) => (
        <input
          type="email"
          value={row.email}
          onChange={(e) => updateRow(index, 'email', sanitizeString(e.target.value))}
          className={`px-2 py-1 border rounded ${
            row.errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter email"
        />
      ),
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: (row, index) => (
        <input
          type="number"
          value={row.age || ''}
          onChange={(e) => updateRow(index, 'age', parseInt(e.target.value) || 0)}
          className={`px-2 py-1 border rounded w-20 ${
            row.errors.age ? 'border-red-500' : 'border-gray-300'
          }`}
          min="0"
        />
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row, index) => (
        <button
          onClick={() => removeRow(index)}
          className="px-2 py-1 bg-red-600 text-white rounded text-sm"
          disabled={rows.length === 1}
        >
          Remove
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Table data={rows} columns={columns} />

      <div className="flex items-center justify-between">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Row
        </button>

        <button
          disabled={!isValid}
          className={`px-4 py-2 rounded ${
            isValid
              ? 'bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit All
        </button>
      </div>

      {/* Error Summary */}
      {rows.some(row => Object.keys(row.errors).length > 0) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-medium text-red-800 mb-2">Validation Errors:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {rows.map((row, index) => (
              Object.entries(row.errors).map(([field, error]) => (
                <li key={`${index}-${field}`}>
                  Row {index + 1}, {field}: {error}
                </li>
              ))
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Export Pattern for Library Users

```typescript
// Recommended export pattern for your app
export type {
  CellValue,
  ColumnDef,
  SortState,
  TableProps,
  TableClassNames,
  Localization,
} from 'flowers-nextjs-table';

export {
  Table,
  ActionDropdown,
  ChipDisplay,
  ExpandableText,
  NoContent,
  Pagination,
  TableSkeleton,
  // Hooks
  useRowSelection,
  useTableSort,
  useInternalState,
  // Utilities
  sanitizeString,
  formatDate,
  isDateString,
  isString,
  isNumber,
  createColumn,
  createColumns,
  mergeTableConfig,
} from 'flowers-nextjs-table';
```