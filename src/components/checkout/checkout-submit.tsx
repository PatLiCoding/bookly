import { useState } from "react";

/** Props for the CheckoutSubmit component. */
interface CheckoutSubmitProps {
  /** Callback invoked upon order submission, passing the current terms consent status. */
  onSubmit: (agb: boolean) => void;
}

/**
 * Renders the terms and conditions checkbox and the final purchase submit button.
 */
export function CheckoutSubmit({ onSubmit }: CheckoutSubmitProps) {
  const [agb, setAgb] = useState(false);

  return (
    <div className="checkout-card checkout-submit">
      <label>
        <input type="checkbox" checked={agb} onChange={(e) => setAgb(e.target.checked)} />
        <span>Ich stimme den <strong>AGB</strong> zu.</span>
      </label>
      <button onClick={() => onSubmit(agb)}>Kostenpflichtig bestellen</button>
    </div>
  );
}