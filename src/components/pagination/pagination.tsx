import "./pagination.css";

interface Props {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

interface ButtonProps {
  label: string | number;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}

/** A single button of the pagination bar. */
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

/** Previous / next buttons and numbered pages. Hidden if there is only one page. */
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
