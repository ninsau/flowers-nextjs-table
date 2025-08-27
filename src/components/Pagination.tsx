"use client";
import type React from "react";
import { useCallback, useMemo } from "react";
import type { Localization, PaginationClassNames } from "../types";

interface PaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly classNames?: PaginationClassNames;
  readonly localization: Localization["pagination"];
}

interface NavigationButtonProps {
  readonly onClick: () => void;
  readonly disabled: boolean;
  readonly className: string;
  readonly children: React.ReactNode;
  readonly ariaLabel: string;
}

const NavigationButton = ({
  onClick,
  disabled,
  className,
  children,
  ariaLabel,
}: NavigationButtonProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={className}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  classNames = {},
  localization,
}: PaginationProps): React.JSX.Element | null => {
  const isValidPagination = useMemo(
    () => totalPages > 1 && page >= 1 && page <= totalPages,
    [totalPages, page]
  );

  const handlePreviousPage = useCallback(() => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  }, [page, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  }, [page, totalPages, onPageChange]);

  const isFirstPage = useMemo(() => page === 1, [page]);
  const isLastPage = useMemo(() => page === totalPages, [page, totalPages]);

  const previousButtonClass = useMemo(
    () =>
      isFirstPage
        ? (classNames.buttonDisabled ?? "")
        : (classNames.button ?? ""),
    [isFirstPage, classNames.buttonDisabled, classNames.button]
  );

  const nextButtonClass = useMemo(
    () =>
      isLastPage
        ? (classNames.buttonDisabled ?? "")
        : (classNames.button ?? ""),
    [isLastPage, classNames.buttonDisabled, classNames.button]
  );

  if (!isValidPagination) return null;

  return (
    <nav className={classNames.container} aria-label="Table pagination">
      <output className={classNames.pageInfo} aria-live="polite">
        {localization.pageInfo(page, totalPages)}
      </output>
      <div className="flex gap-2">
        <NavigationButton
          onClick={handlePreviousPage}
          disabled={isFirstPage}
          className={previousButtonClass}
          ariaLabel={`Go to previous page (${page - 1})`}
        >
          {localization.previous}
        </NavigationButton>
        <NavigationButton
          onClick={handleNextPage}
          disabled={isLastPage}
          className={nextButtonClass}
          ariaLabel={`Go to next page (${page + 1})`}
        >
          {localization.next}
        </NavigationButton>
      </div>
    </nav>
  );
};

export default Pagination;
