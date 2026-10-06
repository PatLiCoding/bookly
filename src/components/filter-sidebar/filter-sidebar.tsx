import "./filter-sidebar.css";
import type { Filters, SortOption } from "../../utils/book-filter";
import { NO_FILTERS } from "../../utils/book-filter";

/** Represents a single selectable filter or sorting option. */
interface Option<T> {
  /** Visible label displayed on the option button. */
  label: string;
  /** Underlying value corresponding to the option. */
  value: T;
}

/** Props for the FilterSidebar component. */
interface Props {
  /** Currently active filter criteria. */
  filters: Filters;
  /** Callback fired when filter or sorting parameters are updated. */
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

/**
 * Toggles a filter value by returning `null` if the value is currently active,
 * or the new value if it is not.
 *
 * @template T - The type of the value being toggled.
 * @param current - The currently selected filter value or null.
 * @param value - The newly clicked option value.
 * @returns The updated filter state (`null` if deactivated).
 */
function toggle<T>(current: T | null, value: T): T | null {
  return current === value ? null : value;
}

/** Props for a grouped list of filter options. */
interface GroupProps<T> {
  /** Section heading title. */
  title: string;
  /** Available options to choose from. */
  options: Option<T>[];
  /** Currently active option value within this group. */
  active: T | null;
  /** Callback triggered when an option is selected or toggled off. */
  onSelect: (value: T) => void;
}

/**
 * Renders a group of filter option buttons under a section title.
 *
 * @template T - The type of option values in the group.
 */
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

/**
 * Renders a sidebar allowing users to filter books by minimum rating and sort criteria.
 */
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
