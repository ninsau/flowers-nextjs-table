# 🤖 AGENTS.md - AI Agent Guide for Flowers Next.js Table

> **Comprehensive guide for AI agents (like Cursor) to efficiently build with and contribute to the Flowers Next.js Table library**

## 📚 Primary Documentation Resources

Before implementing features, consult these comprehensive documentation files:

- **[API.md](./API.md)** - Complete API reference with all props, types, hooks, and examples
- **[docs/api.md](./docs/api.md)** - Deep technical documentation with architecture details
- **[README.md](./README.md)** - Project overview and quick start guide
- **[MIGRATION.md](./MIGRATION.md)** - Migration guides from other table libraries

**Key sections to reference:**
- [Pagination System](./API.md#pagination-system) - Complete pagination flow diagrams (auto & manual)
- [Troubleshooting](./API.md#troubleshooting) - Common issues and solutions
- [Performance](./API.md#performance-optimization) - Optimization strategies
- [TypeScript Types](./API.md#typescript-types) - All exported types and interfaces

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Component API](#component-api)
- [Pagination Modes](#pagination-modes)
- [Advanced Patterns](#advanced-patterns)
- [Contributing Guidelines](#contributing-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Common Issues & Solutions](#common-issues--solutions)

## 🎯 Overview

**Flowers Next.js Table** is a production-ready, headless, performant, and highly customizable table component for React and Next.js applications. Built with strict TypeScript, designed for scalability, and optimized for millions of users.

### Key Features
- 🎨 **Truly Headless** - Zero built-in styles, complete design freedom
- ⚡ **High Performance** - Optimized algorithms for large datasets (millions of rows)
- 🔒 **Type Safe** - Strict TypeScript, zero `any` types, full IntelliSense support
- 🛡️ **Secure by Default** - XSS protection and input sanitization built-in
- ♿ **Accessible** - WCAG 2.1 AA compliant with full keyboard navigation
- 📱 **Mobile Ready** - Touch-friendly with responsive design patterns

## 🚀 Quick Start

### Installation
```bash
npm install flowers-nextjs-table
```

### Import Default Styles (Optional)

If you prefer not to style the table yourself, you can import our polished default styles:

```tsx
import { Table, type ColumnDef } from 'flowers-nextjs-table';
import 'flowers-nextjs-table/styles'; // Import default styles

// Now you can use the table with minimal or no classNames
<Table
  data={users}
  columns={columns}
  enableDarkMode={true} // Optional: Enable dark mode
/>
```

### Basic Usage
```tsx
"use client";
import { Table, type ColumnDef } from 'flowers-nextjs-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
];

const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
];

export default function UsersTable() {
  return (
    <Table
      data={users}
      columns={columns}
      classNames={{
        table: 'w-full border-collapse',
        thead: 'bg-gray-50',
        th: 'p-3 text-left border-b',
        td: 'p-3 border-b',
      }}
    />
  );
}
```

## 🧠 Core Concepts

### 1. Data Structure
Your data must be an array of objects where each object represents a row. The `accessorKey` in column definitions maps to object keys.

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  tags: string[];
  isActive: boolean;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 50, tags: ['electronics', 'computers'], isActive: true },
  // ... more products
];
```

### 2. Column Definitions
Columns define how data is displayed and behave. Each column has an `accessorKey` that maps to your data structure.

```tsx
const columns: ColumnDef<Product>[] = [
  { accessorKey: 'name', header: 'Product Name', enableSorting: true },
  { accessorKey: 'price', header: 'Price', enableSorting: true },
  { accessorKey: 'stock', header: 'Stock Level' },
  { accessorKey: 'tags', header: 'Categories' },
  { accessorKey: 'isActive', header: 'Status' },
];
```

### 3. Styling Approach
The library is completely headless - you provide all styling through the `classNames` prop. Use Tailwind CSS, CSS modules, or any styling solution.

## 🎨 Component API

> **📖 For complete API reference, see [API.md](./API.md)**

### Table Component Props

```tsx
interface TableProps<T> {
  // Required props
  data: readonly T[];
  columns: readonly ColumnDef<T>[];
  
  // Optional props
  loading?: boolean;
  searchValue?: string;
  enableRowSelection?: boolean;
  enableColumnResizing?: boolean;
  
  // Pagination (see Pagination Modes section below)
  paginationMode?: 'auto' | 'manual' | 'off';
  itemsPerPage?: number;
  page?: number;                    // For manual mode
  totalPages?: number;              // For manual mode
  onPageChange?: (page: number) => void;  // For manual mode
  showPageNumbers?: boolean;
  
  // State Management
  persistenceKey?: string;          // Enable localStorage persistence
  disableInternalProcessing?: boolean;  // For server-side processing
  
  // Styling
  classNames?: Partial<TableClassNames>;
  enableDarkMode?: boolean;

  // Callbacks
  onRowClick?: (item: T) => void;
  onSortChange?: (state: SortState<T>) => void;
  onRowSelectionChange?: (selection: Record<string | number, boolean>) => void;
}
```

## 🔄 Pagination Modes

**IMPORTANT:** Understanding pagination is critical for proper implementation. See [complete pagination documentation](./API.md#pagination-system) with flow diagrams.

### Auto Pagination (Client-Side)

Use when all data is available client-side (< 10,000 rows recommended).

```tsx
<Table
  data={allProducts}              // Full dataset
  columns={columns}
  paginationMode="auto"           // Default value
  itemsPerPage={25}               // Rows per page
  showPageNumbers={true}          // Show page number buttons
/>
```

**How it works:**
1. Table receives full dataset
2. Internally filters based on `searchValue` (if provided)
3. Internally sorts based on column sort state
4. Automatically splits into pages
5. Renders only current page

### Manual Pagination (Server-Side)

Use for large datasets (> 10,000 rows) or API-driven tables.

```tsx
"use client";
import { useState, useEffect } from 'react';
import { Table, type SortState } from 'flowers-nextjs-table';

export default function ServerTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortState, setSortState] = useState<SortState<User>>({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `/api/users?page=${page}&sort=${sortState.key}&order=${sortState.direction}`
      );
      const result = await response.json();
      setData(result.items);
      setTotalPages(result.totalPages);
    }
    fetchData();
  }, [page, sortState]);

  return (
    <Table
      data={data}                           // Only current page data
      columns={columns}
      paginationMode="manual"               // Server-side mode
      page={page}                           // Current page (controlled)
      totalPages={totalPages}               // Total pages (controlled)
      onPageChange={setPage}                // Page change handler
      sortState={sortState}                 // Controlled sort
      onSortChange={setSortState}           // Sort change handler
      disableInternalProcessing={true}      // Disable client-side processing
    />
  );
}
```

**How it works:**
1. Parent component manages `page` state
2. Parent fetches data for current page from server
3. Table displays provided data (no internal filtering/sorting)
4. User clicks pagination → `onPageChange` callback
5. Parent fetches new page data
6. Table re-renders with new data

### Pagination Off

Disable pagination completely (shows all rows).

```tsx
<Table
  data={data}
  columns={columns}
  paginationMode="off"
/>
```

**Flow Diagrams:** See [API.md#pagination-flow-diagrams](./API.md#pagination-flow-diagrams) for visual flow charts.

### Column Definition Interface

```tsx
interface ColumnDef<T> {
  accessorKey: keyof T | 'actions' | 'select';
  header: string | (() => ReactNode);
  cell?: (row: T) => ReactNode;
  enableSorting?: boolean;
  enableResizing?: boolean;
  size?: number;
}
```

## 🔧 Advanced Patterns

### 1. Custom Cell Rendering
```tsx
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    cell: (product) => (
      <div className="flex items-center space-x-3">
        <img src={product.image} alt={product.name} className="w-8 h-8 rounded" />
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500">{product.sku}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: (product) => (
      <span className={product.onSale ? 'text-red-600' : ''}>
        ${product.price.toFixed(2)}
      </span>
    ),
  },
];
```

### 2. Row Actions
```tsx
import { ActionDropdown } from 'flowers-nextjs-table';

