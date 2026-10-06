import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ALL_CATEGORY } from "../../utils/category";
import "./search-bar.css";

/** Props for the SearchInput component. */
interface InputProps {
  /** Current text value of the search input field. */
  value: string;
  /** Callback fired when the input value changes. */
  onChange: (value: string) => void;
}

/**
 * Renders the text input field for book searches.
 */
function SearchInput({ value, onChange }: InputProps) {
  return (
    <input
      name="search"
      type="text"
      enterKeyHint="search"
      value={value}
      placeholder="Titel oder Autor suchen"
      aria-label="Bücher suchen"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/**
 * Renders the submit button displaying a decorative lens icon with hover feedback.
 *
 * @param isHovered - Indicates whether the user is currently hovering over the search form.
 */
function LensButton({ isHovered }: { isHovered: boolean }) {
  const state = isHovered ? "hover" : "default";
  return (
    <button className="lens-area" type="submit" aria-label="Suchen">
      <img className="lens-area-border" src="./assets/icons/search-borderline.png" alt="" />
      <img className="lens-img" src={`./assets/icons/search-${state}.png`} alt="" />
    </button>
  );
}

/**
 * Custom hook returning a form submission handler that navigates to the search results route.
 *
 * @param value - Search query string to submit.
 */
function useSubmitSearch(value: string) {
  const navigate = useNavigate();
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = value.trim();
    if (!term) return;
    const params = new URLSearchParams({ q: term });
    navigate(`/category/${ALL_CATEGORY}?${params.toString()}`);
  };
}

/**
 * Manages input state, hover dynamics, and submission for the search bar form.
 *
 * @param initialValue - Initial search query derived from URL search parameters.
 */
function SearchForm({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [isHovered, setIsHovered] = useState(false);
  const handleSubmit = useSubmitSearch(value);

  return (
    <form
      className="search-section"
      role="search"
      onSubmit={handleSubmit}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SearchInput value={value} onChange={setValue} />
      <LensButton isHovered={isHovered} />
    </form>
  );
}

/**
 * Container component that reads the current `q` search parameter from the URL
 * and initializes the `SearchForm` component.
 */
function SearchBar() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  return <SearchForm key={query} initialValue={query} />;
}

export default SearchBar;
