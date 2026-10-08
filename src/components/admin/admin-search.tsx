interface Props {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function AdminSearch({ value, placeholder, onChange }: Props) {
  return (
    <div className="admin-search-wrapper">
      <input
        className="admin-search"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="admin-search-clear"
          onClick={() => onChange("")}
          aria-label="Suche zurücksetzen"
        >
          <img src="./assets/icons/search_remove.png" alt="Suche abbrechen" />
        </button>
      )}
    </div>
  );
}