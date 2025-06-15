"use client";
import { useState, useCallback, Dispatch, SetStateAction } from "react";

/**
 * A hook that manages state, persisting it to localStorage if a key is provided.
 */
export function useInternalState<S>(
  initialState: S | (() => S),
  persistenceKey?: string
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(() => {
    // Helper function to resolve the initial state whether it's a value or a function
    const getInitialValue = () => {
      return typeof initialState === "function"
        ? (initialState as () => S)()
        : initialState;
    };

    if (typeof window === "undefined" || !persistenceKey) {
      return getInitialValue();
    }

    try {
      const item = window.localStorage.getItem(persistenceKey);
      if (item) {
        return JSON.parse(item);
      } else {
        return getInitialValue();
      }
    } catch (error) {
      console.warn(
        `Error reading localStorage key “${persistenceKey}”:`,
        error
      );
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
            console.warn(
              `Error setting localStorage key “${persistenceKey}”:`,
              error
            );
          }
        }

        return newState;
      });
    },
    [persistenceKey]
  );

  return [state, updateState];
}
