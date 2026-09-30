import { Component } from "react";
import type { SortDirection } from "../../utils/list-view";
import "../search-bar/search-bar.css";
import "./list-toolbar.css";

interface ListToolbarProps {
  query: string;
  direction: SortDirection;
  placeholder?: string;
  onQueryChange: (query: string) => void;
  onDirectionChange: (direction: SortDirection) => void;
}

const DEFAULT_PLACEHOLDER = "Titel oder Autor suchen";

export class ListToolbar extends Component<ListToolbarProps> {
  private handleToggle = () => {
    const next = this.props.direction === "desc" ? "asc" : "desc";
    this.props.onDirectionChange(next);
  };

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

  private renderLens() {
    return (
      <span className="lens-area" aria-hidden="true">
        <img
          className="lens-area-border"
          src="/assets/icons/search-borderline.png"
          alt=""
        />
        <img
          className="lens-img"
          src="/assets/icons/search-default.png"
          alt=""
        />
      </span>
    );
  }

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
