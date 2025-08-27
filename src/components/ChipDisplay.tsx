// src/components/ChipDisplay.tsx
"use client";
import { useState } from "react";
import type { ChipDisplayClassNames } from "../types";

interface ChipDisplayProps {
  items: readonly string[];
  classNames?: ChipDisplayClassNames;
  maxVisibleItems?: number;
}

function ChipDisplay({
  items,
  classNames = {},
  maxVisibleItems = 3,
}: Readonly<ChipDisplayProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) {
    return (
      <div
        data-testid="chip-display-container"
        className={classNames.container}
      />
    );
  }

  const visibleItems = isExpanded ? items : items.slice(0, maxVisibleItems);
  const hiddenItemsCount = Math.max(0, items.length - maxVisibleItems);

  return (
    <div data-testid="chip-display-container" className={classNames.container}>
      {visibleItems.map((item) => (
        <span key={`item-${item}`} className={classNames.chip}>
          {item}
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
      {isExpanded && hiddenItemsCount > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
          className={classNames.moreButton}
        >
          Show less
        </button>
      )}
    </div>
  );
}

export default ChipDisplay;
