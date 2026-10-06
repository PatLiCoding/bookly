import "./home.css";
import { Link } from "react-router-dom";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import LoadStatus from "../../components/load-status/load-status";
import { getNewestBooks, getTopRatedBooks } from "../../services/book-service";
import { useAsync } from "../../hooks/use-async";
import type { AsyncResult } from "../../hooks/use-async";
import type { Book } from "../../interface/book";
import { ALL_CATEGORY } from "../../utils/category";

const PREVIEW_COUNT = 6;

/** Big intro section at the top of the start page. */
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-part-1">Finde deine nächste </span>
          <br />
          <span className="hero-title-part-2">Lieblings&shy;geschichte.</span>
        </h1>
        <p className="hero-subtitle">
          Handverlesene Bücher, persönliche Empfehlungen und
          versandkostenfreie Lieferung direkt zu dir nach Hause.
        </p>
        <Link to="/category/Fantasy" className="hero-btn">
          Bestseller entdecken
        </Link>
      </div>
    </section>
  );
}

interface SectionProps {
  title: string;
  className: string;
  sort: string;
  state: AsyncResult<Book[]>;
}

/** Titled preview row with a "view all" link that presets the sorting. */
function BookSection({ title, className, sort, state }: SectionProps) {
  return (
    <section className={className}>
      <div className="section-header">
        <h2 className="container-title">{title}</h2>
        <Link
          to={`/category/${ALL_CATEGORY}?sort=${sort}`}
          className="view-all-link"
        >
          Alle ansehen &rarr;
        </Link>
      </div>
      <LoadStatus loading={state.loading} error={state.error} />
      <BookPreviewList books={state.data ?? []} />
    </section>
  );
}

function Home() {
  const highlights = useAsync(() => getTopRatedBooks(PREVIEW_COUNT), []);
  const releases = useAsync(() => getNewestBooks(PREVIEW_COUNT), []);

  return (
    <section className="home">
      <Hero />
      <section className="books-container">
        <BookSection title="Unsere Highlights" className="highlights" sort="rating" state={highlights} />
        <BookSection title="Neuheiten" className="releases" sort="newest" state={releases} />
      </section>
    </section>
  );
}

export default Home;