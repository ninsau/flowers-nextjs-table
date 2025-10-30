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
  readonly showPageNumbers: boolean;
}

interface NavigationButtonProps {
  readonly onClick: () => void;
  readonly disabled: boolean;
  readonly className: string;
  readonly children: React.ReactNode;
  readonly ariaLabel: string;
  readonly ariaCurrent?: "page" | undefined;
}

const NavigationButton = ({
  onClick,
  disabled,
  className,
  children,
  ariaLabel,
  ariaCurrent,
}: NavigationButtonProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={className}
    aria-label={ariaLabel}
    aria-current={ariaCurrent}
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
  showPageNumbers,
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

  const handlePageClick = useCallback((pageNumber: number) => {
    onPageChange(pageNumber);
  }, [onPageChange]);

  const isFirstPage = useMemo(() => page === 1, [page]);
  const isLastPage = useMemo(() => page === totalPages, [page, totalPages]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }

        if (page === 3 && page + 1 <= totalPages - 2) {
          pages.push(page + 1);
        }
        
        if (totalPages > 4) {
          pages.push(-1);
        }
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        if (totalPages > 4) {
          pages.push(-1);
        }
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [page, totalPages]);

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

  const pageButtonClass = classNames.pageButton ?? "";
  const activePageButtonClass = classNames.activePageButton ?? "";

  if (!isValidPagination) return null;

  return (
    <nav className={classNames.container} aria-label="Table pagination">
      <output className={classNames.pageInfo} aria-live="polite">
        {localization.pageInfo(page, totalPages)}
      </output>
      <div className="flex gap-2 items-center">
        <NavigationButton
          onClick={handlePreviousPage}
          disabled={isFirstPage}
          className={previousButtonClass}
          ariaLabel={`Go to previous page (${page - 1})`}
        >
          {localization.previous}
        </NavigationButton>
        
        <div className="flex gap-2">
          {showPageNumbers && pageNumbers.map((pageNumber, index) => {
            const key = `ellipsis-${index}`;
            if (pageNumber === -1) {
              return (
                <span
                  key={key}
                  className="px-2 py-1 text-gray-500"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }
            
            const isActive = pageNumber === page;
            const buttonClass = isActive ? activePageButtonClass : pageButtonClass;
            
            return (
              <NavigationButton
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                disabled={false}
                className={buttonClass}
                ariaLabel={`Go to page ${pageNumber}`}
                ariaCurrent={isActive ? "page" : undefined}
              >
                {pageNumber}
              </NavigationButton>
            );
          })}
        </div>
        
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
