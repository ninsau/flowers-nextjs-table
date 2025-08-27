"use client";
import { useCallback, useMemo, useState } from "react";
import type { ExpandableTextClassNames } from "../types";
import { sanitizeString } from "../utils";

interface ExpandableTextProps {
  readonly text: string;
  readonly classNames?: ExpandableTextClassNames;
  readonly maxLength?: number;
}

const ExpandableText = ({
  text,
  classNames = {},
  maxLength = 50,
}: ExpandableTextProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sanitizedText = useMemo(() => sanitizeString(text), [text]);

  const shouldTruncate = useMemo(
    () => sanitizedText.length > maxLength,
    [sanitizedText.length, maxLength]
  );

  const displayText = useMemo(() => {
    if (!shouldTruncate) return sanitizedText;
    return isExpanded
      ? sanitizedText
      : `${sanitizedText.slice(0, maxLength)}...`;
  }, [sanitizedText, shouldTruncate, isExpanded, maxLength]);

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
