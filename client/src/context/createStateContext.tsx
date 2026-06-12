import { createContext, useMemo, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";

type StateContextValue<T> = {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
};

/**
 * Factory for the simplest kind of context: one useState value + its setter,
 * exposed as `{ value, setValue }`. The context value is memoized on `value`
 * only — `setValue` is referentially stable — so consumers re-render exactly
 * when the value changes.
 */
export function createStateContext<T>(initial: T | (() => T)) {
  const Context = createContext<undefined | StateContextValue<T>>(undefined);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [value, setValue] = useState<T>(initial);

    const contextValue = useMemo(() => ({ value, setValue }), [value]);

    return (
      <Context.Provider value={contextValue}>{children}</Context.Provider>
    );
  };

  return { Context, Provider };
}

/**
 * Factory for contexts that share a single mutable ref as `{ ref }`. The
 * context value is created once (empty `useMemo` deps), so its identity is
 * stable for the provider's lifetime and never triggers consumer re-renders.
 */
export function createRefContext<T>() {
  const Context = createContext<undefined | { ref: RefObject<T | null> }>(
    undefined
  );

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<T>(null);

    const contextValue = useMemo(() => ({ ref }), []);

    return (
      <Context.Provider value={contextValue}>{children}</Context.Provider>
    );
  };

  return { Context, Provider };
}
