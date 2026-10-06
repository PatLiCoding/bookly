import { useEffect, useState } from "react";
import type { DependencyList } from "react";

/** Structure of the state object returned by the `useAsync` hook. */
export interface AsyncResult<T> {
  /** The resolved data payload, or `null` if pending or failed. */
  data: T | null;
  /** Caught error object, or `null` if pending or successful. */
  error: Error | null;
  /** Boolean flag indicating whether the asynchronous operation is still executing. */
  loading: boolean;
}

/** Internal state representation holding settled data or error results. */
type Settled<T> = Pick<AsyncResult<T>, "data" | "error">;

/**
 * Normalizes caught execution errors into standard `Error` instances and logs the error.
 *
 * @param value - The caught exception or rejection payload.
 */
function handleError(value: unknown): Error {
  console.error(value);
  if (value instanceof Error) return value;
  const message = (value as { message?: string } | null)?.message;
  return new Error(message ?? "Unknown error");
}

/**
 * Maps settled internal state to a public `AsyncResult<T>` structure.
 *
 * @param settled - The settled state object or `null` if still loading.
 */
function toResult<T>(settled: Settled<T> | null): AsyncResult<T> {
  return {
    data: settled?.data ?? null,
    error: settled?.error ?? null,
    loading: settled === null,
  };
}

/**
 * Initiates an asynchronous task with an active-flag cleanup function
 * to prevent race conditions or updates on unmounted state.
 *
 * @param load - Async factory function producing the value promise.
 * @param onSettled - Callback invoked when the promise fulfills or rejects.
 */
function start<T>(
  load: () => Promise<T>,
  onSettled: (settled: Settled<T>) => void,
): () => void {
  let active = true;
  const settle = (settled: Settled<T>) => active && onSettled(settled);
  load()
    .then((data) => settle({ data, error: null }))
    .catch((e: unknown) => settle({ data: null, error: handleError(e) }));
  return () => {
    active = false;
  };
}

/**
 * Custom hook executing an asynchronous factory function whenever dependencies change,
 * managing data resolution, error handling, and loading state automatically.
 *
 * @param load - Async function fetching or calculating the target data.
 * @param deps - Dependency list controlling when the async task re-runs.
 * @returns Object containing data, error, and loading indicator.
 */
export function useAsync<T>(
  load: () => Promise<T>,
  deps: DependencyList,
): AsyncResult<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => start(load, setSettled), deps);
  return toResult(settled);
}
