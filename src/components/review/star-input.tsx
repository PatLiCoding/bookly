import { Component } from "react";

/** Props for the StarInput component. */
interface StarInputProps {
  /** Active star count value (1 to 5). */
  value: number;
  /** Callback fired when a star button is clicked. */
  onChange: (value: number) => void;
}

const STARS = [1, 2, 3, 4, 5];

/**
 * Class component rendering interactive star rating selector buttons.
 */
export class StarInput extends Component<StarInputProps> {
  /** Renders an individual star selection button with active highlighted state. */
  private renderStar = (n: number) => {
    const active = n <= this.props.value;
    return (
      <button
        key={n}
        type="button"
        className={`star-input-btn ${active ? "star-input-btn-active" : ""}`}
        aria-label={`${n} Sterne`}
        onClick={() => this.props.onChange(n)}
      >
        ★
      </button>
    );
  };

  render() {
    return <div className="star-input">{STARS.map(this.renderStar)}</div>;
  }
}