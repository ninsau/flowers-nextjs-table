# flowers-nextjs-table

[![npm version](https://badge.fury.io/js/flowers-nextjs-table.svg)](https://badge.fury.io/js/flowers-nextjs-table)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/flowers-nextjs-table)](https://bundlephobia.com/package/flowers-nextjs-table)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-97.5%25%20passing-brightgreen.svg)](https://github.com/ninsau/flowers-nextjs-table)
[![Security](https://img.shields.io/badge/security-XSS%20protected-green.svg)](https://github.com/ninsau/flowers-nextjs-table)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> A production-ready, headless, performant, and highly customizable table component for React and Next.js. Built with strict TypeScript, designed for scalability, and optimized for millions of users.

- **Truly Headless** — Zero built-in styles, complete design freedom
- **High Performance** — Optimized for large datasets with server-side pagination support
- **Type Safe** — Strict TypeScript, zero `any` types, full IntelliSense
- **Secure by Default** — XSS protection and input sanitization built-in
- **Accessible** — WCAG 2.1 AA compliant with full keyboard navigation
- **SSR Compatible** — Works with Next.js App Router and Server Components

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
  return <Table data={users} columns={columns} />;
}
```

## Styling

The library is headless — you control all styling. Two approaches:

**Default styles** (quick start):
```tsx
import 'flowers-nextjs-table/styles';
<Table data={data} columns={columns} enableDarkMode={true} />
```

**Custom classes** (full control via Tailwind, CSS modules, or any CSS):
```tsx
<Table
  data={data}
  columns={columns}
  classNames={{
    container: 'bg-white rounded-lg shadow-sm border overflow-hidden',
    table: 'w-full',
    thead: 'bg-gray-50',
    th: 'px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase',
    tbody: 'divide-y divide-gray-200',
    tr: 'hover:bg-blue-50 transition-colors',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
  }}
/>
```

See [Styling System](./API.md#styling-system) for the full `classNames` reference.

## Pagination

```tsx
// Client-side (default) — provide all data, table handles paging
<Table data={allData} columns={columns} itemsPerPage={25} />

// Server-side — you control page state
<Table
  data={currentPageData}
  columns={columns}
  paginationMode="manual"
  disableInternalProcessing={true}
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

See [Pagination System](./API.md#pagination-system) for full examples with flow diagrams.

## Performance

| Metric | Value |
|--------|-------|
| Bundle Size (gzipped) | < 20kB |
| Tree Shaking | Full ESM support |
| TypeScript Coverage | 100% |
| Test Coverage | > 90% |

For large datasets, use `paginationMode="manual"` with `disableInternalProcessing={true}`, or implement virtual scrolling via the `renderBody` prop. See [Performance Optimization](./API.md#performance-optimization).

## Compatibility

| Dependency | Supported Versions |
|---|---|
| React | 18.x, 19.x |
| Next.js | 13.x — 16.x |
| TypeScript | 5.0+ |
| Node.js | 20+, 22+, 24+ |
| Tailwind CSS | 3.x, 4.x (optional) |

## Documentation

| Document | Purpose |
|----------|---------|
| [API Reference](./API.md) | Complete props, types, hooks, components, utilities, patterns, and troubleshooting |
| [Migration Guide](./MIGRATION.md) | Migrate from `nextjs-reusable-table` or other table libraries |
| [Contributing](./CONTRIBUTING.md) | Development setup and contribution workflow |
| [Changelog](./CHANGELOG.md) | Version history |

## AI Integration

This library is optimized for AI-assisted development:

- **Cursor AI Skill** — Install from `.cursor/skills/flowers-table/` for in-editor guidance on props, patterns, and troubleshooting
- **Context7** — Configured via [`context7.json`](./context7.json) for automatic doc lookup in MCP-compatible tools
- **LLM Reference** — [`llms.txt`](./llms.txt) (concise) and [`llms-full.txt`](./llms-full.txt) (complete) for LLM context
- **Agent Guide** — [`AGENTS.md`](./AGENTS.md) provides coding standards and workflow guidance for AI agents

## Contributing

```bash
git clone https://github.com/ninsau/flowers-nextjs-table.git
cd flowers-nextjs-table
npm install
npm run dev
```

See [Contributing Guide](./CONTRIBUTING.md) for the full development workflow.

## License

ISC © [ninsau](https://github.com/ninsau)
