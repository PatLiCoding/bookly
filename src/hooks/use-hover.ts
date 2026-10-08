import { useState } from "react";

/**
 * Tracks the hover state of an element.
 *
 * @returns The hover flag and props to spread onto the element.
 */
export function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
  return { isHovered, hoverProps };
}