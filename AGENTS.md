# AI Agent Guide — flowers-nextjs-table

Guide for AI agents (Cursor, Copilot, Claude, etc.) to efficiently work with and contribute to this library.

## Documentation Map

| Document | Purpose | When to check |
|----------|---------|---------------|
| [API.md](./API.md) | Complete API reference (props, types, hooks, components, patterns, troubleshooting) | First stop for any usage question |
| [README.md](./README.md) | Project overview, quick start, compatibility | Orientation |
| [MIGRATION.md](./MIGRATION.md) | Migration from other libraries | When porting from TanStack Table, MUI, etc. |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Dev setup, PR process, scripts | Before making changes |
| [llms.txt](./llms.txt) / [llms-full.txt](./llms-full.txt) | LLM-optimized reference | Quick context loading |
| [.cursor/skills/flowers-table/SKILL.md](./.cursor/skills/flowers-table/SKILL.md) | Cursor AI skill with condensed API | In-editor AI assistance |

**Always check [API.md](./API.md) first for props, examples, pagination, and troubleshooting.**

## Project Structure

```
src/
  components/   Table.tsx, ActionDropdown.tsx, ChipDisplay.tsx, ExpandableText.tsx,
                NoContent.tsx, Pagination.tsx, TableSkeleton.tsx
  hooks/        useTableSort.ts, useRowSelection.ts, useInternalState.ts
  styles/       defaultClassNames.ts, table.css
  types/        index.ts (all type definitions)
  utils/        index.ts (sanitize, format, merge, create helpers)
  index.ts      Main entry — all exports
tests/          Jest tests mirroring src/ structure
```

## Coding Standards

### TypeScript

- **Strict mode** — no `any` types, ever
- **Explicit typing** where clarity is needed; use interfaces over type aliases for object shapes
- **Generic constraints** — `T extends Record<string, CellValue>` for table data types
- **Readonly** — use `readonly` for array props and immutable data

### React Patterns

- **Functional components only** — no class components
- **`useMemo` and `useCallback`** for expensive computations and stable references
- **Controlled/uncontrolled hybrid** — support both patterns for sort, selection, and pagination
- **`"use client"` directive** on components that use hooks or browser APIs

### Styling

- **No inline styles** — use CSS classes exclusively
- **BEM naming** for default class names (`next-table__container`, `next-table-pagination__button`)
- **Headless by default** — all styling via `classNames` prop; default styles are opt-in

### Error Handling

- **Graceful degradation** — render `<NoContent>` for empty data, use safe defaults
- **Dev-mode warnings** — validate props with `console.error`/`console.warn` behind `process.env.NODE_ENV === 'development'`
- **Try-catch** around localStorage access and optional features

## Development Commands

```bash
npm run dev          # Watch mode (tsup)
npm run build        # Full build (lint + type-check + tsup + tailwind)
npm run build:fast   # Quick build (tsup + tailwind only)
npm test             # Run tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Tests with coverage report
npm run lint         # Lint and auto-fix (Biome)
npm run lint:check   # Lint check only
npm run type-check   # TypeScript type check
npm run size         # Bundle size check
npm run ci           # Full CI pipeline locally
```

## Testing Expectations

- **Jest + React Testing Library** for all tests
- **Coverage thresholds**: branches 65%, functions 65%, lines 70%, statements 70%
- Test files go in `tests/` mirroring `src/` structure
- Mock `localStorage` and `matchMedia` (already in `tests/setup.ts`)

## Commit Convention

```
type(scope): description

feat(table): add virtual scrolling support
fix(sorting): resolve aria-sort attribute issue
test(utils): add coverage for sanitizeString
docs(readme): update compatibility table
```

## Key Implementation Details

- The Table component uses a data pipeline: Search/Filter -> Sort -> Paginate (see [API.md#architecture](./API.md#architecture))
- `disableInternalProcessing={true}` bypasses the entire pipeline for server-side tables
- The `select` and `actions` reserved `accessorKey` values have special rendering paths
- Row selection supports both controlled (`rowSelection`/`onRowSelectionChange`) and uncontrolled (internal state) modes
- Column resizing uses mouse event listeners on `document` (not React state per-pixel)

## Compatibility

| Dependency | Supported |
|---|---|
| React | 18.x, 19.x |
| Next.js | 13.x — 16.x |
| TypeScript | 5.0+ |
| Node.js | 20+, 22+, 24+ |
| Tailwind CSS | 3.x, 4.x (optional) |
