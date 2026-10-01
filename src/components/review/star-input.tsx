import { Component } from "react";

interface StarInputProps {
  value: number;
  onChange: (value: number) => void;
}

const STARS = [1, 2, 3, 4, 5];

export class StarInput extends Component<StarInputProps> {
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
