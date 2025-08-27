"use client";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ActionDropdownClassNames, CellValue } from "../types";
import { sanitizeString } from "../utils";

/** Defines a single action item in the dropdown menu. */
interface Action<T extends Record<string, CellValue>> {
  /** The visible text label for the action button. */
  readonly label: string;
  /** The callback function that executes when the action is clicked. It receives the row item. */
  readonly onClick: (item: T) => void;
  /** Optional disabled state */
  readonly disabled?: boolean;
}

/** Defines the props for the `ActionDropdown` component. */
interface ActionDropdownProps<T extends Record<string, CellValue>> {
  /** The data item for the current row, which is passed to the `onClick` handlers. */
  readonly item: T;
  /** An array of action objects to display in the dropdown. */
  readonly actions: readonly Action<T>[];
  /** An object of class strings for styling the component. */
  readonly classNames?: ActionDropdownClassNames;
}

interface DropdownMenuProps<T extends Record<string, CellValue>> {
  readonly actions: readonly Action<T>[];
  readonly classNames: ActionDropdownClassNames;
  readonly onActionClick: (e: React.MouseEvent, action: Action<T>) => void;
}

const DropdownMenu = <T extends Record<string, CellValue>>({
  actions,
  classNames,
  onActionClick,
}: DropdownMenuProps<T>): React.JSX.Element => (
  <div
    className={
      classNames.menu ??
      "absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    }
    role="menu"
    aria-orientation="vertical"
    tabIndex={-1}
  >
    <div className="py-1">
      {actions.map((action, index) => (
        <button
          key={`${sanitizeString(action.label)}-${index}`}
          type="button"
          onClick={(e) => onActionClick(e, action)}
          disabled={action.disabled}
          className={
            classNames.item ??
            "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          }
          role="menuitem"
          tabIndex={-1}
          aria-label={`Action: ${sanitizeString(action.label)}`}
        >
          {sanitizeString(action.label)}
        </button>
      ))}
    </div>
  </div>
);

/**
 * A headless dropdown component for displaying row-level actions.
 */
const ActionDropdown = <T extends Record<string, CellValue>>({
  item,
  actions,
  classNames = {},
}: ActionDropdownProps<T>): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasActions = useMemo(() => actions.length > 0, [actions.length]);

  const toggleDropdown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsOpen((prev) => !prev);
    },
    []
  );

  const handleActionClick = useCallback(
    (e: React.MouseEvent, action: Action<T>) => {
      e.stopPropagation();
      if (!action.disabled) {
        action.onClick(item);
        setIsOpen(false);
      }
    },
    [item]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [isOpen, handleClickOutside]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => document.removeEventListener("keydown", handleEscapeKey);
    }
    return undefined;
  }, [isOpen]);

  if (!hasActions) {
    return <div />;
  }

  return (
    <div
      ref={containerRef}
      className={classNames.container ?? "relative inline-block text-left"}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className={classNames.button}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open action menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={classNames.icon ?? "h-5 w-5"}
        >
          <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
        </svg>
      </button>

      {isOpen && (
        <DropdownMenu
          actions={actions}
          classNames={classNames}
          onActionClick={handleActionClick}
        />
      )}
    </div>
  );
};

export default ActionDropdown;
