import { useRef } from "react";
import "./book-details.css";
import type { Book } from "../../interface/book";
import type { CartItem } from "../../pages/cart-page/cart-page";
import { renderStars } from "../../utils/render-stars";
import { parsePrice } from "../../utils/parse-price";

interface Props {
  book: Book;
  onAddToCart: (item: CartItem) => void;
}

function BookDetails({ book, onAddToCart }: Props) {
  const commentsRef = useRef<HTMLDivElement>(null);

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: parsePrice(book.price),
      cover: book.cover,
      quantity: 1,
    });
  };

  const commentCount = book.comments ? book.comments.length : 0;

  return (
    <div className="book-details-container">
      <div className="book-header">
        <div className="cover-container">
          <img className="cover-image" src={book.cover} alt={book.title} />
        </div>

        <div className="book-info-col">
          <div className="main-info">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">von {book.author}</p>
            {book.releaseDate && (
              <p className="release-date">Erschienen am: {book.releaseDate}</p>
            )}

            <div className="rating-summary-row">
              <div className="stars">{renderStars(book.rating)}</div>
              <button className="comments-link" onClick={scrollToComments}>
                ( {commentCount}{" "}
                {commentCount === 1 ? "Kommentar" : "Kommentare"} )
              </button>
            </div>
          </div>

          <div className="purchase-box">
            <span className="price-tag">{book.price}</span>
            <button
              className="order-btn"
              onClick={handleAddToCart}
              aria-label="In den Warenkorb"
            >
              <span>In den Warenkorb</span>
              <img src="/assets/icons/cart.png" alt="cart icon" />
            </button>
          </div>
        </div>
      </div>

      <hr className="divider" />

      <section className="description-section">
        <h3>Beschreibung</h3>
        <p>{book.description || "Keine Beschreibung verfügbar."}</p>
      </section>

      <hr className="divider" />

      <div className="overall-rating-badge">
        <div><span>Gesamtbewertung:</span></div>
        <div><span>{renderStars(book.rating)}</span>
        <span>({book.rating.toFixed(1)} / 5)</span></div>
      </div>

      <section className="comments-section" ref={commentsRef}>
        <h3>Kommentare &amp; Bewertungen</h3>

        {book.comments && book.comments.length > 0 ? (
          book.comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <span className="user-name">{comment.userName}</span>
                <div className="stars">
                  {renderStars(comment.rating)}
                  <p className="comment-date">12.8.2022</p>
                </div>
              </div>
              <div className="comment-text">
                <p>{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Noch keine Kommentare vorhanden.</p>
        )}
      </section>
    </div>
  );
}

export default BookDetails;