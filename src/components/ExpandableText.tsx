// src/components/ExpandableText.tsx
"use client";
import { useState } from "react";
import type { ExpandableTextClassNames } from "../types";

interface ExpandableTextProps {
  text: string;
  classNames?: ExpandableTextClassNames;
  maxLength?: number;
}

function ExpandableText({
  text,
  classNames = {},
  maxLength = 50,
}: Readonly<ExpandableTextProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const toggleExpansion = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <span>
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <button
        type="button"
        onClick={toggleExpansion}
        className={classNames.toggleButton}
      >
        {isExpanded ? "show less" : "show more"}
      </button>
    </span>
  );
}

export default ExpandableText;
