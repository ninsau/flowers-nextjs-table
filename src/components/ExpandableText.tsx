"use client";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import type { ExpandableTextClassNames } from "../types";

interface ExpandableTextProps {
  readonly text: string;
  readonly classNames?: ExpandableTextClassNames;
  readonly maxLength?: number;
}

const ExpandableText = ({
  text,
  classNames = {},
  maxLength = 50,
}: ExpandableTextProps): React.JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = useMemo(
    () => text.length > maxLength,
    [text.length, maxLength]
  );

  const displayText = useMemo(() => {
    if (!shouldTruncate) return text;
    return isExpanded ? text : `${text.slice(0, maxLength)}...`;
  }, [text, shouldTruncate, isExpanded, maxLength]);

  const toggleExpansion = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    },
    []
  );

  if (!shouldTruncate) {
    return <span>{displayText}</span>;
  }

  return (
    <span>
      {displayText}{" "}
      <button
        type="button"
        onClick={toggleExpansion}
        className={classNames.toggleButton}
        aria-label={isExpanded ? "Show less text" : "Show more text"}
      >
        {isExpanded ? "show less" : "show more"}
      </button>
    </span>
  );
};

export default ExpandableText;
