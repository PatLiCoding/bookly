import { useState } from "react";

// interface SubmitProps {
//   onSubmit: (agb: boolean) => void;
// }

export function CheckoutSubmit({ onSubmit }: { onSubmit: (agb: boolean) => void }) {
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