"use client";

import type { TableClassNames } from "../types";

interface TableSkeletonProps {
  classNames?: TableClassNames;
  rows?: number;
  cols?: number;
}

function TableSkeleton({
  classNames = {},
  rows = 10,
  cols = 5,
}: Readonly<TableSkeletonProps>) {
  return (
    <div data-testid="table-skeleton" className={classNames.container}>
      <table className={classNames.table} style={{ width: "100%" }}>
        <thead className={classNames.thead}>
          <tr>
            {Array.from({ length: cols }, (_, i) => (
              <th
                key={`skeleton-header-column-${i + 1}`}
                className={classNames.th}
              >
                <span className="flowers-skeleton" aria-hidden="true" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={classNames.tbody}>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={`skeleton-row-${i + 1}`} className={classNames.tr}>
              {Array.from({ length: cols }, (_, j) => (
                <td
                  key={`skeleton-cell-${i + 1}-${j + 1}`}
                  className={classNames.td}
                >
                  <span className="flowers-skeleton" aria-hidden="true" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSkeleton;
