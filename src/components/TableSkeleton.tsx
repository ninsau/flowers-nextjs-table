"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
  // A basic skeleton that loosely matches the table structure.
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div data-testid="table-skeleton" className={classNames.container}>
        <table className={classNames.table} style={{ width: "100%" }}>
          <thead className={classNames.thead}>
            <tr>
              {Array.from({ length: cols }, (_, i) => (
                <th
                  key={`skeleton-header-column-${i + 1}`}
                  className={classNames.th}
                >
                  <Skeleton height={20} />
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
                    <Skeleton height={20} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SkeletonTheme>
  );
}

export default TableSkeleton;
