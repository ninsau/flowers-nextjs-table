# Contributing to flowers-nextjs-table

Thank you for considering contributing! Your contributions are highly appreciated.

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

Open an issue on the [GitHub Issues](https://github.com/ninsau/flowers-nextjs-table/issues) page with:

- **Description**: Clear and concise description of the bug
- **Steps to reproduce**: Steps to reproduce the behavior
- **Expected behavior**: What you expected to happen
- **Environment**: Package version, Node.js version, React version, browser

### Suggesting Enhancements

Open an issue with:

- **Use case**: The problem you're trying to solve
- **Proposed solution**: How you think it should be solved
- **Alternatives considered**: Other approaches you've thought about

### Submitting Pull Requests

1. Fork the repository and create your branch from `main`
2. Follow the coding standards (see below)
3. Include tests for your changes
4. Ensure all tests pass
5. Update documentation if you've changed the API

## Development Setup

```bash
git clone https://github.com/ninsau/flowers-nextjs-table.git
cd flowers-nextjs-table
npm install
```

### Available Scripts

```bash
npm run dev          # Watch mode (rebuild on changes)
npm run build        # Full build (lint + type-check + tsup + tailwind)
npm run build:fast   # Quick build (tsup + tailwind only)
npm test             # Run tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Tests with coverage report
npm run lint         # Lint and auto-fix (Biome)
npm run lint:check   # Lint check only (no auto-fix)
npm run format       # Format code (Biome)
npm run format:check # Format check only
npm run type-check   # TypeScript type checking
npm run size         # Check bundle size
npm run ci           # Run full CI pipeline locally
```

### Build Output

After running `npm run build`:

- `dist/index.js` — CommonJS bundle
- `dist/index.mjs` — ES Module bundle
- `dist/index.d.ts` — TypeScript declarations
- `dist/table.css` — Default styles

## Coding Standards

- **TypeScript strict mode** — no `any` types
- **Functional components only** — no class components
- **No inline styles** — use CSS classes
- **Memoize** expensive computations with `useMemo`/`useCallback`
- **Biome** for linting and formatting (run `npm run lint` before committing)

See [AGENTS.md](./AGENTS.md) for detailed coding standards.

## Testing

- Tests go in `tests/` mirroring `src/` structure
- Use Jest + React Testing Library
- Coverage thresholds: branches 65%, functions 65%, lines 70%, statements 70%
- Run `npm run test:coverage` to verify

## Commit Messages

Follow conventional commits:

```
type(scope): description

feat(table): add virtual scrolling support
fix(sorting): resolve aria-sort attribute issue
test(utils): add coverage for sanitizeString
docs(readme): update compatibility table
```

## Pull Request Process

1. Ensure your PR is up-to-date with the latest `main` branch
2. Provide a clear description of your changes
3. Reference any related issues
4. All CI checks must pass (lint, format, type-check, tests, build, bundle size)
5. Wait for review from a maintainer

## Versioning

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning based on commit messages. Version bumps happen automatically on merge to `main`.

## License

By contributing, you agree that your contributions will be licensed under the [ISC License](./LICENSE).
