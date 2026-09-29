import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ALL_CATEGORY } from "../../utils/category";
import "./search-bar.css"

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

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

function LensButton({ isHovered }: { isHovered: boolean }) {
  const state = isHovered ? "hover" : "default";
  return (
    <button className="lens-area" type="submit" aria-label="Suchen">
      <img className="lens-area-border" src="/assets/icons/search-borderline.png" alt="" />
      <img className="lens-img" src={`/assets/icons/search-${state}.png`} alt="" />
    </button>
  );
}

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

function SearchBar() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  return <SearchForm key={query} initialValue={query} />;
}

export default SearchBar;