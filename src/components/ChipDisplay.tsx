// src/components/ChipDisplay.tsx
"use client";
import { useState } from "react";
import type { ChipDisplayClassNames } from "../types";

interface ChipDisplayProps {
  items: any[];
  classNames?: ChipDisplayClassNames;
  limit?: number;
}

function ChipDisplay({
  items,
  classNames = {},
  limit = 3,
}: Readonly<ChipDisplayProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  const visibleItems = isExpanded ? items : items.slice(0, limit);
  const hiddenItemsCount = items.length - limit;

  return (
    <div className={classNames.container}>
      {visibleItems.map((item, index) => (
        <span key={`item-${String(item)}-${index}`} className={classNames.chip}>
          {String(item)}
        </span>
      ))}
      {!isExpanded && hiddenItemsCount > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className={classNames.moreButton}
        >
          +{hiddenItemsCount} more
        </button>
      )}
    </div>
  );
}

export default ChipDisplay;
