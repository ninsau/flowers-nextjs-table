"use client";
import { useState, useCallback, Dispatch, SetStateAction } from "react";

/**
 * A hook that manages state, persisting it to localStorage if a key is provided.
 * It gracefully handles async storage operations and supports functional updates.
 * @param initialState The initial state value, or a function that returns the initial state.
 * @param persistenceKey A unique key to store the state in localStorage. If omitted, it behaves like a regular `useState`.
 * @returns A state and a setter function, identical to the `useState` signature.
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

    if (!persistenceKey) {
      return getInitialValue();
    }

    try {
      const item = window.localStorage.getItem(persistenceKey);
      // Refactored from nested ternary to a clear if/else block
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

  // The enhanced setter function that updates both local state and persisted storage
  const updateState: Dispatch<SetStateAction<S>> = useCallback(
    (value) => {
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
