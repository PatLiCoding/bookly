import { useState } from "react";
import type { Values } from "../../interface/checkout";

export function useValues(initial: () => Values) {
  const [values, setValues] = useState(initial);
  const change = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));
  return [values, change] as const;
}
