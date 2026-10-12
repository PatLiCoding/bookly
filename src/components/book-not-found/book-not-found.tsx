import { Link } from "react-router-dom";
import "./book-not-found.css";

/** Friendly message for books that do not exist or are no longer available. */
function BookNotFound() {
  return (
    <section className="book-not-found">
      <h2>Dieses Buch ist leider nicht verfügbar</h2>
      <p>Es wurde entfernt, oder der Link stimmt nicht.</p>
      <Link to="/" className="book-not-found-link">
        Weiter stöbern
      </Link>
    </section>
  );
}

export default BookNotFound;