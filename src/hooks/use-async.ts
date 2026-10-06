import { useEffect, useState } from "react";
import type { DependencyList } from "react";

export interface AsyncResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

type Settled<T> = Pick<AsyncResult<T>, "data" | "error">;

/** Logs the cause and turns anything that was thrown into an Error. */
function handleError(value: unknown): Error {
  console.error(value);
  if (value instanceof Error) return value;
  const message = (value as { message?: string } | null)?.message;
  return new Error(message ?? "Unknown error");
}

/** As long as nothing has settled, we are loading. */
function toResult<T>(settled: Settled<T> | null): AsyncResult<T> {
  return {
    data: settled?.data ?? null,
    error: settled?.error ?? null,
    loading: settled === null,
  };
}

/** Starts loading; the returned function drops a result that arrives too late. */
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

/** Runs `load` whenever `deps` change; returns data, error and loading flag. */
export function useAsync<T>(
  load: () => Promise<T>,
  deps: DependencyList,
): AsyncResult<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => start(load, setSettled), deps);
  return toResult(settled);
}
