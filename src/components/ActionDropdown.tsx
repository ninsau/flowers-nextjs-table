"use client";
import { useState, useRef, useEffect } from "react";
import type { ActionDropdownClassNames } from "../types";

/** Defines a single action item in the dropdown menu. */
interface Action<T> {
  /** The visible text label for the action button. */
  label: string;
  /** The callback function that executes when the action is clicked. It receives the row item. */
  onClick: (item: T) => void;
}

/** Defines the props for the `ActionDropdown` component. */
interface ActionDropdownProps<T> {
  /** The data item for the current row, which is passed to the `onClick` handlers. */
  item: T;
  /** An array of action objects to display in the dropdown. */
  actions: Action<T>[];
  /** An object of class strings for styling the component. */
  classNames?: ActionDropdownClassNames;
}

/**
 * A headless dropdown component for displaying row-level actions.
 */
function ActionDropdown<T>({
  item,
  actions,
  classNames = {},
}: Readonly<ActionDropdownProps<T>>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleActionClick = (e: React.MouseEvent, action: Action<T>) => {
    e.stopPropagation();
    action.onClick(item);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div
          className={
            classNames.menu ??
            "absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          }
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={(e) => handleActionClick(e, action)}
                className={
                  classNames.item ??
                  "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                }
                role="menuitem"
                tabIndex={-1}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionDropdown;