const columns: ColumnDef<Product>[] = [
  // ... other columns
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: (product) => (
      <ActionDropdown
        item={product}
        actions={[
          {
            label: 'Edit',
            onClick: (product) => handleEdit(product),
          },
          {
            label: 'Delete',
            onClick: (product) => handleDelete(product),
            disabled: !product.canDelete,
          },
        ]}
      />
    ),
  },
];
```

### 3. Row Selection
```tsx
const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

<Table
  data={products}
  columns={columns}
  enableRowSelection={true}
  rowSelection={rowSelection}
  onRowSelectionChange={setRowSelection}
  classNames={{
    // ... other styles
    tr: (row) => rowSelection[row.id] ? 'bg-blue-50' : '',
  }}
/>
```

### 4. Server-Side Processing
```tsx
<Table
  data={products}
  columns={columns}
  disableInternalProcessing={true}
  paginationMode="manual"
  page={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  sortState={sortState}
  onSortChange={setSortState}
/>
```

### 5. Custom Formatting
```tsx
<Table
  data={products}
  columns={columns}
  formatValue={(value, key, item) => {
    if (key === 'price') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value as number);
    }
    if (key === 'tags') {
      return Array.isArray(value) ? value.join(', ') : String(value);
    }
    return value;
  }}
/>
```

## 🎯 Contributing Guidelines

### Before You Start
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Install dependencies**: `npm install`
4. **Run tests**: `npm test`

### Development Workflow
1. **Make your changes** following the coding standards below
2. **Run linting**: `npm run lint`
3. **Run type checking**: `npm run type-check`
4. **Run tests**: `npm test`
5. **Build the project**: `npm run build`
6. **Commit your changes** with conventional commits
7. **Push and create a pull request**

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
```
feat(table): add virtual scrolling support
fix(sorting): resolve aria-sort attribute issue
docs(readme): update installation instructions
test(utils): add test coverage for sanitizeString
```

## 📏 Coding Standards

### 1. TypeScript
- **Strict mode only** - no `any` types allowed
- **Explicit typing** - avoid type inference where clarity is needed
- **Interface over type** - prefer interfaces for object shapes
- **Generic constraints** - use proper generic constraints for type safety

```tsx
// ✅ Good
interface ColumnDef<T extends Record<string, CellValue>> {
  accessorKey: keyof T | ReservedKeys;
  header: string | (() => ReactNode);
}

