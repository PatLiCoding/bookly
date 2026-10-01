import "./filter-sidebar.css";
import type { Filters, SortOption } from "../../utils/book-filter";
import { NO_FILTERS } from "../../utils/book-filter";

interface Option<T> {
  label: string;
  value: T;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const RATING_OPTIONS: Option<number>[] = [
  { label: "Ab 4 Sterne", value: 4 },
  { label: "Ab 3 Sterne", value: 3 },
];

const SORT_OPTIONS: Option<SortOption>[] = [
  { label: "Beste Bewertung", value: "rating" },
  { label: "Meiste Bewertungen", value: "reviews" },
  { label: "Neueste zuerst", value: "newest" },
  { label: "Preis: Aufsteigend", value: "price-asc" },
  { label: "Preis: Absteigend", value: "price-desc" },
];

/** Returns null if the value is already active (= deactivate), else the value. */
function toggle<T>(current: T | null, value: T): T | null {
  return current === value ? null : value;
}

interface GroupProps<T> {
  title: string;
  options: Option<T>[];
  active: T | null;
  onSelect: (value: T) => void;
}

/** A titled list of options; clicking the active option deactivates it. */
function FilterGroup<T>({ title, options, active, onSelect }: GroupProps<T>) {
  return (
    <div className="filter-group">
      <h3 className="filter-group-title">{title}</h3>
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          aria-pressed={active === option.value}
          className={`filter-option ${active === option.value ? "active" : ""}`}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Sidebar with rating filter and sorting (rating, reviews, release date, price). Every option can be toggled off. */
function FilterSidebar({ filters, onChange }: Props) {
  return (
    <aside className="filter-sidebar">
      <FilterGroup
        title="Bewertung"
        options={RATING_OPTIONS}
        active={filters.minRating}
        onSelect={(v) => onChange({ ...filters, minRating: toggle(filters.minRating, v) })}
      />
      <FilterGroup
        title="Sortieren"
        options={SORT_OPTIONS}
        active={filters.sort}
        onSelect={(v) => onChange({ ...filters, sort: toggle(filters.sort, v) })}
      />
      <button type="button" className="filter-reset" onClick={() => onChange(NO_FILTERS)}>
        Alle zurücksetzen
      </button>
    </aside>
  );
}

export default FilterSidebar;
