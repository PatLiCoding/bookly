import { useRef } from "react";
import "./book-details.css";
import type { Book } from "../../interface/book";
import type { User } from "../../interface/user";
import type { NewCartItem } from "../../hooks/use-cart";
import { renderStars } from "../../utils/render-stars";
import { parsePrice } from "../../utils/parse-price";
import { useBookReviews } from "../../hooks/use-book-reviews";
import { averageRating } from "../../services/review-service";
import { ReviewSection } from "../review/review-section";
import { QuantityControl } from "../quantity-control/quantity-control";
import { getCover } from "../../utils/book-cover";

/** Props for the BookDetails component. */
interface Props {
  /** Detailed book information object. */
  book: Book;
  /** Currently authenticated user, or null if unauthenticated. */
  loggedUser: User | null;
  /** Current quantity of this item present in the cart. */
  cartQuantity?: number;
  /** Callback triggered to add the book to the shopping cart. */
  onAddToCart: (item: NewCartItem) => void;
  /** Optional callback to increment quantity in cart. */
  onIncreaseItem?: (id: number) => void;
  /** Optional callback to decrement quantity in cart. */
  onDecreaseItem?: (id: number) => void;
}

/**
 * Transforms a Book entity into a payload structure formatted for cart operations.
 *
 * @param book - Source book details.
 * @returns Standardized new cart item object.
 */
function toCartItem(book: Book): NewCartItem {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    price: parsePrice(book.price),
    cover: getCover(book.cover),
  };
}

/** Props for displaying rating summary indicators. */
interface RatingRowProps {
  /** Average numerical rating value. */
  rating: number;
  /** Total count of submitted reviews/comments. */
  count: number;
  /** Action handler to scroll directly to the comments view. */
  onCommentsClick: () => void;
}

/**
 * Displays star rating and total review count with quick navigation to reviews.
 */
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

/** Props for the main meta information panel of a book. */
interface BookInfoProps extends RatingRowProps {
  /** The target book record. */
  book: Book;
}

/**
 * Displays metadata including title, author, category, release date, and overall rating summary.
 */
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

/** Props for price display and cart interaction controls. */
interface PurchaseBoxProps {
  /** Formatted price string. */
  price: string;
  /** Active quantity in the cart. */
  cartQuantity: number;
  /** Handler invoked when adding the book to cart. */
  onAdd: () => void;
  /** Optional callback to increment quantity. */
  onIncrease?: () => void;
  /** Optional callback to decrement quantity. */
  onDecrease?: () => void;
}

/**
 * Box element containing purchase details, pricing information, and cart manipulation controls.
 */
function PurchaseBox({price, cartQuantity, onAdd, onIncrease, onDecrease,}: PurchaseBoxProps) {
  return (
    <div className="purchase-box">
      <span className="price-tag">{price}</span>
      {cartQuantity > 0 ? (
        <div className="cart-quantity-wrapper">
          <span className="cart-quantity-label">Im Warenkorb:</span>
          <QuantityControl 
            quantity={cartQuantity} onIncrease={() => onIncrease?.()}
            onDecrease={() => onDecrease?.()} size="medium"
          />
        </div>
      ) : (
        <button className="order-btn" onClick={onAdd} aria-label="In den Warenkorb">
          <span>In den Warenkorb</span>
          <img src="./assets/icons/cart.png" alt="cart icon" />
        </button>
      )}
    </div>
  );
}

/** Props combining book header data and interactive purchase options. */
interface BookHeaderProps extends BookInfoProps {
  /** Current quantity in cart. */
  cartQuantity: number;
  /** Callback to add to cart. */
  onAdd: () => void;
  /** Optional increment callback. */
  onIncrease?: () => void;
  /** Optional decrement callback. */
  onDecrease?: () => void;
}

/**
 * Top section layout of book detail view combining image cover, info text, and buying options.
 */
function BookHeader({cartQuantity, onAdd, onIncrease, onDecrease, ...info}: BookHeaderProps) {
  const { book } = info;
  return (
    <div className="book-header">
      <div className="cover-container">
        <img className="cover-image" src={getCover(book.cover)} alt={book.title} />
      </div>
      <div className="book-info-col">
        <BookInfo {...info} />
        <PurchaseBox
          price={book.price} cartQuantity={cartQuantity} onAdd={onAdd}
          onIncrease={onIncrease}onDecrease={onDecrease}
        />
      </div>
    </div>
  );
}

/**
 * Renders the descriptive synopsis section for a book.
 */
function Description({ text }: { text?: string }) {
  return (
    <section className="description-section">
      <h3>Beschreibung</h3>
      <p>{text || "Keine Beschreibung verfügbar."}</p>
    </section>
  );
}

/**
 * Displays a prominent overall score badge for the book.
 */
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

/**
 * Full page component rendering book metadata, description, reviews, and interactive actions.
 */
function BookDetails({book, loggedUser, cartQuantity = 0, onAddToCart,
  onIncreaseItem, onDecreaseItem,}: Props) {
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