// ❌ Bad
interface ColumnDef<T> {
  accessorKey: any;
  header: any;
}
```

### 2. React Patterns
- **Functional components only** - no class components
- **Hooks for state management** - use custom hooks for complex logic
- **Memoization** - use `useMemo` and `useCallback` appropriately
- **Event handling** - proper event typing and handling

```tsx
// ✅ Good
const handleSort = useCallback((key: keyof T) => {
  setSortState(prev => ({
    key,
    direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
  }));
}, []);

// ❌ Bad
const handleSort = (key) => {
  setSortState({ key, direction: 'asc' });
};
```

### 3. Styling
- **CSS classes only** - no inline styles
- **BEM methodology** - use consistent class naming
- **Responsive design** - mobile-first approach
- **Accessibility** - proper contrast and focus states

```tsx
// ✅ Good
className="next-table__container overflow-x-auto"

// ❌ Bad
style={{ overflow: 'auto' }}
```

### 4. Error Handling
- **Graceful degradation** - handle edge cases gracefully
- **User feedback** - provide clear error messages
- **Fallback values** - use sensible defaults
- **Validation** - validate inputs and data

```tsx
// ✅ Good
if (!data || data.length === 0) {
  return <NoContent text="No data available" />;
}

// ❌ Bad
return data.map(item => <Row key={item.id} data={item} />);
```

## 🧪 Testing

### Test Structure
- **Unit tests** for utilities and hooks
- **Component tests** for React components
- **Integration tests** for complex interactions
- **Accessibility tests** for ARIA compliance

### Testing Standards
- **Testing Library** - use React Testing Library for component tests
- **Jest** - use Jest as the test runner
- **Coverage** - maintain >90% test coverage
- **Mocking** - mock external dependencies appropriately

### Example Test
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from '../Table';

describe('Table', () => {
  it('should render data correctly', () => {
    const data = [{ id: 1, name: 'Test' }];
    const columns = [{ accessorKey: 'name', header: 'Name' }];
    
    render(<Table data={data} columns={columns} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle row clicks', async () => {
    const user = userEvent.setup();
    const onRowClick = jest.fn();
    
    render(
      <Table 
        data={[{ id: 1, name: 'Test' }]} 
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        onRowClick={onRowClick}
      />
    );
    
    const row = screen.getByRole('row', { name: /test/i });
    await user.click(row);
    
    expect(onRowClick).toHaveBeenCalledWith({ id: 1, name: 'Test' });
  });
});
```

