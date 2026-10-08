import { useEffect, useState } from "react";

/** Returns the value after it stayed unchanged for `delay` ms (empty = instant). */
export default function useDebounce(value: string, delay = 300): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (value === "") return setDebounced("");
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}