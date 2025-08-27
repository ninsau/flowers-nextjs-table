"use client";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";

interface LocalStorageError {
  readonly key: string;
  readonly operation: "read" | "write";
  readonly originalError: unknown;
}

const handleStorageError = (
  key: string,
  operation: "read" | "write",
  error: unknown
): void => {
  const storageError: LocalStorageError = {
    key,
    operation,
    originalError: error,
  };

  console.warn(
    `localStorage ${operation} error for key "${key}":`,
    storageError.originalError
  );
};

const safeParseJSON = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

/**
 * A hook that manages state, persisting it to localStorage if a key is provided.
 */
export function useInternalState<S>(
  initialState: S | (() => S),
  persistenceKey?: string
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(() => {
    const getInitialValue = (): S => {
      return typeof initialState === "function"
        ? (initialState as () => S)()
        : initialState;
    };

    if (typeof window === "undefined" || !persistenceKey) {
      return getInitialValue();
    }

    try {
      const item = window.localStorage.getItem(persistenceKey);
      return item ? safeParseJSON(item, getInitialValue()) : getInitialValue();
    } catch (error) {
      handleStorageError(persistenceKey, "read", error);
      return getInitialValue();
    }
  });

  const updateState: Dispatch<SetStateAction<S>> = useCallback(
    (value) => {
      if (typeof window === "undefined") return;

      setState((prevState) => {
        const newState =
          typeof value === "function"
            ? (value as (prevState: S) => S)(prevState)
            : value;

        if (persistenceKey) {
          try {
            window.localStorage.setItem(
              persistenceKey,
              JSON.stringify(newState)
            );
          } catch (error) {
            handleStorageError(persistenceKey, "write", error);
          }
        }

        return newState;
      });
    },
    [persistenceKey]
  );

  return [state, updateState];
}
