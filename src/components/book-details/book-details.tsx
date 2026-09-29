import { useRef } from "react";
import "./book-details.css";
import type { Book } from "../../interface/book";
import type { User } from "../../interface/user";
import type { NewCartItem } from "../../utils/use-cart";
import { renderStars } from "../../utils/render-stars";
import { parsePrice } from "../../utils/parse-price";
import { useBookReviews } from "../../utils/use-book-reviews";
import { averageRating } from "../../services/review-service";
import { ReviewSection } from "../review/review-section";
import { QuantityControl } from "../quantity-control/quantity-control";

interface Props {
  book: Book;
  loggedUser: User | null;
  cartQuantity?: number;
  onAddToCart: (item: NewCartItem) => void;
  onIncreaseItem?: (id: number) => void;
  onDecreaseItem?: (id: number) => void;
}

function toCartItem(book: Book): NewCartItem {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    price: parsePrice(book.price),
    cover: book.cover,
  };
}

interface RatingRowProps {
  rating: number;
  count: number;
  onCommentsClick: () => void;
}

function RatingRow({ rating, count, onCommentsClick }: RatingRowProps) {
  return (
    <div className="rating-summary-row">
      <div className="stars">{renderStars(rating)}</div>
      <button className="comments-link" onClick={onCommentsClick}>
        ( {count} {count === 1 ? "Kommentar" : "Kommentare"} )
      </button>
    </div>
  );
}

interface BookInfoProps extends RatingRowProps {
  book: Book;
}

function BookInfo({ book, ...rating }: BookInfoProps) {
  return (
    <div className="main-info">
      <h1 className="book-title">{book.title}</h1>
      <p className="book-author">von {book.author}</p>
      {book.releaseDate && (
        <p className="release-date">Erschienen am: {book.releaseDate}</p>
      )}
      <p className="book-category">Kategorie: {book.category}</p>
      <RatingRow {...rating} />
    </div>
  );
}

interface PurchaseBoxProps {
  price: string;
  cartQuantity: number;
  onAdd: () => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

function PurchaseBox({
  price,
  cartQuantity,
  onAdd,
  onIncrease,
  onDecrease,
}: PurchaseBoxProps) {
  return (
    <div className="purchase-box">
      <span className="price-tag">{price}</span>
      {cartQuantity > 0 ? (
        <div className="cart-quantity-wrapper">
          <span className="cart-quantity-label">Im Warenkorb:</span>
          <QuantityControl
            quantity={cartQuantity}
            onIncrease={() => onIncrease?.()}
            onDecrease={() => onDecrease?.()}
            size="medium"
          />
        </div>
      ) : (
        <button className="order-btn" onClick={onAdd} aria-label="In den Warenkorb">
          <span>In den Warenkorb</span>
          <img src="/assets/icons/cart.png" alt="cart icon" />
        </button>
      )}
    </div>
  );
}

interface BookHeaderProps extends BookInfoProps {
  cartQuantity: number;
  onAdd: () => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

function BookHeader({
  cartQuantity,
  onAdd,
  onIncrease,
  onDecrease,
  ...info
}: BookHeaderProps) {
  const { book } = info;
  return (
    <div className="book-header">
      <div className="cover-container">
        <img className="cover-image" src={book.cover} alt={book.title} />
      </div>
      <div className="book-info-col">
        <BookInfo {...info} />
        <PurchaseBox
          price={book.price}
          cartQuantity={cartQuantity}
          onAdd={onAdd}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      </div>
    </div>
  );
}

function Description({ text }: { text?: string }) {
  return (
    <section className="description-section">
      <h3>Beschreibung</h3>
      <p>{text || "Keine Beschreibung verfügbar."}</p>
    </section>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <div className="overall-rating-badge">
      <div><span>Gesamtbewertung:</span></div>
      <div>
        <span>{renderStars(rating)}</span>
        <span>({rating.toFixed(1)} / 5)</span>
      </div>
    </div>
  );
}

function BookDetails({
  book,
  loggedUser,
  cartQuantity = 0,
  onAddToCart,
  onIncreaseItem,
  onDecreaseItem,
}: Props) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { reviews, loaded, reload } = useBookReviews(book.id);
  const rating = loaded ? averageRating(reviews) : book.rating;
  const scrollToComments = () =>
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="book-details-container">
      <BookHeader
        book={book}
        rating={rating}
        count={reviews.length}
        cartQuantity={cartQuantity}
        onCommentsClick={scrollToComments}
        onAdd={() => onAddToCart(toCartItem(book))}
        onIncrease={() => onIncreaseItem?.(book.id)}
        onDecrease={() => onDecreaseItem?.(book.id)}
      />
      <hr className="divider" />
      <Description text={book.description} />
      <hr className="divider" />
      <RatingBadge rating={rating} />
      <div ref={commentsRef}>
        <ReviewSection book={book} user={loggedUser} reviews={reviews} onChanged={reload} />
      </div>
    </div>
  );
}

export default BookDetails;