import { useRef } from "react";

const FALLBACK_MS = 700;
const TOLERANCE_PX = 20;

/**
 * Returns a Promise that resolves when the native `scrollend` event fires
 * or after a fallback timeout expires.
 */
function waitForScrollEnd(): Promise<void> {
  return new Promise((resolve) => {
    const finish = () => {
      window.removeEventListener("scrollend", finish);
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(finish, FALLBACK_MS);
    window.addEventListener("scrollend", finish);
  });
}

/**
 * Custom React hook managing smooth scrolling to a target DOM container element
 * before executing a post-scroll action (e.g., updating pagination state).
 *
 * @returns Object containing `setTarget` ref callback and async `scrollThen` trigger.
 */
export function useScrollTarget() {
  const targetRef = useRef<HTMLElement | null>(null);

  /**
   * Ref callback assigning the target DOM node to scroll into view.
   *
   * @param element - The HTML DOM element instance or `null`.
   */
  const setTarget = (element: HTMLElement | null) => {
    targetRef.current = element;
  };

  /**
   * Scrolls the assigned target element into view smoothly and executes
   * the provided action after the scrolling animation completes.
   *
   * @param action - Callback function to run once scrolling has finished.
   */
  const scrollThen = async (action: () => void) => {
    const target = targetRef.current;
    if (!target || Math.abs(target.getBoundingClientRect().top) <= TOLERANCE_PX)
      return action();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    await waitForScrollEnd();
    action();
  };

  return { setTarget, scrollThen };
}
