import { useEffect, useRef } from "react";

/** Opens the returned <dialog> as a modal on mount (Esc closes it natively). */
export default function useModalDialog() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return ref;
}
