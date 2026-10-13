import { useLocation, useNavigate } from "react-router-dom";

interface NoticeState {
  removedTitles?: string[];
}

/** Titles of books removed at checkout, passed via the router state. */
function useRemovedTitles(): string[] {
  const state = useLocation().state as NoticeState | null;
  return state?.removedTitles ?? [];
}

/** Banner that names the books removed from the cart because they are no longer available. */
function CartRemovedNotice() {
  const titles = useRemovedTitles();
  const navigate = useNavigate();
  if (titles.length === 0) return null;

  return (
    <div className="cart-notice" role="alert">
      <p>
        <strong>
          Folgende Artikel sind nicht mehr verfügbar und wurden aus deinem
          Warenkorb entfernt:
        </strong>
      </p>
      <ul>
        {titles.map((t, i) => <li key={`${i}-${t}`}>{t}</li>)}
      </ul>
      <p>Deine Bestellung wurde noch nicht abgeschickt. Bitte prüfe deinen Warenkorb und bestelle erneut.</p>
      <button onClick={() => navigate("/cart", { replace: true, state: null })}>Verstanden</button>
    </div>
  );
}

export default CartRemovedNotice;