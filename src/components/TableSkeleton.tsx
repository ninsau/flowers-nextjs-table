// src/components/TableSkeleton.tsx
"use client";

import React from "react";
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
}: TableSkeletonProps) {
  // A basic skeleton that loosely matches the table structure.
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className={classNames.container}>
        <table className={classNames.table} style={{ width: "100%" }}>
          <thead className={classNames.thead}>
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className={classNames.th}>
                  <Skeleton height={20} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={classNames.tbody}>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className={classNames.tr}>
                {Array.from({ length: cols }).map((_, j) => (
                  <td key={j} className={classNames.td}>
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
