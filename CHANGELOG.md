# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.2] - 2025-09-30

### Fixed
- **Critical**: Fixed double-encoding bug where `sanitizeString` was causing legitimate content to display as HTML entities (e.g., "Internal &amp; Process" instead of "Internal & Process")
- **Critical**: Fixed select-all checkbox not working in controlled mode - callbacks were not being triggered
- Improved controlled state detection in `useRowSelection` and `useTableSort` hooks to properly handle empty objects
- Fixed accessibility issue where select/actions column checkboxes were incorrectly wrapped in button elements
- Removed incorrect `role="img"` from NoContent component for better accessibility

### Changed
- Added deprecation notice to `sanitizeString` function with clear documentation that React handles XSS automatically
- Removed unnecessary sanitization calls from rendering components (React handles this)
- Added explicit return type to `getRowId` default function for better type safety

### Tests
- Enabled and fixed previously skipped "select all rows" test
- All 88 tests now passing ✅
- Maintained 90%+ test coverage

## [1.1.0] - 2024-01-XX

### Added
- Comprehensive TypeScript strict mode compliance with zero `any` types
- Enhanced security with XSS prevention and input sanitization
- Performance optimizations with improved memoization and algorithms
- Comprehensive test suite with 80%+ code coverage
- Professional CI/CD pipeline with automated testing and releases
- GitHub issue templates and pull request templates
- Semantic versioning with automated releases
- Enhanced accessibility with ARIA labels and keyboard navigation
- Bundle size analysis and optimization

### Changed
- **BREAKING**: Strengthened type constraints with `CellValue` type system
- **BREAKING**: All array props are now readonly for immutability
- **BREAKING**: Enhanced function signatures with explicit return types
- Improved error handling with structured error management
- Better functional programming patterns throughout codebase
- Enhanced component architecture with separation of concerns
- Improved documentation with comprehensive JSDoc comments

### Fixed
- Security vulnerabilities through input sanitization
- Performance issues with unnecessary re-renders
- Accessibility issues with missing ARIA labels
- Memory leaks in event listeners and effects

### Performance
- Optimized data processing algorithms with better complexity
- Enhanced memoization strategies for expensive operations
- Reduced bundle size through tree-shaking optimizations
- Improved rendering performance with callback optimizations

### Security
- Added XSS protection for all user-provided content
- Implemented secure input sanitization
- Enhanced data validation throughout the codebase
- Secure localStorage handling with error boundaries