## 🚨 Common Issues & Solutions

> **📖 For comprehensive troubleshooting guide, see [API.md#troubleshooting](./API.md#troubleshooting)**

### Quick Fixes

### 1. TypeScript Errors
**Problem**: Generic type constraints not working
```tsx
// ❌ Error: Type 'string' is not assignable to type 'keyof T'
const columns: ColumnDef<User>[] = [
  { accessorKey: 'actions', header: 'Actions' }
];
```

**Solution**: Use proper generic constraints
```tsx
// ✅ Good
const columns: ColumnDef<User>[] = [
  { accessorKey: 'actions' as const, header: 'Actions' }
];
```

### 2. Styling Issues
**Problem**: Table not styled correctly
**Solution**: Ensure you're providing all necessary classNames
```tsx
<Table
  data={data}
  columns={columns}
  classNames={{
    container: 'w-full',
    table: 'min-w-full divide-y divide-gray-200',
    thead: 'bg-gray-50',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    tbody: 'bg-white divide-y divide-gray-200',
    tr: 'hover:bg-gray-50',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
  }}
/>
```

### 3. Performance Issues
**Problem**: Table slow with large datasets
**Solution**: Use virtualization or pagination
```tsx
// For large datasets, use manual pagination
<Table
  data={paginatedData}
  columns={columns}
  disableInternalProcessing={true}
  paginationMode="manual"
  page={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

### 4. Accessibility Issues
**Problem**: Screen readers not working properly
**Solution**: Ensure proper ARIA attributes and semantic HTML
```tsx
// The library handles most accessibility automatically
// Just ensure your data has proper labels and descriptions
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Full Name', // Clear, descriptive header
  },
];
```

## 🔗 Resources

### Documentation
- **[API.md](./API.md)** - Complete API reference (PRIMARY REFERENCE)
  - All props, types, and interfaces
  - Pagination system with flow diagrams
  - Hooks documentation (useTableSort, useRowSelection, useInternalState)
  - Component documentation (ActionDropdown, ChipDisplay, etc.)
  - Performance optimization guide
  - Troubleshooting section
- **[docs/api.md](./docs/api.md)** - Deep technical documentation
  - Architecture and implementation details
  - Performance benchmarks
  - Security considerations
  - Testing strategies
- **[README.md](./README.md)** - Project overview and quick start
- **[MIGRATION.md](./MIGRATION.md)** - Migration guides from other libraries

### Community & Support
- **GitHub Repository**: [ninsau/flowers-nextjs-table](https://github.com/ninsau/flowers-nextjs-table)
- **NPM Package**: [flowers-nextjs-table](https://www.npmjs.com/package/flowers-nextjs-table)
- **Issues**: [GitHub Issues](https://github.com/ninsau/flowers-nextjs-table/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ninsau/flowers-nextjs-table/discussions)

### Quick Reference for AI Agents
When implementing features:
1. ✅ Check [API.md](./API.md) first for props and examples
2. ✅ Review [pagination documentation](./API.md#pagination-system) for pagination features
3. ✅ Consult [troubleshooting](./API.md#troubleshooting) for common issues
4. ✅ Reference [docs/api.md](./docs/api.md) for implementation details
5. ✅ Follow coding standards in [CONTRIBUTING.md](./CONTRIBUTING.md)

## 🤝 Getting Help

If you encounter issues or need help:

1. **Check existing issues** on GitHub
2. **Search discussions** for similar problems
3. **Create a new issue** with detailed information
4. **Join discussions** to ask questions
5. **Review the code** - the library is well-documented

## 📝 License

This project is licensed under the ISC License. See [LICENSE](./LICENSE) for details.

---

**Happy coding! 🎉**

Remember: This library is designed to be flexible, performant, and accessible. When in doubt, prioritize user experience and accessibility over clever code patterns.
