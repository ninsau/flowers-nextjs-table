"use client";
import React from "react";
import type { PaginationClassNames, Localization } from "../types";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  classNames?: PaginationClassNames;
  localization: Localization["pagination"];
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  classNames = {},
  localization,
}: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null;
  return (
    <nav className={classNames.container}>
      <div className={classNames.pageInfo}>
        {localization.pageInfo(page, totalPages)}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={page === 1 ? classNames.buttonDisabled : classNames.button}
        >
          {localization.previous}
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={
            page === totalPages ? classNames.buttonDisabled : classNames.button
          }
        >
          {localization.next}
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
