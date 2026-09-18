import "./home.css";

interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  rating: number;
  cover: string;
}

const highlightBooks: Book[] = [
  {
    id: 1,
    title: "Das Flüstern der Wälder",
    author: "Elena Vance",
    price: "14,99 €",
    rating: 5,
    cover: "assets/img/bookcover_default.png",
  },
  {
    id: 2,
    title: "Die Nacht der Sterne",
    author: "Maximilian Schwarz",
    price: "16,00 €",
    rating: 4,
    cover: "assets/img/bookcover_default.png",
  },
  {
    id: 3,
    title: "Wege der Zeit",
    author: "Laura Berger",
    price: "16,00 €",
    rating: 3,
    cover: "assets/img/bookcover_default.png",
  },
  {
    id: 4,
    title: "Am Ende des Meeres",
    author: "Jonas Brand",
    price: "16,00 €",
    rating: 0,
    cover: "assets/img/bookcover_default.png",
  },
];

function Home() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="home">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-part-1">Finde deine nächste </span>
            <br />
            <span className="hero-title-part-2">Lieblingsgeschichte.</span>
          </h1>
          <p className="hero-subtitle">
            Handverlesene Bücher, persönliche Empfehlungen und
            versandkostenfreie Lieferung direkt zu dir nach Hause.
          </p>
          <div className="hero-btn">Bestseller entdecken</div>
        </div>
      </section>

      <section className="books-container">
        <section className="highlights">
          <div className="section-header">
            <h2 className="container-title">Unsere Highlights</h2>
            <a className="view-all-link">
              Alle ansehen &rarr;
            </a>
          </div>
          <div className="book-preview">
            <div className="book-preview-inner">
              {highlightBooks.map((book) => (
                <div className="home-book-card" key={book.id}>
                  <div className="cover-wrapper">
                    <img
                      className="bockcover"
                      src={book.cover}
                      alt={book.title}
                    />
                  </div>
                  <div className="book-dicription">
                    <h3 className="title">{book.title}</h3>
                    <p className="author">von {book.author}</p>
                    <div className="rating-row">
                      <div className="stars">{renderStars(book.rating)}</div>
                    </div>
                    <div className="card-footer">
                      <span className="price">{book.price}</span>
                      <button
                        className="cart-btn"
                        title="In den Warenkorb"
                        aria-label="In den Warenkorb"
                      >
                        <img src="assets/icons/cart.png" alt="cart" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="releases">
          <div className="section-header">
            <h2 className="container-title">Neuheiten</h2>
            <a className="view-all-link">
              Alle ansehen &rarr;
            </a>
          </div>
          <div className="book-preview">
            <div className="book-preview-inner">
              {highlightBooks.map((book) => (
                <div className="home-book-card" key={book.id}>
                  <div className="cover-wrapper">
                    <img
                      className="bockcover"
                      src={book.cover}
                      alt={book.title}
                    />
                  </div>
                  <div className="book-dicription">
                    <h3 className="title">{book.title}</h3>
                    <p className="author">von {book.author}</p>
                    <div className="rating-row">
                      <div className="stars">{renderStars(book.rating)}</div>
                    </div>
                    <div className="card-footer">
                      <span className="price">{book.price}</span>
                      <button
                        className="cart-btn"
                        title="In den Warenkorb"
                        aria-label="In den Warenkorb"
                      >
                        <img src="assets/icons/cart.png" alt="cart" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}

export default Home;
