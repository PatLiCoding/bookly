import { useEffect, useRef } from "react";

/** Locks the page scroll while the component is mounted. */
function useScrollLock() {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
}

/** Opens the returned <dialog> as a modal on mount (Esc closes it natively). */
export default function useModalDialog() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useScrollLock();
  return ref;
}
