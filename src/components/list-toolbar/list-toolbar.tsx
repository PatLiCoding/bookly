import { Component } from "react";
import type { SortDirection } from "../../utils/list-view";
import "../search-bar/search-bar.css";
import "./list-toolbar.css";

/** Props for the ListToolbar class component. */
interface ListToolbarProps {
  /** Current search query string. */
  query: string;
  /** Current sorting direction (`"asc"` or `"desc"`). */
  direction: SortDirection;
  /** Optional custom placeholder text for the search input. */
  placeholder?: string;
  /** Callback fired when the search query text is modified. */
  onQueryChange: (query: string) => void;
  /** Callback fired when the sort direction button is toggled. */
  onDirectionChange: (direction: SortDirection) => void;
}

const DEFAULT_PLACEHOLDER = "Titel oder Autor suchen";

/**
 * Class component rendering a search input bar and sort direction toggle button.
 */
export class ListToolbar extends Component<ListToolbarProps> {
  /** Toggles the sort direction between ascending (`"asc"`) and descending (`"desc"`). */
  private handleToggle = () => {
    const next = this.props.direction === "desc" ? "asc" : "desc";
    this.props.onDirectionChange(next);
  };

  /** Renders the text input element for searching list items. */
  private renderInput() {
    const { query, placeholder, onQueryChange } = this.props;
    return (
      <input
        type="text"
        value={query}
        placeholder={placeholder ?? DEFAULT_PLACEHOLDER}
        aria-label="Liste durchsuchen"
        onChange={(e) => onQueryChange(e.target.value)}
      />
    );
  }

  /** Renders decorative search magnifying glass visual icons. */
  private renderLens() {
    return (
      <span className="lens-area" aria-hidden="true">
        <img
          className="lens-area-border"
          src="./assets/icons/search-borderline.png"
          alt=""
        />
        <img
          className="lens-img"
          src="./assets/icons/search-default.png"
          alt=""
        />
      </span>
    );
  }

  /** Renders the sort toggle button with dynamic label and arrow indicator. */
  private renderSortButton() {
    const isDesc = this.props.direction === "desc";
    return (
      <button
        type="button"
        className="list-sort-btn"
        aria-label="Sortierreihenfolge wechseln"
        onClick={this.handleToggle}
      >
        {isDesc ? "Neueste zuerst " : "Älteste zuerst "}
        {isDesc ? <span>&darr;</span> : <span>&uarr;</span>}
      </button>
    );
  }

  render() {
    return (
      <div className="list-toolbar">
        <div className="search-section" role="search">
          {this.renderInput()}
          {this.renderLens()}
        </div>
        {this.renderSortButton()}
      </div>
    );
  }
}
