import { useState } from "react";
import type { Values } from "../interface/checkout";

/**
 * Custom React hook for managing key-value state pairs in form components.
 *
 * @param initial - A factory function returning the initial form state values.
 * @returns A tuple containing the current state object and a updater function to set individual keys.
 */
export function useValues(initial: () => Values) {
  const [values, setValues] = useState(initial);

  /**
   * Updates a single property within the form state by key.
   *
   * @param key - The property key to update.
   * @param value - The new string value to assign.
   */
  const change = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  return [values, change] as const;
}
