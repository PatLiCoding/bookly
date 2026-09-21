import { useRef } from "react";

const FALLBACK_MS = 700;
const TOLERANCE_PX = 20;

/** Resolves once scrolling has ended (or after a fallback delay). */
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

/** Ref callback for the scroll target plus `scrollThen`: scroll first, then run an action. */
export function useScrollTarget() {
  const targetRef = useRef<HTMLElement | null>(null);
  const setTarget = (element: HTMLElement | null) => {
    targetRef.current = element;
  };

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
