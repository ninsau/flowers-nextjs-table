"use client";
import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import localforage from "localforage";

/**
 * A hook that manages state, persisting it to localforage if a key is provided.
 * It gracefully handles async storage operations and supports functional updates.
 * @param initialState The initial state value, or a function that returns the initial state.
 * @param persistenceKey A unique key to store the state in localforage. If omitted, it behaves like a regular `useState`.
 * @returns A state and a setter function, identical to the `useState` signature.
 */
export function useInternalState<S>(
  initialState: S | (() => S),
  persistenceKey?: string
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(initialState);

  // Load state from localforage on initial mount if a key is provided
  useEffect(() => {
    if (persistenceKey) {
      localforage.getItem<S>(persistenceKey).then((savedState) => {
        if (savedState !== null) {
          setState(savedState);
        }
      });
    }
  }, [persistenceKey]);

  // The enhanced setter function that updates both local state and persisted storage
  const updateState: Dispatch<SetStateAction<S>> = useCallback(
    (value) => {
      // Use the functional form of setState to get the latest state
      setState((prevState) => {
        const newState =
          typeof value === "function"
            ? (value as (prevState: S) => S)(prevState)
            : value;

        if (persistenceKey) {
          localforage.setItem(persistenceKey, newState);
        }

        return newState;
      });
    },
    [persistenceKey]
  );

  return [state, updateState];
}
