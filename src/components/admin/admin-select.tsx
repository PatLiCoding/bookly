import { useState, useRef, useEffect, type ReactNode, type MouseEvent } from "react";

interface Option<T extends string = string> {
  value: T;
  label: string;
}

interface Props<T extends string = string> {
  value: T;
  options: readonly Option<T>[] | readonly string[];
  onChange: (value: T) => void;
}

/** Closes dropdown when clicking outside of it. */
function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, onClose: () => void): void {
  useEffect(() => {
    function handleClick(e: MouseEvent | Event): void {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick as unknown as EventListener);
    return () => document.removeEventListener("mousedown", handleClick as unknown as EventListener);
  }, [ref, onClose]);
}

/** Renders the currently selected value acting as the toggle button. */
function DropdownToggle({ label, onClick }: { label: string; onClick: () => void }): ReactNode {
  return (
    <button type="button" className="admin-select-toggle" onClick={onClick}>
      <span>{label}</span>
      <span className="admin-select-arrow">▼</span>
    </button>
  );
}

/** Renders a single option item inside the dropdown list. */
function DropdownItem({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }): ReactNode {
  return (
    <div className={`admin-select-option ${selected ? "is-selected" : ""}`} onClick={onSelect}>
      {label}
    </div>
  );
}

/** Generic custom dropdown component giving full CSS control over hover states and pointer cursors. */
export default function AdminSelect<T extends string = string>({ value, options, onChange }: Props<T>): ReactNode {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick(ref, () => setOpen(false));

  const normalizedOptions: Option<T>[] = options.map((opt) => 
    typeof opt === "string" ? { value: opt as T, label: opt } : opt
  );

  const currentLabel = normalizedOptions.find((o) => o.value === value)?.label ?? value;

  function handleSelect(val: T): void {
    onChange(val);
    setOpen(false);
  }

  return (
    <div className="admin-select-wrapper" ref={ref}>
      <DropdownToggle label={currentLabel} onClick={() => setOpen(!open)} />
      {open && (
        <div className="admin-select-dropdown">
          {normalizedOptions.map((opt) => (
            <DropdownItem 
              key={opt.value} 
              label={opt.label} 
              selected={opt.value === value} 
              onSelect={() => handleSelect(opt.value)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}