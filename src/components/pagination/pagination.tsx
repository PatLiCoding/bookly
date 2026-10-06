import "./pagination.css";

/** Props for the Pagination component. */
interface Props {
  /** Currently active page number (1-indexed). */
  page: number;
  /** Total count of available pages. */
  pageCount: number;
  /** Callback triggered when a page selection or navigation button is clicked. */
  onChange: (page: number) => void;
}

/** Props for an individual pagination button. */
interface ButtonProps {
  /** Text or number displayed inside the button. */
  label: string | number;
  /** Event handler invoked when the button is clicked. */
  onClick: () => void;
  /** Optional flag indicating whether the button is disabled. */
  disabled?: boolean;
  /** Optional flag indicating whether this button corresponds to the currently active page. */
  active?: boolean;
}

/**
 * Renders an individual button within the pagination control strip.
 */
function PageButton({ label, onClick, disabled = false, active = false }: ButtonProps) {
  return (
    <button
      type="button"
      className={`page-btn ${active ? "active" : ""}`}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/**
 * Renders page navigation controls with previous/next actions and numbered page buttons.
 * Returns `null` if total page count is 1 or less.
 */
function Pagination({ page, pageCount, onChange }: Props) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Seitennavigation">
      <PageButton label="Zurück" disabled={page === 1} onClick={() => onChange(page - 1)} />
      {pages.map((p) => (
        <PageButton key={p} label={p} active={p === page} onClick={() => onChange(p)} />
      ))}
      <PageButton label="Weiter" disabled={page === pageCount} onClick={() => onChange(page + 1)} />
    </nav>
  );
}

export default Pagination;
