import { useEffect, type RefObject } from "react";

/**
 * Calls the handler when a mousedown happens outside the referenced element.
 *
 * @param ref - Ref of the element to watch.
 * @param onOutside - Callback fired on outside clicks.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onOutside]);
}