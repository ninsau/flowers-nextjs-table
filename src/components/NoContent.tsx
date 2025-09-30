"use client";
import type React from "react";
import { memo } from "react";

interface NoContentComponentProps {
  readonly text?: string;
  readonly icon?: React.ReactNode;
}

const NoContent = memo<NoContentComponentProps>(
  ({ text = "No data available", icon }) => {
    return (
      <output
        className="flex flex-col items-center justify-center p-12 text-center text-gray-500"
        aria-live="polite"
      >
        {icon && (
          <div className="mb-4" aria-hidden="true">
            {icon}
          </div>
        )}
        <p>{text}</p>
      </output>
    );
  }
);

NoContent.displayName = "NoContent";

export default NoContent;
