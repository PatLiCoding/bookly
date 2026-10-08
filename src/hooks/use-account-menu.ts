import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "./use-click-outside";

/**
 * Manages open/close state of the account dropdown.
 * The menu closes automatically when clicking outside of `menuRef`.
 */
export function useAccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = () => setIsOpen((open) => !open);

  useClickOutside(menuRef, close);
  return { isOpen, menuRef, close, toggle };
}